from datetime import datetime, timezone, timedelta
import pytest
import jwt

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
)
from app.core.config import settings


def test_password_hashing():
    password = "MySecurePassword2026!"
    hashed = get_password_hash(password)

    # Must be non-empty and start with the standard Argon2id signature
    assert hashed != password
    assert hashed.startswith("$argon2id$")

    # Positive match
    assert verify_password(password, hashed) is True

    # Negative matches
    assert verify_password("WrongPassword!", hashed) is False
    assert verify_password("", hashed) is False


def test_jwt_creation_and_decoding_uses_hs256():
    subject = "user-uuid-12345"
    role = "learner"

    token = create_access_token(subject=subject, role=role)
    assert isinstance(token, str)

    # Explicitly confirm token header is pinned to HS256 algorithm
    unverified_header = jwt.get_unverified_header(token)
    assert unverified_header["alg"] == "HS256"
    assert unverified_header["typ"] == "JWT"

    payload = decode_access_token(token)
    assert payload["sub"] == subject
    assert payload["role"] == role
    assert "iat" in payload
    assert "exp" in payload
    assert payload["exp"] > payload["iat"]


def test_jwt_expiration():
    subject = "expired-user"
    role = "learner"

    # Create an already expired token (-10 seconds)
    token = create_access_token(
        subject=subject,
        role=role,
        expires_delta=timedelta(seconds=-10),
    )

    with pytest.raises(jwt.ExpiredSignatureError):
        decode_access_token(token)


def test_jwt_invalid_signature():
    subject = "tampered-user"
    role = "instructor"

    # Token signed with a completely different secret key
    rogue_secret = "completely_different_and_untrusted_secret_key"
    payload = {
        "sub": subject,
        "role": role,
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "exp": int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp()),
    }
    invalid_token = jwt.encode(payload, rogue_secret, algorithm="HS256")

    with pytest.raises(jwt.InvalidSignatureError):
        decode_access_token(invalid_token)


def test_jwt_reject_none_algorithm():
    payload = {
        "sub": "attacker",
        "role": "admin",
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "exp": int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp()),
    }
    # Attempt "none" algorithm attack
    none_token = jwt.encode(payload, key="", algorithm="none")

    with pytest.raises((jwt.InvalidAlgorithmError, jwt.DecodeError)):
        decode_access_token(none_token)


def test_jwt_reject_alternative_algorithms():
    """Confirms that tokens signed with non-HS256 algorithms (e.g. HS384) are strictly rejected."""
    payload = {
        "sub": "user-alt-alg",
        "role": "learner",
        "iat": int(datetime.now(timezone.utc).timestamp()),
        "exp": int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp()),
    }
    # Encode with HS384 instead of HS256
    hs384_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS384")

    with pytest.raises(jwt.InvalidAlgorithmError):
        decode_access_token(hs384_token)


def test_jwt_missing_required_claims():
    # Token missing the required 'role' claim
    now = datetime.now(timezone.utc)
    incomplete_payload = {
        "sub": "user-without-role",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=1)).timestamp()),
    }
    token = jwt.encode(incomplete_payload, settings.SECRET_KEY, algorithm="HS256")

    with pytest.raises(jwt.MissingRequiredClaimError):
        decode_access_token(token)
