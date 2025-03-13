# vrikshya/backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database.database import Base, engine, get_db
from models.user import User
from models.product import Product
from models.order import Order
from models.message import Message
from passlib.context import CryptContext
import jwt
import os
from schemas import UserCreate, UserLogin, ProductCreate, ProductOut, OrderCreate, OrderOut, MessageCreate, MessageOut
from pydantic import EmailStr
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Get SECRET_KEY from environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY not found in environment variables. Please set it in the .env file.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
RESET_TOKEN_EXPIRE_MINUTES = 15

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Load email credentials from environment variables
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

if not EMAIL_SENDER or not EMAIL_PASSWORD:
    raise ValueError("EMAIL_SENDER and EMAIL_PASSWORD must be set in the .env file")

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_reset_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "reset"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_reset_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "reset":
            raise HTTPException(status_code=400, detail="Invalid token type")
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=400, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

def send_reset_email(email: str, reset_token: str):
    reset_link = f"http://127.0.0.1:8000/reset-password?token={reset_token}"
    
    # Create the email
    msg = MIMEMultipart()
    msg["From"] = EMAIL_SENDER
    msg["To"] = email
    msg["Subject"] = "Vrikshya Password Reset Request"
    
    body = f"""
    Hello,
    
    You requested a password reset for your Vrikshya account. Click the link below to reset your password:
    
    {reset_link}
    
    This link will expire in {RESET_TOKEN_EXPIRE_MINUTES} minutes. If you did not request a password reset, please ignore this email.
    
    Best,
    The Vrikshya Team
    """
    msg.attach(MIMEText(body, "plain"))
    
    try:
        # Connect to Gmail's SMTP server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, email, msg.as_string())
        server.quit()
        print(f"Password reset email sent to {email}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send reset email")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_user_with_role(role: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role: {current_user.role}"
            )
        return current_user
    return role_checker

# WebSocket manager for active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id, None)

    async def broadcast(self, sender_id: str, receiver_id: str, message: str):
        if receiver_id in self.active_connections:
            await self.active_connections[receiver_id].send_text(message)

manager = ConnectionManager()

@app.get("/")
def read_root(db: Session = Depends(get_db)):
    return {"message": "Hello, Vrikshya! Database connected."}

