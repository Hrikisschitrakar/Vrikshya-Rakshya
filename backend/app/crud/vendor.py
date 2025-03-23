from sqlalchemy.orm import Session
from app.models.user import User
from app.models.vendor import VendorProfile
from app.schemas.vendor import VendorProfileCreate

def create_vendor_profile(db: Session, username: str, vendor: VendorProfileCreate):
    user = db.query(User).filter(User.username == username, User.role == "vendor").first()
    if not user or db.query(VendorProfile).filter(VendorProfile.user_id == user.id).first():
        return None
    db_vendor = VendorProfile(
        user_id=user.id,
        business_name=vendor.business_name,
        address=vendor.address,
        description=vendor.description
    )
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def get_vendor_profile(db: Session, username: str):
    user = db.query(User).filter(User.username == username, User.role == "vendor").first()
    if not user:
        return None
    return db.query(VendorProfile).filter(VendorProfile.user_id == user.id).first()

def update_vendor_profile(db: Session, username: str, vendor: VendorProfileCreate):
    user = db.query(User).filter(User.username == username, User.role == "vendor").first()
    if not user:
        return None
    db_vendor = db.query(VendorProfile).filter(VendorProfile.user_id == user.id).first()
    if not db_vendor:
        return None
    db_vendor.business_name = vendor.business_name
    db_vendor.address = vendor.address
    db_vendor.description = vendor.description
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def delete_vendor_profile(db: Session, username: str):
    user = db.query(User).filter(User.username == username, User.role == "vendor").first()
    if not user:
        return None
    db_vendor = db.query(VendorProfile).filter(VendorProfile.user_id == user.id).first()
    if not db_vendor:
        return None
    db.delete(db_vendor)
    db.commit()
    return db_vendor