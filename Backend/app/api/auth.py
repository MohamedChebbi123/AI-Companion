from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.core.errors import AuthError, ConflictError
from app.db.models.user import User
from app.modules.auth.schemas import Register, Login
from app.modules.auth.service import register, login
from app.modules.auth.tokens import create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=201)
def register_route(data: Register, db: Session = Depends(get_db)):
    try:
        user = register(db, data)
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=e.message)
    return {"id": str(user.id), "email": user.email, "display_name": user.display_name}


@router.post("/login")
def login_route(data: Login, db: Session = Depends(get_db)):
    try:
        user = login(db, data)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    return {
        "access_token": create_access_token(str(user.id)),
        "refresh_token": create_refresh_token(str(user.id)),
        "token_type": "bearer",
    }


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
        "status": user.status,
    }
