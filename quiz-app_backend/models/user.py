from sqlalchemy import Column, Integer, String, text
from sqlalchemy.orm import declarative_base, relationship
from pydantic import BaseModel
from database import Base, engine

class User(Base):
	__tablename__ = "users"
	id = Column(Integer, primary_key=True, index=True)
	username = Column(String, unique=True, index=True)
	fullname = Column(String)
	email = Column(String, unique=True, index=True)
	hashed_password = Column(String, nullable=False)

	google_id = Column(String, unique=True, index=True, nullable=True)
	auth_provider = Column(String, default="local")
	role = Column(String, default="student")
	quizzes = relationship("Quiz", back_populates="owner")
	results = relationship("Result", back_populates="user")

class UserResponse(BaseModel):
	username: str
	email: str

class UserRequest(BaseModel):
	username: str
	fullname: str
	email: str
	password: str
	role: str = "student"

class UserLoginRequest(BaseModel):
	username: str
	password: str

class UserLoginResponse(BaseModel):
	message: str
	username: str
	access_token: str
	role: str
	acces_token_type: str = "bearer"

class ResponseMessage(BaseModel):
	message: str


#Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind = engine)

