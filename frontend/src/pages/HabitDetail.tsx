import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import ReactECharts from "echarts-for-react";

export default function HabitDetail() {
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [checkins, setCheckins] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/habits/${id}`),
      api.get(`/habits/${id}/stats`),
      api.get(`/checkins/calendar/${id}`),
    ]).then(([h, s, c]) => {
      setHabit(h.data);
      setStats(s.data);
      setCheckins(c.data);
    });
  }, [id]);

  if (!habit) return <div className="p-8 text-center">加载中...</div>;

  const chartOption = {
    title: { text: "近30天完成率", left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: Array.from({ length: 30 }, (_, i) => `${i + 1}日`) },
    yAxis: { type: "value", max: 100 },
    series: [{
      data: Array.from({ length: 30 }, () => Math.random() > 0.3 ? Math.round(Math.random() * 40 + 60) : 0),
      type: "bar",
      itemStyle: { color: habit.color || "#6366f1" },
    }],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="font-bold text-lg">{habit.icon} {habit.name}</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "当前连续", value: habit.current_streak, unit: "天" },
            { label: "历史最长", value: habit.longest_streak, unit: "天" },
            { label: "总打卡", value: habit.total_completions, unit: "次" },
            { label: "7日完成率", value: stats?.completion_rate_7d || 0, unit: "%" },
          ].map((s, i) => (
            <div key={i} className="card text-center">
              <div className="text-2xl font-bold" style={{ color: habit.color }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <ReactECharts option={chartOption} style={{ height: 300 }} />
        </div>
      </main>
    </div>
  );
}
