import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.password_reset_token import PasswordResetToken


class PasswordResetTokenRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: UUID, raw_token: str) -> PasswordResetToken:
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        record = PasswordResetToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        self.db.add(record)
        await self.db.commit()
        await self.db.refresh(record)
        return record

    async def get_by_raw_token(self, raw_token: str) -> Optional[PasswordResetToken]:
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        result = await self.db.execute(
            select(PasswordResetToken).where(PasswordResetToken.token_hash == token_hash)
        )
        return result.scalar_one_or_none()

    async def delete(self, record: PasswordResetToken) -> None:
        await self.db.delete(record)
        await self.db.commit()

    async def delete_all_for_user(self, user_id: UUID) -> None:
        await self.db.execute(
            delete(PasswordResetToken).where(PasswordResetToken.user_id == user_id)
        )
        await self.db.commit()
