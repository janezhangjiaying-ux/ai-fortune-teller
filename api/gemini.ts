import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing GEMINI_API_KEY on server" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { model, contents, config } = body || {};

    if (!model || !contents) {
      res.status(400).json({ error: "Missing model or contents" });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    res.status(200).json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API proxy error:", err);
    res.status(500).json({ error: "AI分析服务暂时不可用，请稍后重试。" });
  }
}
