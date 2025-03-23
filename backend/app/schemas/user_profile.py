from pydantic import BaseModel
from typing import Optional

class UserProfileCreate(BaseModel):
    bio: Optional[str] = None
    location: Optional[str] = None

class UserProfileOut(BaseModel):
    id: int
    user_id: int
    bio: Optional[str]
    profile_picture_url: Optional[str]
    location: Optional[str]

    class Config:
        orm_mode = True