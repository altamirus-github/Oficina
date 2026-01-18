from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/finance", tags=["finance"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=list[schemas.FinancialEntry])
def list_entries(db: Session = Depends(get_db)):
    return db.query(models.FinancialEntry).order_by(models.FinancialEntry.created_at.desc()).all()


@router.get("/{entry_id}", response_model=schemas.FinancialEntry)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.get(models.FinancialEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return entry


@router.post("/", response_model=schemas.FinancialEntry, status_code=status.HTTP_201_CREATED)
def create_entry(payload: schemas.FinancialEntryCreate, db: Session = Depends(get_db)):
    return crud.create_financial_entry(db, payload)


@router.put("/{entry_id}", response_model=schemas.FinancialEntry)
def update_entry(entry_id: int, payload: schemas.FinancialEntryUpdate, db: Session = Depends(get_db)):
    entry = db.get(models.FinancialEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return crud.update_financial_entry(db, entry, payload)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.get(models.FinancialEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    db.delete(entry)
    db.commit()
