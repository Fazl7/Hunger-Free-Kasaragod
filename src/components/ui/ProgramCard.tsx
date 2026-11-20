import type { Program, ProgramTone } from "@content/programs";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons/Icon";
import { Tilt } from "@/components/motion/Tilt";
import { cn, tr } from "@/lib/utils";

export const toneClasses: Record<ProgramTone, { card: string; icon: string; tag: string; dark: boolean }> = {
  maroon: { card: "bg-maroon text-cream", icon: "bg-cream text-maroon", tag: "bg-ink/25 text-cream", dark: true },
  navy: { card: "bg-navy text-cream", icon: "bg-mustard text-ink", tag: "bg-ink/25 text-cream", dark: true },
  purple: { card: "bg-purple text-cream", icon: "bg-cream text-purple", tag: "bg-ink/25 text-cream", dark: true },
  mustard: { card: "bg-mustard text-ink", icon: "bg-maroon text-cream", tag: "bg-ink/10 text-ink", dark: false },
  leaf: { card: "bg-leaf text-cream", icon: "bg-cream text-leaf", tag: "bg-ink/25 text-cream", dark: true },
};

export function ProgramCard({ program, locale, headingLevel = 3 }: { program: Program; locale: string; headingLevel?: 2 | 3 }) {
  const tone = toneClasses[program.tone];
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <Tilt>
      <Link
        href={`/programs/${program.slug}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] p-7 shadow-[0_20px_40px_-28px_rgba(30,26,23,.7)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-28px_rgba(30,26,23,.8)]",
          tone.card,
          tone.dark && "on-dark",
        )}
      >
        {/* pointer-follow sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(400px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,248,231,.16),transparent_45%)]"
        />
        <span aria-hidden className="absolute -right-8 -bottom-8 opacity-[0.08] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
          <Icon name={program.icon} size={170} strokeWidth={1.2} />
        </span>

        <span className={cn("flex size-14 items-center justify-center rounded-2xl", tone.icon)}>
          <Icon name={program.icon} size={28} />
        </span>
        <H className="mt-6 text-2xl font-semibold">{tr(program.name, locale)}</H>
        {program.stat && (
          <p className="mt-1 text-sm font-semibold opacity-90">
            {program.stat.value} {tr(program.stat.label, locale)}
          </p>
        )}
        <p className="mt-3 flex-1 leading-relaxed opacity-90">{tr(program.summary, locale)}</p>
        <div className="mt-6 flex items-center justify-between gap-3">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", tone.tag)}>
            <Icon name="pin" size={14} />
            {tr(program.areas, locale)}
          </span>
          <span aria-hidden className="flex size-10 items-center justify-center rounded-full border border-current/30 transition-transform duration-300 group-hover:translate-x-1">
            <Icon name="arrowRight" size={18} />
          </span>
        </div>
      </Link>
    </Tilt>
  );
}
