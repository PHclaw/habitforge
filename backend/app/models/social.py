from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, Enum as SAEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum
from app.core.database import Base

class ChallengeStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Challenge(Base):
    __tablename__ = "challenges"
    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    target_days = Column(Integer, default=21)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    status = Column(String(20), default="active")
    is_public = Column(Boolean, default=True)
    max_participants = Column(Integer, default=50)
    created_at = Column(DateTime, default=datetime.utcnow)
    creator = relationship("User")
    habit = relationship("Habit")
    participants = relationship("ChallengeParticipant", back_populates="challenge")

class ChallengeParticipant(Base):
    __tablename__ = "challenge_participants"
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    current_streak = Column(Integer, default=0)
    total_checkins = Column(Integer, default=0)
    rank = Column(Integer, nullable=True)
    challenge = relationship("Challenge", back_populates="participants")
    user = relationship("User", back_populates="challenges")
