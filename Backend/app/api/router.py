from fastapi import APIRouter
from app.api import auth, health, users, conversations, personas, ai

router = APIRouter()

router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(auth.router)
router.include_router(users.router)
router.include_router(conversations.router)
router.include_router(personas.router)
router.include_router(ai.router)
