// src/api.ts
export type AskBotResponse = {
  answer: string;
};

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL as string;

export async function askBot(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message }),
    });

    if (!response.ok) {
      throw new Error("API lỗi: " + response.statusText);
    }

    const data: AskBotResponse = await response.json();
    return data.answer;
  } catch (error: any) {
    throw new Error("Có lỗi xảy ra: " + error.message);
  }
}
