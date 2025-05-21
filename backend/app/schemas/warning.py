from pydantic import BaseModel
from datetime import datetime

class WarningBase(BaseModel):
    user_id: int
    username: str
    content: str

class WarningCreate(WarningBase):
    pass

class WarningOut(BaseModel):
    id: int
    user_id: int
    username: str
    content: str
    created_at: datetime

    class Config:
        orm_mode = True
