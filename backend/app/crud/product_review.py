from sqlalchemy.orm import Session
from app.models.product_review import ProductReview
from app.models.user import User
from app.models.marketplace import Product
from app.schemas.product_review import ProductReviewCreate

def create_product_review(db: Session, user_id: int, review: ProductReviewCreate):
    # Check if the user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    # Check if the product exists
    product = db.query(Product).filter(Product.id == review.product_id).first()
    if not product:
        return None

    # Create the review
    db_review = ProductReview(
        product_id=review.product_id,
        user_id=user_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_product_reviews(db: Session, product_id: int):
    return db.query(ProductReview).filter(ProductReview.product_id == product_id).all()

def delete_product_review(db: Session, review_id: int, user_id: int):
    review = db.query(ProductReview).filter(ProductReview.id == review_id, ProductReview.user_id == user_id).first()
    if not review:
        return None
    db.delete(review)
    db.commit()
    return review