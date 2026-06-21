from sqlalchemy.orm import Session

from app.db.models.user import User
from app.db.repositories.users import UserRepository
from app.modules.users.schemas import UpdateProfile


def update_profile(db: Session, user: User, data: UpdateProfile) -> User:
    fields = data.model_dump(exclude_unset=True)
    if not fields:
        return user
    repo = UserRepository(db)
    return repo.update(user, **fields)
