import traceback
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.core.errors import AuthError, NotFoundError
from app.db.models.user import User
from app.modules.ai.service import get_chat_response

router = APIRouter(prefix="/ai", tags=["ai"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat/{conversation_id}", response_model=ChatResponse)
async def chat(
    conversation_id: UUID,
    data: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        reply = await get_chat_response(db, conversation_id, user.id, data.message)
        return ChatResponse(reply=reply)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except AuthError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=e.message)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))
