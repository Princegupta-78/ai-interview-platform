from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# REMINDER: Swap out YOUR_PASSWORD with your actual Postgres master password
DATABASE_URL = "postgresql://postgres:9696463549@127.0.0.1:5432/ai_interview_platform"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()