import { GoogleGenerativeAI } from '@google/generative-ai'

/** Default model — override via GEMINI_MODEL in .env.local */
export const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash-lite'

const apiKey = process.env.GEMINI_API_KEY

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey && apiKey !== 'your_gemini_api_key')
}

export function getGenAI(): GoogleGenerativeAI {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured')
  }
  return new GoogleGenerativeAI(apiKey!)
}

export function getModel(modelName = GEMINI_MODEL) {
  return getGenAI().getGenerativeModel({ model: modelName })
}