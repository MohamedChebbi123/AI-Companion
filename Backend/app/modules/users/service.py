from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.db.repositories.users import UserRepository
from app.modules.users.schemas import UpdateProfile


async def update_profile(db: AsyncSession, user: User, data: UpdateProfile) -> User:
    fields = data.model_dump(exclude_unset=True)
    if not fields:
        return user
    repo = UserRepository(db)
    return await repo.update(user, **fields)
