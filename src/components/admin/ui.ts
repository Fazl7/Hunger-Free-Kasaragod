/** Shared class strings for the admin UI (touch-friendly: ≥44px targets, 16px inputs so iOS doesn't zoom). */
export const ui = {
  card: "rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-ink/8 sm:p-6",
  label: "flex flex-col gap-1.5 text-sm font-semibold text-ink",
  hint: "text-xs font-normal text-ink-soft",
  input:
    "min-h-12 w-full rounded-xl border border-ink/15 bg-white px-3.5 text-base font-normal text-ink placeholder:text-ink-soft/60 focus:border-maroon focus:ring-2 focus:ring-maroon/20 focus:outline-none disabled:bg-ink/5",
  textarea:
    "w-full rounded-xl border border-ink/15 bg-white p-3.5 text-base font-normal leading-relaxed text-ink placeholder:text-ink-soft/60 focus:border-maroon focus:ring-2 focus:ring-maroon/20 focus:outline-none",
  btn: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-semibold transition-colors active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  primary: "bg-maroon text-cream hover:bg-maroon-deep",
  gold: "bg-mustard text-ink hover:bg-[#ffc81a]",
  outline: "border-2 border-maroon/25 text-maroon hover:border-maroon",
  ghost: "text-maroon hover:bg-maroon/5",
  danger: "bg-[#b42318] text-white hover:bg-[#912018]",
  iconBtn: "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-30",
} as const;
