import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Shared Gemini client, initialized lazily on first use
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다. AI Studio의 Settings > Secrets 패널에서 API 키를 입력해 주세요.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing support
  app.use(express.json({ limit: '10mb' }));

  // API Route: Run the actual Agent using Gemini API
  app.post("/api/run-agent", async (req, res) => {
    try {
      const { systemPrompt, userInput } = req.body;
      
      if (!systemPrompt || !userInput) {
        res.status(400).json({ error: "System prompt와 User input은 필수입니다." });
        return;
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: `사용자가 입력한 정보 또는 매개변수:\n${userInput}` }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const output = response.text || "에이전트가 결과를 생성하지 못했습니다.";
      res.json({ output });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: error.message || "에이전트 구동 중 오류가 발생했습니다. API 키 구성을 확인해 주세요." 
      });
    }
  });

  // API Route: Check if Gemini is configured
  app.get("/api/health", (req, res) => {
    const keyExists = !!process.env.GEMINI_API_KEY;
    res.json({ 
      status: "ok", 
      geminiConfigured: keyExists,
      message: keyExists 
        ? "Gemini API 키가 바르게 연동되어 실시간 에이전트 실행 테스트가 가능합니다." 
        : "Gemini API 키가 감지되지 않았습니다. API가 필요한 실시간 테스트 탭을 제외한 모든 기능(갤러리, 등록, 피드백 등)은 정상 동작합니다."
    });
  });

  // Vite development middleware setup or production static server
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`H-Agent Hub backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
