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
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "123456")
SUPERVISOR_USER = os.getenv("SUPERVISOR_USER", "supervisor")
SUPERVISOR_PASSWORD = os.getenv("SUPERVISOR_PASSWORD", "123456")
OPERATOR_USER = os.getenv("OPERATOR_USER", "operador")
OPERATOR_PASSWORD = os.getenv("OPERATOR_PASSWORD", "123456")


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
    defaults = [
        {
            "name": "Administrador",
            "username": ADMIN_USER,
            "role": "admin",
            "password": ADMIN_PASSWORD,
        },
        {
            "name": "Supervisor",
            "username": SUPERVISOR_USER,
            "role": "supervisor",
            "password": SUPERVISOR_PASSWORD,
        },
        {
            "name": "Operador",
            "username": OPERATOR_USER,
            "role": "operator",
            "password": OPERATOR_PASSWORD,
        },
    ]

    for data in defaults:
        existing = db.query(models.User).filter_by(username=data["username"]).first()
        if existing:
            updated = False
            if existing.role != data["role"]:
                existing.role = data["role"]
                updated = True
            if not verify_password(data["password"], existing.password_hash):
                existing.password_hash = hash_password(data["password"])
                updated = True
            if not existing.is_active:
                existing.is_active = True
                updated = True
            if updated:
                db.add(existing)
            continue
        user = models.User(
            name=data["name"],
            username=data["username"],
            role=data["role"],
            password_hash=hash_password(data["password"]),
            is_active=True,
        )
        db.add(user)
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
