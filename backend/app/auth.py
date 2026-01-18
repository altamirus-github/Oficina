import os
import uuid
from typing import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import models
from .database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

ADMIN_USER = os.getenv("ADMIN_USER", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
DEMO_USER = os.getenv("DEMO_USER", "demo")
DEMO_PASSWORD = os.getenv("DEMO_PASSWORD", "demo123")


class UserToken:
    def __init__(self, token: str, role: str):
        self.token = token
        self.role = role


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_token(db: Session, user: models.User) -> UserToken:
    token_value = uuid.uuid4().hex
    token = models.AuthToken(token=token_value, user=user)
    db.add(token)
    db.commit()
    return UserToken(token=token_value, role=user.role)


def revoke_token(db: Session, token_value: str, user_id: int | None = None) -> None:
    query = db.query(models.AuthToken).filter_by(token=token_value)
    if user_id is not None:
        query = query.filter_by(user_id=user_id)
    token = query.first()
    if token:
        db.delete(token)
        db.commit()


def seed_users(db: Session) -> None:
    if db.query(models.User).count() > 0:
        return

    admin = models.User(
        name="Administrador",
        username=ADMIN_USER,
        role="admin",
        password_hash=hash_password(ADMIN_PASSWORD),
        is_active=True,
    )
    demo = models.User(
        name="Demo",
        username=DEMO_USER,
        role="operator",
        password_hash=hash_password(DEMO_PASSWORD),
        is_active=True,
    )
    db.add_all([admin, demo])
    db.commit()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> models.User:
    token = db.query(models.AuthToken).filter_by(token=credentials.credentials).first()
    if not token or not token.user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalido")
    return token.user


def require_roles(*roles: str) -> Callable:
    def _checker(user: models.User = Depends(get_current_user)) -> models.User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sem permissao")
        return user

    return _checker
