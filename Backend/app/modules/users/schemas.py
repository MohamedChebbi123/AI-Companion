from typing import Optional
from pydantic import BaseModel, Field, field_validator


class UpdateProfile(BaseModel):
    display_name: Optional[str] = Field(None, min_length=3, max_length=15)
    locale: Optional[str] = None

    @field_validator("display_name")
    @classmethod
    def validate_display_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.replace("_", "").isalnum():
            raise ValueError("Only letters, numbers, underscores allowed")
        return v
