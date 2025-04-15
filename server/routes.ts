import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { analyzeImageSchema, imageAnalysisResult } from "@shared/schema";
import { analyzeScreenshot } from "./openai";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze screenshot endpoint
  app.post("/api/screenshots/analyze", express.json({ limit: MAX_FILE_SIZE }), async (req, res) => {
    try {
      // Validate request body
      const parseResult = analyzeImageSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid request data", errors: parseResult.error.errors });
      }

      const { base64, filename, mimetype, size } = parseResult.data;

      // Check file size
      if (size > MAX_FILE_SIZE) {
        return res.status(400).json({ message: "File too large. Maximum size is 10MB" });
      }

      // Check file type
      if (!["image/png", "image/jpeg", "image/jpg"].includes(mimetype)) {
        return res.status(400).json({ message: "Unsupported file type. Only PNG and JPG/JPEG are supported" });
      }

      // Analyze the image using OpenAI
      const analysisResults = await analyzeScreenshot(base64);

      // Validate analysis results against schema
      const resultValidation = imageAnalysisResult.safeParse(analysisResults);
      if (!resultValidation.success) {
        console.error("Invalid analysis results:", resultValidation.error);
        return res.status(500).json({ message: "Invalid analysis results from AI service" });
      }

      // Store the screenshot and analysis results
      await storage.createScreenshot({
        filename,
        mimetype,
        size,
        base64,
        results: analysisResults
      });

      // Return the analysis results
      return res.status(200).json(analysisResults);
    } catch (error) {
      console.error("Error analyzing screenshot:", error);
      return res.status(500).json({ message: "Error analyzing screenshot", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
