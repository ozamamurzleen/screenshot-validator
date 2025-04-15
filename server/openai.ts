import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

import type { ImageAnalysisResult } from "@shared/schema";

/**
 * Analyzes a screenshot image using OpenAI's vision capabilities
 * @param base64Image The base64-encoded image to analyze
 * @returns Analysis results including pass/fail status for each guideline
 */
export async function analyzeScreenshot(base64Image: string): Promise<ImageAnalysisResult> {
  try {
    // Remove the data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const prompt = `
    You are an Elite, Highly-Precise Image Analyst AI. Your critical mission is to meticulously analyze 
    the provided screenshot and evaluate if it meets the following guidelines:
    
    1. Resolution: Must meet or exceed the minimum threshold of 1280×720 pixels.
    2. Text Readability: All textual elements must be crystal clear and readable with adequate contrast.
    3. UI Element Visibility: All essential UI elements must be fully visible, not cropped or occluded.
    4. Image Quality: The overall image quality must be good without compression artifacts or blurriness.
    
    For each guideline, determine if the screenshot passes or fails. If it fails, provide a specific 
    recommendation for how to fix the issue.
    
    Respond using ONLY the following JSON format:
    {
      "isApproved": boolean,
      "issuesCount": number,
      "guidelines": [
        {
          "title": string,
          "description": string,
          "status": "passed" | "failed",
          "recommendation": string
        }
      ],
      "comments": string,
      "improvementActions": [string]
    }
    
    The isApproved should be true only if ALL guidelines pass. The issuesCount should be the number of 
    failed guidelines. The comments should summarize the analysis results. The improvementActions 
    should list specific steps to improve the screenshot if it fails any guidelines.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const analysisResult = JSON.parse(content) as ImageAnalysisResult;
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing image:", error);
    // Return a fallback error response
    return {
      isApproved: false,
      issuesCount: 1,
      guidelines: [
        {
          title: "Error During Analysis",
          description: "Unable to analyze the screenshot",
          status: "failed",
          recommendation: "Please try again with a different image or check your connection."
        }
      ],
      comments: "An error occurred during image analysis. Please try again.",
      improvementActions: ["Try uploading a different image", "Ensure your image is in a supported format (JPG/PNG)"]
    };
  }
}
