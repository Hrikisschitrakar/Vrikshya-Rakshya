from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bio = Column(String, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    location = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="profile")