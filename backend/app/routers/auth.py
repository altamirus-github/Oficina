from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models
from ..auth import create_token, verify_password
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(payload: dict, db: Session = Depends(get_db)):
    username = payload.get("username")
    password = payload.get("password")
    if not username or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Credenciais invalidas")
    user = db.query(models.User).filter_by(username=username).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais invalidas")
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais invalidas")
    token = create_token(db, user)
    return {"access_token": token.token, "token_type": "bearer", "role": token.role}
