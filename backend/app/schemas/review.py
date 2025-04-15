# In your schemas/review.py file
from pydantic import BaseModel

class ReviewCreate(BaseModel):
    product_id: int
    user_id: int
    rating: float  # Only rating now

class ReviewOut(BaseModel):
    id: int
    product_id: int
    user_id: int
    rating: float

    class Config:
        orm_mode = True
