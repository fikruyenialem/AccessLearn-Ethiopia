from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
import jwt
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from app.core.config import settings

# Initialize Argon2id password hasher
password_hash_helper = PasswordHash((Argon2Hasher(),))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against an Argon2 hashed password."""
    return password_hash_helper.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hashes a plain password using Argon2id."""
    return password_hash_helper.hash(password)


def create_access_token(
    subject: str,
    role: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Creates an RFC 7519 standard JWT token signed with fixed HS256.
    Payload includes subject (sub), role, issued-at (iat), and expiration (exp).
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "sub": str(subject),
        "role": str(role),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256",
    )


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decodes and validates a JWT token using fixed HS256.
    Explicitly restricts allowed algorithms to HS256 to prevent algorithm confusion attacks.
    Requires and verifies exp, sub, iat, and role claims.
    Raises jwt.PyJWTError subclasses on invalid, expired, or tampered tokens.
    """
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=["HS256"],
        options={
            "require": ["exp", "sub", "iat", "role"],
            "verify_exp": True,
            "verify_iat": True,
        },
    )
