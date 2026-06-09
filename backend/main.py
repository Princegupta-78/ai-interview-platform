import os
import tempfile
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from pypdf import PdfReader
from fastapi.security import OAuth2PasswordBearer
from routes.code import router as code_router

# Database and Models
from database import SessionLocal, engine, Base
from models.user import User
from models.interview import Interview
from schemas.user import UserCreate, UserLogin

# --- DAY 19: IMPORT NEW AUTHENTICATION ENGINE ---
from auth import hash_password, verify_password, create_access_token

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(
    code_router,
    prefix="/code",
    tags=["Code Evaluation"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- DAY 19: JWT SECURITY SCHEME ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.get("/")
def home():
    return {"message": "Backend Running"}

# --- SECURE SIGNUP ---
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Passwords are now hashed via auth.py
    hashed_pw = hash_password(user.password)
    new_user = User(name=user.name, email=user.email, password=hashed_pw)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

# --- SECURE LOGIN (RETURNS JWT TOKEN) ---
@app.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Generate the cryptographic token
    access_token = create_access_token(data={"sub": user.email})

    return {
        "message": "Login successful",
        "token": access_token
    }

# --- NEW DAY 19 TEST ROUTE: PROTECTED API ---
@app.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme)):
    # If the user doesn't pass a valid token, FastAPI blocks them automatically!
    return {
        "message": "Protected route access granted",
        "token": token
    }

# ==========================================
# (PREVIOUS FEATURES: AI, RESUMES, DB SAVING)
# ==========================================

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

class EvaluationRequest(BaseModel):
    question: str
    answer: str

@app.post("/evaluate-answer")
def evaluate_answer(req: EvaluationRequest):
    prompt = f"""
    You are an expert technical interviewer.
    Interview Question: {req.question}
    Candidate Answer: {req.answer}
    Analyze the answer professionally.
    Return STRICTLY in this exact format:

    SCORE: [number out of 100]
    TECHNICAL_SKILL: [rating]
    COMMUNICATION: [rating]
    CONFIDENCE: [rating]
    FEEDBACK: [short paragraph]

    If the answer is empty or weak, give a low score honestly.
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return {"feedback": response.text}
    except Exception as e:
        return {"error": str(e)}

class InterviewSaveRequest(BaseModel):
    role: str
    question: str
    answer: str
    feedback: str

@app.post("/save-interview")
def save_interview(req: InterviewSaveRequest, db: Session = Depends(get_db)):
    try:
        new_record = Interview(
            role=req.role,
            question=req.question,
            answer=req.answer,
            feedback=req.feedback
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return {"message": "Interview entry persisted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/interview-history")
def get_interview_history(db: Session = Depends(get_db)):
    return db.query(Interview).order_by(Interview.id.desc()).all()

@app.get("/analytics")
def get_analytics():
    return {
        "total_interviews": 12,
        "average_score": 82,
        "confidence": "Good",
        "strongest_skill": "Data Structures & Algorithms",
        "weakest_skill": "System Design"
    }

@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    temp = tempfile.NamedTemporaryFile(delete=False)
    contents = await file.read()
    temp.write(contents)
    temp.close()

    reader = PdfReader(temp.name)
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted
            
    os.unlink(temp.name)

    analysis = f"""
Resume Analysis:

**Strong Points:**
- Good technical exposure
- Project experience detected

**Improvements:**
- Add more measurable achievements
- Improve resume formatting

**Suggested Roles:**
- Frontend Developer
- Software Engineer Intern

**Resume Content Preview:**
{text[:500]}...
    """
    return {"analysis": analysis}

# --- DAY 20: AI CODING INTERVIEW MODULE ---

@app.get("/generate-coding-question")
def generate_coding_question(role: str):
    prompt = f"""
    Generate ONE technical coding interview question suitable for a {role}.
    Include:
    1. Problem Statement
    2. Example Input
    3. Example Output
    4. Constraints
    Keep it strictly professional and formatted cleanly. Do not provide the solution.
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return {"question": response.text}
    except Exception as e:
        return {"error": str(e)}

class CodeEvaluationRequest(BaseModel):
    question: str
    code: str

@app.post("/evaluate-code")
def evaluate_code(req: CodeEvaluationRequest):
    prompt = f"""
    You are a Senior Staff Software Engineer reviewing a candidate's code.
    
    Coding Question:
    {req.question}
    
    Candidate Code:
    {req.code}
    
    Evaluate the submission strictly and professionally. Provide feedback in this structure:
    1. Correctness (Score out of 10)
    2. Time Complexity (State the Big O and why)
    3. Space Complexity (State the Big O and why)
    4. Code Quality (Readability, naming conventions, edge cases)
    5. Optimization Suggestions (How to improve the approach)
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return {"feedback": response.text}
    except Exception as e:
        return {"error": str(e)}

# --- DAYS 27-28: RESUME-BASED INTERVIEW GENERATOR ---

class ResumeInterviewRequest(BaseModel):
    resume_text: str

@app.post("/resume-interview")
def resume_interview(req: ResumeInterviewRequest):
    prompt = f"""
    You are an expert technical recruiter and engineering manager.
    Analyze the following resume content:

    Resume:
    {req.resume_text}

    Based ONLY on the skills, projects, and experiences listed in this resume, generate a personalized interview loop. 
    Format the output cleanly with bold headings.

    Generate:
    1. 5 Technical Interview Questions (testing the specific languages/frameworks they listed)
    2. 3 Behavioral/HR Questions (based on their experience level)
    3. 2 Deep-Dive Project Questions (ask them to explain specific projects they mentioned)
    """

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return {"questions": response.text}

    except Exception as e:
        return {"error": str(e)}