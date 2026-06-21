from fastapi import APIRouter
from app.api import auth, health, users

router = APIRouter()

router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(auth.router)
router.include_router(users.router)
