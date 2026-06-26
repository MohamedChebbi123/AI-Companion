from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class CreateConversation(BaseModel):
    persona_id: Optional[UUID] = None
    title: Optional[str] = None


class ConversationResponse(BaseModel):
    id: UUID
    user_id: UUID
    persona_id: Optional[UUID]
    persona_version: Optional[int]
    title: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}
