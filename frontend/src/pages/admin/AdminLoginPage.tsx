import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ username, password });
      navigate("/admin/dashboard", { replace: true });
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1c1c1e] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500">
            <Building2 size={20} className="text-white" />
          </span>
          <span className="font-bold text-white text-xl">PerfectJagah</span>
        </div>

        <div>
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-4">
            Admin Portal
          </p>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Manage your
            <br />
            <span className="text-amber-400">real estate</span>
            <br />
            portfolio.
          </h1>
          <p className="mt-4 text-white/40 text-sm leading-relaxed max-w-xs">
            Add properties, track inquiries, and manage your listings — all from
            one powerful dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3 text-white/30 text-xs">
          <span>© {new Date().getFullYear()} PerfectJagah</span>
          <span>·</span>
          <span>All rights reserved</span>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#faf9f6]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
              <Building2 size={16} className="text-white" />
            </span>
            <span className="font-bold text-charcoal text-lg">
              PerfectJagah
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-charcoal">
            Sign in to Admin
          </h2>
          <p className="text-sm text-muted-400 mt-1">
            Enter your credentials to access the dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Username
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500"
                />
                <input
                  type="text"
                  placeholder="admin"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 h-11 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-400 hover:text-charcoal"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
