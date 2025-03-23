import os
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.user_profile import UserProfileCreate

def create_user_profile(db: Session, user_id: int, profile: UserProfileCreate, image_bytes: bytes = None):
    # Check if the user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    # Check if the user already has a profile
    if user.profile:
        return None

    # Save the profile picture if provided
    profile_picture_url = None
    if image_bytes:
        os.makedirs("static/profiles", exist_ok=True)
        image_path = f"static/profiles/{user_id}_profile.jpg"
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        profile_picture_url = f"/{image_path}"

    # Create the profile
    db_profile = UserProfile(
        user_id=user_id,
        bio=profile.bio,
        location=profile.location,
        profile_picture_url=profile_picture_url
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def get_user_profile(db: Session, user_id: int):
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

def update_user_profile(db: Session, user_id: int, profile: UserProfileCreate, image_bytes: bytes = None):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not db_profile:
        return None

    # Update fields
    db_profile.bio = profile.bio
    db_profile.location = profile.location

    # Update profile picture if provided
    if image_bytes:
        os.makedirs("static/profiles", exist_ok=True)
        # Delete the old image if it exists
        if db_profile.profile_picture_url:
            old_image_path = db_profile.profile_picture_url.lstrip('/')
            if os.path.exists(old_image_path):
                os.remove(old_image_path)
        # Save the new image
        image_path = f"static/profiles/{user_id}_profile.jpg"
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        db_profile.profile_picture_url = f"/{image_path}"

    db.commit()
    db.refresh(db_profile)
    return db_profile

def delete_user_profile(db: Session, user_id: int):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not db_profile:
        return None
    # Delete the profile picture if it exists
    if db_profile.profile_picture_url:
        image_path = db_profile.profile_picture_url.lstrip('/')
        if os.path.exists(image_path):
            os.remove(image_path)
    db.delete(db_profile)
    db.commit()
    return db_profile