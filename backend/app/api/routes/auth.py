from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.config import get_settings
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, Token, UserCreate, UserPublic

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(data: UserCreate, db: Session = Depends(get_db)) -> Token:
    exists_with_email = db.scalars(
        select(User).where(User.email == data.email.lower().strip()),
    ).first()
    if exists_with_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = User(
        email=data.email.lower().strip(),
        hashed_password=hash_password(data.password),
        full_name=data.full_name.strip() if data.full_name else None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    settings = get_settings()
    token = create_access_token(
        subject=str(user.id),
        secret_key=settings.secret_key,
        algorithm=settings.jwt_algorithm,
        expires_minutes=settings.access_token_expire_minutes,
    )
    return Token(access_token=token)


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)) -> Token:
    user = db.scalars(
        select(User).where(User.email == data.email.lower().strip()),
    ).first()
    if user is None or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )
    settings = get_settings()
    token = create_access_token(
        subject=str(user.id),
        secret_key=settings.secret_key,
        algorithm=settings.jwt_algorithm,
        expires_minutes=settings.access_token_expire_minutes,
    )
    return Token(access_token=token)


@router.get("/me", response_model=UserPublic)
def auth_me(user: User = Depends(get_current_user)) -> User:
    return user
