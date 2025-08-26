from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.question import Quiz, Question, Answer, Result
from models.user import User
from models.quiz import QuizCreate, QuizResponse, ResultCreate, ResultResponse
from routers.users import get_current_user
from typing import List

router = APIRouter()

@router.post("/createQuiz", response_model=QuizResponse)
def create_quiz(quiz: QuizCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_quiz = Quiz(title=quiz.title, created_by= current_user.id)
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)

    for q in quiz.questions:
        db_question = Question(question_text = q.question_text, quiz_id = db_quiz.id)
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
        for a in q.answers:
            db_answer = Answer(answer_text=a.answer_text, is_correct = a.is_correct, question_id = db_question.id)
            db.add(db_answer)

    db.commit()
    db.refresh(db_quiz)
    return db_quiz

@router.get("/quizzes")
def get_quizzes(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).all()
    return quizzes

@router.get("/quizzes/{quiz_id}", response_model=QuizResponse)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).options(joinedload(Quiz.questions).joinedload(Question.answers)).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@router.post("/submitQuiz/{quiz_id}", response_model=ResultResponse)
def submit_quiz(
    quiz_id: int,
    result: ResultCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    db_result = Result(
        quiz_id = quiz_id,  # take from URL param, not from body
        user_id = current_user.id,
        correct_answers_rate = result.correct_answers_rate,
        skipped_answers_rate = result.skipped_answers_rate,
        wrong_answers_rate = result.wrong_answers_rate
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

@router.get("/summaries")
def get_quiz_summaries(db: Session = Depends(get_db)):
    results = db.query(Result).all()
    return results