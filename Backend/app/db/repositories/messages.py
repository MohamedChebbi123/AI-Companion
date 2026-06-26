from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.message import Message


class MessageRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_message(
        self,
        conversation_id: UUID,
        role: str,
        content: str,
        modality: str = "text",
        token_usage: Optional[dict] = None,
        truncated: bool = False,
    ) -> Message:
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            modality=modality,
            token_usage=token_usage,
            truncated=truncated,
        )
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message

    async def get_by_conversation(self, conversation_id: UUID, limit: int = 50) -> list[Message]:
        result = await self.db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_id(self, message_id: UUID) -> Optional[Message]:
        return await self.db.get(Message, message_id)

    async def update(self, message: Message, **kwargs) -> Message:
        for key, value in kwargs.items():
            setattr(message, key, value)
        await self.db.commit()
        await self.db.refresh(message)
        return message
