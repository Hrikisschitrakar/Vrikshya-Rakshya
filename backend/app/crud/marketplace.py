from http.client import HTTPException
import os
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models.user import User
from app.models.vendor import VendorProfile
from app.models.marketplace import Product, Order
from app.schemas.marketplace import ProductCreate, ProductUpdate, OrderCreate

def create_product(db: Session, vendor_id: int, product: ProductCreate, image_bytes: bytes):
    # Ensure the static/products directory exists
    os.makedirs("static/products", exist_ok=True)
    
    # Save the image to the static directory
    image_path = f"static/products/{vendor_id}_{product.name.replace(' ', '_')}.jpg"
    with open(image_path, "wb") as f:
        f.write(image_bytes)
    
    db_product = Product(
        vendor_id=vendor_id,
        vendor_name=db.query(VendorProfile).filter(VendorProfile.user_id == vendor_id).first().business_name,
        vendor_address=db.query(VendorProfile).filter(VendorProfile.user_id == vendor_id).first().address,
        name=product.name,
        description=product.description,
        price=product.price,
        stock=product.stock,
        image_url=f"/{image_path}"
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session, username: str):
    user = db.query(User).filter(User.username == username, User.role == "vendor").first()
    if not user:
        return None
    return db.query(Product).filter(Product.vendor_id == user.id).all()

def get_products_id(db: Session, vendor_id: int):
    user = db.query(User).filter(User.vendor_id == vendor_id, User.role == "vendor").first()
    if not user:
        return None
    return db.query(Product).filter(Product.vendor_id == user.id).all()

def get_product(db: Session):
    user = db.query(User)
    if not user:
        return None
    return db.query(Product).filter(Product.vendor_id == user.id).all()

def search_products(
    db: Session,
    search_term: str = None,
    min_price: float = None,
    max_price: float = None,
    in_stock: bool = None,
    vendor_username: str = None
):
    query = db.query(Product)
    
    if search_term:
        search = f"%{search_term}%"
        query = query.filter(
            (Product.name.ilike(search)) | (Product.description.ilike(search))
        )
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if in_stock is not None:
        if in_stock:
            query = query.filter(Product.stock > 0)
        else:
            query = query.filter(Product.stock == 0)
    
    if vendor_username:
        vendor = db.query(User).filter(User.username == vendor_username, User.role == "vendor").first()
        if vendor:
            query = query.filter(Product.vendor_id == vendor.id)
    
    return query.all()

def update_product(db: Session, product_id: int, username: str, product: ProductUpdate, image_bytes: bytes = None):
    user = db.query(User).filter(User.username == username, User.role == "vendor").first()
    if not user:
        return None
    db_product = db.query(Product).filter(Product.id == product_id, Product.vendor_id == user.id).first()
    if not db_product:
        return None
    
    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.stock = product.stock
    
    if image_bytes:
        # Ensure the static/products directory exists
        os.makedirs("static/products", exist_ok=True)
        
        # Delete the old image if it exists
        if db_product.image_url:
            old_image_path = db_product.image_url.lstrip('/')
            if os.path.exists(old_image_path):
                os.remove(old_image_path)
        # Save the new image
        image_path = f"static/products/{user.id}_{product.name.replace(' ', '_')}.jpg"
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        db_product.image_url = f"/{image_path}"
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int, username: str):
    user = db.query(User).filter(User.username == username, User.role == "vendor").first()
    if not user:
        return None
    db_product = db.query(Product).filter(Product.id == product_id, Product.vendor_id == user.id).first()
    if not db_product:
        return None
    # Delete the image file if it exists
    if db_product.image_url:
        image_path = db_product.image_url.lstrip('/')
        if os.path.exists(image_path):
            os.remove(image_path)
    db.delete(db_product)
    db.commit()
    return db_product

def create_order(db: Session, username: str, order: OrderCreate):
    customer = db.query(User).filter(User.username == username, User.role == "customer").first()
    if not customer:
        return None
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        return None
    if product.stock < order.quantity:
        return None
    if not order.order_status:
        order.order_status = 'pending'
    
    product.stock -= order.quantity
    db_order = Order(
        customer_id=customer.id,
        product_id=product.id,
        quantity=order.quantity,
        total_price=product.price * order.quantity,
        order_status=order.order_status,
        vendor_id=product.vendor_id,
        product_name=product.name,
        address= order.address,
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_order_history(db: Session, username: str):
    customer = db.query(User).filter(User.username == username, User.role == "customer").first()
    if not customer:
        return None
    return db.query(Order).filter(Order.customer_id == customer.id).all()


# def get_vendor_dashboard(db, username: str):
#     # Get vendor's user details
#     vendor = db.query(User).filter(User.username == username).first()

#     # Calculate the total number of orders for the vendor
#     total_orders = db.query(Order).join(Product).filter(Product.vendor_id == vendor.id).count()

#     # Calculate the total sales (sum of the total_price from the orders for the vendor)
#     total_sales = db.query(func.sum(Order.total_price)).join(Product).filter(Product.vendor_id == vendor.id).scalar() or 0

#     # Calculate the total number of products for the vendor
#     total_products = db.query(Product).filter(Product.vendor_id == vendor.id).count()

#     # Calculate the total revenue (sum of the total_price from the orders)
#     total_revenue = db.query(func.sum(Order.total_price)).join(Product).filter(Product.vendor_id == vendor.id).scalar() or 0

#     # Build the dashboard response
#     dashboard_data = {
#         "total_orders": total_orders,
#         "total_sales": total_sales,
#         "total_products": total_products,
#         "vendor_id": vendor.id,
#         "vendor_name": vendor.username,  # Assuming 'vendor.username' is the business name
#         "total_revenue": total_revenue
#     }

#     return dashboard_data

from sqlalchemy.orm import aliased
from sqlalchemy import func

def get_vendor_dashboard(db, username: str):
    # Get vendor's user details
    vendor = db.query(User).filter(User.username == username).first()

    # Create an alias for Product to avoid ambiguity in the join
    product_alias = aliased(Product)

    # Calculate the total number of orders for the vendor
    total_orders = db.query(Order).join(
        product_alias, product_alias.id == Order.product_id  # Explicitly specify the join condition
    ).filter(product_alias.vendor_id == vendor.id).count()

    # Calculate the total sales (sum of the total_price from the orders for the vendor)
    total_sales = db.query(func.sum(Order.total_price)).join(
        product_alias, product_alias.id == Order.product_id
    ).filter(product_alias.vendor_id == vendor.id).scalar() or 0

    # Calculate the total number of products for the vendor
    total_products = db.query(Product).filter(Product.vendor_id == vendor.id).count()

    # Calculate the total revenue (sum of the total_price from the orders)
    total_revenue = db.query(func.sum(Order.total_price)).join(
        product_alias, product_alias.id == Order.product_id
    ).filter(product_alias.vendor_id == vendor.id).scalar() or 0

    # Build the dashboard response
    dashboard_data = {
        "total_orders": total_orders,
        "total_sales": total_sales,
        "total_products": total_products,
        "vendor_id": vendor.id,
        "vendor_name": vendor.username,  # Assuming 'vendor.username' is the business name
        "total_revenue": total_revenue
    }

    return dashboard_data
