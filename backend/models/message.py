# vrikshya/backend/models/message.py
from sqlalchemy import Column, UUID, ForeignKey, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID as UUIDType
from sqlalchemy.sql import func
from database.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUIDType, primary_key=True, server_default=func.gen_random_uuid(), nullable=False)
    sender_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(UUIDType, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=False), nullable=False, server_default=func.current_timestamp())