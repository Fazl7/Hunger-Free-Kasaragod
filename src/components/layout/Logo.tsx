import { cn } from "@/lib/utils";

/** Mark: a bowl whose rim is a smile, with three wisps of steam. (Placeholder until the official logo is supplied.) */
export function LogoMark({ className, steam = true }: { className?: string; steam?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("shrink-0", className)} aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#7A1F1F" />
      <path d="M10 25h28a14 14 0 0 1-28 0z" fill="#F2B705" />
      <path d="M15.5 30c4.5 3.6 12.5 3.6 17 0" fill="none" stroke="#7A1F1F" strokeWidth="2.4" strokeLinecap="round" />
      {steam && (
        <g fill="none" stroke="#FFF8E7" strokeWidth="2.2" strokeLinecap="round">
          <path className="motion-safe:animate-steam" d="M18 19c-1.6-2 1.6-3.4 0-5.6" />
          <path className="motion-safe:animate-steam [animation-delay:.5s]" d="M24 19c-1.6-2 1.6-3.4 0-5.6" />
          <path className="motion-safe:animate-steam [animation-delay:1s]" d="M30 19c-1.6-2 1.6-3.4 0-5.6" />
        </g>
      )}
    </svg>
  );
}

export function Logo({ label, sub, className, compact = false }: { label: string; sub?: string; className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-10" />
      <span className="flex flex-col leading-none">
        <span className={cn("logo-text font-display font-semibold tracking-tight", compact ? "max-w-[7rem] text-[0.95rem] leading-tight sm:max-w-none sm:text-[1.05rem]" : "text-[1.05rem]")}>{label}</span>
        {sub && <span className={cn("mt-1 text-[0.7rem] font-medium tracking-wide opacity-75", compact && "hidden sm:block")}>{sub}</span>}
      </span>
    </span>
  );
}
