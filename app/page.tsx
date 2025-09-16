"use client";

import { useState } from "react";
import { askBot } from "./api";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const reply = await askBot(question);
      setAnswer(reply);
    } catch (err: unknown) {
      if (err instanceof Error) setAnswer(err.message);
      else setAnswer("Có lỗi xảy ra: Không xác định lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400 flex items-center gap-2">
        🌤️ Weather Chatbot
      </h1>

      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-2xl shadow-lg">
        <textarea
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          rows={3}
          placeholder="Hãy hỏi về thời tiết (ví dụ: Thời tiết ở Hà Nội thế nào?)"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="mt-4 w-full py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Hỏi Bot"}
        </button>

        <div className="mt-6 p-4 bg-gray-700 rounded-lg min-h-[80px]">
          {answer ? (
            <p className="whitespace-pre-line">{answer}</p>
          ) : (
            <p className="text-gray-400 italic">
              Câu trả lời sẽ hiển thị ở đây...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
