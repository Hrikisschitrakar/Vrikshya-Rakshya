from database import SessionLocal

db = SessionLocal()

try:
    print("✅ Successfully connected to PostgreSQL!")
except Exception as e:
    print(f"❌ Connection failed: {e}")
finally:
    db.close()
