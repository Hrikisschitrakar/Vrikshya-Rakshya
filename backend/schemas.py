from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    username: str
    name: str
    role: str
    password: str

class UserLogin(BaseModel):
    identifier: str  # This can be either username or email
    password: str

class UserResponse(BaseModel):
    email: str
    username: str
    name: str
    role: str
