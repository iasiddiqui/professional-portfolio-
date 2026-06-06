import { GoogleGenerativeAI } from '@google/generative-ai';

import { env, requireEnvValue } from '../config/env.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';

let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(requireEnvValue(env.GEMINI_API_KEY, 'GEMINI_API_KEY'));
  }

  return genAI;
}

export interface GeminiGenerateOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
}

export interface GeminiGenerateResult {
  text: string;
  model: string;
}

export async function generateGeminiResponse(
  options: GeminiGenerateOptions
): Promise<GeminiGenerateResult> {
  const modelName = options.model ?? env.GEMINI_MODEL;

  try {
    const model = getGeminiClient().getGenerativeModel({
      model: modelName,
      systemInstruction: options.systemPrompt,
    });

    const result = await model.generateContent(options.userPrompt);
    const text = result.response.text();

    if (!text?.trim()) {
      throw new AppError('AI returned an empty response', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return { text: text.trim(), model: modelName };
  } catch (error) {
    if (error instanceof AppError) throw error;

    const message = error instanceof Error ? error.message : 'Gemini request failed';
    throw new AppError(`AI service unavailable: ${message}`, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
