# 🌱 HabitForge — AI 习惯养成引擎

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-blue?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/Stars-Welcome-yellow" alt="Stars">
</p>

> 下决心容易，坚持难。HabitForge 用 AI 帮你把「想做的事」变成「正在做的事」。

<p align="center">
  <img src="https://raw.githubusercontent.com/PHclaw/habitforge/main/promo_images/hero.png" width="800" alt="HabitForge Hero">
</p>

---

## ✨ 核心功能

### 🤖 AI 习惯教练
告诉 AI 你的目标（减肥、读书、早起、戒烟...），它为你量身定制：
- **个性化习惯**：根据你的作息、体能、偏好定制
- **智能调整**：连续失败自动降级难度，连续成功自动升级挑战
- **每周计划**：每日具体行动建议，不用自己动脑

### ✅ 一键打卡
- 早上 / 午间 / 晚间多时段提醒
- 连续天数追踪，断链恢复机制（1天自然豁免）
- 心情记录 + 难度感知，数据驱动优化

### 📊 数据洞察
- 习惯完成率趋势图（近30天可视化）
- 周几最容易放弃？AI 告诉你答案
- 习惯关联分析：跑步的日子，早睡概率提升 40%

### ⚔️ 社交挑战赛
- 发起 21 天习惯挑战赛，邀请好友 PK
- 排行榜、成就徽章、里程碑庆祝
- 加入公开挑战，找到同频伙伴

### 🏆 成就体系
10+ 种成就徽章：初来乍到 → 坚持一周 → 习惯初成 → 百日英雄

---

## 🛠 技术栈

| 层 | 技术 |
|---|------|
| 后端 | FastAPI · SQLAlchemy · PostgreSQL · JWT 认证 |
| 前端 | React 18 · TypeScript · Tailwind CSS · Zustand · ECharts |
| AI 引擎 | DeepSeek / OpenAI GPT-4o |
| 部署 | Docker Compose · Nginx |

---

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/PHclaw/habitforge.git
cd habitforge

# 配置（复制环境变量）
cp backend/.env.example backend/.env
# 编辑 backend/.env，填入你的 API Key

# 一键启动
docker-compose up -d

# 访问
open http://localhost:3000
```

**手动启动（开发模式）：**

```bash
# 后端
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 前端（新终端）
cd frontend
npm install
npm run dev
```

---

## 📁 项目结构

```
habitforge/
├── backend/
│   ├── app/
│   │   ├── api/          # API 路由
│   │   │   ├── auth.py    # 注册 / 登录 / 当前用户
│   │   │   ├── habits.py  # 习惯 CRUD + 统计
│   │   │   ├── checkins.py # 打卡 + 日历
│   │   │   ├── social.py  # 挑战赛 + 排行榜
│   │   │   ├── ai.py      # AI 教练
│   │   │   └── deps.py    # 认证依赖
│   │   ├── core/         # 核心配置
│   │   │   ├── config.py  # 环境变量
│   │   │   ├── database.py # 异步数据库连接
│   │   │   └── security.py # JWT + 密码哈希
│   │   ├── models/       # SQLAlchemy 模型
│   │   │   ├── user.py    # 用户
│   │   │   ├── habit.py   # 习惯
│   │   │   ├── checkin.py # 打卡记录
│   │   │   ├── social.py  # 挑战 / 参与者
│   │   │   └── achievement.py # 成就
│   │   ├── schemas/      # Pydantic 请求/响应模型
│   │   └── services/     # 业务逻辑
│   │       ├── ai_coach.py    # AI 教练核心
│   │       └── achievement.py  # 成就判定
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/        # 页面
│   │   │   ├── Landing.tsx       # 落地页
│   │   │   ├── Login.tsx        # 登录
│   │   │   ├── Register.tsx     # 注册
│   │   │   ├── Dashboard.tsx    # 主仪表盘
│   │   │   ├── HabitDetail.tsx  # 习惯详情 + 图表
│   │   │   ├── AICoach.tsx      # AI 教练
│   │   │   ├── Challenges.tsx   # 挑战赛
│   │   │   └── Profile.tsx      # 个人资料
│   │   ├── stores/       # Zustand 状态
│   │   ├── services/     # Axios API 封装
│   │   └── App.tsx       # 路由 + 布局
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 📡 API 一览

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录，返回 JWT |
| GET | `/api/auth/me` | 当前用户 |
| GET/POST | `/api/habits/` | 列表 / 创建习惯 |
| GET/PATCH/DELETE | `/api/habits/:id` | 读取 / 更新 / 删除 |
| GET | `/api/habits/:id/stats` | 习惯统计 |
| POST | `/api/checkins/` | 打卡 |
| GET | `/api/checkins/today` | 今日打卡 |
| GET | `/api/checkins/calendar/:id` | 习惯打卡日历 |
| POST | `/api/ai/coach` | AI 生成习惯计划 |
| GET | `/api/challenges/` | 挑战赛列表 |
| POST | `/api/challenges/` | 创建挑战赛 |
| POST | `/api/challenges/join` | 加入挑战赛 |

---

## 📈 路线图

- [x] v1.0 — 核心习惯 CRUD + 打卡
- [x] v1.1 — AI 习惯教练
- [x] v1.2 — 社交挑战赛
- [ ] v1.3 — 智能提醒引擎（APScheduler）
- [ ] v1.4 — 习惯关联分析
- [ ] v2.0 — 微信小程序端

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 License

MIT License © PHclaw
