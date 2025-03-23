from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate

def create_notification(db: Session, notification: NotificationCreate):
    db_notification = Notification(
        user_id=notification.user_id,
        content=notification.content
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_notifications(db: Session, user_id: int):
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

def mark_notifications_as_read(db: Session, user_id: int):
    notifications = db.query(Notification).filter(Notification.user_id == user_id, Notification.read == False).all()
    for notification in notifications:
        notification.read = True
    db.commit()
    return notifications