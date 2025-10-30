from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class ContactBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    phone: Optional[str] = None

class ContactOut(ContactBase):
    id: int

    class Config:
        from_attributes = True