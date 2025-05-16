import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

KHALTI_SECRET_KEY = os.getenv("KHALTI_SECRET_KEY")
KHALTI_GATEWAY_URL = os.getenv("KHALTI_GATEWAY_URL")

app = FastAPI()

class InitializeRequest(BaseModel):
    return_url: str
    website_url: str
    amount: int
    purchase_order_id: str
    purchase_order_name: str

class VerifyRequest(BaseModel):
    pidx: str

@app.post("/khalti/initiate")
async def initialize_khalti_payment(request: InitializeRequest):
    url = f"{KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/"
    headers = {
        "Authorization": f"Key {KHALTI_SECRET_KEY}",
        "Content-Type": "application/json",
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=request.dict(), headers=headers)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as exc:
        # Forward Khalti error response
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.json())
    except httpx.RequestError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@app.post("/khalti/verify")
async def verify_khalti_payment(request: VerifyRequest):
    url = f"{KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Key {KHALTI_SECRET_KEY}",
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json={"pidx": request.pidx}, headers=headers)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.json())
    except httpx.RequestError as exc:
        raise HTTPException(status_code=500, detail=str(exc))

# To run:
# uvicorn khalti_fastapi:app --reload
