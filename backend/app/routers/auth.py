from fastapi import APIRouter

from ..auth import LoginRequest, Token, authenticate

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest):
    return authenticate(payload)
