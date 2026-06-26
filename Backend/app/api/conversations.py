from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user
from app.core.errors import AuthError, NotFoundError
from app.db.models.user import User
from app.db.repositories.messages import MessageRepository
from app.modules.conversations.schemas import CreateConversation, ConversationResponse, MessageResponse
from app.modules.conversations.service import (
    create_conversation,
    get_conversation,
    list_conversations,
    delete_conversation,
)

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("", status_code=201, response_model=ConversationResponse)
async def create(
    data: CreateConversation,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await create_conversation(db, user.id, data)


@router.get("", response_model=list[ConversationResponse])
async def list_all(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await list_conversations(db, user.id)


@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_one(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        return await get_conversation(db, conversation_id, user.id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message)


@router.get("/{conversation_id}/messages", response_model=list[MessageResponse])
async def get_messages(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        conv = await get_conversation(db, conversation_id, user.id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message)
    msgs = await MessageRepository(db).get_by_conversation(conv.id)
    return list(reversed(msgs))


@router.delete("/{conversation_id}", status_code=204)
async def delete(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        await delete_conversation(db, conversation_id, user.id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message)
