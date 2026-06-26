import re
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AuthError, NotFoundError
from app.db.repositories.conversations import ConversationRepository
from app.db.repositories.messages import MessageRepository
from app.db.repositories.personas import PersonaRepository
from app.modules.ai.prompt.builder import build_messages
from app.modules.ai.providers.groq import GroqProvider

_provider = GroqProvider()


async def get_chat_response(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
    user_message: str,
) -> str:
    conv_repo = ConversationRepository(db)
    conversation = await conv_repo.get_by_id(conversation_id)
    if not conversation:
        raise NotFoundError("Conversation not found")
    if conversation.user_id != user_id:
        raise AuthError("Access denied")

    persona_definition = {}
    if conversation.persona_id:
        persona = await PersonaRepository(db).get_by_id(conversation.persona_id)
        if persona:
            persona_definition = {**persona.definition, "name": persona.name}

    messages = build_messages(persona_definition, user_message)

    msg_repo = MessageRepository(db)
    await msg_repo.create_message(conversation_id=conversation_id, role="user", content=user_message)

    chunks = []
    async for chunk in _provider.stream_chat(messages):
        chunks.append(chunk)

    reply = re.sub(r"<think>.*?</think>", "", "".join(chunks), flags=re.DOTALL).strip()
    await msg_repo.create_message(conversation_id=conversation_id, role="assistant", content=reply)

    return reply
