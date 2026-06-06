import type { AiInteraction } from '@prisma/client';

export interface AiInteractionDto {
  id: string;
  feature: string;
  prompt: string;
  response: string;
  sessionId: string | null;
  model: string | null;
  latencyMs: number | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AskIshanResponseDto {
  id: string;
  sessionId: string;
  message: string;
  reply: string;
  model: string;
}

export function mapAiInteractionToDto(record: AiInteraction): AiInteractionDto {
  return {
    id: record.id,
    feature: record.feature,
    prompt: record.prompt,
    response: record.response,
    sessionId: record.sessionId,
    model: record.model,
    latencyMs: record.latencyMs,
    metadata: (record.metadata as Record<string, unknown> | null) ?? null,
    createdAt: record.createdAt.toISOString(),
  };
}
