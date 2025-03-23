from pydantic import BaseModel
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: int
    content: str

class NotificationOut(BaseModel):
    id: int
    user_id: int
    content: str
    created_at: datetime
    read: bool

    class Config:
        from_attributes = True