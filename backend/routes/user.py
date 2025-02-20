from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
async def get_all_users():
    users = []
    async for user in db["users"].find():
        user["_id"] = str(user["_id"])
        users.append(user)
    return users

@router.post("/register")
async def register_user(user: dict):
    existing_user = await db["users"].find_one({"email": user["email"]})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists.")
    new_user = await db["users"].insert_one(user)
    return {"message": "User registered successfully", "user_id": str(new_user.inserted_id)}
