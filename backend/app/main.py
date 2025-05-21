
import shutil
from app.crud.remedies import get_remedy_by_disease_name
from app.schemas.remedies import RemedyResponse
from app.crud.saved_remedies import save_remedy
from app.models.saved_remedies import SavedRemedies
from app.schemas.saved_remedies import SavedRemedyOut, SavedRemedyResponse
from app.models.remedies import Remedy
from app.schemas.customer_dashboard import CustomerDashboard
from app.crud.wish_list import add_to_wishlist, get_wishlist, remove_from_wishlist
from app.schemas.wish_list import WishListOut
from app.models.customer import CustomerProfile
from app.schemas.customer import CustomerProfileCreate, CustomerProfileOut
from app.models.wish_list import WishList
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, WebSocket, WebSocketDisconnect, Query
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from app.database import Base, engine, get_db
from app.schemas.user import UserCreate, UserOut, UserDelete, UserLogin, ChangePassword, ChangeUsername, ChangeFullName  # Add ChangeUsername
from app.schemas.vendor import VendorProfileCreate, VendorProfileOut
from app.schemas.marketplace import OrderOutVendor, ProductCreate, ProductOut, ProductUpdate, OrderCreate, OrderOut, VendorDashboard
from app.schemas.chat import ChatMessageCreate, ChatMessageOut
from app.schemas.notification import NotificationCreate, NotificationOut
from app.schemas.password_reset import PasswordResetRequest, PasswordReset as PasswordResetSchema
from app.models.user import User
from app.models.vendor import VendorProfile
from app.models.marketplace import Product, Order
from app.models.notification import Notification
from app.models.password_reset import PasswordReset as PasswordResetModel
from app.crud.user import create_user, delete_user, authenticate_user, change_password, change_username, change_fullname  # Add change_username
from app.crud.vendor import create_vendor_profile, get_vendor_profile, update_vendor_profile, delete_vendor_profile
from app.crud.marketplace import create_product, get_products, get_products_id, search_products, update_product, delete_product, create_order, get_order_history, get_vendor_dashboard
from app.crud.chat import create_chat_message, get_chat_history, mark_messages_as_read
from app.crud.notification import create_notification, get_notifications, mark_notifications_as_read
from app.crud.password_reset import create_password_reset_token, reset_password
from app.websockets import manager
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from io import BytesIO
import json
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import List
from fastapi.security import OAuth2PasswordBearer
from app.utils.email import send_email
from app.crud.profile import create_profile, get_profile_by_username
from app.schemas.profile import ProfileOut
from app.models.profile import Profile
app = FastAPI(title="Vrikshya Rakshya Backend")
import os
import requests
from app.models.profile import Profile  # Assuming you have the Profile model
from app.schemas.profile import ProfileOut
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewOut
from pydantic import BaseModel
import httpx
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from sqlalchemy.orm import aliased
from sqlalchemy import func
from app.models.payment import Orders, Users
# Mount the static directory to serve images
app.mount("/static", StaticFiles(directory="static"), name="static")

Base.metadata.create_all(bind=engine)

SECRET_KEY = "6ec55fdc0630e01a0688d8c7c3524784a8601d9c797f716ca2b588ba68e3943d"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

from fastapi.middleware.cors import CORSMiddleware


# Allow all origins for development purposes (change in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or use ["http://localhost:3000"] for React Native on local
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods like GET, POST, PUT, DELETE
    allow_headers=["*"],  # Allows all headers
)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
def create_verification_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # The payload contains the user data
    except JWTError:
        return None

# Load the trained model
model = load_model('/Users/hrikisschitrakar/Desktop/model/plant_disease_model.h5')

# Define class labels
class_labels = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Chili___healthy",
    "Chili___leaf_curl",
    "Chili___leaf_spot",
    "Chili___whitefly",
    "Chili___yellowish",
    "Coffee___Rust",
    "Coffee___healthy",
    "Coffee___red_spider_mite",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

# User endpoints
# @app.post("/signup", response_model=UserOut)
# async def signup(user: UserCreate, db: Session = Depends(get_db)):
#     # Check if username or email already exists
#     if db.query(User).filter(User.username == user.username).first():
#         raise HTTPException(status_code=400, detail="Username already registered")
#     if db.query(User).filter(User.email == user.email).first():
#         raise HTTPException(status_code=400, detail="Email already registered")
#     if user.role not in ["customer", "vendor"]:
#         raise HTTPException(status_code=400, detail="Invalid role")
    
#     # Create the user in the database
#     db_user = create_user(db, user)
    
#     # Create an access token for the user
#     token = create_access_token(data={"sub": db_user.username})
    
#     # Return the user data along with the generated token
#     return {
#         "id": db_user.id,
#         "username": db_user.username,
#         "email": db_user.email,
#         "full_name": db_user.full_name,
#         "role": db_user.role,
#         "token": token  # Include the generated token in the response
#     }

