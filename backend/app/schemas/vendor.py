from pydantic import BaseModel

class VendorProfileCreate(BaseModel):
    business_name: str
    address: str
    description: str

class VendorProfileOut(BaseModel):
    id: int
    user_id: int
    business_name: str
    address: str
    description: str

    class Config:
        from_attributes = True