@app.post("/auth/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        user_id=user.user_id,
        name=user.name,
        username=user.username,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_token({"sub": str(new_user.id)})

    return {"message": "User created successfully", "token": token}

@app.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Email not found")

    if not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    token = create_token({"sub": str(db_user.id)})

    return {"message": "Login successful", "token": token}

@app.post("/auth/forgot-password")
def forgot_password(email: EmailStr, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    reset_token = create_reset_token({"sub": str(user.id)})
    send_reset_email(user.email, reset_token)
    
    return {"message": "Password reset email sent. Check your inbox."}

@app.post("/auth/reset-password")
def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    user_id = verify_reset_token(token)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.password = pwd_context.hash(new_password)
    db.commit()
    
    return {"message": "Password reset successfully"}

@app.get("/users/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "name": current_user.name,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at,
        "is_active": current_user.is_active
    }

@app.get("/customer/dashboard")
def customer_dashboard(current_user: User = Depends(get_current_user_with_role("customer"))):
    return {"message": f"Welcome to the Customer Dashboard, {current_user.username}!"}

@app.get("/vendor/dashboard")
def vendor_dashboard(current_user: User = Depends(get_current_user_with_role("vendor"))):
    return {"message": f"Welcome to the Vendor Dashboard, {current_user.username}!"}

@app.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_user_with_role("vendor")),
    db: Session = Depends(get_db)
):
    new_product = Product(
        vendor_id=current_user.id,
        name=product.name,
        description=product.description,
        price=product.price
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    product_dict = new_product.__dict__.copy()
    product_dict["id"] = str(new_product.id)
    product_dict["vendor_id"] = str(new_product.vendor_id)
    return ProductOut(**product_dict)

@app.get("/products", response_model=List[ProductOut])
def list_products(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return [
        ProductOut(
            id=str(product.id),
            vendor_id=str(product.vendor_id),
            name=product.name,
            description=product.description,
            price=product.price,
            created_at=product.created_at
        )
        for product in products
    ]

@app.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: str,
    product: ProductCreate,
    current_user: User = Depends(get_current_user_with_role("vendor")),
    db: Session = Depends(get_db)
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    if str(db_product.vendor_id) != str(current_user.id):
        raise HTTPException(
            status_code=403, detail="You can only update your own products"
        )
    
    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db.commit()
    db.refresh(db_product)
    
    product_dict = db_product.__dict__.copy()
    product_dict["id"] = str(db_product.id)
    product_dict["vendor_id"] = str(db_product.vendor_id)
    return ProductOut(**product_dict)

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_user_with_role("vendor")),
    db: Session = Depends(get_db)
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    if str(db_product.vendor_id) != str(current_user.id):
        raise HTTPException(
            status_code=403, detail="You can only delete your own products"
        )
    
    db.delete(db_product)
    db.commit()
    return None

@app.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    order: OrderCreate,
    current_user: User = Depends(get_current_user_with_role("customer")),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    total_price = product.price * order.quantity
    
    new_order = Order(
        customer_id=current_user.id,
        product_id=order.product_id,
        quantity=order.quantity,
        total_price=total_price
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    order_dict = new_order.__dict__.copy()
    order_dict["id"] = str(new_order.id)
    order_dict["customer_id"] = str(new_order.customer_id)
    order_dict["product_id"] = str(new_order.product_id)
    return OrderOut(**order_dict)

@app.get("/orders", response_model=List[OrderOut])
def list_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "customer":
        orders = db.query(Order).filter(Order.customer_id == current_user.id).all()
    elif current_user.role == "vendor":
        orders = (
            db.query(Order)
            .join(Product, Order.product_id == Product.id)
            .filter(Product.vendor_id == current_user.id)
            .all()
        )
    else:
        raise HTTPException(status_code=403, detail="Invalid role")
    
    return [
        OrderOut(
            id=str(order.id),
            customer_id=str(order.customer_id),
            product_id=str(order.product_id),
            quantity=order.quantity,
            total_price=order.total_price,
            created_at=order.created_at
        )
        for order in orders
    ]

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, db: Session = Depends(get_db)):
    # Note: WebSocket dependencies with OAuth2 are tricky; we'll handle token manually
    token = websocket.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        await websocket.close(code=1008)
        return
    
    try:
        current_user = get_current_user(token, db)
        if str(current_user.id) != user_id:
            await websocket.close(code=1008)
            return
    except HTTPException:
        await websocket.close(code=1008)
        return
    
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = MessageCreate(receiver_id=user_id, content=data)
            new_message = Message(
                sender_id=current_user.id,
                receiver_id=message_data.receiver_id,
                content=message_data.content
            )
            db.add(new_message)
            db.commit()
            
            message_out = MessageOut(
                id=str(new_message.id),
                sender_id=str(new_message.sender_id),
                receiver_id=str(new_message.receiver_id),
                content=new_message.content,
                created_at=new_message.created_at
            )
            await manager.broadcast(
                str(current_user.id),
                message_data.receiver_id,
                message_out.json()
            )
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
        manager.disconnect(user_id)

@app.post("/messages", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_message = Message(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    message_out = MessageOut(
        id=str(new_message.id),
        sender_id=str(new_message.sender_id),
        receiver_id=str(new_message.receiver_id),
        content=new_message.content,
        created_at=new_message.created_at
    )
    return message_out

@app.get("/messages/{receiver_id}", response_model=List[MessageOut])
def get_chat_history(
    receiver_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.created_at).all()
    return [
        MessageOut(
            id=str(message.id),
            sender_id=str(message.sender_id),
            receiver_id=str(message.receiver_id),
            content=message.content,
            created_at=message.created_at
        )
        for message in messages
    ]
    
#cust:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjkzNzJjMi03NGY1LTQ2NmUtYTE0Yy1lMDRkODQ1ODQxNDUiLCJleHAiOjE3NDE4NTk1Nzl9.bnJUOdKy3LpBnLDT4oZAwl8rPJk-dp6b3QJefrzwlWY

#vend:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMGIyZTgxMi00M2YyLTQ3NWUtYjAyMy0zMDVhZWNhNTIzNGUiLCJleHAiOjE3NDE4NjYyMzZ9.Ot0CLCKS1me1k51SHZkiDDVhzfBS__oSNW4DP9XDWPY

#prod: 20b2e812-43f2-475e-b023-305aeca5234e