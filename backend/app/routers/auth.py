from fastapi import APIRouter, Body, Depends, Form, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from .. import models
from ..auth import create_token, get_current_user, revoke_token, verify_password
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


@router.post("/login")
def login(
    payload: dict | None = Body(None),
    username: str | None = Form(None),
    password: str | None = Form(None),
    db: Session = Depends(get_db),
):
    if payload:
        username = payload.get("username") or username
        password = payload.get("password") or password
    if not username or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Credenciais invalidas")
    user = db.query(models.User).filter_by(username=username).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais invalidas")
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais invalidas")
    token = create_token(db, user)
    return {
        "access_token": token.token,
        "token_type": "bearer",
        "role": token.role,
        "username": user.username,
        "name": user.name,
    }


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    revoke_token(db, credentials.credentials, user.id)
    return {"status": "ok"}
