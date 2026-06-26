from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user
from app.db.models.user import User
from app.modules.users.schemas import UpdateProfile
from app.modules.users.service import update_profile

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/profile")
async def get_profile(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
        "locale": user.locale,
        "status": user.status,
        "created_at": user.created_at,
    }


@router.patch("/profile")
async def patch_profile(
    data: UpdateProfile,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    updated = await update_profile(db, user, data)
    return {
        "id": str(updated.id),
        "email": updated.email,
        "display_name": updated.display_name,
        "locale": updated.locale,
        "status": updated.status,
    }
