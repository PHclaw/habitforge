from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CheckInCreate(BaseModel):
    habit_id: int
    note: Optional[str] = None
    mood: Optional[str] = None
    difficulty_felt: Optional[str] = None

class CheckInOut(BaseModel):
    id: int
    habit_id: int
    user_id: int
    completed_at: datetime
    note: Optional[str] = None
    mood: Optional[str] = None
    difficulty_felt: Optional[str] = None
    skipped: bool
    class Config:
        from_attributes = True

class DailyCheckInSummary(BaseModel):
    date: str
    total_habits: int
    completed: int
    completion_rate: float
