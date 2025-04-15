from sqlalchemy import Column, Integer, String
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    image_url = Column(String, nullable=False)
# from sqlalchemy import Column, Integer, String
# from app.database import Base

# class Profile(Base):
#     __tablename__ = "profiles"
    
#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True, nullable=False)
#     image_url = Column(String, nullable=False)  # Storing the URL of the image
