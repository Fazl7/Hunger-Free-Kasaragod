"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons/Icon";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";

const primary = [
  { href: "/programs", key: "programs" },
  { href: "/impact", key: "impact" },
  { href: "/food-rescue", key: "foodRescue" },
  { href: "/gallery", key: "gallery" },
  { href: "/press", key: "press" },
] as const;

const secondary = [
  { href: "/about", key: "about" },
  { href: "/make-an-impact", key: "makeAnImpact" },
  { href: "/ledger", key: "ledger" },
  { href: "/request-help", key: "requestHelp" },
  { href: "/volunteer", key: "volunteer" },
  { href: "/contact", key: "contact" },
] as const;

export function Header({ trustBar }: { trustBar?: string | null }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation (state-during-render pattern, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Drawer: Escape closes, focus trapped inside, body scroll locked.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(drawer.current?.querySelectorAll<HTMLElement>("a,button") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const [first, last] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {trustBar && (
        <div className="bg-ink text-center text-xs font-medium tracking-wide text-cream/90">
          <p className="container-page py-2">{trustBar}</p>
        </div>
      )}
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
          scrolled ? "bg-cream/90 shadow-[0_8px_30px_-18px_rgba(30,26,23,.45)] backdrop-blur-md" : "bg-cream",
        )}
      >
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="rounded-lg text-maroon" aria-label={`${t("meta.siteName")}, ${t("common.home")}`}>
            <Logo label={t("meta.siteName")} sub="Live to Smile Foundation" compact />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center rounded-full px-3.5 text-[0.95rem] font-medium text-ink transition-colors hover:text-maroon",
                      "after:absolute after:inset-x-3.5 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-mustard after:transition-transform after:duration-300 hover:after:scale-x-100",
                      isActive(item.href) && "text-maroon after:scale-x-100",
                    )}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden sm:block"><LanguageToggle className="text-ink" /></span>
            <Link
              href="/donate"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-mustard px-3.5 text-[0.95rem] sm:px-5 font-semibold text-ink shadow-[0_6px_18px_-8px_rgba(242,183,5,.95)] transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              <Icon name="heart" size={18} className="hidden min-[400px]:block" />
              {t("common.donateShort")}
            </Link>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
            >
              <Icon name="menu" />
              <span className="sr-only">{t("common.menu")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-ink/50 transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        ref={drawer}
        role="dialog"
        aria-modal="true"
        aria-label={t("common.menu")}
        inert={!open}
        className={cn(
          "on-dark fixed inset-y-0 right-0 z-[70] flex w-[min(22rem,88vw)] flex-col overflow-y-auto bg-maroon p-6 text-cream transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => { setOpen(false); menuBtn.current?.focus(); }}
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-cream/10"
          >
            <Icon name="close" />
            <span className="sr-only">{t("common.close")}</span>
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {[...primary, ...secondary].map((item, i) => (
              <li
                key={item.href}
                className={cn("transition-[opacity,transform] duration-500", open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0")}
                style={{ transitionDelay: open ? `${80 + i * 35}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex min-h-12 items-center justify-between rounded-xl px-3 font-display text-xl hover:bg-cream/10 aria-[current=page]:text-mustard"
                >
                  {t(`nav.${item.key}`)}
                  <Icon name="arrowRight" size={18} className="opacity-50" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/donate"
          className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-mustard px-6 font-semibold text-ink"
        >
          <Icon name="heart" size={18} />
          {t("common.donate")}
        </Link>
      </div>
    </>
  );
}
