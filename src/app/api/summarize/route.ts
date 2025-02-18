import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // Debug: Log the received request payload
    console.log("Received text for summarization:", text);

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI that summarizes news articles in 3 short sentences." },
        { role: "user", content: `Summarize this article:\n\n${text}` },
      ],
      max_tokens: 100,
    });

    const summary = response.choices[0]?.message?.content?.trim() || "No summary available.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}
