import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      toast.error("邮箱或密码错误");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🌱</span>
          <h1 className="text-2xl font-bold mt-2">HabitForge</h1>
          <p className="text-gray-400 text-sm mt-1">登录你的习惯养成引擎</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">密码</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-base">
            登录
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          还没有账号？<Link to="/register" className="text-primary font-medium hover:underline">立即注册</Link>
        </p>
      </div>
    </div>
  );
}
