import os
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..auth import get_current_user
from ..database import get_db
from ..image_utils import process_image

router = APIRouter(prefix="/vehicles", tags=["vehicles"], dependencies=[Depends(get_current_user)])
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads", "vehicles")


@router.get("/", response_model=list[schemas.Vehicle])
def list_vehicles(db: Session = Depends(get_db)):
    return db.query(models.Vehicle).all()


@router.get("/{vehicle_id}", response_model=schemas.Vehicle)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.get(models.Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle


@router.post("/", response_model=schemas.Vehicle, status_code=status.HTTP_201_CREATED)
def create_vehicle(payload: schemas.VehicleCreate, db: Session = Depends(get_db)):
    return crud.create_vehicle(db, payload)


@router.put("/{vehicle_id}", response_model=schemas.Vehicle)
def update_vehicle(vehicle_id: int, payload: schemas.VehicleUpdate, db: Session = Depends(get_db)):
    vehicle = db.get(models.Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return crud.update_vehicle(db, vehicle, payload)


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.get(models.Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    db.delete(vehicle)
    db.commit()


@router.get("/{vehicle_id}/photos", response_model=list[schemas.VehiclePhoto])
def list_photos(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.get(models.Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle.photos


@router.post("/{vehicle_id}/photos", response_model=list[schemas.VehiclePhoto], status_code=status.HTTP_201_CREATED)
def upload_photos(
    vehicle_id: int,
    files: list[UploadFile] = File(...),
    captions: list[str] | None = Form(None),
    db: Session = Depends(get_db),
):
    vehicle = db.get(models.Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    if len(files) < 4 or len(files) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Envie entre 4 e 10 fotos do veiculo",
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    results = []
    for idx, file in enumerate(files):
        raw = file.file.read()
        processed = process_image(raw)
        filename = f"{uuid.uuid4().hex}.jpg"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as buffer:
            buffer.write(processed)

        caption = None
        if captions and idx < len(captions):
            caption = captions[idx]

        file_path = f"/uploads/vehicles/{filename}"
        results.append(crud.add_vehicle_photo(db, vehicle, file_path, caption))
    return results


@router.delete("/photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_photo(photo_id: int, db: Session = Depends(get_db)):
    photo = db.get(models.VehiclePhoto, photo_id)
    if not photo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found")
    db.delete(photo)
    db.commit()
