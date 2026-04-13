import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, Users } from "lucide-react";

export default function Challenges() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/challenges/").then(r => setChallenges(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg">⚔️ 习惯挑战赛</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">加载中...</div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⚔️</div>
            <h3 className="text-lg font-bold text-gray-600 mb-2">暂无公开挑战</h3>
            <p className="text-gray-400">成为第一个发起挑战的人！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((c: any) => (
              <div key={c.id} className="card">
                <div className="font-bold mb-2">{c.title}</div>
                <div className="text-sm text-gray-500 mb-3">{c.description}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="w-3 h-3" /> {c.participant_count || 0} / {c.max_participants}
                  </div>
                  <div className="text-xs text-gray-400">{c.target_days} 天挑战</div>
                </div>
                <button className="mt-3 w-full btn-primary text-sm py-2">加入挑战</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
