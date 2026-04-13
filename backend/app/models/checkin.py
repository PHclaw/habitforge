from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class CheckIn(Base):
    __tablename__ = "checkins"
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    note = Column(Text, nullable=True)
    mood = Column(String(20), nullable=True)
    difficulty_felt = Column(String(20), nullable=True)
    skipped = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    habit = relationship("Habit", back_populates="checkins")
    user = relationship("User", back_populates="checkins")
