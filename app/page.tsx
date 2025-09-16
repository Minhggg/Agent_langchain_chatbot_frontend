"use client";

import { useState, useRef, useEffect } from "react";
import { askBot } from "./api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askBot(input);
      const botMessage: Message = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      const botMessage: Message = {
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra: Không xác định lỗi",
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-900 p-4 text-white">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400 flex items-center gap-2 justify-center">
        🌤️ Weather Chatbot
      </h1>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xl whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Nhập câu hỏi..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </main>
  );
}
