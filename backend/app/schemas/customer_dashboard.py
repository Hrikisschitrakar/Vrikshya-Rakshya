from pydantic import BaseModel

class CustomerDashboard(BaseModel):
    total_orders: int
    total_spent: float
    customer_id: int
    wishlist_count: int
    customer_name: str