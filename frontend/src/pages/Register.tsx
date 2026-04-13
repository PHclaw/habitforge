import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, username, password, fullName);
      toast.success("注册成功！");
      navigate("/dashboard");
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "注册失败");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🌱</span>
          <h1 className="text-2xl font-bold mt-2">加入 HabitForge</h1>
          <p className="text-gray-400 text-sm mt-1">用 AI 养成好习惯</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">用户名</label>
            <input required value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="yourname" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">全名（可选）</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="张三" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">密码</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-base">
            创建账号
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          已有账号？<Link to="/login" className="text-primary font-medium hover:underline">立即登录</Link>
        </p>
      </div>
    </div>
  );
}
