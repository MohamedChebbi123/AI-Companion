from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import NotFoundError, AuthError
from app.db.models.conversation import Conversation
from app.db.repositories.conversations import ConversationRepository
from app.modules.conversations.schemas import CreateConversation


async def create_conversation(db: AsyncSession, user_id: UUID, data: CreateConversation) -> Conversation:
    repo = ConversationRepository(db)
    return await repo.create(
        user_id=user_id,
        persona_id=data.persona_id,
        title=data.title,
    )


async def get_conversation(db: AsyncSession, conversation_id: UUID, user_id: UUID) -> Conversation:
    repo = ConversationRepository(db)
    conversation = await repo.get_by_id(conversation_id)
    if not conversation:
        raise NotFoundError("Conversation not found")
    if conversation.user_id != user_id:
        raise AuthError("Access denied")
    return conversation


async def list_conversations(db: AsyncSession, user_id: UUID) -> list[Conversation]:
    repo = ConversationRepository(db)
    return await repo.get_by_user(user_id)


async def delete_conversation(db: AsyncSession, conversation_id: UUID, user_id: UUID) -> None:
    repo = ConversationRepository(db)
    conversation = await repo.get_by_id(conversation_id)
    if not conversation:
        raise NotFoundError("Conversation not found")
    if conversation.user_id != user_id:
        raise AuthError("Access denied")
    await repo.delete(conversation)
