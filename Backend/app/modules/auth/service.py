import secrets
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.core.errors import AuthError, ConflictError, NotFoundError
from app.core.email import send_password_reset_email
from app.db.repositories.users import UserRepository
from app.db.repositories.refresh_tokens import RefreshTokenRepository
from app.db.repositories.password_reset_tokens import PasswordResetTokenRepository
from app.db.models.user import User
from app.modules.auth.password import hash_password, verify_password
from app.modules.auth.schemas import Register, Login, forget_password, ForgotPassword
from app.modules.auth.tokens import create_access_token, create_refresh_token


def register(db: Session, data: Register) -> User:
    repo = UserRepository(db)

    if repo.get_by_email(data.email):
        raise ConflictError("Email already registered")

    return repo.create(
        email=data.email,
        display_name=data.display_name,
        password_hash=hash_password(data.password),
        locale=data.locale,
        status="active",
    )


def login(db: Session, data: Login) -> User:
    repo = UserRepository(db)
    user = repo.get_by_email(data.email)

    if not user or not verify_password(data.password, user.password_hash):
        raise AuthError("Invalid email or password")
    return user

def logout(db: Session, raw_token: str) -> None:
    repo = RefreshTokenRepository(db)
    record = repo.get_by_raw_token(raw_token)
    if record:
        repo.delete(record)


def refresh(db: Session, raw_token: str) -> tuple[str, str]:
    repo = RefreshTokenRepository(db)
    record = repo.get_by_raw_token(raw_token)
    if not record:
        raise AuthError("Invalid refresh token")
    if record.expires_at < datetime.now(timezone.utc):
        repo.delete(record)
        raise AuthError("Refresh token expired")
    user_id = str(record.user_id)
    repo.delete(record)
    new_refresh_token = create_refresh_token(user_id)
    repo.create(record.user_id, new_refresh_token)
    return create_access_token(user_id), new_refresh_token


def request_password_reset(db: Session, data: ForgotPassword) -> None:
    repo = UserRepository(db)
    user = repo.get_by_email(data.email)

    if not user:
        return

    token_repo = PasswordResetTokenRepository(db)
    token_repo.delete_all_for_user(user.id)

    raw_token = secrets.token_urlsafe(32)
    token_repo.create(user.id, raw_token)
    send_password_reset_email(user.email, raw_token)


def forget_password(db: Session, data: forget_password):
    token_repo = PasswordResetTokenRepository(db)
    record = token_repo.get_by_raw_token(data.password_refresh_token)

    if not record:
        raise AuthError("Invalid reset token")

    if record.expires_at < datetime.now(timezone.utc):
        token_repo.delete(record)
        raise AuthError("Reset token expired")

    repo = UserRepository(db)
    user = repo.get_by_id(record.user_id)

    user.password_hash = hash_password(data.password)
    token_repo.delete(record)
    db.commit()
    