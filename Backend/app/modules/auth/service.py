import secrets
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AuthError, ConflictError, NotFoundError
from app.core.email import send_password_reset_email
from app.db.repositories.users import UserRepository
from app.db.repositories.refresh_tokens import RefreshTokenRepository
from app.db.repositories.password_reset_tokens import PasswordResetTokenRepository
from app.db.models.user import User
from app.modules.auth.password import hash_password, verify_password
from app.modules.auth.schemas import Register, Login, ResetPassword, ForgotPassword
from app.modules.auth.tokens import create_access_token, create_refresh_token


async def register(db: AsyncSession, data: Register) -> User:
    repo = UserRepository(db)

    if await repo.get_by_email(data.email):
        raise ConflictError("Email already registered")

    return await repo.create(
        email=data.email,
        display_name=data.display_name,
        password_hash=hash_password(data.password),
        locale=data.locale,
        status="active",
    )


async def login(db: AsyncSession, data: Login) -> User:
    repo = UserRepository(db)
    user = await repo.get_by_email(data.email)

    if not user or not verify_password(data.password, user.password_hash):
        raise AuthError("Invalid email or password")
    return user


async def logout(db: AsyncSession, raw_token: str) -> None:
    repo = RefreshTokenRepository(db)
    record = await repo.get_by_raw_token(raw_token)
    if record:
        await repo.delete(record)


async def refresh(db: AsyncSession, raw_token: str) -> tuple[str, str]:
    repo = RefreshTokenRepository(db)
    record = await repo.get_by_raw_token(raw_token)
    if not record:
        raise AuthError("Invalid refresh token")
    if record.expires_at < datetime.now(timezone.utc):
        await repo.delete(record)
        raise AuthError("Refresh token expired")
    user_id = str(record.user_id)
    new_refresh_token = create_refresh_token(user_id)
    await repo.delete_no_commit(record)
    repo.create_no_commit(record.user_id, new_refresh_token)
    await db.commit()
    return create_access_token(user_id), new_refresh_token


async def request_password_reset(db: AsyncSession, data: ForgotPassword) -> None:
    repo = UserRepository(db)
    user = await repo.get_by_email(data.email)

    if not user:
        return

    token_repo = PasswordResetTokenRepository(db)
    await token_repo.delete_all_for_user(user.id)

    raw_token = secrets.token_urlsafe(32)
    record = await token_repo.create(user.id, raw_token)
    try:
        send_password_reset_email(user.email, raw_token)
    except Exception:
        await token_repo.delete(record)
        raise


async def forget_password(db: AsyncSession, data: ResetPassword) -> None:
    token_repo = PasswordResetTokenRepository(db)
    record = await token_repo.get_by_raw_token(data.password_refresh_token)

    if not record:
        raise AuthError("Invalid reset token")

    if record.expires_at < datetime.now(timezone.utc):
        await token_repo.delete(record)
        raise AuthError("Reset token expired")

    repo = UserRepository(db)
    user = await repo.get_by_id(record.user_id)

    if not user:
        raise NotFoundError("User not found")

    user.password_hash = hash_password(data.password)
    await token_repo.delete_all_for_user(record.user_id)
    await RefreshTokenRepository(db).delete_all_for_user(record.user_id)

    await db.commit()
