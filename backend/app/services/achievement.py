BADGES = {
    "first_checkin": {"id": "first_checkin", "name": "初来乍到", "icon": "🌱", "desc": "完成第一次打卡"},
    "streak_7": {"id": "streak_7", "name": "坚持一周", "icon": "🔥", "desc": "连续打卡7天"},
    "streak_21": {"id": "streak_21", "name": "习惯初成", "icon": "🌿", "desc": "连续打卡21天"},
    "streak_50": {"id": "streak_50", "name": "五十天俱乐部", "icon": "💎", "desc": "连续打卡50天"},
    "streak_100": {"id": "streak_100", "name": "百日英雄", "icon": "🏆", "desc": "连续打卡100天"},
    "perfect_week": {"id": "perfect_week", "name": "完美一周", "icon": "⭐", "desc": "一周所有习惯全勤"},
    "early_bird": {"id": "early_bird", "name": "早起鸟", "icon": "🐦", "desc": "早6点前完成打卡"},
    "night_owl": {"id": "night_owl", "name": "夜猫子", "icon": "🦉", "desc": "晚11点后完成打卡"},
    "social_warrior": {"id": "social_warrior", "name": "挑战者", "icon": "⚔️", "desc": "参加挑战赛并排名前三"},
    "habits_5": {"id": "habits_5", "name": "多面手", "icon": "🎯", "desc": "同时养成5个习惯"},
}

def check_badges(user_id: int, habits: list, checkins: list, current_streak: int) -> list:
    earned = []
    if len(checkins) >= 1:
        earned.append(BADGES["first_checkin"])
    if current_streak >= 7:
        earned.append(BADGES["streak_7"])
    if current_streak >= 21:
        earned.append(BADGES["streak_21"])
    if current_streak >= 50:
        earned.append(BADGES["streak_50"])
    if current_streak >= 100:
        earned.append(BADGES["streak_100"])
    if len(habits) >= 5:
        earned.append(BADGES["habits_5"])
    return earned
