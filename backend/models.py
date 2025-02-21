from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(String(50), unique=True, nullable=False)
    vendor_id = Column(String(50), ForeignKey("vendors.vendor_id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String)
    image_url = Column(String)
    category = Column(String(50))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