@app.post("/signup", response_model=UserOut)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username or email already exists
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if user.role not in ["customer", "vendor"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    # Create the user in the database
    db_user = create_user(db, user)
    
    # Create an access token for the user
    token = create_access_token(data={"sub": db_user.username})
    
    # Send email with the verification link
    verification_token = create_verification_token(data={"sub": db_user.email})
    verification_link = f"http://localhost:8000/verify/{verification_token}"
    email_subject = "Please verify your email"
    email_body = f"Click the link to verify your email: {verification_link}"
    
    email_sent = await send_email(to_email=db_user.email, subject=email_subject, body=email_body)
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send verification email")
    
    return {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "full_name": db_user.full_name,
        "role": db_user.role,
        "token": token,  # Include the generated token in the response
        "message": "User created successfully. Please check your email for verification."
    }

@app.get("/verify/{verification_token}")
async def verify_email(verification_token: str, db: Session = Depends(get_db)):
    try:
        # Decode the token to get user data
        payload = verify_access_token(verification_token)
        if payload is None:
            raise HTTPException(status_code=400, detail="Invalid or expired token")
        
        # Extract the user email from the token
        email = payload.get("sub")
        
        # Find the user in the database
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Mark the user as verified
        user.is_verified = True
        db.commit()
        
        return {"message": "Email successfully verified. You can now log in."}
    
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")



@app.delete("/users", response_model=UserOut)
async def delete_user_endpoint(user: UserDelete, db: Session = Depends(get_db)):
    db_user = delete_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # If needed, issue a new token after deleting the user (typically not done for delete operations)
    new_token = create_access_token(data={"sub": db_user.username})

    return {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "full_name": db_user.full_name,
        "role": db_user.role,
        "token": new_token  # Adding the new token to the response
    }


@app.post("/login", response_model=UserOut)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Generate token
    token = create_access_token(data={"sub": db_user.username})

    # Return user info along with token
    return {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "full_name": db_user.full_name,
        "role": db_user.role,
        "token": token  # Adding the token to the response
    }


# Function to get the current user from the toke # 
@app.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
    password_reset = await create_password_reset_token(db, request.email)
    if not password_reset:
        raise HTTPException(status_code=400, detail="Email not found or failed to send reset email")
    return {"message": "Password reset email sent successfully"}

@app.post("/reset-password")
async def reset_password_endpoint(request: PasswordResetSchema, db: Session = Depends(get_db)):
    if not reset_password(db, request.token, request.new_password):
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return {"message": "Password reset successfully"}

@app.post("/change-password/{username}", response_model=UserOut)
async def change_password_endpoint(username: str, change_password_data: ChangePassword, db: Session = Depends(get_db)):
    user = change_password(db, username, change_password_data.current_password, change_password_data.new_password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or current password")
    return user

# @app.post("/change-username/{current_username}", response_model=UserOut)
# async def change_username_endpoint(current_username: str, change_username_data: ChangeUsername, db: Session = Depends(get_db)):
#     result = change_username(
#         db,
#         current_username,
#         change_username_data.current_password,
#         change_username_data.new_username
#     )
#     if result is None:
#         raise HTTPException(status_code=401, detail="Invalid username or current password")
#     if result is False:
#         raise HTTPException(status_code=400, detail="New username is already taken")
#     return result

@app.post("/change-username/{current_username}", response_model=UserOut)
async def change_username_endpoint(current_username: str, change_username_data: ChangeUsername, db: Session = Depends(get_db)):
    result = change_username(
        db,
        current_username,
        change_username_data.current_password,
        change_username_data.new_username
    )
    
    if result is None:
        raise HTTPException(status_code=401, detail="Invalid username or current password")
    if result is False:
        raise HTTPException(status_code=400, detail="New username is already taken")
    
    # Assuming the username change was successful, generate a new token
    new_token = create_access_token(data={"sub": result.username})  # Update the token generation logic as needed

    # Return the updated user details along with the new token
    return {"id": result.id, "username": result.username, "email": result.email, "full_name": result.full_name, "role": result.role, "token": new_token}

@app.post("/change-fullname/{current_fullname}", response_model=UserOut)
async def change_fullname_endpoint(current_fullname: str, change_fullname_data: ChangeFullName, db: Session = Depends(get_db)):
    # Change the full name in the database
    result = change_fullname(
        db,
        current_fullname,
        change_fullname_data.current_password,
        change_fullname_data.new_full_name
    )
    
    # If the result is None, it means the username or password was incorrect
    if result is None:
        raise HTTPException(status_code=401, detail="Invalid name or current password")
    
    # If the result is False, it means the new full name is already taken (or some other error occurred)
    if result is False:
        raise HTTPException(status_code=400, detail="New name is already taken")
    
    # Assuming the full name change was successful, generate a new token (based on username)
    new_token = create_access_token(data={"sub": result.full_name})  # Use result.full_name
    
    # Return the updated user details along with the new token
    return {
        "id": result.id,
        "username": result.username,
        "email": result.email,
        "full_name": result.full_name,
        "role": result.role,
        "token": new_token  # Include the new token in the response
    }

# Profile POST endpoint

@app.post("/profile")
async def create_profile_endpoint(username: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Get the file extension and create the filename
    file_extension = file.filename.split('.')[-1]
    file_name = f"{username}_profile.{file_extension}"
    
    # Define the directory to save the file
    profile_dir = "static/profiles"
    
    # Create the directory if it doesn't exist
    os.makedirs(profile_dir, exist_ok=True)
    
    # Define the file location
    file_location = os.path.join(profile_dir, file_name)

    # Save the file to the specified location
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save the image URL to the database
    image_url = f"/static/profiles/{file_name}"
    
    # Check if the profile already exists
    db_profile = db.query(Profile).filter(Profile.username == username).first()
    
    if db_profile:
        db_profile.image_url = image_url
        db.commit()
        db.refresh(db_profile)
        return {"message": "Profile updated successfully", "image_url": image_url}
    
    # If no profile exists, create a new profile
    new_profile = Profile(username=username, image_url=image_url)
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return {"message": "Profile created successfully", "image_url": image_url}


@app.get("/profile/{username}", response_model=ProfileOut)
async def get_profile(username: str, db: Session = Depends(get_db)):
    # Query the database for the profile by username
    db_profile = db.query(Profile).filter(Profile.username == username).first()

    # If the profile is not found, raise a 404 error
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    return db_profile

@app.put("/profile/{username}", response_model=ProfileOut)
async def update_profile_image(username: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Query the profile by username
    db_profile = db.query(Profile).filter(Profile.username == username).first()

    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Generate the image file path
    file_location = f"static/profiles/{username}_{file.filename}"

    # Save the image to the server
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Update the profile with the new image URL
    db_profile.image_url = f"/static/profiles/{username}_{file.filename}"
    db.commit()

    return db_profile


# Disease prediction endpoint
@app.get("/")
def home():
    return {"message": "Plant Disease Prediction API is running!"}

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = load_img(BytesIO(contents), target_size=(139, 139))
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array)
        predicted_class_index = np.argmax(prediction)
        predicted_label = class_labels[predicted_class_index]
        confidence_score = float(prediction[0][predicted_class_index] * 100)

        return {
            "Predicted Label": predicted_label,
            "Confidence Score": f"{confidence_score:.2f}%"
        }
    except Exception as e:
        return {"error": str(e)}

# In your main.py or endpoints file
@app.get("/plant/remedies/{disease_name}", response_model=RemedyResponse)
def get_remedies_by_disease(disease_name: str, db: Session = Depends(get_db)):
    remedy = get_remedy_by_disease_name(db, disease_name)
    if remedy:
        return remedy
    raise HTTPException(status_code=404, detail="Disease not found")


# Vendor endpoints
@app.post("/vendor/profile/{username}", response_model=VendorProfileOut)
async def create_vendor_profile_endpoint(username: str, vendor: VendorProfileCreate, db: Session = Depends(get_db)):
    db_vendor = create_vendor_profile(db, username, vendor)
    if not db_vendor:
        raise HTTPException(status_code=400, detail="Vendor not found or profile already exists")
    return db_vendor

@app.get("/vendor/profile/{username}", response_model=VendorProfileOut)
async def get_vendor_profile_endpoint(username: str, db: Session = Depends(get_db)):
    vendor = get_vendor_profile(db, username)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")
    return vendor

@app.put("/vendor/profile/{username}", response_model=VendorProfileOut)
async def update_vendor_profile_endpoint(username: str, vendor: VendorProfileCreate, db: Session = Depends(get_db)):
    db_vendor = update_vendor_profile(db, username, vendor)
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor or profile not found")
    return db_vendor

@app.delete("/vendor/profile/{username}", response_model=VendorProfileOut)
async def delete_vendor_profile_endpoint(username: str, db: Session = Depends(get_db)):
    db_vendor = delete_vendor_profile(db, username)
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor or profile not found")
    return db_vendor

@app.get("/vendor/dashboard/{username}", response_model=VendorDashboard)
async def get_vendor_dashboard_endpoint(username: str, db: Session = Depends(get_db)):
    dashboard = get_vendor_dashboard(db, username)
    if dashboard is None:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return dashboard

# Marketplace endpoints
@app.post("/products/{username}", response_model=ProductOut)
async def create_product_endpoint(
    username: str,
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    stock: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    vendor = db.query(User).filter(User.username == username, User.role == "vendor").first()
    if not vendor:
        raise HTTPException(status_code=400, detail="Vendor not found")
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    image_bytes = await file.read()
    product = ProductCreate(name=name, description=description, price=price, stock=stock)
    db_product = create_product(db, vendor.id,  product, image_bytes)
    return db_product

@app.get("/products/{username}", response_model=list[ProductOut])
async def get_products_endpoint(username: str, db: Session = Depends(get_db)):
    products = get_products(db, username)
    if not products:
        return []
    return products


@app.post("/reviews", response_model=ReviewOut)
async def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    # Check if the user has already reviewed the product
    existing_review = db.query(Review).filter(Review.product_id == review.product_id, Review.user_id == review.user_id).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this product.")

    # Create new review with only the rating
    db_review = Review(product_id=review.product_id, user_id=review.user_id, rating=review.rating)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@app.get("/reviews/{product_id}", response_model=list[ReviewOut])
async def get_reviews(product_id: int, db: Session = Depends(get_db)):
    # Query the reviews for the given product_id
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    
    # If no reviews are found, raise an HTTPException with a 404 status code
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this product.")
    
    return reviews

@app.get("/reviews/average/{product_id}", response_model=float)
async def get_average_rating(product_id: int, db: Session = Depends(get_db)):
    # Query all reviews for the given product_id
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    
    # If no reviews are found, raise a 404 error
    if not reviews:
        raise HTTPException(status_code=404, detail="No reviews found for this product.")
    
    # Calculate the average rating
    average_rating = sum([review.rating for review in reviews]) / len(reviews)
    
    return average_rating


@app.get("/products/{vendor_id}", response_model=list[ProductOut])
async def get_products_endpoint(vendor_id: int, db: Session = Depends(get_db)):
    products = get_products_id(db, vendor_id)
    if not products:
        return []
    return products

@app.get("/products", response_model=list[ProductOut])
async def get_all_products_endpoint(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found")
    return products


@app.post("/restock", response_model=ProductOut)
async def restock_product(product_id: int, quantity: int, db: Session = Depends(get_db)):
    # Find the product by its product_id
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    # Verify if the vendor is the owner of the product
    # if product.vendor_id != vendor_id:
    #     raise HTTPException(status_code=403, detail="You are not authorized to restock this product.")
    
    # Check if quantity is a positive number
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero.")
    
    # Restock the product (increase the stock by the given quantity)
    product.stock += quantity
    
    # Commit the changes to the database
    db.commit()
    db.refresh(product)
    
    return product

@app.post("/price", response_model=ProductOut)
async def replace_product_price(product_id: int, price: int, db: Session = Depends(get_db)):
    # Find the product by its product_id
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    # Verify if the vendor is the owner of the product
    # if product.vendor_id != vendor_id:
    #     raise HTTPException(status_code=403, detail="You are not authorized to restock this product.")
    
    # Check if quantity is a positive number
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than zero.")
    
    # Restock the product (increase the stock by the given quantity)
    product.price = price
    
    # Commit the changes to the database
    db.commit()
    db.refresh(product)
    
    return product

@app.get("/products/search", response_model=list[ProductOut])
async def search_products_endpoint(
    db: Session = Depends(get_db),
    search_term: str = Query(None, description="Search term to match product name or description"),
    min_price: float = Query(None, description="Minimum price filter"),
    max_price: float = Query(None, description="Maximum price filter"),
    in_stock: bool = Query(None, description="Filter by stock availability (true for in stock, false for out of stock)"),
    vendor_username: str = Query(None, description="Filter by vendor username")
):
    products = search_products(
        db,
        search_term=search_term,
        min_price=min_price,
        max_price=max_price,
        in_stock=in_stock,
        vendor_username=vendor_username
    )
    return products

@app.put("/products/{username}/{product_id}", response_model=ProductOut)
async def update_product_endpoint(
    username: str,
    product_id: int,
    product: ProductUpdate,
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username, User.role == "vendor").first()
    if not user:
        raise HTTPException(status_code=404, detail="Vendor not found")
    image_bytes = await file.read() if file else None
    if file and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    db_product = update_product(db, product_id, username, product, image_bytes)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found or not owned by vendor")
    return db_product

@app.delete("/products/{username}/{product_id}", response_model=ProductOut)
async def delete_product_endpoint(username: str, product_id: int, db: Session = Depends(get_db)):
    db_product = delete_product(db, product_id, username)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found or not owned by vendor")
    return db_product

@app.post("/orders/{username}", response_model=OrderOut)
async def create_order_endpoint(username: str, order: OrderCreate, db: Session = Depends(get_db)):
    db_order = create_order(db, username, order)
    if not db_order:
        raise HTTPException(status_code=400, detail="Customer not found, product not found, or insufficient stock")

    # Notify the customer
    customer = db.query(User).filter(User.username == username).first()
    product = db.query(Product).filter(Product.id == db_order.product_id).first()
    vendor = db.query(User).filter(User.id == product.vendor_id).first()
    customer_notification = NotificationCreate(
        user_id=customer.id,
        content=f"Your order for {db_order.quantity} unit(s) of {product.name} has been placed successfully!"
    )
    db_customer_notification = create_notification(db, customer_notification)
    customer_notification_data = {
        "type": "notification",
        "id": db_customer_notification.id,
        "content": db_customer_notification.content,
        "created_at": db_customer_notification.created_at.isoformat(),
        "read": db_customer_notification.read
    }
    await manager.send_personal_message(customer_notification_data, customer.id)

    # Notify the vendor
    vendor_notification = NotificationCreate(
        user_id=vendor.id,
        content=f"New order received: {db_order.quantity} unit(s) of {product.name} from {username}"
    )
    db_vendor_notification = create_notification(db, vendor_notification)
    vendor_notification_data = {
        "type": "notification",
        "id": db_vendor_notification.id,
        "content": db_vendor_notification.content,
        "created_at": db_vendor_notification.created_at.isoformat(),
        "read": db_vendor_notification.read
    }
    await manager.send_personal_message(vendor_notification_data, vendor.id)

    return db_order

# @app.get("/orders/history/{username}", response_model=list[OrderOut])
# async def get_order_history_endpoint(username: str, db: Session = Depends(get_db)):
#     orders = get_order_history(db, username)
#     if not orders:
#         return []
#     return orders
@app.get("/orders/history/{username}", response_model=List[OrderOut])
async def get_order_history_endpoint(username: str, db: Session = Depends(get_db)):
    # Get the customer by username
    customer = db.query(User).filter(User.username == username, User.role == "customer").first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Query the orders with product details
    orders = db.query(Order, Product).join(Product, Product.id == Order.product_id).filter(Order.customer_id == customer.id).all()

    # Prepare the response with the necessary fields
    response = []
    for order, product in orders:
        response.append({
            "id": order.id,
            "product_id": order.product_id,
            "vendor_id": product.vendor_id,  # Ensure vendor_id is set
            "customer_id": order.customer_id,
            "quantity": order.quantity,
            "total_price": order.total_price,
            "order_status": order.order_status,
            "product_name": product.name,  # Ensure product_name is included
            "created_at": order.created_at,
            "address": order.address,  # Ensure vendor_address is included
        })
    
    return response

# Endpoint to get the orders for a vendor
# Endpoint to get the orders for a vendor with the product name
@app.get("/orders/vendor-history/{vendor_username}", response_model=List[OrderOutVendor])
async def get_vendor_orders_endpoint(vendor_username: str, db: Session = Depends(get_db)):
    # Get the vendor by username (ensure vendor role)
    vendor = db.query(User).filter(User.username == vendor_username, User.role == "vendor").first()
    
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    # Explicitly set the base table for the join using select_from()
    orders = db.query(
        Order.id.label('order_id'),
        Product.name.label('product_name'),
        Product.vendor_name,
        Product.vendor_address,
        Order.customer_id,
        User.full_name.label('full_name'),  # Fetch full_name from the User table
        Order.quantity,
        Order.total_price,
        Order.order_status,
        Order.created_at,
        Product.vendor_id  # Vendor ID from Product table
    ).select_from(Order).join(Product, Product.id == Order.product_id).join(User, User.id == Order.customer_id).filter(Product.vendor_id == vendor.id).all()

    if not orders:
        return []  # Return empty list if no orders found

    # Return orders formatted correctly with full_name and vendor_id
    result = [
        {
            "order_id": order.order_id,
            "product_name": order.product_name,
            "vendor_name": order.vendor_name,
            "vendor_address": order.vendor_address,
            "address": order.vendor_address,
            "customer_id": order.customer_id,
            "full_name": order.full_name,  # Add full_name to the response
            "quantity": order.quantity,
            "total_price": order.total_price,
            "order_status": order.order_status,
            "created_at": order.created_at,
            "vendor_id": order.vendor_id,  # Include vendor_id as well
        }
        for order in orders
    ]
    
    return result





# Chat endpoints
@app.websocket("/ws/chat/{username}")
async def websocket_chat(websocket: WebSocket, username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        await websocket.close(code=1008, reason="User not found")
        return

    await manager.connect(user.id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            message_type = data.get("type", "message")

            if message_type == "message":
                message = ChatMessageCreate(**data)
                db_message = create_chat_message(db, user.id, message.recipient_username, message)
                if not db_message:
                    await websocket.send_json({"error": "Recipient not found"})
                    continue

                # Prepare the message to send
                message_data = {
                    "type": "message",
                    "sender_username": username,
                    "recipient_username": message.recipient_username,
                    "content": message.content,
                    "timestamp": db_message.timestamp.isoformat(),
                    "read": db_message.read
                }

                # Send the message to the recipient
                recipient = db.query(User).filter(User.username == message.recipient_username).first()
                await manager.send_personal_message(message_data, recipient.id)
                # Send the message back to the sender (for confirmation)
                await manager.send_personal_message(message_data, user.id)

                # Create a notification for the recipient
                notification = NotificationCreate(
                    user_id=recipient.id,
                    content=f"New message from {username}: {message.content[:50]}{'...' if len(message.content) > 50 else ''}"
                )
                db_notification = create_notification(db, notification)
                notification_data = {
                    "type": "notification",
                    "id": db_notification.id,
                    "content": db_notification.content,
                    "created_at": db_notification.created_at.isoformat(),
                    "read": db_notification.read
                }
                await manager.send_personal_message(notification_data, recipient.id)

            elif message_type == "typing":
                recipient_username = data.get("recipient_username")
                typing_data = {
                    "type": "typing",
                    "sender_username": username,
                    "recipient_username": recipient_username
                }
                recipient = db.query(User).filter(User.username == recipient_username).first()
                if recipient:
                    await manager.send_personal_message(typing_data, recipient.id)

    except WebSocketDisconnect:
        manager.disconnect(user.id)
    except Exception as e:
        await websocket.send_json({"error": str(e)})
        manager.disconnect(user.id)

@app.get("/chat/history/{username}/{other_username}", response_model=list[ChatMessageOut])
async def get_chat_history_endpoint(username: str, other_username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    messages = get_chat_history(db, user.id, other_username)
    return messages

@app.post("/chat/send/{username}", response_model=ChatMessageOut)
async def send_chat_message_endpoint(username: str, message: ChatMessageCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_message = create_chat_message(db, user.id, message.recipient_username, message)
    if not db_message:
        raise HTTPException(status_code=404, detail="Recipient not found")

    # Prepare the message to send via WebSocket
    message_data = {
        "type": "message",
        "sender_username": username,
        "recipient_username": message.recipient_username,
        "content": message.content,
        "timestamp": db_message.timestamp.isoformat(),
        "read": db_message.read
    }

    # Send the message to the recipient via WebSocket
    recipient = db.query(User).filter(User.username == message.recipient_username).first()
    await manager.send_personal_message(message_data, recipient.id)
    # Send the message back to the sender (for confirmation)
    await manager.send_personal_message(message_data, user.id)

    # Create a notification for the recipient
    notification = NotificationCreate(
        user_id=recipient.id,
        content=f"New message from {username}: {message.content[:50]}{'...' if len(message.content) > 50 else ''}"
    )
    db_notification = create_notification(db, notification)
    notification_data = {
        "type": "notification",
        "id": db_notification.id,
        "content": db_notification.content,
        "created_at": db_notification.created_at.isoformat(),
        "read": db_notification.read
    }
    await manager.send_personal_message(notification_data, recipient.id)

    return db_message

@app.post("/chat/mark-read/{username}/{other_username}")
async def mark_messages_as_read_endpoint(username: str, other_username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    other_user = db.query(User).filter(User.username == other_username).first()
    if not other_user:
        raise HTTPException(status_code=404, detail="Other user not found")

    messages = mark_messages_as_read(db, user.id, other_username)
    if not messages:
        return {"message": "No unread messages to mark as read"}

    # Notify the sender (other_user) that their messages have been read
    read_data = {
        "type": "read",
        "sender_username": username,
        "recipient_username": other_username,
        "message_ids": [message.id for message in messages]
    }
    await manager.send_personal_message(read_data, other_user.id)

    return {"message": f"Marked {len(messages)} messages as read"}

# Notification endpoints
@app.get("/notifications/{username}", response_model=List[NotificationOut])
async def get_notifications_endpoint(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    notifications = get_notifications(db, user.id)
    return notifications

@app.post("/notifications/mark-read/{username}")
async def mark_notifications_as_read_endpoint(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    notifications = mark_notifications_as_read(db, user.id)
    return {"message": f"Marked {len(notifications)} notifications as read"}


class PaymentRequest(BaseModel):
    amount: float
    mobile_number: str
    product_name: str
    email: str


KHALTI_API_URL = os.getenv("KHALTI_API_URL")
KHALTI_API_KEY = os.getenv("KHALTI_API_KEY")


@app.post("/create-payment/")
async def create_payment(payment: PaymentRequest):
    payload = {
        "amount": payment.amount * 100,  # Amount should be in Paisa (1 Nrs = 100 Paisa)
        "mobile": payment.mobile_number,
        "product_identity": payment.product_name,
        "email": payment.email,
    }

    headers = {
        "Authorization": f"Key {KHALTI_API_KEY}"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(KHALTI_API_URL, json=payload, headers=headers)
            response_data = response.json()
            
            if response.status_code == 201:
                return {"payment_url": response_data["payment_url"]}
            else:
                raise HTTPException(status_code=400, detail="Failed to create payment order")
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail="Internal Server Error")
        



@app.post("/save-remedy", response_model=SavedRemedyResponse)
async def save_remedy_endpoint(username: str, disease_name: str, db: Session = Depends(get_db)):
    # Save the remedy
    saved_remedy = save_remedy(db, username, disease_name)
    
    if saved_remedy:
        return saved_remedy
    else:
        raise HTTPException(status_code=404, detail="Disease name not found in remedies")
    

@app.get("/saved-remedies/{username}", response_model=list[SavedRemedyOut])
async def get_saved_remedies(username: str, db: Session = Depends(get_db)):
    # Query the saved_remedies table for the given username
    saved_remedies = db.query(SavedRemedies).filter(SavedRemedies.username == username).all()
    
    if not saved_remedies:
        raise HTTPException(status_code=404, detail="No saved remedies found for this username")
    
    return saved_remedies

# @app.get("/customer/dashboard/{username}", response_model=CustomerDashboard)
# async def get_customer_dashboard(username: str, db: Session = Depends(get_db)):
#     # Get the customer user details
#     customer = db.query(User).filter(User.username == username).first()
#     if not customer:
#         raise HTTPException(status_code=404, detail="Customer not found")

#     # Calculate the total number of orders for the customer
#     total_orders = db.query(Order).filter(Order.customer_id == customer.id).count()

#     # Calculate the total money spent by the customer (sum of the total_price from the orders)
#     total_spent = db.query(func.sum(Order.total_price)).filter(Order.customer_id == customer.id).scalar() or 0

#     # Build the customer dashboard response
#     dashboard_data = {
#         "total_orders": total_orders,
#         "total_spent": total_spent,
#         "customer_id": customer.id,
#         "customer_name": customer.full_name,  # Assuming 'customer.full_name' is the name of the customer
#     }

#     return dashboard_data

@app.get("/customer/dashboard/{username}", response_model=CustomerDashboard)
async def get_customer_dashboard(username: str, db: Session = Depends(get_db)):
    # Query the customer from the User table
    customer = db.query(User).filter(User.username == username, User.role == "customer").first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Query to get the total number of orders for the customer
    total_orders = db.query(Order).filter(Order.customer_id == customer.id).count()
    
    # Query to get the total amount of money spent by the customer
    total_spent = db.query(func.sum(Order.total_price)).filter(Order.customer_id == customer.id).scalar() or 0.0
    
    # Query to get the wishlist count for the customer
    wishlist_count = db.query(WishList).filter(WishList.customer_id == customer.id).count()
    
    # Create the dashboard response with the order count, total spent, and wishlist count
    dashboard_data = CustomerDashboard(
        customer_id=customer.id,  # Include customer_id
        customer_name=customer.full_name,  # Include customer_name
        total_orders=total_orders,
        total_spent=total_spent,
        wishlist_count=wishlist_count
    )

    return dashboard_data

@app.post("/wishlist/{username}/{product_id}", response_model=WishListOut)
async def add_to_wishlist_endpoint(username: str, product_id: int, db: Session = Depends(get_db)):
    # Get the user by username
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Add the product to the user's wish list
    wish_list_item = add_to_wishlist(db, user.id, product_id)
    
    if not wish_list_item:
        raise HTTPException(status_code=400, detail="Product already in wish list")
    
    return wish_list_item

@app.get("/wishlist/{username}", response_model=List[WishListOut])
async def get_wishlist_endpoint(username: str, db: Session = Depends(get_db)):
    # Get the user by username
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Retrieve the user's wish list
    wishlist = get_wishlist(db, user.id)
    
    if not wishlist:
        raise HTTPException(status_code=404, detail="No items in wish list")
    
    return wishlist

@app.delete("/wishlist/{username}/{product_id}", response_model=WishListOut)
async def remove_from_wishlist_endpoint(username: str, product_id: int, db: Session = Depends(get_db)):
    # Get the user by username
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Remove the product from the user's wish list
    wish_list_item = remove_from_wishlist(db, user.id, product_id)
    
    if not wish_list_item:
        raise HTTPException(status_code=404, detail="Product not found in wish list")
    
    return wish_list_item

@app.post("/customer/profile/{username}", response_model=CustomerProfileOut)
async def create_or_update_customer_profile(username: str, customer_profile: CustomerProfileCreate, db: Session = Depends(get_db)):
    # Fetch the user by username
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the user already has a profile
    existing_profile = db.query(CustomerProfile).filter(CustomerProfile.username == username).first()

    if existing_profile:
        # If profile exists, update it
        existing_profile.email = customer_profile.email
        existing_profile.home_address = customer_profile.home_address
        existing_profile.full_name = user.full_name  # Keep full_name from the User table

        db.commit()
        db.refresh(existing_profile)

        return existing_profile

    # If no profile exists, create a new one
    new_profile = CustomerProfile(
        username=username,
        email=customer_profile.email,
        home_address=customer_profile.home_address,
        phone_number=customer_profile.phone_number,  # Use phone_number from the User table
        full_name=user.full_name,  # Use full_name from the User table
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@app.get("/customer/profile/{username}", response_model=CustomerProfileOut)
async def get_customer_profile(username: str, db: Session = Depends(get_db)):
    # Query the customer profile based on the username
    customer_profile = db.query(CustomerProfile).filter(CustomerProfile.username == username).first()

    # If the profile doesn't exist, raise an HTTPException with 404 status
    if not customer_profile:
        raise HTTPException(status_code=404, detail="Customer profile not found")

    return customer_profile


@app.get("/products_by_name/{search}", response_model=list[ProductOut])
async def search_products_by_name(
    db: Session = Depends(get_db),
    search_term: str = Query(..., description="Search term to match product name")
):
    # Query the database for products whose names contain the search term (case insensitive)
    products = db.query(Product).filter(Product.name.ilike(f"%{search_term}%")).all()

    if not products:
        raise HTTPException(status_code=404, detail="No products found matching the search term")

    # Return the list of matching products
    return products


# KHALTI_SECRET_KEY = '9e7be065e8d244fbba92f2a6f1580b39'
# KHALTI_INITIATE_URL = 'https://dev.khalti.com/api/v2/epayment/initiate/'


# @app.post("/create_order")
# async def create_order(product_name: str, quantity: int, user_id: int, db: Session = Depends(get_db)):
#     # Fetch product from the database using product_name
#     product = db.query(Product).filter(Product.name == product_name).first()

#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")

#     # Fetch user details from the database
#     user = db.query(Users).filter(Users.id == user_id).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     # Calculate total price
#     total_price = product.price * quantity

#     # Create an order in the database
#     order = Orders(
#         user_id=user_id,
#         product_id=product.id,  # Store product_id in the order
#         quantity=quantity,
#         total_price=total_price,
#         payment_status=False,
#     )
#     db.add(order)
#     db.commit()
#     db.refresh(order)

#     # Prepare Khalti payload
#     payload = {
#         "return_url": f"http://127.0.0.1:8000/payment_callback?pidx={order.id}",
#         "website_url": "http://127.0.0.1:8000",
#         "amount": total_price * 100,  # Convert to paisa (if applicable)
#         "purchase_order_id": str(order.id),
#         "purchase_order_name": f"Plant Medicine Purchase: {product_name}",
#         "customer_info": {
#             "name": user.username,  # Fetch the user's name from the database
#             "email": user.email,  # Fetch the user's email from the database
#         }
#     }

#     headers = {
#         "Authorization": f"Key {KHALTI_SECRET_KEY}",
#         "Content-Type": "application/json"
#     }

#     try:
#         # Send payment initiation request to Khalti API
#         response = requests.post(KHALTI_INITIATE_URL, json=payload, headers=headers)
#         response_data = response.json()

#         if response.status_code == 200 and 'payment_url' in response_data:
#             return JSONResponse(content={"payment_url": response_data['payment_url']})

#         else:
#             raise HTTPException(status_code=500, detail="Failed to initiate payment.")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# @app.get("/payment_callback")
# async def payment_callback(
#     pidx: str,
#     transaction_id: str,
#     amount: int,
#     total_amount: int,
#     status: str,
#     purchase_order_id: int,
#     purchase_order_name: str,
#     db: Session = Depends(get_db)
# ):
#     # Verify the payment status
#     if status != 'Completed':
#         raise HTTPException(status_code=400, detail="Payment was not successful.")

#     # Fetch the order from the database using the purchase_order_id (pidx)
#     order = db.query(Orders).filter(Orders.id == purchase_order_id).first()

#     if not order:
#         raise HTTPException(status_code=404, detail="Order not found.")

#     # Update the order with payment confirmation details
#     order.payment_status = True  # Mark as paid
#     order.payment_url = f"https://www.khalti.com/checkout/{transaction_id}"  # Store payment URL if needed
#     order.transaction_id = transaction_id  # Store the transaction ID for tracking purposes

#     # Commit the changes to the database
#     db.commit()

#     # Return a success response
#     return {"message": "Payment confirmed and order updated.", "order_id": order.id, "status": "Completed"}
from datetime import datetime

KHALTI_SECRET_KEY = '9e7be065e8d244fbba92f2a6f1580b39'
KHALTI_INITIATE_URL = 'https://dev.khalti.com/api/v2/epayment/initiate/'

# @app.post("/create_order")
# async def create_order(product_name: str, quantity: int, user_id: int, db: Session = Depends(get_db)):
#     product = db.query(Product).filter(Product.name == product_name).first()
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")

#     user = db.query(Users).filter(Users.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     total_price = product.price * quantity

#     order = Orders(
#         user_id=user_id,
#         product_id=product.id,
#         quantity=quantity,
#         total_price=total_price,
#         payment_status=False,
#     )
#     db.add(order)
#     db.commit()
#     db.refresh(order)

#     # Use path parameter for pidx - no query params here
#     return_url = f"http://127.0.0.1:8000/payment_callback/{order.id}"

#     payload = {
#         "return_url": return_url,
#         "website_url": "http://127.0.0.1:8000",
#         "amount": total_price * 100,  # Convert to paisa
#         "purchase_order_id": str(order.id),
#         "purchase_order_name": f"Plant Medicine Purchase: {product_name}",
#         "customer_info": {
#             "name": user.username,
#             "email": user.email,
#         }
#     }

#     headers = {
#         "Authorization": f"Key {KHALTI_SECRET_KEY}",
#         "Content-Type": "application/json"
#     }

#     try:
#         response = requests.post(KHALTI_INITIATE_URL, json=payload, headers=headers)
#         response_data = response.json()
#         if response.status_code == 200 and 'payment_url' in response_data:
#             return JSONResponse(content={"payment_url": response_data['payment_url']})
#         else:
#             raise HTTPException(status_code=500, detail="Failed to initiate payment.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/create_order")
async def create_order(
    product_id: int = Query(..., description="ID of the product to order"),
    quantity: int = Query(..., gt=0, description="Quantity to order"),
    user_id: int = Query(..., description="ID of the user placing the order"),
    db: Session = Depends(get_db)
):
    # Fetch product by ID instead of name
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    total_price = product.price * quantity

    order = Orders(
        user_id=user_id,
        product_id=product.id,
        quantity=quantity,
        total_price=total_price,
        payment_status=False,
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return_url = f"http://127.0.0.1:8000/payment_callback/{order.id}"

    payload = {
        "return_url": return_url,
        "website_url": "http://127.0.0.1:8000",
        "amount": total_price * 100,  # Convert to paisa
        "purchase_order_id": str(order.id),
        "purchase_order_name": f"Plant Medicine Purchase: {product.name}",
        "customer_info": {
            "name": user.username,
            "email": user.email,
        }
    }

    headers = {
        "Authorization": f"Key {KHALTI_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(KHALTI_INITIATE_URL, json=payload, headers=headers)
        response_data = response.json()
        if response.status_code == 200 and 'payment_url' in response_data:
            return JSONResponse(content={"payment_url": response_data['payment_url']})
        else:
            raise HTTPException(status_code=500, detail="Failed to initiate payment.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
@app.get("/payment_callback/{pidx}")
async def payment_callback(
    pidx: int,
    transaction_id: str,
    amount: int,
    total_amount: int,
    status: str,
    purchase_order_id: int,
    purchase_order_name: str,
    db: Session = Depends(get_db)
):
    if status != 'Completed':
        raise HTTPException(status_code=400, detail="Payment was not successful.")

    if pidx != purchase_order_id:
        raise HTTPException(status_code=400, detail="Order ID mismatch in callback.")

    order = db.query(Orders).filter(Orders.id == purchase_order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    # Get the product linked to the order
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    # Check if stock is enough to fulfill the order
    if product.stock < order.quantity:
        raise HTTPException(status_code=400, detail="Insufficient product stock.")

    # Deduct the ordered quantity from the product stock
    product.stock -= order.quantity

    # Update the order status and transaction info
    order.payment_status = True
    order.payment_url = f"https://www.khalti.com/checkout/{transaction_id}"
    order.transaction_id = transaction_id

    db.commit()

    return {
        "status": "success",
        "message": "Payment confirmed, order updated, and stock adjusted successfully.",
        # "order": {
        #     "id": order.id,
        #     "purchase_order_name": purchase_order_name,
        #     "transaction_id": transaction_id,
        #     "amount_paid": total_amount,
        #     "payment_url": order.payment_url,
        #     "payment_status": order.payment_status,
        #     "updated_at": datetime.utcnow().isoformat() + "Z",
        #     "remaining_stock": product.stock  # optionally return updated stock
        #}
    }


@app.put("/orders/update-status/{order_id}", response_model=OrderOut)
async def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.order_status = status
    db.commit()
    db.refresh(order)
    
    return order


@app.get("/users/role")
async def get_users_by_role(db: Session = Depends(get_db)):
    # Fetch users whose role is either 'customer' or 'vendor'
    users = db.query(User).filter(User.role.in_(['customer', 'vendor'])).all()
    
    if not users:
        raise HTTPException(status_code=404, detail="No users found with the specified roles")
    
    # Returning the list of users
    return users

@app.delete("/users/{username}", response_model=UserOut)
async def delete_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # If you want, delete related dependencies here to avoid FK issues

    db.delete(user)
    db.commit()

    # Generate token or send empty string if you don't want token on delete
    token = create_access_token(data={"sub": user.username})

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "token": token,
    }



@app.post("/send-warning/{username}")
async def send_warning_notification(username: str, db: Session = Depends(get_db)):
    # Find user by username
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a warning notification content
    warning_message = "Warning: Please follow the community guidelines to avoid penalties."

    # Prepare notification object
    notification = NotificationCreate(
        user_id=user.id,
        content=warning_message
    )

    # Create notification in DB
    created_notification = create_notification(db, notification)

    if not created_notification:
        raise HTTPException(status_code=500, detail="Failed to send notification")

    return {"message": f"Warning notification sent to {username}"}