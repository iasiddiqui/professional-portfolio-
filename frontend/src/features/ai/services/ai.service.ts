import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import type { AskIshanPayload, AskIshanResponse } from '@/features/ai/types/ai.types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function aiRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const json = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !json.success) {
    throw new Error(json.message ?? `AI request failed (${response.status})`);
  }

  return json.data;
}

export const aiService = {
  askIshan(payload: AskIshanPayload) {
    return aiRequest<AskIshanResponse>(API_ENDPOINTS.public.ai.ask, payload);
  },
};
