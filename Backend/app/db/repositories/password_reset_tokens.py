import hashlib
from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.password_reset_token import PasswordResetToken


class PasswordResetTokenRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: UUID, raw_token: str) -> PasswordResetToken:
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        record = PasswordResetToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_by_raw_token(self, raw_token: str):
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        return self.db.query(PasswordResetToken).filter(PasswordResetToken.token_hash == token_hash).first()

    def delete(self, record: PasswordResetToken) -> None:
        self.db.delete(record)
        self.db.commit()

    def delete_all_for_user(self, user_id: UUID) -> None:
        self.db.query(PasswordResetToken).filter(PasswordResetToken.user_id == user_id).delete()
        self.db.commit()
