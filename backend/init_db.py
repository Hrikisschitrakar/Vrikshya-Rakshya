from database import engine, Base

# Create all tables
Base.metadata.create_all(bind=engine)
print("✅ Users table created successfully!")
