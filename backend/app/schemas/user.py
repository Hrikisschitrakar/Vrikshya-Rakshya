from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    phone_number: str
    role: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    phone_number: str
    role: str

    class Config:
        from_attributes = True

class UserDelete(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

class ChangeUsername(BaseModel):
    current_password: str
    new_username: str