from fastapi import FastAPI
from database import users_collection

app = FastAPI()

@app.get("/")
async def root():
    user_count = users_collection.count_documents({})
    return {"message": f"Hello! MongoDB connection successful. Users count: {user_count}"}
