import type { GitHubLanguageStat } from '@/features/github/types/github.types';

interface GitHubLanguagesProps {
  languages: GitHubLanguageStat[];
}

export function GitHubLanguages({ languages }: GitHubLanguagesProps) {
  if (languages.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-sm text-muted-foreground">
        No language data available.
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="mb-4 text-lg font-semibold tracking-tight">Top languages</h3>
      <div className="mb-5 flex h-3 overflow-hidden rounded-full bg-muted/40">
        {languages.map((language) => (
          <div
            key={language.name}
            style={{
              width: `${language.percentage}%`,
              backgroundColor: language.color ?? '#737373',
            }}
            title={`${language.name} ${language.percentage}%`}
          />
        ))}
      </div>
      <div className="space-y-3">
        {languages.slice(0, 8).map((language) => (
          <div key={language.name} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: language.color ?? '#737373' }}
              />
              <span>{language.name}</span>
            </div>
            <span className="text-muted-foreground">{language.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
