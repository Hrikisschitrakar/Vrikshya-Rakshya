from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int

class ProductUpdate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int

class ProductOut(BaseModel):
    id: int
    vendor_id: int
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    product_id: int
    quantity: int

class OrderOut(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True

class VendorDashboard(BaseModel):
    total_products: int
    total_orders: int
    total_revenue: float