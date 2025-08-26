from typing import List, Optional
from pydantic import BaseModel

class AnswerCreate(BaseModel):
    answer_text: str
    is_correct: int #

class QuestionCreate(BaseModel):
    question_text: str
    answers: List[AnswerCreate]

class QuizCreate(BaseModel):
    title: str
    created_by: int
    questions: List[QuestionCreate] = []

class AnswerResponse(BaseModel):
    id: int
    answer_text: str
    is_correct: int

    class Config:
        orm_mode = True

class QuestionResponse(BaseModel):
    id: int
    question_text: str
    answers: List[AnswerResponse]

    class Config:
        orm_mode = True

class QuizResponse(BaseModel):
    id: int
    title: str
    created_by: int
    questions: List[QuestionResponse] = []

    class Config:
        orm_mode = True

class ResultCreate(BaseModel):
    correct_answers_rate: int
    skipped_answers_rate: int
    wrong_answers_rate: int

class ResultResponse(BaseModel):
    id: int
    quiz_id: int
    user_id: int
    correct_answers_rate: int
    skipped_answers_rate: int
    wrong_answers_rate: int

    class Config:
        orm_mode = True
