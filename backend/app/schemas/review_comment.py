from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ReviewCommentBase(BaseModel):
    content: str
    parent_comment_id: Optional[int] = None

class ReviewCommentCreate(ReviewCommentBase):
    review_id: int
    user_id: int

class ReviewCommentOut(ReviewCommentBase):
    id: int
    review_id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
