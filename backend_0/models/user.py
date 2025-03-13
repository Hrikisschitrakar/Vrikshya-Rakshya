from sqlalchemy import Column, String, Boolean, TIMESTAMP
from database import Base
import datetime
import uuid
from sqlalchemy import Column, Integer, String, DateTime, func
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # ✅ Ensure id is correct
    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'customer' or 'vendor'
    created_at = Column(DateTime, default=func.now())
    
