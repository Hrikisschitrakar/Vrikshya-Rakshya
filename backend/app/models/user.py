from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True, nullable=False)
#     email = Column(String, unique=True, index=True, nullable=False)
#     password = Column(String, nullable=False)
#     full_name = Column(String, nullable=False)
#     role = Column(String, nullable=False)  # "customer" or "vendor"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    full_name = Column(String)
    role = Column(String)
    is_verified = Column(Boolean, default=False)  # Add this line to track verification status
    
