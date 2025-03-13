# vrikshya/backend/schemas.py
from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    user_id: str
    name: str
    username: str
    email: str
    password: str
    role: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

class ProductOut(BaseModel):
    id: str
    vendor_id: str
    name: str
    description: Optional[str]
    price: float
    created_at: datetime

    @validator("id", "vendor_id", pre=True)
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v

    class Config:
        from_attributes = True