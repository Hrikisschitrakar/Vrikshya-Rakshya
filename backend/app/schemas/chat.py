from pydantic import BaseModel
from datetime import datetime

class ChatMessageCreate(BaseModel):
    recipient_username: str
    content: str

class ChatMessageOut(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    content: str
    timestamp: datetime
    read: bool

    class Config:
        from_attributes = True