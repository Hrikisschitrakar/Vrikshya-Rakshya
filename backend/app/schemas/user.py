from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str
    role: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    token: str  # Added token field

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

class ChangeFullName(BaseModel):
    current_password: str
    new_full_name: str

class ChangeEmail(BaseModel):
    current_password: str
    new_email: str

    