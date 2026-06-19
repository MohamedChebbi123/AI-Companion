from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.modules.auth.schemas import Register
from app.modules.auth.service import register

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=201)
def register_route(data: Register, db: Session = Depends(get_db)):
    user = register(db, data)
    return {"id": str(user.id), "email": user.email, "display_name": user.display_name}
