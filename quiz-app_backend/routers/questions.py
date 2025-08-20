
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.question import Question
from models.schemas import QuestionSchema
from typing import List

router = APIRouter()

@router.get("/", response_model=List[QuestionSchema])
def get_questions(db: Session = Depends(get_db)):
    return db.query(Question).all()