from pydantic import BaseModel
from datetime import datetime

class SavedRemedyResponse(BaseModel):
    id: int
    username: str
    disease_name: str
    plant_name: str
    description: str
    remedies: str
    pesticides_fertilizers: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class SavedRemedyOut(BaseModel):
    id: int
    username: str
    disease_name: str
    plant_name: str
    description: str
    remedies: str
    pesticides_fertilizers: str
    created_at: datetime

    class Config:
        orm_mode = True  # This allows us to work with SQLAlchemy models directly
        from_attributes = True