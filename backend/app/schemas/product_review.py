from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

class ProductReviewCreate(BaseModel):
    product_id: int
    rating: int
    comment: Optional[str] = None

    @validator("rating")
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError("Rating must be between 1 and 5")
        return v

class ProductReviewOut(BaseModel):
    id: int
    product_id: int
    user_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True