from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class CustomerProfile(Base):
    __tablename__ = "customer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("users.username"), nullable=False, unique=True)  # ForeignKey to users' username
    email = Column(String, nullable=False)
    home_address = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    full_name = Column(String, nullable=False)  # This will store the full name directly from users table
    created_at = Column(DateTime, default=datetime.utcnow)
