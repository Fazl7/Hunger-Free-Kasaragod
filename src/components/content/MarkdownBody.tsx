import { Fragment, type ReactNode } from "react";
import { parseMarkdown, type Inline } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/**
 * <MarkdownBody source={text} />
 * Renders press-release text: paragraphs, headings, bold/italic, links, lists
 * and quotes. Built from a parsed tree into React elements (never innerHTML), so
 * pasted content is always safe. Works on the server and in the admin preview.
 */
function renderInline(nodes: Inline[]): ReactNode[] {
  return nodes.map((n, i) => {
    switch (n.t) {
      case "text":
        return <Fragment key={i}>{n.v}</Fragment>;
      case "br":
        return <br key={i} />;
      case "strong":
        return <strong key={i} className="font-semibold text-ink">{renderInline(n.c)}</strong>;
      case "em":
        return <em key={i}>{renderInline(n.c)}</em>;
      case "link": {
        const external = /^https?:\/\//i.test(n.href);
        return (
          <a
            key={i}
            href={n.href}
            className="font-medium text-maroon underline decoration-mustard decoration-2 underline-offset-4 hover:decoration-maroon"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {renderInline(n.c)}
          </a>
        );
      }
    }
  });
}

export function MarkdownBody({ source, className }: { source: string; className?: string }) {
  const blocks = parseMarkdown(source);
  return (
    <div className={cn("space-y-5 text-lg leading-relaxed text-ink", className)}>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}>{renderInline(b.c)}</p>;
          case "h":
            return b.level === 2 ? (
              <h2 key={i} className="pt-4 text-2xl leading-tight font-semibold sm:text-3xl">{renderInline(b.c)}</h2>
            ) : (
              <h3 key={i} className="pt-2 text-xl leading-snug font-semibold">{renderInline(b.c)}</h3>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc space-y-2 pl-6 marker:text-mustard">
                {b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-maroon">
                {b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-4 border-mustard pl-5 font-display text-xl text-ink-soft italic">
                {renderInline(b.c)}
              </blockquote>
            );
        }
      })}
    </div>
  );
}
