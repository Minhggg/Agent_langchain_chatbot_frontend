// app/api.ts
export async function askBot(message: string) {
  try {
    const response = await fetch(
      "https://agent-langchain-chatbot-weather.onrender.com/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      throw new Error("API lỗi: " + response.statusText);
    }

    const data: { reply: { output: string } } = await response.json();
    return data.reply.output;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Có lỗi xảy ra: " + error.message);
    } else {
      throw new Error("Có lỗi xảy ra: Không xác định lỗi");
    }
  }
}
