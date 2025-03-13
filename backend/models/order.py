# vrikshya/backend/models/order.py
from sqlalchemy import Column, UUID, ForeignKey, Float, TIMESTAMP, Integer  # Add Integer here
from sqlalchemy.dialects.postgresql import UUID as UUIDType
from sqlalchemy.sql import func
from database.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUIDType, primary_key=True, server_default=func.gen_random_uuid(), nullable=False)
    customer_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    product_id = Column(UUIDType, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.current_timestamp())