import os 
import httpx
from fastapi import APIRouter, HTTPException, Request, Depends
from starlette.responses import RedirectResponse
from jose import jwt

from sqlalchemy.orm import Session
from database import get_db  # Your DB session dependency
from models.user import User

router = APIRouter()

#...to do google authentication