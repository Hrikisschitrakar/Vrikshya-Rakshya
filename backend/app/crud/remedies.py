# In your crud/marketplace.py
from sqlalchemy.orm import Session
from app.models.remedies import Remedy
from app.schemas.remedies import RemedyResponse

def get_remedy_by_disease_name(db: Session, disease_name: str):
    remedy = db.query(Remedy).filter(Remedy.disease_name == disease_name).first()
    if remedy:
        return RemedyResponse.from_orm(remedy)  

    return None

def get_remedy_by_plant_name(db: Session, plant_name: str):
    remedy = db.query(Remedy).filter(Remedy.plant_name == plant_name).first()
    if remedy:
        return RemedyResponse.from_orm(remedy)  

    return None