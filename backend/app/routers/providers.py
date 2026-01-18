from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/providers", tags=["providers"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=list[schemas.Provider])
def list_providers(db: Session = Depends(get_db)):
    return db.query(models.Provider).all()


@router.get("/{provider_id}", response_model=schemas.Provider)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    provider = db.get(models.Provider, provider_id)
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider not found")
    return provider


@router.post("/", response_model=schemas.Provider, status_code=status.HTTP_201_CREATED)
def create_provider(payload: schemas.ProviderCreate, db: Session = Depends(get_db)):
    return crud.create_provider(db, payload)


@router.put("/{provider_id}", response_model=schemas.Provider)
def update_provider(provider_id: int, payload: schemas.ProviderUpdate, db: Session = Depends(get_db)):
    provider = db.get(models.Provider, provider_id)
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider not found")
    return crud.update_provider(db, provider, payload)


@router.delete("/{provider_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_provider(provider_id: int, db: Session = Depends(get_db)):
    provider = db.get(models.Provider, provider_id)
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider not found")
    db.delete(provider)
    db.commit()
