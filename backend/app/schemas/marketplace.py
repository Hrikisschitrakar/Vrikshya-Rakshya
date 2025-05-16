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
    vendor_name:  Optional[str] = None
    vendor_address: Optional[str] = None
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
    address: str
    order_status: str ="Pending"  # Default status
   # product_name: Optional[str] = None
    #vendor_id: Optional[int] = None

class OrderOut(BaseModel):
    id: int
    product_id: int
    vendor_id: int
    customer_id: int
    quantity: int
    total_price: float  # Assuming total_price is the same as total_amount
    order_status: str
    created_at: datetime
    product_name: str
    address: Optional[str] = None

    class Config:
        orm_mode = True


class OrderOutVendor(BaseModel):
    order_id: int
    product_name: str
    vendor_name: str
    vendor_address: str
    customer_id: int
    full_name: str  # Ensure this matches with the query result
    quantity: int
    total_price: float
    order_status: str
    created_at: datetime
    vendor_id: int
    address: Optional[str] = None

    class Config:
        orm_mode = True

class VendorDashboard(BaseModel):
    total_products: int
    total_orders: int
    total_revenue: float



class VendorDashboardResponse(BaseModel):
    total_orders: int
    total_sales: float
    total_products: int
    vendor_id: int
    vendor_name: str
    total_revenue: float  # Ensure this field is present

    class Config:
        orm_mode = True
