import os
import uuid
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..auth import get_current_user
from ..database import get_db

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")

router = APIRouter(prefix="/checklists", tags=["checklists"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=list[schemas.VehicleChecklist])
def list_checklists(db: Session = Depends(get_db)):
    return db.query(models.VehicleChecklist).order_by(models.VehicleChecklist.created_at.desc()).all()


@router.get("/{checklist_id}", response_model=schemas.VehicleChecklist)
def get_checklist(checklist_id: int, db: Session = Depends(get_db)):
    checklist = db.get(models.VehicleChecklist, checklist_id)
    if not checklist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist not found")
    return checklist


@router.post("/", response_model=schemas.VehicleChecklist, status_code=status.HTTP_201_CREATED)
def create_checklist(payload: schemas.VehicleChecklistCreate, db: Session = Depends(get_db)):
    return crud.create_vehicle_checklist(db, payload)


@router.put("/{checklist_id}", response_model=schemas.VehicleChecklist)
def update_checklist(checklist_id: int, payload: schemas.VehicleChecklistUpdate, db: Session = Depends(get_db)):
    checklist = db.get(models.VehicleChecklist, checklist_id)
    if not checklist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist not found")
    return crud.update_vehicle_checklist(db, checklist, payload)


@router.post("/{checklist_id}/photos", response_model=schemas.ChecklistPhoto, status_code=status.HTTP_201_CREATED)
def upload_photo(
    checklist_id: int,
    file: UploadFile = File(...),
    caption: str | None = Form(None),
    db: Session = Depends(get_db),
):
    checklist = db.get(models.VehicleChecklist, checklist_id)
    if not checklist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist not found")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename or "")[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    file_path = f"/uploads/{filename}"
    return crud.add_checklist_photo(db, checklist, file_path, caption)
