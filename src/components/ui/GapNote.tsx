import type { ReactNode } from "react";
import { showGaps } from "@content/site.config";
import { cn } from "@/lib/utils";

/**
 * Clearly marked "content gap" placeholder. Visible in development (or with
 * NEXT_PUBLIC_SHOW_CONTENT_GAPS=true) so the owner can see what is missing;
 * renders NOTHING in production.
 */
export function GapNote({ children, className }: { children: ReactNode; className?: string }) {
  if (!showGaps) return null;
  return (
    <div
      role="note"
      data-content-gap
      className={cn(
        "rounded-2xl border-2 border-dashed border-gap/70 bg-[repeating-linear-gradient(135deg,#fff7ed_0_10px,#ffedd5_10px_20px)] p-4 text-sm text-[#7c2d12]",
        className,
      )}
    >
      <strong className="mr-1 font-semibold uppercase tracking-wide">Content gap:</strong>
      {children}
      <span className="mt-1 block text-xs opacity-80">Hidden in production · see CONTENT_GAPS.md</span>
    </div>
  );
}
