from sqlalchemy.orm import Session
from app.models.user import User
from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessageCreate

def create_chat_message(db: Session, sender_id: int, recipient_username: str, message: ChatMessageCreate):
    recipient = db.query(User).filter(User.username == recipient_username).first()
    if not recipient:
        return None
    db_message = ChatMessage(
        sender_id=sender_id,
        recipient_id=recipient.id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_chat_history(db: Session, user_id: int, other_username: str):
    other_user = db.query(User).filter(User.username == other_username).first()
    if not other_user:
        return []
    messages = db.query(ChatMessage).filter(
        ((ChatMessage.sender_id == user_id) & (ChatMessage.recipient_id == other_user.id)) |
        ((ChatMessage.sender_id == other_user.id) & (ChatMessage.recipient_id == user_id))
    ).order_by(ChatMessage.timestamp.asc()).all()
    return messages

def mark_messages_as_read(db: Session, user_id: int, other_username: str):
    other_user = db.query(User).filter(User.username == other_username).first()
    if not other_user:
        return []
    messages = db.query(ChatMessage).filter(
        ChatMessage.sender_id == other_user.id,
        ChatMessage.recipient_id == user_id,
        ChatMessage.read == False
    ).all()
    for message in messages:
        message.read = True
    db.commit()
    return messages