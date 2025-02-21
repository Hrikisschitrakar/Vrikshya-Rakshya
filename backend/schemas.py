from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    username: str
    full_name: str
    role: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    email: str
    username: str
    full_name: str
    role: str
