from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User  # Ensure this is correctly imported
import logging

forget_password_router = APIRouter()

# Setup logging
logging.basicConfig(level=logging.DEBUG)

@forget_password_router.post("/forgot-password")
def forgot_password(username: str, email: str, db: Session = Depends(get_db)):
    try:
        # Check if the user exists
        user = db.query(User).filter(User.username == username, User.email == email).first()

        if not user:
            logging.error(f"User not found for username: {username}, email: {email}")
            raise HTTPException(status_code=404, detail="User not found")

        # If found, send an email (mocked for now)
        logging.info(f"Sending password reset email to {email}")
        
        return {"message": f"Password reset email sent to {email}"}

    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
