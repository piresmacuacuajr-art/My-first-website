import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.post("/api/suggest-investment", async (req, res) => {
    const { balance, plans } = req.body;
    
    const prompt = `Based on the user's current balance of ${balance} MZN, suggest the best investment plan from the following list. Consider risk management and long-term growth. Provide a brief explanation.
    
    Available Plans:
    ${JSON.stringify(plans)}
    
    Response format: JSON with 'planName' and 'explanation' fields.`;
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
      });
      res.json(JSON.parse(response.text!));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to fetch suggestion" });
    }
  });
  
  // Placeholder for transaction history
  app.get("/api/transactions", (req, res) => {
    res.json([
      { id: 1, date: "2026-06-08", type: "Deposit", amount: 5000, status: "Completed" },
      { id: 2, date: "2026-06-07", type: "Investment", amount: -2000, status: "Completed" },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
