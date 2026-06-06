'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/constants/query-keys';
import { getErrorMessage } from '@/lib/errors';
import { settingsService } from '@/features/settings/services/settings.service';
import type { UpdateSettingsPayload } from '@/features/settings/types/settings.types';

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => settingsService.update(payload),
    onSuccess: (settings) => {
      queryClient.setQueryData(QUERY_KEYS.settings.detail, settings);
      toast.success('Settings saved successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to save settings')),
  });
}
