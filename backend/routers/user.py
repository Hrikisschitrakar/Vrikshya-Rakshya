from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User
from schemas import LoginSchema, SignupSchema
from database import get_db
from auth import hash_password, verify_password, create_access_token

router = APIRouter()

# Login Route
@router.post("/login")
async def login(user_data: LoginSchema, db: AsyncSession = Depends(get_db)):
    query = select(User).where((User.username == user_data.identifier) | (User.email == user_data.identifier))
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid username/email or password")

    access_token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

# Signup Route
@router.post("/signup")
async def signup(user_data: SignupSchema, db: AsyncSession = Depends(get_db)):
    query = select(User).where((User.email == user_data.email) | (User.username == user_data.username))
    result = await db.execute(query)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email or username already exists")

    new_user = User(
        user_id=user_data.user_id,
        name=user_data.name,
        username=user_data.username,
        email=user_data.email,
        password=hash_password(user_data.password),
        role=user_data.role
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {"message": "User created successfully"}
