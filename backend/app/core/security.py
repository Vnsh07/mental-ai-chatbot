from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(
    *,
    subject: str,
    secret_key: str,
    algorithm: str,
    expires_minutes: int,
) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    payload = {
        "sub": subject,
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(payload, secret_key, algorithm=algorithm)


def decode_token(token: str, secret_key: str, algorithm: str) -> str | None:
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        sub = payload.get("sub")
        if sub is None or not isinstance(sub, str):
            return None
        return sub
    except JWTError:
        return None
