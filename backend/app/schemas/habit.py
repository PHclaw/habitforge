from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str = "lifestyle"
    target_frequency: str = "daily"
    reminder_times: Optional[str] = "morning"
    color: str = "#6366f1"
    icon: str = "star"
    difficulty: str = "medium"

class HabitCreate(HabitBase):
    pass

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    reminder_times: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None

class HabitOut(HabitBase):
    id: int
    user_id: int
    is_active: bool
    current_streak: int
    longest_streak: int
    total_completions: int
    ai_plan: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class HabitStats(BaseModel):
    habit_id: int
    total_checkins: int
    current_streak: int
    longest_streak: int
    completion_rate_7d: float
    completion_rate_30d: float
    most_difficult_day: Optional[str] = None
    most_completed_day: Optional[str] = None
