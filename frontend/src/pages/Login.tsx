import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChatBubbleIcon,
  UserIcon,
  HashIcon,
  ArrowRightIcon,
  SpinnerIcon,
  SparkleIcon,
  LinkIcon,
} from "../icons";

export default function Login() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomId.trim()) {
      setLoading(true);
      // Simulate a small delay for better UX
      setTimeout(() => {
        navigate(`/chat?username=${encodeURIComponent(username)}&roomId=${encodeURIComponent(roomId)}`);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            animation: "float-blob 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            animation: "float-blob 10s ease-in-out 3s infinite",
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main Card */}
      <div
        className="w-full max-w-[420px] relative z-10"
        style={{ animation: "fade-up 0.6s ease-out" }}
      >
        <div className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle gradient shine on card top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-5">
              <ChatBubbleIcon className="w-7 h-7 text-violet-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Connect
            </h1>
            <p className="text-sm text-zinc-400 font-medium">
              Join conversations instantly
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label htmlFor="username-input" className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2.5">
                <UserIcon className="w-4 h-4 text-zinc-500" />
                Username
              </label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            {/* Room ID Input */}
            <div>
              <label htmlFor="room-input" className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2.5">
                <HashIcon className="w-4 h-4 text-zinc-500" />
                Room ID
              </label>
              <input
                id="room-input"
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!username.trim() || !roomId.trim() || loading}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 disabled:hover:shadow-violet-500/20 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Enter Chat Room</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <SparkleIcon className="w-4 h-4 text-violet-400/60" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 mb-1">Quick Tip</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Share the same room ID with friends to start chatting together in real-time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-3">
              <div className="flex-shrink-0 mt-0.5">
                <LinkIcon className="w-4 h-4 text-violet-400/60" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  No account needed — just pick a name and join.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
