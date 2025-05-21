from app.schemas.comments import CommentCreate
from app.models.comments import Comment
import os
from sqlalchemy.orm import Session
def create_comment(db: Session, comment: CommentCreate):
    db_comment = Comment(
        product_id=comment.product_id,
        user_id=comment.user_id,
        content=comment.content,
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comments_by_product(db: Session, product_id: int):
    return db.query(Comment).filter(Comment.product_id == product_id).all()
