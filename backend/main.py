from fastapi import FastAPI  # Ensure correct import
from routers import product

app = FastAPI()

# Include routers
app.include_router(product.router)

@app.get("/")
def home():
    return {"message": "Welcome to Vrikshya API"}
