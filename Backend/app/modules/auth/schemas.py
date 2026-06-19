from pydantic import BaseModel, EmailStr


class Register(BaseModel):
    email: EmailStr
    password: str
    display_name: str
    locale: str
    status: str


class Login(BaseModel):
    email: EmailStr
    password: str
