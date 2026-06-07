import { GoogleGenerativeAI } from '@google/generative-ai';

import { env, requireEnvValue } from '../config/env.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';
import { logger } from '../utils/logger.js';

let genAI: GoogleGenerativeAI | null = null;

/** Models tried in order when the primary model hits quota or rate limits. */
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'] as const;

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

function buildModelQueue(requestedModel?: string): string[] {
  const primary = requestedModel ?? env.GEMINI_MODEL;
  const fallbacks = FALLBACK_MODELS.filter((model) => model !== primary);
  return [primary, ...fallbacks];
}

function isQuotaOrRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message;
  return (
    message.includes('429') ||
    message.includes('Quota exceeded') ||
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('limit: 0')
  );
}

function toQuotaAppError(lastError: unknown): AppError {
  logger.warn('Gemini quota exhausted for all configured models', {
    meta: {
      models: buildModelQueue(),
      error: lastError instanceof Error ? lastError.message : String(lastError),
    },
  });

  return new AppError(
    'Ask Ishan AI is temporarily unavailable due to API quota limits. Please try again in a minute or use the contact form.',
    HTTP_STATUS.TOO_MANY_REQUESTS
  );
}

function toGeminiAppError(error: unknown): AppError {
  const message = error instanceof Error ? error.message : 'Gemini request failed';
  logger.error('Gemini request failed', { meta: { error: message } });
  return new AppError(
    'Ask Ishan AI is temporarily unavailable. Please try again later.',
    HTTP_STATUS.SERVICE_UNAVAILABLE
  );
}

async function generateWithModel(
  modelName: string,
  options: GeminiGenerateOptions
): Promise<GeminiGenerateResult> {
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
}

export async function generateGeminiResponse(
  options: GeminiGenerateOptions
): Promise<GeminiGenerateResult> {
  const models = buildModelQueue(options.model);
  let lastError: unknown;

  for (const modelName of models) {
    try {
      return await generateWithModel(modelName, options);
    } catch (error) {
      if (error instanceof AppError) throw error;

      if (isQuotaOrRateLimitError(error)) {
        lastError = error;
        logger.warn('Gemini model quota exceeded, trying fallback', {
          meta: { model: modelName, error: error instanceof Error ? error.message : String(error) },
        });
        continue;
      }

      throw toGeminiAppError(error);
    }
  }

  throw toQuotaAppError(lastError);
}
