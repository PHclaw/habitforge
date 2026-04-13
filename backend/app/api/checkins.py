from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, date, timedelta
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.habit import Habit
from app.models.checkin import CheckIn
from app.models.user import User
from app.schemas.checkin import CheckInCreate, CheckInOut, DailyCheckInSummary
from typing import List

router = APIRouter(prefix="/checkins", tags=["打卡"])

@router.post("/", response_model=CheckInOut, status_code=201)
async def create_checkin(
    data: CheckInCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Verify habit ownership
    r = await db.execute(select(Habit).where(Habit.id == data.habit_id, Habit.user_id == user.id))
    habit = r.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="习惯不存在")

    today = date.today()
    # Check duplicate today
    r2 = await db.execute(select(CheckIn).where(
        CheckIn.habit_id == data.habit_id,
        func.date(CheckIn.completed_at) == today
    ))
    if r2.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="今日已打卡")

    checkin = CheckIn(
        habit_id=data.habit_id,
        user_id=user.id,
        note=data.note,
        mood=data.mood,
        difficulty_felt=data.difficulty_felt,
        skipped=False,
    )
    db.add(checkin)

    # Update streak
    yesterday = today - timedelta(days=1)
    r3 = await db.execute(select(CheckIn).where(
        CheckIn.habit_id == habit.id,
        func.date(CheckIn.completed_at) == yesterday
    ))
    if r3.scalar_one_or_none():
        habit.current_streak += 1
    else:
        habit.current_streak = 1
    if habit.current_streak > habit.longest_streak:
        habit.longest_streak = habit.current_streak
    habit.total_completions += 1

    await db.commit()
    await db.refresh(checkin)
    return checkin

@router.get("/today", response_model=List[CheckInOut])
async def get_today_checkins(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    today = date.today()
    r = await db.execute(select(CheckIn).where(
        CheckIn.user_id == user.id,
        func.date(CheckIn.completed_at) == today
    ))
    return r.scalars().all()

@router.get("/calendar/{habit_id}", response_model=List[CheckInOut])
async def get_habit_calendar(
    habit_id: int,
    month: int = None,
    year: int = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    from datetime import date as d
    target = d(year or date.today().year, month or date.today().month, 1)
    from calendar import monthrange
    _, last_day = monthrange(target.year, target.month)
    start = target
    end = d(target.year, target.month, last_day)
    r = await db.execute(select(CheckIn).where(
        CheckIn.habit_id == habit_id,
        CheckIn.user_id == user.id,
        func.date(CheckIn.completed_at) >= start,
        func.date(CheckIn.completed_at) <= end
    ))
    return r.scalars().all()
