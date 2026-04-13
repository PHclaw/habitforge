from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from datetime import datetime
from app.core.database import Base

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_id = Column(String(100), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
    notified = Column(Boolean, default=False)
