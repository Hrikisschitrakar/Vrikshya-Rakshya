# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database import get_db
# from models import User
# from schemas import UserCreate, UserLogin, UserResponse
# from passlib.context import CryptContext
# from jose import jwt, JWTError
# from datetime import datetime, timedelta

# # JWT Secret Key
# SECRET_KEY = "6ec55fdc0630e01a0688d8c7c3524784a8601d9c797f716ca2b588ba68e3943d"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60

# # Password Hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# auth_router = APIRouter()

# # Helper function to create a hashed password
# def hash_password(password: str):
#     return pwd_context.hash(password)

# # Helper function to verify password
# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# # Create JWT token
# def create_access_token(data: dict):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# # User Signup
# @auth_router.post("/signup", response_model=UserResponse)
# def signup(user: UserCreate, db: Session = Depends(get_db)):
#     try:
#         # Check if email or username already exists
#         existing_user = db.query(User).filter(
#             (User.email == user.email) | (User.username == user.username)
#         ).first()
#         if existing_user:
#             raise HTTPException(status_code=400, detail="Email or Username already registered")

#         # Create a new user
#         hashed_password = hash_password(user.password)
#         new_user = User(
#             user_id=f"cust{uuid.uuid4().hex[:4]}",
#             email=user.email,
#             username=user.username,
#             name=user.name,
#             password=hashed_password,
#             role=user.role.lower(),  # Ensure lowercase for consistency
#         )
#         db.add(new_user)
#         db.commit()
#         db.refresh(new_user)

#         return new_user

#     except SQLAlchemyError as e:
#         db.rollback()
#         error_message = str(e.__dict__['orig'])
#         raise HTTPException(status_code=500, detail=f"Database Error: {error_message}")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")


# # User Login
# @auth_router.post("/login")
# def login(user: UserLogin, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.email == user.email).first()
#     if not db_user or not verify_password(user.password, db_user.hashed_password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
    
#     token = create_access_token({"sub": db_user.email, "role": db_user.role})
#     return {"access_token": token, "token_type": "bearer"}

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from models.user import User
# from schemas import LoginSchema
# from database import get_db
# from passlib.context import CryptContext
# import jwt
# import datetime

# # Password Hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # JWT Secret Key
# SECRET_KEY = "6ec55fdc0630e01a0688d8c7c3524784a8601d9c797f716ca2b588ba68e3943d"
# ALGORITHM = "HS256"

# # FastAPI Router
# auth_router = APIRouter()

# # Password Hashing Functions
# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)

# # JWT Token Function
# def create_access_token(data: dict, expires_delta: int = 60):
#     to_encode = data.copy()
#     expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_delta)
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# # ✅ Login Route (Users can log in with Username OR Email)
# @auth_router.post("/login")
# async def login(user_data: LoginSchema, db: AsyncSession = Depends(get_db)):
#     query = select(User).where((User.username == user_data.identifier) | (User.email == user_data.identifier))
#     result = await db.execute(query)
#     user = result.scalar_one_or_none()

#     if not user or not verify_password(user_data.password, user.password):
#         raise HTTPException(status_code=400, detail="Invalid username/email or password")

#     # Generate JWT Token
#     access_token = create_access_token({"sub": user.id, "role": user.role})
#     return {"access_token": access_token, "token_type": "bearer"}



# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from models.user import User
# from schemas import UserLogin
# from database import get_db
# from passlib.context import CryptContext
# import jwt
# import datetime

# # Password Hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # JWT Secret Key
# SECRET_KEY = "6ec55fdc0630e01a0688d8c7c3524784a8601d9c797f716ca2b588ba68e3943d"
# ALGORITHM = "HS256"

# # FastAPI Router
# auth_router = APIRouter()

# # Password Verification Function
# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)

# # JWT Token Function
# def create_access_token(data: dict, expires_delta: int = 60):
#     to_encode = data.copy()
#     expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_delta)
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# # ✅ Login Route (Users can log in with Email OR Username)
# @auth_router.post("/login")
# async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
#     try:
#         # Query user by email OR username
#         query = select(Users).where((Users.username == user_data.identifier) | (Users.email == user_data.identifier))
#         result = await db.execute(query)
#         user = result.scalar_one_or_none()

#         # Check if user exists
#         if not user:
#             raise HTTPException(status_code=400, detail="User not found")

#         # Verify password
#         if not verify_password(user_data.password, user.password):
#             raise HTTPException(status_code=400, detail="Incorrect password")

#         # Generate JWT Token
#         access_token = create_access_token({"sub": user.id, "role": user.role})
#         return {"access_token": access_token, "token_type": "bearer"}

#     except Exception as e:
#         print(f"Error during login: {e}")  # Log the actual error
#         raise HTTPException(status_code=500, detail="Internal Server Error")
