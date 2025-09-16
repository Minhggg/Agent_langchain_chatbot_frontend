"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const askBackend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(
        "https://agent-langchain-chatbot-weather.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input, chat_history: chatHistory }),
        }
      );

      if (!res.ok) throw new Error(`API lỗi: ${res.status} ${res.statusText}`);

      const data: { reply: { output: string; chat_history: Message[] } } =
        await res.json();

      setChatHistory(data.reply.chat_history);

      const aiMsg: Message = { role: "assistant", content: data.reply.output };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Lỗi kết nối server" },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-white">
      {/* Logo mặt trời */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl shadow-lg">
          🌞
        </div>
        <h1 className="text-3xl font-bold mt-3 text-yellow-300">Weather Chatbot</h1>
      </div>

      {/* Chat box */}
      <div className="flex flex-col w-full max-w-2xl h-[600px] bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 && (
            <p className="text-gray-400 italic">Tin nhắn sẽ hiển thị ở đây...</p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xl whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 flex gap-2">
          <input
            type="text"
            placeholder="Nhập câu hỏi về thời tiết..."
            className="flex-1 rounded-xl px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askBackend()}
            disabled={loading}
          />
          <button
            onClick={askBackend}
            disabled={loading}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-semibold text-gray-900 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Gửi"}
          </button>
        </div>
      </div>
    </main>
  );
}
