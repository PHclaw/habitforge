from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.habit import Habit
from app.models.checkin import CheckIn
from app.models.user import User
from app.schemas.habit import HabitCreate, HabitUpdate, HabitOut, HabitStats
from app.schemas.checkin import CheckInCreate, CheckInOut, DailyCheckInSummary
from datetime import datetime, date, timedelta
from typing import List
import json

router = APIRouter(prefix="/habits", tags=["习惯"])

@router.post("/", response_model=HabitOut, status_code=201)
async def create_habit(
    data: HabitCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    habit = Habit(user_id=user.id, **data.model_dump())
    db.add(habit)
    await db.commit()
    await db.refresh(habit)
    return habit

@router.get("/", response_model=List[HabitOut])
async def list_habits(
    category: str = None,
    is_active: bool = True,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    q = select(Habit).where(Habit.user_id == user.id, Habit.is_active == is_active)
    if category:
        q = q.where(Habit.category == category)
    result = await db.execute(q.order_by(Habit.created_at.desc()))
    return result.scalars().all()

@router.get("/{habit_id}", response_model=HabitOut)
async def get_habit(
    habit_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(select(Habit).where(Habit.id == habit_id, Habit.user_id == user.id))
    habit = result.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="习惯不存在")
    return habit

@router.patch("/{habit_id}", response_model=HabitOut)
async def update_habit(
    habit_id: int,
    data: HabitUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(select(Habit).where(Habit.id == habit_id, Habit.user_id == user.id))
    habit = result.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="习惯不存在")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(habit, k, v)
    await db.commit()
    await db.refresh(habit)
    return habit

@router.delete("/{habit_id}", status_code=204)
async def delete_habit(
    habit_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(select(Habit).where(Habit.id == habit_id, Habit.user_id == user.id))
    habit = result.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="习惯不存在")
    await db.delete(habit)
    await db.commit()

@router.get("/{habit_id}/stats", response_model=HabitStats)
async def get_habit_stats(
    habit_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(select(Habit).where(Habit.id == habit_id, Habit.user_id == user.id))
    habit = result.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="习惯不存在")
    today = date.today()
    check_7d = today - timedelta(days=6)
    check_30d = today - timedelta(days=29)
    r7 = await db.execute(select(func.count(CheckIn.id)).where(
        and_(CheckIn.habit_id == habit_id, CheckIn.skipped == False,
             func.date(CheckIn.completed_at) >= check_7d)
    ))
    r30 = await db.execute(select(func.count(CheckIn.id)).where(
        and_(CheckIn.habit_id == habit_id, CheckIn.skipped == False,
             func.date(CheckIn.completed_at) >= check_30d)
    ))
    count7 = r7.scalar() or 0
    count30 = r30.scalar() or 0
    from collections import Counter
    dow_r = await db.execute(select(extract("dow", CheckIn.completed_at), CheckIn.id).where(
        CheckIn.habit_id == habit_id, CheckIn.skipped == False
    ))
    dow_counts = Counter([r[0] for r in dow_r.fetchall()])
    most_completed = ["周一","周二","周三","周四","周五","周六","周日"][max(dow_counts, key=dow_counts.get, default=3)] if dow_counts else None
    return HabitStats(
        habit_id=habit_id,
        total_checkins=habit.total_completions,
        current_streak=habit.current_streak,
        longest_streak=habit.longest_streak,
        completion_rate_7d=round(count7/7*100, 1),
        completion_rate_30d=round(count30/30*100, 1),
        most_completed_day=most_completed,
    )
