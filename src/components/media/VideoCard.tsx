import { YouTubeFacade } from "./YouTubeFacade";
import { cn } from "@/lib/utils";

/** Gallery card: video facade + title underneath. */
export function VideoCard({
  id,
  title,
  playLabel,
  large = false,
  portrait = false,
  className,
}: {
  id: string;
  title: string;
  playLabel: string;
  large?: boolean;
  portrait?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white p-2 ring-1 ring-ink/8 transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(122,31,31,.55)]",
        portrait && "md:p-3",
        className,
      )}
    >
      <YouTubeFacade
        id={id}
        title={title}
        playLabel={playLabel}
        large={large}
        portrait={portrait}
      />
      {/* Padding lives on the wrapper: inside a line-clamped box it would let part of the hidden 3rd line show through. */}
      <div className={cn("px-3 pt-3 pb-2.5", portrait && "md:px-0 md:pb-0")}>
        <h3 title={large ? undefined : title} className={cn("leading-snug font-semibold text-ink", large && !portrait ? "text-xl" : "line-clamp-2 text-base")}>
          {title}
        </h3>
      </div>
    </article>
  );
}
