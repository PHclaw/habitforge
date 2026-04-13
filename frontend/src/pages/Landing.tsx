import { Link } from "react-router-dom";
import { ArrowRight, Flame, Target, Brain, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <span className="font-bold text-xl">HabitForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm">登录</Link>
          <Link to="/register" className="btn-primary text-sm">免费开始</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block bg-indigo-50 text-primary text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
          🤖 AI 驱动的习惯养成引擎
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          下决心容易，<br />
          <span className="text-primary">坚持难。</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          HabitForge 用 AI 帮你把「想做的事」变成「正在做的事」。<br />
          个性化计划 · 智能打卡 · 社交激励，让习惯不再孤独。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
            免费开始 <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-secondary px-8 py-3 text-lg">
            我已有账号
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择 HabitForge？</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Brain className="w-8 h-8" />, title: "AI 习惯教练", desc: "告诉 AI 你的目标，它为你量身定制可执行的习惯计划" },
              { icon: <Target className="w-8 h-8" />, title: "智能打卡", desc: "一键打卡，连续追踪，自动计算最优提醒时间" },
              { icon: <Flame className="w-8 h-8" />, title: "连续激励", desc: "连续天数可视化，断链恢复机制，里程碑庆祝" },
              { icon: <Users className="w-8 h-8" />, title: "社交挑战", desc: "发起习惯挑战赛，与好友 PK，连续天数排行榜" },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="text-primary mb-4 flex justify-center">{f.icon}</div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">今天开始，21 天养成好习惯</h2>
        <p className="text-indigo-100 mb-8">100% 免费 · 开源 · 无广告</p>
        <Link to="/register" className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
          立即加入 →
        </Link>
      </section>

      <footer className="text-center text-gray-400 text-sm py-8">
        <p>© 2026 HabitForge · MIT License · 100% 开源</p>
        <p className="mt-1">Built by PHclaw · Powered by AI</p>
      </footer>
    </div>
  );
}
