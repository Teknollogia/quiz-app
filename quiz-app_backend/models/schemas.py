from typing import List
from pydantic import BaseModel

class AnswerCreate(BaseModel):
    answer_text: str
    is_correct: int  #

class AnswerSchema(BaseModel):
    id: int
    answer_text: str

    class Config:
        orm_mode = True

class QuestionSchema(BaseModel):
    id: int
    question_text: str
    answers: List[AnswerSchema]

    class Config:
        orm_mode = True

# Used for incoming question data
class QuestionCreate(BaseModel):
    question_text: str
    answers: List[AnswerCreate]
    correct_answer_index: int  # Index in the `answers` list

# Used for incoming quiz data
class QuizCreate(BaseModel):
    title: str
    questions: List[QuestionCreate]