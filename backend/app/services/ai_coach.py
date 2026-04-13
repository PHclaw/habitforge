import json
from openai import OpenAI
from app.core.config import settings

class AICoachService:
    PROMPT = """你是一个专业的行为改变教练。你的任务是帮助用户制定可行的习惯养成计划。

分析用户的目标后，请返回一个 JSON 对象，包含：
{
  "habits": [
    {
      "name": "习惯名称（简短，如"每天早起喝杯水"）",
      "category": "health/learning/habit/lifestyle",
      "difficulty": "easy/medium/hard",
      "description": "一句话描述这个习惯",
      "reason": "为什么这个习惯对齐目标很重要"
    }
  ],
  "weekly_plan": [
    {
      "day": "周一",
      "focus": "本周重点（如：建立早起习惯）",
      "action": "具体行动（如：闹钟提前5分钟）"
    }
  ],
  "tips": ["针对该用户情况的3-5条个性化建议"],
  "reasoning": "你的整体思考过程，50字以内"
}

用户信息：
目标: {goal}
现有习惯: {current_habits}
可用时间: {available_time}
难度偏好: {difficulty_preference}

请只返回 JSON，不要包含任何其他文字。"""

    def __init__(self):
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL,
        )
        self.model = settings.LLM_MODEL

    async def generate_plan(self, goal: str, current_habits: list = None,
                             available_time: str = None, difficulty: str = "medium") -> dict:
        current_habits = current_habits or []
        prompt = self.PROMPT.format(
            goal=goal,
            current_habits=", ".join(current_habits) if current_habits else "无",
            available_time=available_time or "每天碎片时间",
            difficulty_preference=difficulty,
        )
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024,
        )
        content = response.choices[0].message.content.strip()
        # 尝试去掉可能的markdown代码块
        if content.startswith("```"):
            lines = content.split("\n")
            content = "\n".join(lines[1:-1])
        return json.loads(content)

ai_coach = AICoachService()
