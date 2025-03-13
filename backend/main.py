# vrikshya/backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database.database import Base, engine, get_db
from models.user import User
from models.product import Product  # Add this import
from passlib.context import CryptContext
import jwt
import os
from schemas import UserCreate, UserLogin, ProductCreate, ProductOut  # Add Product schemas
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import List  # Add for typing

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Get SECRET_KEY from environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY not found in environment variables. Please set it in the .env file.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_user_with_role(role: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role: {current_user.role}"
            )
        return current_user
    return role_checker

@app.get("/")
def read_root(db: Session = Depends(get_db)):
    return {"message": "Hello, Vrikshya! Database connected."}

@app.post("/auth/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        user_id=user.user_id,
        name=user.name,
        username=user.username,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_token({"sub": str(new_user.id)})

    return {"message": "User created successfully", "token": token}

@app.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Email not found")

    if not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    token = create_token({"sub": str(db_user.id)})

    return {"message": "Login successful", "token": token}

@app.get("/users/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "name": current_user.name,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at,
        "is_active": current_user.is_active
    }

@app.get("/customer/dashboard")
def customer_dashboard(current_user: User = Depends(get_current_user_with_role("customer"))):
    return {"message": f"Welcome to the Customer Dashboard, {current_user.username}!"}

@app.get("/vendor/dashboard")
def vendor_dashboard(current_user: User = Depends(get_current_user_with_role("vendor"))):
    return {"message": f"Welcome to the Vendor Dashboard, {current_user.username}!"}

@app.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_user_with_role("vendor")),
    db: Session = Depends(get_db)
):
    new_product = Product(
        vendor_id=current_user.id,
        name=product.name,
        description=product.description,
        price=product.price
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.get("/products", response_model=List[ProductOut])
def list_products(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products
#cust:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjkzNzJjMi03NGY1LTQ2NmUtYTE0Yy1lMDRkODQ1ODQxNDUiLCJleHAiOjE3NDE4NTk1Nzl9.bnJUOdKy3LpBnLDT4oZAwl8rPJk-dp6b3QJefrzwlWY

#vend:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMGIyZTgxMi00M2YyLTQ3NWUtYjAyMy0zMDVhZWNhNTIzNGUiLCJleHAiOjE3NDE4NTk2MTZ9.ASbHmjNn6PpnRKbOtBYD-6f0ycgW5JzL1Pp7qY7Str0