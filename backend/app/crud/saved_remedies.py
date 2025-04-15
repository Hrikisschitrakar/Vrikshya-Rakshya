from sqlalchemy.orm import Session
from app.models.saved_remedies import SavedRemedies
from app.models.remedies import Remedy

def save_remedy(db: Session, username: str, disease_name: str):
    # Check if the disease name exists in the remedies table
    remedy = db.query(Remedy).filter(Remedy.disease_name == disease_name).first()
    if remedy:
        # Create a new saved remedy record
        saved_remedy = SavedRemedies(
            username=username,
            disease_name=disease_name,
            plant_name=remedy.plant_name,
            description=remedy.description,
            remedies=remedy.remedies,
            pesticides_fertilizers=remedy.pesticides_fertilizers
        )
        db.add(saved_remedy)
        db.commit()
        db.refresh(saved_remedy)
        return saved_remedy
    return None
