from pydantic import BaseModel
from datetime import datetime
class ProductReportCreate(BaseModel):
    product_id: int
    reporter_username: str
    reason: str


from typing import Optional

class ProductOutSimple(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    stock: int
    vendor_name: Optional[str]  # Include vendor_name here if product has it

    class Config:
        orm_mode = True

class ProductReportOut(BaseModel):
    id: int
    product_id: int
    reporter_username: str
    reason: str
    created_at: datetime
    product: ProductOutSimple

    class Config:
        orm_mode = True
