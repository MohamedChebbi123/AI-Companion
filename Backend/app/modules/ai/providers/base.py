from abc import ABC, abstractmethod
from collections.abc import AsyncIterator


class LLMProvider(ABC):
    @abstractmethod
    async def stream_chat(
        self,
        messages: list[dict],
        max_tokens: int = 1024,
    ) -> AsyncIterator[str]: ...
