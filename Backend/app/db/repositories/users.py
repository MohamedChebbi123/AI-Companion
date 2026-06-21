from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.user import User


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: UUID) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def create(
        self,
        email: str,
        display_name: str,
        password_hash: Optional[str] = None,
        locale: Optional[str] = None,
        status: str = "active",
    ) -> User:
        user = User(
            email=email,
            password_hash=password_hash,
            display_name=display_name,
            locale=locale,
            status=status,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self,user:User):
        self.db.delete(user)
        self.db.commit()
    
    def update(self, user: User, **fields) -> User:
        for key, value in fields.items():
            setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    