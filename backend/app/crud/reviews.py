from app.schemas.review import ReviewCreate
from backend.app.schemas.review_comment import ReviewReplyCreate
from app.models.reviews import Review, ReviewReply
from sqlalchemy.orm import Session
def create_reviews(db: Session, review_in: ReviewCreate):
    review = Review(**review_in.dict())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def create_review_reply(db: Session, reply_in: ReviewReplyCreate):
    reply = ReviewReply(**reply_in.dict())
    db.add(reply)
    db.commit()
    db.refresh(reply)
    return reply

def get_reviews_by_product(db: Session, product_id: int):
    return db.query(Review).filter(Review.product_id == product_id).all()
