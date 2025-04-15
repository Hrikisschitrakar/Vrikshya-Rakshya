from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database import Base


class Remedy(Base):
    __tablename__ = "remedies"

    id = Column(Integer, primary_key=True, index=True)
    plant_name = Column(String, index=True)
    disease_name = Column(String, index=True)
    description = Column(String)
    remedies = Column(String)
    pesticides_fertilizers = Column(String)

    