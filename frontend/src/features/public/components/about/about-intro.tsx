import { MapPin } from 'lucide-react';

interface AboutIntroProps {
  title: string;
  body: string;
}

export function AboutIntro({ title, body }: AboutIntroProps) {
  const paragraphs = body.split('\n\n').map((p) => p.trim()).filter(Boolean);

  return (
    <section className="glass-panel relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none absolute inset-0 linear-glow opacity-40" aria-hidden />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <h2 className="text-2xl font-semibold tracking-tight text-gradient sm:text-3xl">{title}</h2>

          <p className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground sm:justify-end">
            <MapPin className="h-4 w-4" />
            Hyderabad, India
          </p>
        </div>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-[17px] sm:leading-8">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
