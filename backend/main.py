from fastapi import FastAPI, HTTPException
from database import engine  # Database engine
from models import Base       # SQLAlchemy Base
from models import User
from schemas import UserLogin
from forget_password import forget_password_router
from fastapi import  Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from passlib.context import CryptContext
from datetime import datetime, timedelta
from database import engine, Base, get_db
from models import User
from schemas import UserCreate, UserResponse
from utils import hash_password
import os
from dotenv import load_dotenv
# Initialize FastAPI
app = FastAPI()

# Create database tables


# Include routers

app.include_router(forget_password_router, prefix="/password", tags=["Forget Password"])

# Root endpoint
@app.get("/")
def home():
    return {"message": "Welcome to Vrikshya API"}

@app.get("/check-db")
def check_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))  # FIX: Use text()
        return {"message": "✅ Database connection successful 🚀"}
    except Exception as e:
        return {"error": str(e)}
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or db_user.hashed_password != user.password:  # ⚠️ Direct comparison
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful"}

# Load environment variables from .env
# load_dotenv()
# SECRET_KEY = os.getenv("SECRET_KEY")
# ALGORITHM = "HS256"
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def create_access_token(data: dict, expires_delta: timedelta):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + expires_delta
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# @app.post("/login")
# def login(user: UserLogin, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.email == user.email).first()
    
#     if not db_user or not verify_password(user.password, db_user.hashed_password):
#         raise HTTPException(status_code=401, detail="Invalid email or password")
    
#     access_token = create_access_token(data={"sub": db_user.email}, expires_delta=timedelta(hours=1))
    
#     return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        full_name=user.full_name,
        username=user.username,
        email=user.email,
        hashed_password=user.password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to your frontend IP for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
