from datetime import datetime
from pydantic import BaseModel

class CustomerProfileCreate(BaseModel):
    email: str
    home_address: str
    phone_number: str

class CustomerProfileOut(BaseModel):
    id: int
    username: str
    email: str
    home_address: str
    full_name: str
    phone_number: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

    