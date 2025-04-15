import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const screenshots = pgTable("screenshots", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  mimetype: text("mimetype").notNull(),
  size: integer("size").notNull(),
  base64: text("base64").notNull(),
  results: jsonb("results"),
  createdAt: text("created_at").notNull().default("NOW()"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScreenshotSchema = createInsertSchema(screenshots).pick({
  filename: true,
  mimetype: true,
  size: true,
  base64: true,
});

export const analyzeImageSchema = z.object({
  base64: z.string().min(1),
  filename: z.string().min(1),
  mimetype: z.string().min(1),
  size: z.number().positive(),
});

export const guideline = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["passed", "failed"]),
  recommendation: z.string(),
});

export const imageAnalysisResult = z.object({
  isApproved: z.boolean(),
  issuesCount: z.number(),
  guidelines: z.array(guideline),
  comments: z.string(),
  improvementActions: z.array(z.string()),
});

export type GuidelineResult = z.infer<typeof guideline>;
export type ImageAnalysisResult = z.infer<typeof imageAnalysisResult>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertScreenshot = z.infer<typeof insertScreenshotSchema>;
export type AnalyzeImageRequest = z.infer<typeof analyzeImageSchema>;
export type User = typeof users.$inferSelect;
export type Screenshot = typeof screenshots.$inferSelect;
