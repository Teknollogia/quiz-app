import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from routers import users, auth, questions

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from routers import quizzes

Base.metadata.create_all(bind = engine)

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(users.router, prefix="/login", tags = ["login"])
app.include_router(questions.router, prefix="/questions", tags = ["questions"])
app.include_router(quizzes.router, prefix="/quizzes")

@app.get("/")
def read_root():
	for route in app.routes:
		print(f"{route.path} -> {route.name}")
	return {"message": "Welcome to the FastAPI backend!"}

