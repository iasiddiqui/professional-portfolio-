'use client';

import { useMutation } from '@tanstack/react-query';

import { aiService } from '@/features/ai/services/ai.service';
import type { AskIshanPayload } from '@/features/ai/types/ai.types';

export function useAskIshan() {
  return useMutation({
    mutationFn: (payload: AskIshanPayload) => aiService.askIshan(payload),
  });
}
