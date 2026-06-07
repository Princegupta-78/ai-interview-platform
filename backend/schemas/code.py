from pydantic import BaseModel

class CodeSubmission(BaseModel):
    problem_id: int
    code: str