import { YouTubeFacade } from "./YouTubeFacade";
import { cn } from "@/lib/utils";

/** Gallery card: 16:9 facade + title underneath. */
export function VideoCard({
  id,
  title,
  playLabel,
  large = false,
  className,
}: {
  id: string;
  title: string;
  playLabel: string;
  large?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white p-2 ring-1 ring-ink/8 transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(122,31,31,.55)]",
        className,
      )}
    >
      <YouTubeFacade id={id} title={title} playLabel={playLabel} large={large} />
      <h3 className={cn("px-3 pt-3 pb-2 leading-snug font-semibold text-ink", large ? "text-xl" : "line-clamp-2 text-base")}>{title}</h3>
    </article>
  );
}
