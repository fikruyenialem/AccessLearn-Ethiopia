from decimal import Decimal
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user_optional, get_db
from app.models.user import AccessibilityPreference, User
from app.schemas.preference import (
    AccessibilityPreferenceResponse,
    AccessibilityPreferenceUpdate,
)

router = APIRouter(prefix="/preferences", tags=["Accessibility Preferences"])


@router.get("", response_model=AccessibilityPreferenceResponse)
def get_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional),
):
    """Retrieve saved accessibility settings for the user or default parameters."""
    if current_user and current_user.accessibility_preference:
        return current_user.accessibility_preference

    # Return default baseline preferences for unauthenticated or first-time sessions
    return AccessibilityPreferenceResponse(
        id=uuid.uuid4(),
        user_id=current_user.id if current_user else uuid.uuid4(),
        preferred_language="en",
        caption_enabled=True,
        caption_size="medium",
        caption_color="white_on_black",
        contrast_mode="normal",
        text_scale=Decimal("1.00"),
    )


@router.put("", response_model=AccessibilityPreferenceResponse)
def update_preferences(
    prefs_in: AccessibilityPreferenceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional),
):
    """Save updated accessibility settings."""
    if not current_user:
        # Client will persist locally in localStorage / IndexedDB
        return AccessibilityPreferenceResponse(
            id=uuid.uuid4(),
            user_id=uuid.uuid4(),
            preferred_language=prefs_in.preferred_language or "en",
            caption_enabled=prefs_in.caption_enabled if prefs_in.caption_enabled is not None else True,
            caption_size=prefs_in.caption_size or "medium",
            caption_color=prefs_in.caption_color or "white_on_black",
            contrast_mode=prefs_in.contrast_mode or "normal",
            text_scale=prefs_in.text_scale or Decimal("1.00"),
        )

    prefs = (
        db.query(AccessibilityPreference)
        .filter(AccessibilityPreference.user_id == current_user.id)
        .first()
    )
    if not prefs:
        prefs = AccessibilityPreference(
            id=uuid.uuid4(),
            user_id=current_user.id,
            preferred_language=prefs_in.preferred_language or "en",
            caption_enabled=prefs_in.caption_enabled if prefs_in.caption_enabled is not None else True,
            caption_size=prefs_in.caption_size or "medium",
            caption_color=prefs_in.caption_color or "white_on_black",
            contrast_mode=prefs_in.contrast_mode or "normal",
            text_scale=prefs_in.text_scale or Decimal("1.00"),
        )
        db.add(prefs)
    else:
        if prefs_in.preferred_language is not None:
            prefs.preferred_language = prefs_in.preferred_language
        if prefs_in.caption_enabled is not None:
            prefs.caption_enabled = prefs_in.caption_enabled
        if prefs_in.caption_size is not None:
            prefs.caption_size = prefs_in.caption_size
        if prefs_in.caption_color is not None:
            prefs.caption_color = prefs_in.caption_color
        if prefs_in.contrast_mode is not None:
            prefs.contrast_mode = prefs_in.contrast_mode
        if prefs_in.text_scale is not None:
            prefs.text_scale = prefs_in.text_scale

    db.commit()
    db.refresh(prefs)
    return prefs
