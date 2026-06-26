from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.persona import Persona


class PersonaRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, owner_id: UUID, name: str, definition: dict, is_public: bool) -> Persona:
        persona = Persona(owner_id=owner_id, name=name, definition=definition, is_public=is_public)
        self.db.add(persona)
        await self.db.commit()
        await self.db.refresh(persona)
        return persona

    async def get_by_id(self, persona_id: UUID) -> Optional[Persona]:
        return await self.db.get(Persona, persona_id)

    async def get_by_owner(self, owner_id: UUID) -> list[Persona]:
        result = await self.db.execute(
            select(Persona).where(Persona.owner_id == owner_id).order_by(Persona.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_public(self) -> list[Persona]:
        result = await self.db.execute(
            select(Persona).where(Persona.is_public.is_(True)).order_by(Persona.created_at.desc())
        )
        return list(result.scalars().all())

    async def update(self, persona: Persona, **kwargs) -> Persona:
        for key, val in kwargs.items():
            setattr(persona, key, val)
        await self.db.commit()
        await self.db.refresh(persona)
        return persona

    async def delete(self, persona: Persona) -> None:
        await self.db.delete(persona)
        await self.db.commit()
