from pydantic import BaseModel, EmailStr, Field, field_validator
from enum import Enum
import re

class Locale(str,Enum):
    AR="ar"
    FR="fr"
    EN="en"

class Register(BaseModel):
    email: EmailStr
    password: str=Field(min_length=8,max_length=128)
    display_name: str=Field(min_length=3,max_length=15)
    locale: Locale
    @field_validator("display_name")
    @classmethod
    def validate_display_name(cls, v: str) -> str:
        if not v.replace("_", "").isalnum():
            raise ValueError("Only letters, numbers, underscores allowed")
        return v
    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[^A-Za-z0-9]", v):
            raise ValueError("Password must contain at least one special character")
        return v



class Login(BaseModel):
    email: EmailStr
    password: str


class Logout(BaseModel):
    refresh_token: str


class Refresh(BaseModel):
    refresh_token: str


class forget_password(BaseModel):
    password: str
    password_refresh_token: str


class ForgotPassword(BaseModel):
    email: EmailStr