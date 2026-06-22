import uuid
from sqlalchemy import Column, DateTime, Text, Boolean, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.session import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)

    role = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    modality = Column(Text, nullable=False, default="text")
    client_msg_id = Column(UUID(as_uuid=True), nullable=True)

    token_usage = Column(JSONB, nullable=True)
    truncated = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")
