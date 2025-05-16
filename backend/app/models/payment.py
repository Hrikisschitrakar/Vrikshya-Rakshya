from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from app.database import Base




# No need for the `relationship` here as we're not accessing the `User` or `Vendor` directly.
class Orders(Base):
    __tablename__ = 'order'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # Link to the users table
    product_id = Column(Integer, ForeignKey('products.id'))  # Link to the products table
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    payment_status = Column(Boolean, default=False)
    payment_url = Column(String)
    transaction_id = Column(String, nullable=True)  # New field to store the transaction ID from payment




class Users(Base):
    __tablename__ = 'users'  # Ensure this matches the actual table name in the database
    __table_args__ = {'extend_existing': True} 
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, index=True)