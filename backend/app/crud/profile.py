from sqlalchemy.orm import Session
from app.models.profile import Profile

def create_profile(db: Session, username: str, image_url: str):
    db_profile = Profile(username=username, image_url=image_url)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def get_profile_by_username(db: Session, username: str):
    return db.query(Profile).filter(Profile.username == username).first()
