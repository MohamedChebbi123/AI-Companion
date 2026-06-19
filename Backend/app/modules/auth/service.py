from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.errors import AuthError, ConflictError
from app.db.repositories.users import UserRepository
from app.db.repositories.refresh_tokens import RefreshTokenRepository
from app.db.models.user import User
from app.modules.auth.password import hash_password, verify_password
from app.modules.auth.schemas import Register, Login
from app.modules.auth.tokens import create_access_token


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


def refresh(db: Session, raw_token: str) -> str:
    repo = RefreshTokenRepository(db)
    record = repo.get_by_raw_token(raw_token)
    if not record:
        raise AuthError("Invalid refresh token")
    if record.expires_at < datetime.now(timezone.utc):
        repo.delete(record)
        raise AuthError("Refresh token expired")
    return create_access_token(str(record.user_id))