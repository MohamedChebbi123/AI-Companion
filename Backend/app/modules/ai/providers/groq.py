from collections.abc import AsyncIterator

from groq import AsyncGroq

from app.core.config import settings
from app.modules.ai.providers.base import LLMProvider


class GroqProvider(LLMProvider):
    def __init__(self, model: str = "qwen/qwen3.6-27b"):
        self._client = AsyncGroq(api_key=settings.GROQ_GENERATOR_KEY)
        self._model = model

    async def stream_chat(
        self,
        messages: list[dict],
        max_tokens: int = 1024,
    ) -> AsyncIterator[str]:
        stream = await self._client.chat.completions.create(
            model=self._model,
            messages=messages,
            temperature=0.6,
            max_completion_tokens=max_tokens,
            top_p=0.95,
            reasoning_effort="default",
            stream=True,
            stop=None,
        )
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
