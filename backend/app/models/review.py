
from sqlalchemy import Column, Integer, Float
from app.database import Base

class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, index=True)
    user_id = Column(Integer, index=True)
    rating = Column(Float, nullable=False)  # Only rating as a float (you can use Integer if you prefer whole numbers)
    

