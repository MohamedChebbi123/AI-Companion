from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user
from app.db.models.user import User
from app.db.repositories.messages import MessageRepository
from app.modules.conversations.schemas import MessageResponse

router = APIRouter(prefix="/messages", tags=["messages"])


class UpdateMessageRequest(BaseModel):
    content: str


@router.get("/{message_id}", response_model=MessageResponse)
async def get_message(
    message_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    msg = await MessageRepository(db).get_by_id(message_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return msg


@router.patch("/{message_id}", response_model=MessageResponse)
async def update_message(
    message_id: UUID,
    data: UpdateMessageRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = MessageRepository(db)
    msg = await repo.get_by_id(message_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return await repo.update(msg, content=data.content)


@router.delete("/{message_id}", status_code=204)
async def delete_message(
    message_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = MessageRepository(db)
    msg = await repo.get_by_id(message_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    await repo.delete(msg)
