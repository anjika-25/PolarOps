from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, create_access_token, decode_access_token
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security_scheme = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    
    user = db.query(User).filter(User.user_id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
        )
    
    return user

def require_roles(allowed_roles: list[str], custom_detail: str | None = None):
    """
    Reusable FastAPI dependency to enforce Role-Based Access Control (RBAC).
    Checks whether current_user.role is in allowed_roles.
    Raises HTTP 403 Forbidden with custom_detail if unauthorized.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            detail = custom_detail or f"Role '{current_user.role}' is not authorized to perform this action."
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=detail
            )
        return current_user
    return role_checker

@router.post("/login", response_model=TokenResponse)
def login(login_req: LoginRequest, db: Session = Depends(get_db)):
    # 1. Look up user by email
    user = db.query(User).filter(User.email == login_req.email.lower().strip()).first()
    
    # 2. Verify existence & password
    if not user or not verify_password(login_req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # 3. Create JWT access token with user_id & role
    token_data = {
        "sub": str(user.user_id),
        "name": user.name,
        "email": user.email,
        "role": user.role
    }
    access_token = create_access_token(data=token_data)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
