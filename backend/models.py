from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base
from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr
 # Ensure this is correctly imported

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

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String(20), nullable=False)  # Ensure lowercase during signup
    created_at = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)



# Login Schema
class LoginSchema(BaseModel):
    identifier: str  # Can be either email or username
    password: str

# Signup Schema
class SignupSchema(BaseModel):
    user_id: str
    name: str
    username: str
    email: EmailStr
    password: str
    role: str
