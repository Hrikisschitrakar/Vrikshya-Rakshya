from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    product_id: int
    user_id: int
    content: str

class CommentOut(BaseModel):
    id: int
    product_id: int
    user_id: int
    content: str
    created_at: datetime

    class Config:
        orm_mode = True
