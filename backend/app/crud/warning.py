from sqlalchemy.orm import Session
from app.models.warning import Warning
from app.schemas.warning import WarningCreate

def create_warning(db: Session, warning: WarningCreate):
    db_warning = Warning(
        user_id=warning.user_id,
        username=warning.username,
        content=warning.content
    )
    db.add(db_warning)
    db.commit()
    db.refresh(db_warning)
    return db_warning


def get_warnings_for_user(db: Session, user_id: int):
    return db.query(Warning).filter(Warning.user_id == user_id).all()
