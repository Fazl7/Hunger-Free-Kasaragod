import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons/Icon";
import { excerpt } from "@/lib/markdown";
import { formatLongDate, pick } from "@/lib/format";
import type { PressReleaseRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type PressCardData = Pick<
  PressReleaseRow,
  "slug" | "title_en" | "title_ml" | "body_en" | "body_ml" | "photo_thumb_url" | "photo_url" | "photo_alt" | "release_date" | "place"
>;

/** Blog-style card: photo, "21 November 2026 · Kasaragod", title, excerpt. */
export function PressCard({
  item,
  locale,
  readMore,
  headingLevel = 2,
  className,
}: {
  item: PressCardData;
  locale: string;
  readMore: string;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const title = pick(item.title_en, item.title_ml, locale);
  const body = pick(item.body_en, item.body_ml, locale);
  const photo = item.photo_thumb_url ?? item.photo_url;
  const H = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-ink/8 transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(122,31,31,.55)]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-deep">
        {photo ? (
          <Image
            src={photo}
            alt={item.photo_alt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        ) : (
          <div aria-hidden className="grain flex size-full items-center justify-center text-maroon/30">
            <Icon name="book" size={64} strokeWidth={1.2} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-ink-soft">
          <time dateTime={item.release_date}>{formatLongDate(item.release_date, locale)}</time>
          {item.place && <> · {item.place}</>}
        </p>
        <H className="mt-2 text-xl leading-snug font-semibold text-ink">
          <Link href={`/press/${item.slug}`} className="after:absolute after:inset-0 hover:text-maroon">
            {title}
          </Link>
        </H>
        <p className="mt-3 line-clamp-3 flex-1 text-[0.95rem] text-ink-soft">{excerpt(body, 160)}</p>
        <span aria-hidden className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon">
          {readMore} <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
