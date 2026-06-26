import asyncio
import re
from uuid import UUID

from groq import Groq
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.errors import AuthError, NotFoundError
from app.db.repositories.conversations import ConversationRepository
from app.db.repositories.messages import MessageRepository
from app.db.repositories.personas import PersonaRepository
from app.modules.ai.prompt.builder import build_messages
from app.modules.ai.providers.groq import GroqProvider

_provider = GroqProvider()

_TITLE_PROMPT = """Generate a short chat title (4-6 words max) for a conversation that starts with this message.
Return ONLY the title, no quotes, no punctuation at the end."""


def _generate_title_sync(user_message: str) -> str:
    client = Groq(api_key=settings.GROQ_GENERATOR_KEY)
    response = client.chat.completions.create(
        model="qwen/qwen3.6-27b",
        messages=[
            {"role": "system", "content": _TITLE_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.5,
        max_completion_tokens=512,
        reasoning_effort="default",
        stream=False,
    )
    raw = response.choices[0].message.content or ""
    raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL)
    raw = re.sub(r"<think>.*", "", raw, flags=re.DOTALL)
    return raw.strip()


async def get_chat_response(
    db: AsyncSession,
    conversation_id: UUID,
    user_id: UUID,
    user_message: str,
) -> dict:
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
    existing = await msg_repo.get_by_conversation(conversation_id, limit=1)
    is_first_message = len(existing) == 0
    await msg_repo.create_message(conversation_id=conversation_id, role="user", content=user_message)

    chunks = []
    async for chunk in _provider.stream_chat(messages):
        chunks.append(chunk)

    reply = re.sub(r"<think>.*?</think>", "", "".join(chunks), flags=re.DOTALL).strip()
    await msg_repo.create_message(conversation_id=conversation_id, role="assistant", content=reply)

    new_title = None
    if is_first_message:
        loop = asyncio.get_event_loop()
        new_title = await loop.run_in_executor(None, _generate_title_sync, user_message)
        await conv_repo.update_title(conversation, new_title)

    return {"reply": reply, "title": new_title}
