from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, model_validator


class SpeechStyle(BaseModel):
    tone: str
    formality: str
    verbosity: str
    vocabulary: str


class CreatePersona(BaseModel):
    name: str
    backstory: str
    core_traits: list[str]
    values: list[str]
    boundaries: list[str]
    speechstyle: SpeechStyle
    emotional_baseline: str
    is_public: bool = False


class GeneratePersonaRequest(BaseModel):
    description: str
    is_public: bool = False


class UpdatePersona(BaseModel):
    name: Optional[str] = None
    backstory: Optional[str] = None
    core_traits: Optional[list[str]] = None
    values: Optional[list[str]] = None
    boundaries: Optional[list[str]] = None
    speechstyle: Optional[SpeechStyle] = None
    emotional_baseline: Optional[str] = None
    is_public: Optional[bool] = None


class PersonaResponse(BaseModel):
    id: UUID
    owner_id: UUID
    name: str
    avatar_url: Optional[str] = None
    backstory: str
    core_traits: list[str]
    values: list[str]
    boundaries: list[str]
    speechstyle: SpeechStyle
    emotional_baseline: str
    is_public: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @model_validator(mode="before")
    @classmethod
    def flatten_definition(cls, data):
        if hasattr(data, "definition"):
            defn = data.definition or {}
            return {
                "id": data.id,
                "owner_id": data.owner_id,
                "name": data.name,
                "avatar_url": data.avatar_url,
                "is_public": data.is_public,
                "created_at": data.created_at,
                "updated_at": data.updated_at,
                **defn,
            }
        return data
