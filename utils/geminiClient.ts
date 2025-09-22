import { GoogleGenAI } from "@google/genai";

/**
 * Singleton instance of the GoogleGenAI client.
 * The API key is sourced from environment variables as per guidelines.
 */
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });