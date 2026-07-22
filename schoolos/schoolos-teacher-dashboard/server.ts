import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// AI Teaching Assistant API Endpoint
app.post("/api/ai/assistant", async (req, res) => {
  try {
    const { action, topic, grade, subject, additionalContext } = req.body;
    const ai = getGenAI();

    let systemPrompt = "You are an expert AI Teaching Assistant built into SchoolOS Enterprise. Respond in clear, beautifully formatted Markdown with structured headers, bullet points, and actionable educational content.";
    let userPrompt = "";

    switch (action) {
      case "lesson_plan":
        userPrompt = `Generate a comprehensive high-school lesson plan for ${subject || "Mathematics"} (Grade ${grade || "10A"}). Topic: "${topic || "Quadratic Equations & Real-World Applications"}". Include: 
1. Learning Objectives (Bloom's Taxonomy)
2. Materials Needed & Technology Setup
3. Bell Ringer / Hook (5 mins)
4. Direct Instruction & Core Concepts (15 mins)
5. Guided Practice & Group Work (15 mins)
6. Independent Assessment & Differentiation Strategies
7. Homework & Exit Ticket.`;
        break;
      case "quiz":
        userPrompt = `Generate a 5-question quiz for ${subject || "Mathematics"} Grade ${grade || "10A"} on "${topic || "Polynomial Factoring"}". Include 3 Multiple Choice Questions (with options A-D) and 2 Short Answer Questions. Provide an Answer Key with detailed solution steps at the bottom.`;
        break;
      case "worksheet":
        userPrompt = `Create a printable 4-section practice worksheet on "${topic || "Trigonometric Ratios"}" for Grade ${grade || "10A"} ${subject || "Math"}. Include Section A (Basic Drill), Section B (Application Word Problems), Section C (Challenge Problem), and Section D (Self-Reflection Checkpoint).`;
        break;
      case "question_paper":
        userPrompt = `Draft a Mid-Term Examination Question Paper for ${subject || "Mathematics"} Grade ${grade || "10A"}. Total Marks: 50. Time: 90 Mins.
Section A: 5 MCQs (1 mark each)
Section B: 4 Short Answer Questions (3 marks each)
Section C: 3 Long Problem Solving Questions (5 marks each)
Section D: 1 Real-world Case Study Question (8 marks).`;
        break;
      case "summarize_chapter":
        userPrompt = `Provide a concise, teacher-friendly summary of Chapter: "${topic || "Calculus Fundamentals & Derivatives"}". Highlight key formulas, common student misconceptions, essential vocabulary, and 3 quick check-for-understanding questions.`;
        break;
      case "homework":
        userPrompt = `Create a engaging, 20-minute homework assignment on "${topic || "Linear Systems & Graphing"}" for Grade ${grade || "10A"}. Include 3 scaffolded problems and a rubric for grading.`;
        break;
      case "student_performance":
        userPrompt = `Analyze the following class performance data for Grade ${grade || "10A"} Mathematics on "${topic || "Recent Unit Test"}": ${additionalContext || "Average: 78%, Lowest: 45%, Highest: 98%, Frequent errors in quadratic formula minus signs"}. Suggest 4 targeted pedagogical interventions and class re-teaching strategies.`;
        break;
      case "suggest_weak_students":
        userPrompt = `Provide a customized student support and intervention plan for Grade ${grade || "10A"} students struggling with attendance and math scores: ${additionalContext || "Students: Alex Rivera (71% attendance, 58% score), Sarah Jenkins (68% attendance, 62% score)"}. Include parent communication points, peer tutoring assignments, and 1-on-1 review schedules.`;
        break;
      case "attendance_recommendations":
        userPrompt = `Analyze class attendance patterns for SchoolOS Teacher Dashboard:
Overall Today: 96%
At-Risk Students: 3 students below 75% threshold
Late Arrivals: 8 students today (predominantly Period 1 Math 10A).
Provide 5 actionable, empathetic, and system-integrated teacher recommendations to reduce chronic tardiness and boost Period 1 attendance.`;
        break;
      default:
        userPrompt = `Provide teaching assistance on: ${topic || "General classroom management and mathematics pedagogy"}.`;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback structured response if key is missing
      return res.json({
        success: true,
        text: `### 🤖 SchoolOS AI Teaching Assistant (${action.toUpperCase()})\n\n**Topic:** ${topic || "Core Curriculum"}\n**Target:** Grade ${grade || "10A"} ${subject || "Mathematics"}\n\n#### 🎯 Key Learning Objectives\n- Master fundamental principles of **${topic || "the lesson"}**.\n- Apply analytical problem-solving techniques in structured group exercises.\n- Evaluate real-world application scenarios.\n\n#### 📚 Lesson Breakdown\n1. **Hook (5 mins):** Real-life warm-up scenario.\n2. **Direct Instruction (15 mins):** Interactive whiteboarding of core concepts.\n3. **Guided Practice (15 mins):** Differentiated group problem sets.\n4. **Exit Ticket (5 mins):** 2-minute check for understanding.\n\n> *Note: Connect Gemini API Key in Settings to unlock live streaming AI generation.*`
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || "No response generated.",
    });
  } catch (err: any) {
    console.error("Error calling Gemini API:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to generate AI response",
    });
  }
});

// Vite Middleware for development / Static Serving for production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`SchoolOS Teacher Dashboard Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
