from fastapi import FastAPI
from routes import user

app = FastAPI(title="Vrikshya Rakshya API 🌿")

app.include_router(user.router)

@app.get("/")
async def root():
    return {"message": "🌿 Welcome to Vrikshya Rakshya API"}
