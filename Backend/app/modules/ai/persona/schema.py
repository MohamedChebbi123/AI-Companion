from pydantic import BaseModel


class SpeechStyle(BaseModel):
    tone: str
    formality: str
    verbosity: str
    vocabulary: str


class Persona(BaseModel):
    id: int | None = None
    owner_id: int | None = None
    name: str
    backstory: str
    core_traits: list[str]
    boundaries: list[str]
    values: list[str]
    speechstyle: SpeechStyle
    emotional_baseline: str
    is_public: bool