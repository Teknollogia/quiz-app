import os 
import httpx
from fastapi import APIRouter, HTTPException, Request, Depends
from starlette.responses import RedirectResponse
from jose import jwt

from sqlalchemy.orm import Session
from database import get_db  # Your DB session dependency
from models.user import User


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = "http://localhost:8000/auth/google/callback"
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
FRONTEND_REDIRECT_URL = "http://localhost:5173/auth/google/callback"

router = APIRouter()

@router.get("/google/login")
def login_with_google():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Google OAuth credentials not configured.")
    
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        "&response_type=code"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
        "&prompt=consent"
    )
    return RedirectResponse(google_auth_url)

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code not provided.")

    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to obtain access token.")

        user_info_response = await client.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            params={"alt": "json"},
            headers={"Authorization": f"Bearer {access_token}"},
        )
        user_data = user_info_response.json()
        primary_email = user_data.get("email")
        if not primary_email:
            raise HTTPException(status_code=400, detail="Failed to obtain email.")

        user = get_or_create_user(
            db=db, 
            google_id=str(user_data["id"]), 
            email=primary_email, 
            fullname=user_data.get("name")
        )

        jwt_payload = {"sub": user.username, "email": user.email}
        token = jwt.encode(jwt_payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

        # Redirect to frontend OAuth callback
        return RedirectResponse(
            f"{FRONTEND_REDIRECT_URL}?token={token}&username={user.username}&role={user.role}"
        )

def get_or_create_user(
    db: Session,
    google_id: str,
    email: str,
    fullname: str
):
    user = db.query(User).filter(User.google_id == google_id).first()
    if not user and email:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
            user.auth_provider = "google"
            db.commit()
            db.refresh(user)
    
    if not user:
        user = User(
            username=email.split("@")[0],
            fullname=fullname,
            email=email,
            google_id=google_id,
            auth_provider="google",
            role="student", 
            hashed_password=None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.get("/home")
def auth_home():
    return {"message": "Authentication service is running."}
    