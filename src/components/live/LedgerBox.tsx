import { Icon, isIconKey } from "@/components/icons/Icon";
import { formatCount, formatShortDate } from "@/lib/format";
import type { CountsAs } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

/**
 * <LedgerBox/>: one compact "minute box" per distribution:
 * date · quantity (+unit) · program with icon · place (· optional note).
 * Pure presentational, works in server and client components.
 */
export function LedgerBox({
  date,
  quantity,
  unit,
  countsAs,
  programName,
  programIcon,
  place,
  note,
  photoUrl,
  locale,
  fresh = false,
  className,
}: {
  date: string;
  quantity: number;
  unit: string;
  countsAs: CountsAs;
  programName: string;
  programIcon: string;
  place: string;
  note?: string | null;
  photoUrl?: string | null;
  locale: string;
  /** Briefly highlights an entry that just arrived via realtime. */
  fresh?: boolean;
  className?: string;
}) {
  const accent =
    countsAs === "kits" ? "bg-mustard-soft text-ink" : countsAs === "meals" ? "bg-maroon text-cream" : "bg-leaf/15 text-leaf";

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-2 rounded-2xl bg-white p-3.5 ring-1 ring-ink/8 transition-shadow sm:p-4",
        fresh && "ring-2 ring-mustard motion-safe:animate-[pulse_1.2s_ease-in-out_2]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <time dateTime={date} className="text-xs font-medium tracking-wide text-ink-soft uppercase">
          {formatShortDate(date, locale)}
        </time>
        <span aria-hidden className={cn("flex size-8 shrink-0 items-center justify-center rounded-xl", accent)}>
          <Icon name={isIconKey(programIcon) ? programIcon : "plate"} size={18} />
        </span>
      </div>
      <p className="font-display text-[1.7rem] leading-none font-semibold text-ink">
        <span className="tabular">{formatCount(quantity, locale)}</span>
        {unit && <span className="ml-1.5 font-sans text-sm font-medium text-ink-soft">{unit}</span>}
      </p>
      <p className="text-sm leading-snug font-medium text-maroon">{programName}</p>
      {photoUrl && (
        <a href={photoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open distribution photo: ${programName}, ${place}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={`${programName} distribution in ${place} on ${formatShortDate(date, locale)}`}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        </a>
      )}
      <p className="mt-auto flex items-center gap-1 text-sm text-ink-soft">
        <Icon name="pin" size={14} className="shrink-0" />
        <span className="truncate">{place}</span>
      </p>
      {note && <p className="line-clamp-2 border-t border-ink/8 pt-2 text-xs text-ink-soft">{note}</p>}
    </article>
  );
}
