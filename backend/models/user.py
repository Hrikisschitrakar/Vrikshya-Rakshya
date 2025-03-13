# vrikshya/backend/models/user.py
from sqlalchemy import Column, UUID, String, Text, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID as UUIDType
from sqlalchemy.sql import func
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUIDType, primary_key=True, server_default=func.gen_random_uuid(), nullable=False)
    user_id = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(100), nullable=False, unique=True, index=True)
    password = Column(Text, nullable=False)
    role = Column(String(20), nullable=False)
    created_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.current_timestamp())
    is_active = Column(Boolean, nullable=False, server_default="true")