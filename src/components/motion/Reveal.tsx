import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Server component. Marks an element for the global <RevealObserver/>.
 * Content is fully visible without JS (the hidden state only applies under
 * `html.js`), so SEO and no-JS users always get the content.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  variant?: "up" | "fade" | "scale";
}) {
  return (
    <Tag
      data-reveal={variant}
      className={cn(className)}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
