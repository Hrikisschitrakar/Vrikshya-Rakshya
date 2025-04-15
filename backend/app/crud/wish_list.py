
from sqlalchemy.orm import Session
from app.models.wish_list import WishList
from app.models.user import User
from app.models.marketplace import Product

from app.models.wish_list import WishList
from fastapi import HTTPException

def add_to_wishlist(db, customer_id, product_id):
    # Fetch the customer and product
    customer = db.query(User).filter(User.id == customer_id).first()
    product = db.query(Product).filter(Product.id == product_id).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if the product is already in the customer's wishlist
    existing_item = db.query(WishList).filter(WishList.customer_id == customer.id, WishList.product_id == product.id).first()
    
    if existing_item:
        raise HTTPException(status_code=400, detail="Product is already in your wishlist")
    
    # If product is not in the wishlist, create a new entry
    new_item = WishList(
        customer_id=customer.id,
        product_id=product.id,
        product_name=product.name,
        product_description=product.description,
        product_price=product.price,
        product_stock=product.stock,
        product_image_url=product.image_url
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


def get_wishlist(db: Session, customer_id: int):
    # Fetch the customer's wish list
    wishlist = db.query(WishList).filter(WishList.customer_id == customer_id).all()
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    
    return wishlist

def remove_from_wishlist(db: Session, customer_id: int, product_id: int):
    # Fetch the wish list item
    wishlist_item = db.query(WishList).filter(
        WishList.customer_id == customer_id,
        WishList.product_id == product_id
    ).first()

    if not wishlist_item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")

    db.delete(wishlist_item)
    db.commit()

    return {"message": "Item removed from wishlist"}
