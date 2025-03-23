from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class VendorProfile(Base):
    __tablename__ = "vendor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    business_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    description = Column(String, nullable=False)