
from fastapi import FastAPI
from database import engine  # Import the engine
from models import Base  # Import the Base model

# Initialize FastAPI
app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Import and include routers
from auth import auth_router
app.include_router(auth_router)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include auth routes
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
@app.get("/")
def home():
    return {"message": "Welcome to Vrikshya API"}
