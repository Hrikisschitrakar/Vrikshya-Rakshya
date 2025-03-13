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

class OrderCreate(BaseModel):
    product_id: str
    quantity: int

class OrderOut(BaseModel):
    id: str
    customer_id: str
    product_id: str
    quantity: int
    total_price: float
    created_at: datetime

    @validator("id", "customer_id", "product_id", pre=True)
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    receiver_id: str
    content: str

class MessageOut(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    content: str
    created_at: datetime

    @validator("id", "sender_id", "receiver_id", pre=True)
    def convert_uuid_to_str(cls, v):
        if isinstance(v, UUID):
            return str(v)
        return v

    class Config:
        from_attributes = True