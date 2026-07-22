import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3004;

app.use(express.json());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Principal Intelligence Briefing
app.post("/api/ai/briefing", async (req, res) => {
  try {
    const { contextData, promptType } = req.body;
    if (!ai) {
      return res.json({
        success: true,
        briefing: "Good morning Dr. Sarah Johnson. Today's school operations are running smoothly with 96.9% student attendance and 97.3% teacher presence. Grade 10 Mathematics mock results show a +4.2% improvement. 3 bus routes are experiencing minor traffic delay near West Gate. 5 pending approvals require your review before 11:00 AM.",
        insights: [
          "Grade 10 Physics section B attendance dropped 8% this week - recommendation: trigger counselor check-in.",
          "Term 1 Fee collection is at 92.4% ($1.24M / $1.34M target). Outstanding accounts flag 14 families for installment plans.",
          "Bus Route #12 driver reported construction detour on Pine Street (+8 mins)."
        ]
      });
    }

    const systemInstruction = `You are SchoolOS AI Intelligence Assistant for Green Valley International School, providing high-level operational analysis for Principal Dr. Sarah Johnson. Keep tone executive, clear, actionable, concise, and professional.`;

    const prompt = `Generate a 2-paragraph morning operational briefing and 3 concise bullet point insights for Principal Dr. Sarah Johnson.
Context:
${JSON.stringify(contextData || {})}
Focus: ${promptType || "General Operations"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      briefing: response.text || "Operational summary generated successfully.",
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate briefing" });
  }
});

// AI Draft Notice / Announcement Generator
app.post("/api/ai/draft-notice", async (req, res) => {
  try {
    const { topic, targetAudience, urgency } = req.body;
    if (!ai) {
      return res.json({
        success: true,
        notice: `OFFICIAL ANNOUNCEMENT: ${topic.toUpperCase()}\n\nDear ${targetAudience || 'Parents and Staff'},\n\nWe would like to notify you regarding ${topic}. Please review the updated guidelines on the SchoolOS portal.\n\nWarm regards,\nDr. Sarah Johnson\nPrincipal, Green Valley International School`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Draft an official school announcement from Principal Dr. Sarah Johnson for ${targetAudience || 'Parents & Teachers'}. Topic: ${topic}. Urgency Level: ${urgency || 'Standard'}. Include title, respectful greeting, key details, and clear call-to-action.`,
      config: {
        systemInstruction: "You are drafting official school circulars for Principal Dr. Sarah Johnson at Green Valley International School.",
        temperature: 0.6,
      },
    });

    res.json({
      success: true,
      notice: response.text,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to generate notice" });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SchoolOS Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
