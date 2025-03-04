from sqlalchemy import Column, String, Boolean, TIMESTAMP
from database import Base
import datetime
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)  # Store hashed passwords
    role = Column(String)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
