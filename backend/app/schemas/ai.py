from pydantic import BaseModel
from typing import Optional, List

class AICoachRequest(BaseModel):
    goal: str
    current_habits: Optional[List[str]] = None
    available_time: Optional[str] = None
    difficulty_preference: str = "medium"

class AICoachResponse(BaseModel):
    habits: List[dict]
    weekly_plan: List[dict]
    tips: List[str]
    reasoning: str
