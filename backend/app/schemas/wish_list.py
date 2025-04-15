from pydantic import BaseModel
from datetime import datetime

class WishListOut(BaseModel):
    id: int
    customer_id: int
    product_id: int
    product_name: str
    product_description: str
    product_price: float
    product_stock: int
    product_image_url: str
    created_at: datetime

    class Config:
        orm_mode = True
