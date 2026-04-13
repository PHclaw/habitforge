from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ai import AICoachRequest, AICoachResponse
from app.services.ai_coach import ai_coach

router = APIRouter(prefix="/ai", tags=["AI教练"])

@router.post("/coach", response_model=AICoachResponse)
async def ai_coach_endpoint(
    data: AICoachRequest,
    user: User = Depends(get_current_user)
):
    result = await ai_coach.generate_plan(
        goal=data.goal,
        current_habits=data.current_habits,
        available_time=data.available_time,
        difficulty=data.difficulty_preference,
    )
    return AICoachResponse(**result)
