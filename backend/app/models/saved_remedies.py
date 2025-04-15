from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base
from datetime import datetime

class SavedRemedies(Base):
    __tablename__ = "saved_remedies"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    disease_name = Column(String, nullable=False)
    plant_name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    remedies = Column(Text, nullable=False)
    pesticides_fertilizers = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # You can also add a relationship here if you wish to link to the remedies table
    # remedy = relationship("Remedies", back_populates="saved_remedies")

