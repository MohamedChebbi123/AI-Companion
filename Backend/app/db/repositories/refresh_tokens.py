import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.refresh_token import RefreshToken


class RefreshTokenRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: UUID, raw_token: str) -> RefreshToken:
        record = self._build(user_id, raw_token)
        await self.db.commit()
        await self.db.refresh(record)
        return record

    def create_no_commit(self, user_id: UUID, raw_token: str) -> None:
        self._build(user_id, raw_token)

    def _build(self, user_id: UUID, raw_token: str) -> RefreshToken:
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        record = RefreshToken(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
        self.db.add(record)
        return record

    async def get_by_raw_token(self, raw_token: str) -> Optional[RefreshToken]:
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        result = await self.db.execute(
            select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        )
        return result.scalar_one_or_none()

    async def delete(self, record: RefreshToken) -> None:
        await self.db.delete(record)
        await self.db.commit()

    async def delete_no_commit(self, record: RefreshToken) -> None:
        await self.db.delete(record)

    async def delete_all_for_user(self, user_id: UUID) -> None:
        await self.db.execute(delete(RefreshToken).where(RefreshToken.user_id == user_id))
        await self.db.commit()
