from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.social import Challenge, ChallengeParticipant
from app.models.habit import Habit
from app.models.user import User
from app.schemas.social import ChallengeCreate, ChallengeOut, ChallengeJoin, ParticipantRank
from typing import List

router = APIRouter(prefix="/challenges", tags=["挑战"])

@router.post("/", response_model=ChallengeOut, status_code=201)
async def create_challenge(
    data: ChallengeCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    habit_r = await db.execute(select(Habit).where(Habit.id == data.habit_id, Habit.user_id == user.id))
    if not habit_r.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="习惯不存在")
    challenge = Challenge(creator_id=user.id, **data.model_dump())
    db.add(challenge)
    await db.commit()
    await db.refresh(challenge)
    return challenge

@router.get("/", response_model=List[ChallengeOut])
async def list_challenges(
    status: str = "active",
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    r = await db.execute(select(Challenge).where(Challenge.status == status, Challenge.is_public == True).order_by(Challenge.created_at.desc()).limit(50))
    return r.scalars().all()

@router.post("/join", status_code=201)
async def join_challenge(
    data: ChallengeJoin,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    r = await db.execute(select(Challenge).where(Challenge.id == data.challenge_id))
    challenge = r.scalar_one_or_none()
    if not challenge:
        raise HTTPException(status_code=404, detail="挑战不存在")
    existing = await db.execute(select(ChallengeParticipant).where(
        ChallengeParticipant.challenge_id == data.challenge_id,
        ChallengeParticipant.user_id == user.id
    ))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="已加入该挑战")
    p = ChallengeParticipant(challenge_id=data.challenge_id, user_id=user.id)
    db.add(p)
    await db.commit()
    return {"message": "加入成功"}

@router.get("/{challenge_id}/leaderboard", response_model=List[ParticipantRank])
async def get_leaderboard(
    challenge_id: int,
    db: AsyncSession = Depends(get_db)
):
    r = await db.execute(select(ChallengeParticipant).where(
        ChallengeParticipant.challenge_id == challenge_id
    ).order_by(ChallengeParticipant.current_streak.desc()).limit(20))
    participants = r.scalars().all()
    result = []
    for i, p in enumerate(participants, 1):
        user_r = await db.execute(select(User).where(User.id == p.user_id))
        user = user_r.scalar_one()
        result.append(ParticipantRank(
            rank=i,
            user_id=p.user_id,
            username=user.username,
            current_streak=p.current_streak,
            total_checkins=p.total_checkins
        ))
    return result
