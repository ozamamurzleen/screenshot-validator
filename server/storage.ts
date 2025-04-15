import { users, screenshots, type User, type InsertUser, type Screenshot, type InsertScreenshot, type ImageAnalysisResult } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Screenshot storage methods
  createScreenshot(screenshot: InsertScreenshot & { results?: ImageAnalysisResult }): Promise<Screenshot>;
  getScreenshot(id: number): Promise<Screenshot | undefined>;
  getAllScreenshots(): Promise<Screenshot[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private screenshots: Map<number, Screenshot>;
  currentId: number;
  screenshotId: number;

  constructor() {
    this.users = new Map();
    this.screenshots = new Map();
    this.currentId = 1;
    this.screenshotId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createScreenshot(screenshotData: InsertScreenshot & { results?: ImageAnalysisResult }): Promise<Screenshot> {
    const id = this.screenshotId++;
    const now = new Date().toISOString();
    
    const screenshot: Screenshot = {
      ...screenshotData,
      id,
      createdAt: now,
      results: screenshotData.results || null
    };
    
    this.screenshots.set(id, screenshot);
    return screenshot;
  }
  
  async getScreenshot(id: number): Promise<Screenshot | undefined> {
    return this.screenshots.get(id);
  }
  
  async getAllScreenshots(): Promise<Screenshot[]> {
    return Array.from(this.screenshots.values());
  }
}

export const storage = new MemStorage();
