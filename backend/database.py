from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI and DB name from environment variables
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB")

# Establish connection
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
products_collection = db["products"]
orders_collection = db["orders"]
notifications_collection = db["notifications"]
messages_collection = db["messages"]
results_collection = db["results"]
passkeys_collection = db["passkeys"]

print(f"✅ Successfully connected to MongoDB database: {DB_NAME}")
