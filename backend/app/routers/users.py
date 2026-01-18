import os
import uuid
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_user, hash_password, require_roles
from ..database import get_db
from ..image_utils import process_image

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(get_current_user)])
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads", "profiles")


@router.get("/", response_model=list[schemas.User], dependencies=[Depends(require_roles("admin"))])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).order_by(models.User.created_at.desc()).all()


@router.post("/", response_model=schemas.User, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_roles("admin"))])
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter_by(username=payload.username).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario ja existe")
    user = models.User(
        name=payload.name,
        username=payload.username,
        role=payload.role,
        email=payload.email,
        phone=payload.phone,
        is_active=payload.is_active,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/{user_id}", response_model=schemas.User, dependencies=[Depends(require_roles("admin"))])
def update_user(user_id: int, payload: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario nao encontrado")
    data = payload.model_dump(exclude_unset=True)
    new_password = data.pop("new_password", None)
    for field, value in data.items():
        setattr(user, field, value)
    if new_password:
        user.password_hash = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_roles("admin"))])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario nao encontrado")
    db.delete(user)
    db.commit()


@router.get("/me", response_model=schemas.User)
def get_me(current: models.User = Depends(get_current_user)):
    return current


@router.put("/me", response_model=schemas.User)
def update_me(payload: schemas.ProfileUpdate, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    data = payload.model_dump(exclude_unset=True)
    new_password = data.pop("new_password", None)
    for field, value in data.items():
        setattr(current, field, value)
    if new_password:
        current.password_hash = hash_password(new_password)
    db.commit()
    db.refresh(current)
    return current


@router.post("/me/photo", response_model=schemas.User)
def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current: models.User = Depends(get_current_user),
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    raw = file.file.read()
    processed = process_image(raw, max_size=600, quality=82)
    filename = f"{uuid.uuid4().hex}.jpg"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as buffer:
        buffer.write(processed)
    current.photo_path = f"/uploads/profiles/{filename}"
    db.commit()
    db.refresh(current)
    return current
