'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { AboutModuleShell } from '@/features/admin/components/module-shells';
import { AboutHeroEditor } from '@/features/about/components/about-hero-editor';
import { AboutSectionEditor } from '@/features/about/components/about-section-editor';
import { AboutSectionFormDialog } from '@/features/about/components/about-section-form-dialog';
import { ABOUT_MODULE_CONFIG } from '@/features/about/config/about.config';
import { useKnowledgeBaseEntries } from '@/features/knowledge-base/hooks/use-knowledge-base';
import { useSettings } from '@/features/settings/hooks/use-settings';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/features/auth/providers/auth-provider';

export function AboutModuleView() {
  const { hasPermission } = useAuth();
  const canWriteSections = hasPermission(MODULE_PERMISSIONS.knowledgeBase.write);
  const canWriteHero = hasPermission(MODULE_PERMISSIONS.settings.write);

  const [formOpen, setFormOpen] = useState(false);

  const { data: settings, isLoading: settingsLoading, isError: settingsError, refetch: refetchSettings } =
    useSettings();

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: ABOUT_MODULE_CONFIG.defaultPageSize,
      category: ABOUT_MODULE_CONFIG.category,
      active: undefined,
    }),
    []
  );

  const {
    data: sectionsData,
    isLoading: sectionsLoading,
    isError: sectionsError,
    refetch: refetchSections,
  } = useKnowledgeBaseEntries(queryParams);

  const sections = useMemo(
    () => [...(sectionsData?.items ?? [])].sort((a, b) => a.title.localeCompare(b.title)),
    [sectionsData?.items]
  );

  const isLoading = settingsLoading || sectionsLoading;
  const isError = settingsError || sectionsError;

  const refetch = () => {
    void refetchSettings();
    void refetchSections();
  };

  return (
    <AboutModuleShell
      actions={
        canWriteSections ? (
          <Button variant="accent" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add section
          </Button>
        ) : undefined
      }
    >
      {isLoading ? <Loader label="Loading About content..." /> : null}

      {isError ? (
        <ErrorState
          title="Failed to load About content"
          message="Please try again."
          onRetry={() => void refetch()}
        />
      ) : null}

      {!isLoading && !isError && settings ? (
        <div className="space-y-6">
          <AboutHeroEditor
            key={settings.updatedAt}
            siteDescription={settings.siteDescription ?? ''}
            canWrite={canWriteHero}
          />

          {sections.length === 0 ? (
            <EmptyState
              title="No About sections yet"
              description="Add sections for experience, education, skills, and more."
              actionLabel={canWriteSections ? 'Add section' : undefined}
              onAction={canWriteSections ? () => setFormOpen(true) : undefined}
            />
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Page sections</h2>
              <div className="grid gap-4">
                {sections.map((section) => (
                  <AboutSectionEditor
                    key={section.id}
                    section={section}
                    canWrite={canWriteSections}
                    onDeleted={() => void refetchSections()}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      <AboutSectionFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </AboutModuleShell>
  );
}
