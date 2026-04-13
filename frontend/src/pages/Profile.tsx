import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import useAuthStore from "../stores/authStore";

export default function Profile() {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-bold text-lg">👤 个人资料</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="card text-center py-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-bold text-xl">{user?.full_name || user?.username}</h2>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          <p className="text-gray-400 text-sm">@{user?.username}</p>
        </div>
      </main>
    </div>
  );
}
