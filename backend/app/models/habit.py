from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Habit(Base):
    __tablename__ = "habits"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)
    target_frequency = Column(String(20), default="daily")
    reminder_times = Column(String(200), default="morning")
    color = Column(String(20), default="#6366f1")
    icon = Column(String(50), default="star")
    is_active = Column(Boolean, default=True)
    difficulty = Column(String(20), default="medium")
    ai_plan = Column(Text, nullable=True)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_completions = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner = relationship("User", back_populates="habits")
    checkins = relationship("CheckIn", back_populates="habit", cascade="all, delete-orphan")
