import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Wand2 } from "lucide-react";

export default function AICoach() {
  const [goal, setGoal] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal.trim()) { toast.error("请输入你的目标"); return; }
    setLoading(true);
    try {
      const res = await api.post("/ai/coach", { goal, difficulty_preference: difficulty });
      setResult(res.data);
    } catch {
      toast.error("AI 教练暂时不可用，请检查 API 配置");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
          <span className="text-2xl">🤖</span>
          <h1 className="font-bold text-lg">AI 习惯教练</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {!result ? (
          <div className="card bg-gradient-to-br from-indigo-50 to-purple-50">
            <h2 className="font-bold text-lg mb-2">🎯 告诉我你想养成什么</h2>
            <p className="text-gray-500 text-sm mb-6">越具体，AI 给的建议越精准</p>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={4} value={goal} onChange={e => setGoal(e.target.value)}
              placeholder="例如：我想在三个月内减重10公斤，平时工作很忙，经常加班到晚上10点..."
            />
            <div className="flex gap-4 mt-4 mb-6">
              <label className="text-sm text-gray-600">难度偏好：</label>
              {["easy","medium","hard"].map(d => (
                <label key={d} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input type="radio" name="diff" value={d} checked={difficulty === d}
                    onChange={() => setDifficulty(d)} className="accent-primary" />
                  {d === "easy" ? "🟢 轻松" : d === "medium" ? "🟡 适中" : "🔴 挑战"}
                </label>
              ))}
            </div>
            <button onClick={handleGenerate} disabled={loading}
              className="btn-primary flex items-center gap-2 px-6 py-3 text-base disabled:opacity-60">
              {loading ? "🤖 AI 思考中..." : <><Wand2 className="w-5 h-5" /> 生成专属计划</>}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card bg-green-50 border-green-100">
              <div className="text-sm text-green-600 font-medium mb-2">💡 Reasoning</div>
              <p className="text-gray-700">{result.reasoning}</p>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-3">📋 推荐习惯</h2>
              <div className="grid grid-cols-1 gap-3">
                {result.habits.map((h: any, i: number) => (
                  <div key={i} className="card border-l-4 border-primary">
                    <div className="font-bold mb-1">{h.name}</div>
                    <div className="text-xs text-gray-400 mb-1 capitalize">{h.category} · {h.difficulty}</div>
                    <div className="text-sm text-gray-600">{h.description}</div>
                    <div className="text-xs text-primary mt-1">→ {h.reason}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-3">📅 本周计划</h2>
              <div className="space-y-2">
                {result.weekly_plan.map((w: any, i: number) => (
                  <div key={i} className="card bg-gray-50">
                    <div className="font-medium text-sm mb-1">{w.day}：{w.focus}</div>
                    <div className="text-sm text-gray-500">{w.action}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-3">💡 贴心建议</h2>
              <div className="space-y-2">
                {result.tips.map((tip: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-primary font-bold">·</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setResult(null)} className="btn-secondary text-sm">
              ← 重新生成
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
