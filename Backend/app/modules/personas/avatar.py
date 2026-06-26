import asyncio
from functools import partial

import cloudinary
import cloudinary.uploader

from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


async def upload_to_cloudinary(file_bytes: bytes, persona_id: str) -> str:
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None,
        partial(
            cloudinary.uploader.upload,
            file_bytes,
            public_id=f"personas/{persona_id}",
            overwrite=True,
            resource_type="image",
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                {"quality": "auto", "fetch_format": "auto"},
            ],
        ),
    )
    return result["secure_url"]


async def delete_from_cloudinary(persona_id: str) -> None:
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(
        None,
        partial(
            cloudinary.uploader.destroy,
            f"personas/{persona_id}",
            resource_type="image",
        ),
    )
