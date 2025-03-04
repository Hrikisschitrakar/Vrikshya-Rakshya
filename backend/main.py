from fastapi import FastAPI
from database import engine  # Database engine
from models import Base       # SQLAlchemy Base
from auth import auth_router
from forget_password import forget_password_router
from fastapi import  Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from auth import auth_router 
# Initialize FastAPI
app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
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

