from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.core.errors import AuthError, ConflictError
from app.db.models.user import User
from app.db.repositories.refresh_tokens import RefreshTokenRepository
from app.modules.auth.schemas import Register, Login, Logout, Refresh
from app.modules.auth.service import register, login, logout, refresh
from app.modules.auth.tokens import create_access_token, create_refresh_token
from app.core.ratelimit import limiter


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=201)
@limiter.limit("5/minute")
def register_route(request: Request, data: Register, db: Session = Depends(get_db)):
    try:
        user = register(db, data)
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=e.message)


    return {"id": str(user.id), "email": user.email, "display_name": user.display_name}


@router.post("/login")
@limiter.limit("5/minute")
def login_route(request: Request, data: Login, db: Session = Depends(get_db)):
    try:
        user = login(db, data)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)

    repo = RefreshTokenRepository(db)
    repo.delete_all_for_user(user.id)

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    repo.create(user.id, refresh_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/refresh")
def refresh_route(data: Refresh, db: Session = Depends(get_db)):
    try:
        access_token, new_refresh_token = refresh(db, data.refresh_token)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=e.message)
    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}


@router.post("/logout", status_code=204)
def logout_route(data: Logout, db: Session = Depends(get_db)):
    logout(db, data.refresh_token)


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
        "status": user.status,
    }
