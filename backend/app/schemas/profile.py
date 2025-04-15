from pydantic import BaseModel

class ProfileOut(BaseModel):
    id: int
    username: str
    image_url: str

    class Config:
        orm_mode = True

class ProfileOut(BaseModel):
    username: str
    image_url: str

    class Config:
        orm_mode = True
