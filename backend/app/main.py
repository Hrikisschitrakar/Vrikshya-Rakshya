from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, WebSocket, WebSocketDisconnect, Query
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from app.database import Base, engine, get_db
from app.schemas.user import UserCreate, UserOut, UserDelete, UserLogin, ChangePassword, ChangeUsername  # Add ChangeUsername
from app.schemas.vendor import VendorProfileCreate, VendorProfileOut
from app.schemas.marketplace import ProductCreate, ProductOut, ProductUpdate, OrderCreate, OrderOut, VendorDashboard
from app.schemas.chat import ChatMessageCreate, ChatMessageOut
from app.schemas.notification import NotificationCreate, NotificationOut
from app.schemas.password_reset import PasswordResetRequest, PasswordReset as PasswordResetSchema
from app.models.user import User
from app.models.vendor import VendorProfile
from app.models.marketplace import Product, Order
from app.models.notification import Notification
from app.models.password_reset import PasswordReset as PasswordResetModel
from app.crud.user import create_user, delete_user, authenticate_user, change_password, change_username  # Add change_username
from app.crud.vendor import create_vendor_profile, get_vendor_profile, update_vendor_profile, delete_vendor_profile
from app.crud.marketplace import create_product, get_products, search_products, update_product, delete_product, create_order, get_order_history, get_vendor_dashboard
from app.crud.chat import create_chat_message, get_chat_history, mark_messages_as_read
from app.crud.notification import create_notification, get_notifications, mark_notifications_as_read
from app.crud.password_reset import create_password_reset_token, reset_password
from app.websockets import manager
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from io import BytesIO
import json
from datetime import datetime
from typing import List

app = FastAPI(title="Vrikshya Rakshya Backend")

# Mount the static directory to serve images
app.mount("/static", StaticFiles(directory="static"), name="static")

Base.metadata.create_all(bind=engine)

# Load the trained model
model = load_model('/Users/hrikisschitrakar/Desktop/vrik/backend/model/plant_disease_model.h5')

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
@app.post("/signup", response_model=UserOut)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if user.role not in ["customer", "vendor"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    db_user = create_user(db, user)
    return db_user

@app.delete("/users", response_model=UserOut)
async def delete_user_endpoint(user: UserDelete, db: Session = Depends(get_db)):
    db_user = delete_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return db_user

@app.post("/login", response_model=UserOut)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return db_user

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
    return result

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
    db_product = create_product(db, vendor.id, product, image_bytes)
    return db_product

@app.get("/products/{username}", response_model=list[ProductOut])
async def get_products_endpoint(username: str, db: Session = Depends(get_db)):
    products = get_products(db, username)
    if not products:
        return []
    return products

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

@app.get("/orders/history/{username}", response_model=list[OrderOut])
async def get_order_history_endpoint(username: str, db: Session = Depends(get_db)):
    orders = get_order_history(db, username)
    if not orders:
        return []
    return orders

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