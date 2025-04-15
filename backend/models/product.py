# vrikshya/backend/models/product.py
from sqlalchemy import Column, UUID, String, Text, Float, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as UUIDType
from sqlalchemy.sql import func
from database.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(UUIDType, primary_key=True, server_default=func.gen_random_uuid(), nullable=False)
    vendor_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    vendor_name = Column(String(100), ForeignKey("vendor_profiles.business_name"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.current_timestamp())