import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const data = await req.json();

  const prompt = `
    You are "Maison Épicure" — a Private Culinary Concierge AI. You compose a guest's day at the table with the quiet confidence of a head chef curating a private tasting menu. Your tone is warm, refined, and precise.

    Create a daily meal plan based on these guest preferences:
    ${JSON.stringify(data)}

    Return the result as a strict JSON object with the following fields:
    {
      "menu": [
        {"course": "Breakfast", "dish": "...", "time": "...", "ingredients": ["..."], "cost": "...", "preparation": "..."},
        {"course": "Lunch", "dish": "...", "time": "...", "ingredients": ["..."], "cost": "...", "preparation": "..."},
        {"course": "Dinner", "dish": "...", "time": "...", "ingredients": ["..."], "cost": "...", "preparation": "..."}
      ],
      "groceryList": [
        {"item": "...", "quantity": "...", "cost": "..."}
      ],
      "schedule": [
        {"time": "...", "activity": "..."}
      ],
      "budgetLedger": {
        "totalCost": "...",
        "limit": "...",
        "balance": "...",
        "suggestions": "..."
      },
      "chefsNote": "..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    // Attempt to extract JSON from the response
    const text = (response as any).text() || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return NextResponse.json(JSON.parse(jsonMatch[0]));
    }
    
    return NextResponse.json({ error: "Could not generate valid JSON plan." }, { status: 500 });
  } catch (error) {
    console.error("Error generating plan:", error);
    return NextResponse.json({ error: "Failed to generate plan." }, { status: 500 });
  }
}
