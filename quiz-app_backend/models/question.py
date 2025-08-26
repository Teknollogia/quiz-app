from typing import List
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from database import Base, engine
from models.user import User

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    questions = relationship("Question", back_populates="quiz")
    owner = relationship("User", back_populates="quizzes")
    results = relationship("Result", back_populates="quiz")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    quiz = relationship("Quiz", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer_text = Column(String)
    is_correct = Column(Integer, default=0) 
    question = relationship("Question", back_populates="answers")

# This model is for storing the results of all users of all quizzes
class Result(Base):
    __tablename__ = "results" 
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    correct_answers_rate = Column(Integer)
    skipped_answers_rate = Column(Integer)
    wrong_answers_rate = Column(Integer)

    quiz = relationship("Quiz", back_populates="results")
    user = relationship("User", back_populates="results")


#Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind = engine)

