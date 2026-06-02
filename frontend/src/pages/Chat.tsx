import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ChatBubbleIcon,
  HashIcon,
  UserIcon,
  SendIcon,
  LogOutIcon,
} from "../icons";

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

export default function Chat() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      username: "System",
      text: "Welcome to the chat room!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  const username = searchParams.get("username") || "Anonymous";
  const roomId = searchParams.get("roomId") || "";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Setup WebSocket connection
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
        console.log("Connected to WebSocket server");
        socket.send(JSON.stringify({ type: "join", roomId, username }));

        socket.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === "system") {
                    setMessages(m => [...m, {
                        id: Date.now().toString(),
                        username: "System",
                        text: data.message,
                        timestamp: new Date(),
                    }]);
                } else if (data.type === "chat") {
                    setMessages(m => [...m, {
                        id: Date.now().toString(),
                            username: data.username,
                            text: data.message,
                            timestamp: new Date(),
                    }]);
                 }
            } catch {
                setMessages(m => [...m, {
                    id: Date.now().toString(),
                    username: "Server",
                    text: e.data,
                    timestamp: new Date(),
                }]);
            }
        }
    }
    socket.onclose = () => {
        console.log("WebSocket connection closed");
    }
    setWs(socket);
    return () => socket.close();
  }, [roomId, username]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (ws && inputValue.trim()) {
        ws.send(JSON.stringify({
            type: "chat",
            roomId,
            username,
            message: inputValue,
        }));
    }
    setInputValue("");
  };

  const handleLeave = () => {
    navigate("/");
  };

  const getNameColor = (name: string) => {
    const colors = [
      "#53bdeb", "#e9a977", "#f77e70", "#8de17d",
      "#d4a6f5", "#f5a8c5", "#69c4e0", "#e6cb72",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="h-screen bg-[#0f0a1a] flex flex-col">
      {/* ── Header ── */}
      <header className="shrink-0 border-b border-violet-500/10 bg-[#13111c] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Left: Room info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <ChatBubbleIcon className="w-5 h-5 text-violet-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-white truncate">Chat Room</h1>
              <div className="flex items-center gap-3 text-xs text-violet-300/60">
                <span className="flex items-center gap-1 truncate">
                  <HashIcon className="w-3 h-3 shrink-0 text-violet-400/50" />
                  <span className="truncate font-medium">{roomId}</span>
                </span>
                <span className="hidden sm:inline text-zinc-600">•</span>
                <span className="hidden sm:flex items-center gap-1 truncate">
                  <UserIcon className="w-3 h-3 shrink-0 text-violet-400/50" />
                  <span className="truncate font-medium">{username}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Leave button */}
          <button
            onClick={handleLeave}
            className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/15 text-violet-300/70 hover:text-white hover:bg-violet-500/20 hover:border-violet-500/25 transition-all duration-200 text-sm font-medium cursor-pointer"
          >
            <LogOutIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </header>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='30' cy='30' r='1' fill='rgba(255,255,255,0.015)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23p)' width='60' height='60'/%3E%3C/svg%3E")`,
        }}
      >
        <div className="max-w-3xl mx-auto w-full px-3 sm:px-5 py-3 space-y-0.75">
          {messages.map((msg, index) => {
            const isOwn = msg.username === username;
            const isSystem = msg.username === "System";

            const timeStr = msg.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            // System message
            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  className="flex justify-center py-1"
                  style={{ animation: `fade-up 0.3s ease-out ${index * 30}ms both` }}
                >
                  <div className="px-3 py-1 rounded-md bg-violet-500/10 shadow-sm">
                    <span className="text-[11px] text-violet-300/70 font-medium">{msg.text}</span>
                  </div>
                </div>
              );
            }

            // Check if this is the first message from this sender in a group
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const isFirstInGroup = !prevMsg || prevMsg.username !== msg.username || prevMsg.username === "System";

            // User messages — WhatsApp-style
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"} ${isFirstInGroup ? "pt-2" : ""}`}
                style={{ animation: `${isOwn ? "slide-right" : "slide-left"} 0.25s ease-out both` }}
              >
                <div className={`relative max-w-[75%] sm:max-w-[65%] ${isOwn ? "ml-12" : "mr-12"}`}>
                  {/* Bubble */}
                  <div
                    className={`relative px-2.25 pt-1.5 pb-1.75 shadow-sm ${
                      isOwn
                        ? `bg-linear-to-br from-violet-600 to-purple-700 text-white ${isFirstInGroup ? "rounded-tl-lg rounded-tr-0.75 rounded-bl-lg rounded-br-lg" : "rounded-lg"}`
                        : `bg-[#1c1528] text-[#e9edef] border border-violet-500/40 ${isFirstInGroup ? "rounded-tl-0.75 rounded-tr-lg rounded-bl-lg rounded-br-lg" : "rounded-lg"}`
                    }`}
                  >
                    {/* Sender name for others — only on first in group */}
                    {!isOwn && isFirstInGroup && (
                      <p className="text-[12.5px] font-semibold mb-0.5" style={{ color: getNameColor(msg.username) }}>
                        {msg.username}
                      </p>
                    )}

                    {/* Message text + inline timestamp */}
                    <div className="flex flex-wrap items-end">
                      <span className="text-[14.2px] leading-4.75 wrap-break-word whitespace-pre-wrap">{msg.text}</span>
                      {/* Invisible spacer so text wraps before the timestamp */}
                      <span className="inline-block w-17 shrink-0" />
                    </div>

                    {/* Floating timestamp — bottom right inside bubble */}
                    <div className="absolute bottom-1.25 right-1.75 flex items-center gap-1">
                      <span className={`text-[11px] leading-none ${isOwn ? "text-purple-200/60" : "text-violet-300/40"}`}>
                        {timeStr}
                      </span>
                      {isOwn && (
                        <svg className="w-4 h-2.75 text-violet-300/70" viewBox="0 0 16 11" fill="none">
                          <path d="M11.07 0.66L4.43 7.29L2.14 5L1 6.14L4.43 9.57L12.21 1.8L11.07 0.66Z" fill="currentColor" />
                          <path d="M14.07 0.66L7.43 7.29L6.5 6.36L5.36 7.5L7.43 9.57L15.21 1.8L14.07 0.66Z" fill="currentColor" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 bg-[#13111c] border-t border-violet-500/10 px-3 sm:px-4 py-2.5">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto w-full flex items-center gap-2">
          <input
            id="message-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2.5 bg-[#1c1528] rounded-lg text-[#e9edef] placeholder-violet-300/30 text-[15px] focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors duration-150 border border-violet-500/30"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="shrink-0 w-10.5 h-10.5 flex items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-violet-500/20"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
