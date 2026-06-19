from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db.repositories.users import UserRepository
from app.modules.auth.password import hash_password
from app.modules.auth.schemas import Register
from app.db.models.user import User


def register(db: Session, data: Register) -> User:
    repo = UserRepository(db)

    if repo.get_by_email(data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    return repo.create(
        email=data.email,
        display_name=data.display_name,
        password_hash=hash_password(data.password),
        locale=data.locale,
        status="active",
    )
