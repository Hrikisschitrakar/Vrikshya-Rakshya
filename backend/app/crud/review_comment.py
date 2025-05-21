from sqlalchemy.orm import Session
from app.models.review_comment import ReviewComment
from datetime import datetime

def create_review_comment(db: Session, review_id: int, user_id: int, content: str, parent_comment_id: int = None):
    comment = ReviewComment(
        review_id=review_id,
        user_id=user_id,
        content=content,
        parent_comment_id=parent_comment_id,
        created_at=datetime.utcnow()
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_comments_by_review(db: Session, review_id: int):
    return db.query(ReviewComment).filter(ReviewComment.review_id == review_id).all()
