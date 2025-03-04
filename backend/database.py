# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# # PostgreSQL Database URL
# DATABASE_URL = "postgresql://postgres:hubby%40010@localhost:5432/vrikshya"

# # Create Engine
# engine = create_engine(DATABASE_URL)

# # Session Local
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Base Class
# Base = declarative_base()
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# def test_connection():
#     try:
#         db = SessionLocal()
#         db.execute("SELECT 1")
#         print("✅ Database connection successful 🚀")
#     except Exception as e:
#         print(f"❌ Database connection failed: {e}")
#     finally:
#         db.close()

# # Run this function when the script runs
# if __name__ == "__main__":
#     test_connection()


# from sqlalchemy import create_engine, text  # Import text to fix SQL error
# from sqlalchemy.orm import sessionmaker, declarative_base  # Updated import
# from sqlalchemy.ext.declarative import declarative_base
# # PostgreSQL Database URL
# DATABASE_URL = "postgresql://postgres:hubby%40010@localhost:5432/vrikshya"

# # Create Engine
# engine = create_engine(DATABASE_URL, echo=True)  # Enable logging

# # Session Local
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Base Class (Fixed Warning)
# Base = declarative_base()

# # Test Connection Function
# def test_connection():
#     try:
#         db = SessionLocal()
#         db.execute(text("SELECT 1"))  # FIX: Use `text()` function
#         print("✅ Database connection successful 🚀")
#     except Exception as e:
#         print(f"❌ Database connection failed: {e}")
#     finally:
#         db.close()

# # Run test when script is executed
# if __name__ == "__main__":
#     test_connection()


# from sqlalchemy import create_engine, text
# from sqlalchemy.orm import sessionmaker, declarative_base
# from sqlalchemy.ext.declarative import declarative_base

# Base = declarative_base()

# # PostgreSQL Database URL
# DATABASE_URL = "postgresql://postgres:hubby%40010@localhost:5432/vrikshya"

# # Create Engine
# engine = create_engine(DATABASE_URL, echo=True)

# # Session Local
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Base Class
# Base = declarative_base()

# #  Ensure this function exists
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = "postgresql+asyncpg://vriskya_user:securepassword@localhost/vriskyarakshya"

# Create Async Engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Create Session Local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

# Base Model
Base = declarative_base()

# Dependency to get DB session
async def get_db():
    async with SessionLocal() as session:
        yield session
