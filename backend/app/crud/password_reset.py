from sqlalchemy.orm import Session
from app.models.user import User
from app.models.password_reset import PasswordReset as PasswordResetModel
from app.utils.email import send_email
from passlib.context import CryptContext
import uuid
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_password_reset_token(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    
    # Check if a token already exists for the user
    existing_token = db.query(PasswordResetModel).filter(PasswordResetModel.user_id == user.id).first()
    if existing_token:
        db.delete(existing_token)
        db.commit()
    
    # Create a new token
    token = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    password_reset = PasswordResetModel(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    db.add(password_reset)
    db.commit()
    db.refresh(password_reset)
    
    # Send the reset email
    reset_link = f"http://127.0.0.1:8000/reset-password?token={token}"
    subject = "Password Reset Request"
    body = f"Copy the following token: {token}\nThis link will expire in 1 hour."
    success = await send_email(email, subject, body)
    if not success:
        return None
    
    return password_reset

def reset_password(db: Session, token: str, new_password: str):
    password_reset = db.query(PasswordResetModel).filter(PasswordResetModel.token == token).first()
    if not password_reset:
        return False
    if password_reset.expires_at < datetime.utcnow():
        return False
    
    user = db.query(User).filter(User.id == password_reset.user_id).first()
    if not user:
        return False
    
    user.password = pwd_context.hash(new_password)
    db.delete(password_reset)
    db.commit()
    return True