import uuid
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AccessibilityPreferenceBase(BaseModel):
    preferred_language: str = "en"
    caption_enabled: bool = True
    caption_size: str = "medium"
    caption_color: str = "white_on_black"
    contrast_mode: str = "normal"
    text_scale: Decimal = Decimal("1.00")


class AccessibilityPreferenceUpdate(BaseModel):
    preferred_language: Optional[str] = None
    caption_enabled: Optional[bool] = None
    caption_size: Optional[str] = None
    caption_color: Optional[str] = None
    contrast_mode: Optional[str] = None
    text_scale: Optional[Decimal] = None


class AccessibilityPreferenceResponse(AccessibilityPreferenceBase):
    id: uuid.UUID
    user_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)
