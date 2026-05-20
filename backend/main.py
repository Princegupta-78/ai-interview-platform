import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel

from database import SessionLocal, engine, Base
from models.user import User
from schemas.user import UserCreate, UserLogin

# Creates the new tables with the password column
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the bcrypt hashing engine
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Backend Running"}

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid email")

    valid_password = pwd_context.verify(user.password, existing_user.password)
    if not valid_password:
        raise HTTPException(status_code=400, detail="Invalid password")

    return {
        "message": "Login successful",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email
        }
    }

# --- DAY 9: GENERATE QUESTIONS ---
@app.get("/generate-questions")
def generate_questions(role: str):
    prompt = f"""
    Generate 5 professional interview questions for a {role} role.
    Return ONLY the questions, numbered 1 to 5, with no introduction or conclusion.
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return {"questions": response.text}
        
    except Exception as e:
        return {"error": str(e)}

# --- DAY 11: EVALUATE ANSWER ---
class EvaluationRequest(BaseModel):
    question: str
    answer: str

@app.post("/evaluate-answer")
def evaluate_answer(req: EvaluationRequest):
    prompt = f"""
    You are a professional technical interviewer.

    Interview Question:
    {req.question}

    Candidate Answer:
    {req.answer}

    Evaluate the answer professionally.

    Give:
    1. Score out of 10
    2. Strengths
    3. Weaknesses
    4. Final feedback

    Keep response concise and readable.
    """

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return {"feedback": response.text}
        
    except Exception as e:
        return {"error": str(e)}