from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChallengeCreate(BaseModel):
    title: str
    description: Optional[str] = None
    habit_id: int
    target_days: int = 21
    start_date: datetime
    end_date: datetime
    is_public: bool = True
    max_participants: int = 50

class ChallengeOut(BaseModel):
    id: int
    creator_id: int
    title: str
    description: Optional[str] = None
    habit_id: int
    target_days: int
    start_date: datetime
    end_date: datetime
    status: str
    is_public: bool
    participant_count: int = 0
    created_at: datetime
    class Config:
        from_attributes = True

class ChallengeJoin(BaseModel):
    challenge_id: int

class ParticipantRank(BaseModel):
    rank: int
    user_id: int
    username: str
    current_streak: int
    total_checkins: int
