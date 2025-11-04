from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from pydantic import BaseModel, EmailStr

# Phone: allow optional leading + and digits, spaces, hyphens and parentheses. 7-20 characters
# Use Field(regex=...) to support multiple Pydantic versions where constr(regex=...) may differ.
PHONE_REGEX = r"^\+?[0-9\s\-()]{7,20}$"


class ContactBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(default=None, pattern=PHONE_REGEX, max_length=50)


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    phone: Optional[str] = Field(default=None, pattern=PHONE_REGEX, max_length=50)


class ContactOut(ContactBase):
    id: int

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True