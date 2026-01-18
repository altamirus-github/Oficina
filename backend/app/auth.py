import os
from pydantic import BaseModel
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer


class User(BaseModel):
    username: str
    role: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class LoginRequest(BaseModel):
    username: str
    password: str


ADMIN_USER = os.getenv("ADMIN_USER")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "static-admin-token")
DEMO_USER = os.getenv("DEMO_USER", "demo")
DEMO_PASSWORD = os.getenv("DEMO_PASSWORD", "demo123")
DEMO_TOKEN = os.getenv("DEMO_TOKEN", "static-demo-token")

security = HTTPBearer()


def authenticate(payload: LoginRequest) -> Token:
    if not ADMIN_USER or not ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Credenciais admin nao configuradas",
        )
    if payload.username == ADMIN_USER and payload.password == ADMIN_PASSWORD:
        return Token(access_token=ADMIN_TOKEN, role="admin")
    if payload.username == DEMO_USER and payload.password == DEMO_PASSWORD:
        return Token(access_token=DEMO_TOKEN, role="demo")
    if payload.username != ADMIN_USER or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais invalidas")
    return Token(access_token=ADMIN_TOKEN, role="admin")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    if not ADMIN_USER or not ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Credenciais admin nao configuradas",
        )
    if credentials.credentials == ADMIN_TOKEN:
        return User(username=ADMIN_USER, role="admin")
    if credentials.credentials == DEMO_TOKEN:
        return User(username=DEMO_USER, role="demo")
    if credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalido")
    return User(username=ADMIN_USER, role="admin")
