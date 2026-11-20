import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Icon, type IconKey } from "@/components/icons/Icon";

type Variant = "primary" | "donate" | "outline" | "ghost" | "light";

const base =
  "group/btn relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.95rem] font-semibold leading-tight " +
  "transition-[transform,background-color,color,box-shadow] duration-200 ease-[cubic-bezier(.22,1,.36,1)] active:scale-[0.97] " +
  "motion-safe:hover:-translate-y-0.5";

const variants: Record<Variant, string> = {
  primary: "bg-maroon text-cream shadow-[0_6px_20px_-8px_rgba(122,31,31,.7)] hover:bg-maroon-deep",
  donate: "bg-mustard text-ink shadow-[0_6px_20px_-8px_rgba(242,183,5,.9)] hover:bg-[#ffc81a]",
  outline: "border-2 border-maroon text-maroon hover:bg-maroon hover:text-cream",
  ghost: "text-maroon hover:bg-maroon/5",
  light: "border-2 border-cream/70 text-cream hover:bg-cream hover:text-ink",
};

type Common = { variant?: Variant; icon?: IconKey; children: ReactNode; className?: string };

export function ButtonLink({
  variant = "primary",
  icon,
  children,
  className,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {icon && <Icon name={icon} size={18} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  icon,
  children,
  className,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], "disabled:opacity-60", className)} {...rest}>
      {children}
      {icon && <Icon name={icon} size={18} />}
    </button>
  );
}

export function ExternalButton({ variant = "primary", icon, children, className, ...rest }: Common & ComponentProps<"a">) {
  return (
    <a className={cn(base, variants[variant], className)} target="_blank" rel="noopener noreferrer" {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </a>
  );
}
