from sqlalchemy.orm import Session

from app.core.errors import AuthError, ConflictError
from app.db.repositories.users import UserRepository
from app.db.models.user import User
from app.modules.auth.password import hash_password, verify_password
from app.modules.auth.schemas import Register, Login


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