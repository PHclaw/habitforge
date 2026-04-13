import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../stores/authStore";
import { format } from "date-fns";
import { Flame, Target, Plus, TrendingUp, CheckCircle2, Calendar } from "lucide-react";

interface Habit {
  id: number; name: string; category: string; color: string; icon: string;
  current_streak: number; longest_streak: number; total_completions: number;
  target_frequency: string; description: string | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  health: "💪", learning: "📚", habit: "🔁", lifestyle: "🌿",
};

const COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316"];

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", category: "lifestyle", description: "", difficulty: "medium" });

  useEffect(() => {
    api.get<Habit[]>("/habits/").then(r => setHabits(r.data)).finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newHabit.name.trim()) return;
    const color = COLORS[habits.length % COLORS.length];
    const res = await api.post<Habit>("/habits/", { ...newHabit, color, icon: CATEGORY_ICONS[newHabit.category] || "⭐" });
    setHabits([res.data, ...habits]);
    setShowAdd(false);
    setNewHabit({ name: "", category: "lifestyle", description: "", difficulty: "medium" });
  };

  const handleCheckin = async (habitId: number) => {
    try {
      await api.post("/checkins/", { habit_id: habitId });
      setHabits(habits.map(h => h.id === habitId ? { ...h, current_streak: h.current_streak + 1, total_completions: h.total_completions + 1 } : h));
    } catch (e: any) {
      if (e.response?.status === 400) alert("今日已打卡");
    }
  };

  const totalStreak = habits.reduce((s, h) => s + h.current_streak, 0);
  const todayCompleted = habits.length; // simplified

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-xl text-dark">HabitForge</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">你好，{user?.username || "用户"}</span>
            <Link to="/ai-coach" className="btn-secondary text-sm">🤖 AI教练</Link>
            <Link to="/challenges" className="btn-secondary text-sm">⚔️ 挑战赛</Link>
            <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-600">退出</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Flame className="w-5 h-5 text-orange-500" />, label: "总连续天数", value: totalStreak, color: "bg-orange-50" },
            { icon: <Target className="w-5 h-5 text-primary" />, label: "当前习惯", value: habits.length, color: "bg-indigo-50" },
            { icon: <TrendingUp className="w-5 h-5 text-green-500" />, label: "总打卡次数", value: habits.reduce((s,h)=>s+h.total_completions,0), color: "bg-green-50" },
          ].map((s, i) => (
            <div key={i} className={`card flex items-center gap-4 ${s.color}`}>
              {s.icon}
              <div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Coach Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 flex items-center justify-between text-white">
          <div>
            <h2 className="text-xl font-bold mb-1">🤖 AI 习惯教练</h2>
            <p className="text-indigo-100 text-sm">告诉我你的目标，AI 为你量身定制习惯养成计划</p>
          </div>
          <Link to="/ai-coach" className="bg-white text-primary px-5 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
            开始定制 →
          </Link>
        </div>

        {/* Habits */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">我的习惯</h2>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> 新增习惯
          </button>
        </div>

        {showAdd && (
          <div className="card mb-4 bg-indigo-50 border-indigo-100">
            <h3 className="font-bold mb-3">新增习惯</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg" placeholder="习惯名称，如：每天早起喝温水"
                value={newHabit.name} onChange={e => setNewHabit({ ...newHabit, name: e.target.value })} />
              <select className="px-3 py-2 border border-gray-200 rounded-lg" value={newHabit.category}
                onChange={e => setNewHabit({ ...newHabit, category: e.target.value })}>
                <option value="health">💪 健康</option>
                <option value="learning">📚 学习</option>
                <option value="habit">🔁 习惯</option>
                <option value="lifestyle">🌿 生活方式</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-lg" value={newHabit.difficulty}
                onChange={e => setNewHabit({ ...newHabit, difficulty: e.target.value })}>
                <option value="easy">🟢 简单</option>
                <option value="medium">🟡 适中</option>
                <option value="hard">🔴 困难</option>
              </select>
              <input className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg" placeholder="描述（可选）"
                value={newHabit.description} onChange={e => setNewHabit({ ...newHabit, description: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="btn-primary text-sm">保存</button>
              <button onClick={() => setShowAdd(false)} className="btn-secondary text-sm">取消</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">加载中...</div>
        ) : habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-lg font-bold text-gray-600 mb-2">还没有习惯</h3>
            <p className="text-gray-400 mb-4">点击上方按钮，创建你的第一个习惯</p>
            <button onClick={() => setShowAdd(true)} className="btn-primary">立即开始</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map(habit => (
              <HabitCard key={habit.id} habit={habit} onCheckin={handleCheckin} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function HabitCard({ habit, onCheckin }: { habit: Habit; onCheckin: (id: number) => void }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{CATEGORY_ICONS[habit.category] || "⭐"}</span>
          <div>
            <Link to={`/habits/${habit.id}`} className="font-bold hover:text-primary transition-colors">
              {habit.name}
            </Link>
            <div className="text-xs text-gray-400 capitalize">{habit.category}</div>
          </div>
        </div>
        <span className="streak-badge"><Flame className="w-4 h-4" />{habit.current_streak}</span>
      </div>
      {habit.description && <p className="text-sm text-gray-500 mb-3">{habit.description}</p>}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">累计 {habit.total_completions} 次</div>
        <button
          onClick={() => onCheckin(habit.id)}
          className="bg-green-50 hover:bg-green-100 text-green-600 px-4 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" /> 打卡
        </button>
      </div>
    </div>
  );
}
