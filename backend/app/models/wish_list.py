from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class WishList(Base):
    __tablename__ = "wish_list"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String, nullable=False)
    product_description = Column(String, nullable=False)
    product_price = Column(Integer, nullable=False)
    product_stock = Column(Integer, nullable=False)
    product_image_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


