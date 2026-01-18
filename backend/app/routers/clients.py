from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/clients", tags=["clients"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=list[schemas.Client])
def list_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()


@router.get("/{client_id}", response_model=schemas.Client)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.get(models.Client, client_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return client


@router.post("/", response_model=schemas.Client, status_code=status.HTTP_201_CREATED)
def create_client(payload: schemas.ClientCreate, db: Session = Depends(get_db)):
    return crud.create_client(db, payload)


@router.put("/{client_id}", response_model=schemas.Client)
def update_client(client_id: int, payload: schemas.ClientUpdate, db: Session = Depends(get_db)):
    client = db.get(models.Client, client_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return crud.update_client(db, client, payload)


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.get(models.Client, client_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    db.delete(client)
    db.commit()
