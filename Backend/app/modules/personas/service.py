from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AuthError, NotFoundError
from app.db.repositories.personas import PersonaRepository
from app.modules.personas.avatar import delete_from_cloudinary, upload_to_cloudinary
from app.modules.personas.generator import generate_persona_definition
from app.modules.personas.schemas import CreatePersona, UpdatePersona


async def create_persona(db: AsyncSession, owner_id: UUID, data: CreatePersona):
    repo = PersonaRepository(db)
    definition = {
        "backstory": data.backstory,
        "core_traits": data.core_traits,
        "values": data.values,
        "boundaries": data.boundaries,
        "speechstyle": data.speechstyle.model_dump(),
        "emotional_baseline": data.emotional_baseline,
    }
    return await repo.create(
        owner_id=owner_id,
        name=data.name,
        definition=definition,
        is_public=data.is_public,
    )


async def get_persona(db: AsyncSession, persona_id: UUID, user_id: UUID):
    repo = PersonaRepository(db)
    persona = await repo.get_by_id(persona_id)
    if not persona:
        raise NotFoundError("Persona not found")
    if not persona.is_public and persona.owner_id != user_id:
        raise AuthError("Access denied")
    return persona


async def list_my_personas(db: AsyncSession, owner_id: UUID):
    return await PersonaRepository(db).get_by_owner(owner_id)


async def list_public_personas(db: AsyncSession):
    return await PersonaRepository(db).get_public()


async def update_persona(db: AsyncSession, persona_id: UUID, user_id: UUID, data: UpdatePersona):
    repo = PersonaRepository(db)
    persona = await repo.get_by_id(persona_id)
    if not persona:
        raise NotFoundError("Persona not found")
    if persona.owner_id != user_id:
        raise AuthError("Access denied")

    updates: dict = {}
    if data.name is not None:
        updates["name"] = data.name
    if data.is_public is not None:
        updates["is_public"] = data.is_public

    defn_patch: dict = {}
    if data.backstory is not None:
        defn_patch["backstory"] = data.backstory
    if data.core_traits is not None:
        defn_patch["core_traits"] = data.core_traits
    if data.values is not None:
        defn_patch["values"] = data.values
    if data.boundaries is not None:
        defn_patch["boundaries"] = data.boundaries
    if data.speechstyle is not None:
        defn_patch["speechstyle"] = data.speechstyle.model_dump()
    if data.emotional_baseline is not None:
        defn_patch["emotional_baseline"] = data.emotional_baseline

    if defn_patch:
        updates["definition"] = {**(persona.definition or {}), **defn_patch}

    return await repo.update(persona, **updates)


async def delete_persona(db: AsyncSession, persona_id: UUID, user_id: UUID) -> None:
    repo = PersonaRepository(db)
    persona = await repo.get_by_id(persona_id)
    if not persona:
        raise NotFoundError("Persona not found")
    if persona.owner_id != user_id:
        raise AuthError("Access denied")
    await repo.delete(persona)


async def set_persona_avatar(db: AsyncSession, persona_id: UUID, user_id: UUID, file_bytes: bytes) -> object:
    repo = PersonaRepository(db)
    persona = await repo.get_by_id(persona_id)
    if not persona:
        raise NotFoundError("Persona not found")
    if persona.owner_id != user_id:
        raise AuthError("Access denied")
    url = await upload_to_cloudinary(file_bytes, str(persona_id))
    return await repo.update(persona, avatar_url=url)


async def generate_and_save_persona(db: AsyncSession, owner_id: UUID, description: str, is_public: bool):
    definition = await generate_persona_definition(description)
    name = definition.pop("name", "Unnamed")
    return await PersonaRepository(db).create(
        owner_id=owner_id,
        name=name,
        definition=definition,
        is_public=is_public,
    )


async def remove_persona_avatar(db: AsyncSession, persona_id: UUID, user_id: UUID) -> object:
    repo = PersonaRepository(db)
    persona = await repo.get_by_id(persona_id)
    if not persona:
        raise NotFoundError("Persona not found")
    if persona.owner_id != user_id:
        raise AuthError("Access denied")
    if persona.avatar_url:
        await delete_from_cloudinary(str(persona_id))
    return await repo.update(persona, avatar_url=None)
