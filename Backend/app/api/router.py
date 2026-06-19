from fastapi import APIRouter
from app.api import auth, health

router = APIRouter()

router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(auth.router)
