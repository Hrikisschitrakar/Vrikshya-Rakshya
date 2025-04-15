from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from passlib.context import CryptContext
from jose import JWTError, jwt
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not pwd_context.verify(password, user.password):
        return None
    db.delete(user)
    db.commit()
    return user

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not pwd_context.verify(password, user.password):
        return None
    return user

def change_password(db: Session, username: str, current_password: str, new_password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not pwd_context.verify(current_password, user.password):
        return None
    user.password = pwd_context.hash(new_password)
    db.commit()
    db.refresh(user)
    return user

def change_username(db: Session, current_username: str, current_password: str, new_username: str):
    # Find the user by current username
    user = db.query(User).filter(User.username == current_username).first()
    if not user:
        return None
    
    # Verify the current password
    if not pwd_context.verify(current_password, user.password):
        return None
    
    # Check if the new username is already taken
    if db.query(User).filter(User.username == new_username).first():
        return False
    
    # Update the username
    user.username = new_username
    db.commit()
    db.refresh(user)
    return user

def change_fullname(db: Session, current_fullname: str, current_password: str, new_fullname: str):
    # Find the user by current username
    user = db.query(User).filter(User.full_name == current_fullname).first()
    if not user:
        return None
    
    # Verify the current password
    if not pwd_context.verify(current_password, user.password):
        return None
    
    # Check if the new username is already taken
    if db.query(User).filter(User.full_name == new_fullname).first():
        return False
    
    # Update the username
    user.full_name = new_fullname
    db.commit()
    db.refresh(user)
    return user
  # Load the .env file

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def create_verification_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
