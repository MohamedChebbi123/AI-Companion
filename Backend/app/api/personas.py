from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user
from app.core.errors import AuthError, NotFoundError
from app.db.models.user import User
from app.modules.personas.schemas import CreatePersona, GeneratePersonaRequest, PersonaResponse, UpdatePersona
from app.modules.personas.service import (
    create_persona,
    delete_persona,
    generate_and_save_persona,
    get_persona,
    list_my_personas,
    list_public_personas,
    remove_persona_avatar,
    set_persona_avatar,
    update_persona,
)

router = APIRouter(prefix="/personas", tags=["personas"])


@router.post("", status_code=201, response_model=PersonaResponse)
async def create(
    data: CreatePersona,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await create_persona(db, user.id, data)


@router.get("/me", response_model=list[PersonaResponse])
async def list_mine(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await list_my_personas(db, user.id)


@router.get("/public", response_model=list[PersonaResponse])
async def list_public(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await list_public_personas(db)


@router.post("/generate", status_code=201, response_model=PersonaResponse)
async def generate(
    data: GeneratePersonaRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        return await generate_and_save_persona(db, user.id, data.description, data.is_public)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Generation failed: {e}")


@router.get("/{persona_id}", response_model=PersonaResponse)
async def get_one(
    persona_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        return await get_persona(db, persona_id, user.id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message)


@router.patch("/{persona_id}", response_model=PersonaResponse)
async def update(
    persona_id: UUID,
    data: UpdatePersona,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        return await update_persona(db, persona_id, user.id, data)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message)


@router.delete("/{persona_id}", status_code=204)
async def delete(
    persona_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        await delete_persona(db, persona_id, user.id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message)


@router.post("/{persona_id}/avatar", response_model=PersonaResponse)
async def upload_avatar(
    persona_id: UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image")
    file_bytes = await file.read()
    try:
        return await set_persona_avatar(db, persona_id, user.id, file_bytes)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Upload failed: {e}")


@router.delete("/{persona_id}/avatar", response_model=PersonaResponse)
async def delete_avatar(
    persona_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        return await remove_persona_avatar(db, persona_id, user.id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Delete failed: {e}")
