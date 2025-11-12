import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Missing fish name" }, { status: 400 });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Schrijf een korte, unieke en aantrekkelijke beschrijving van de vissoort "${name}". Max 3 zinnen.`,
    });

    const description = response.text || `Beschrijving voor ${name} niet beschikbaar.`;
    return NextResponse.json({ description });
  } catch (err: any) {
    console.error("Generate-description error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
