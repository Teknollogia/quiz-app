from sqlalchemy import Column, Integer, String, text
from sqlalchemy.orm import declarative_base
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


Base.metadata.create_all(bind = engine)

