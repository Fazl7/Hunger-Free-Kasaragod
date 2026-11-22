"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { Icon, type IconKey } from "@/components/icons/Icon";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: IconKey }[] = [
  { href: "/admin", label: "Dashboard", icon: "award" },
  { href: "/admin/ledger", label: "Ledger", icon: "kit" },
  { href: "/admin/gallery", label: "Gallery", icon: "play" },
  { href: "/admin/press", label: "Press", icon: "book" },
];

/** Route guard + layout: sidebar on desktop, sticky tabs on phones. */
export default function AdminAppLayout({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading, signOut } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!session || isAdmin === false)) router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, session, isAdmin, pathname, router]);

  if (loading || !session || !isAdmin) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-ink-soft" role="status">
        Checking your session…
      </div>
    );
  }

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="on-dark sticky top-0 hidden h-dvh flex-col bg-maroon p-5 text-cream lg:flex">
        <p className="font-display text-xl leading-tight font-semibold">Hunger Free Kasaragod</p>
        <p className="text-xs tracking-[0.14em] text-mustard uppercase">Admin</p>
        <nav aria-label="Admin" className="mt-8 flex-1">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={active(n.href) ? "page" : undefined}
                  className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-medium hover:bg-cream/10 aria-[current=page]:bg-cream aria-[current=page]:text-maroon"
                >
                  <Icon name={n.icon} size={20} /> {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="truncate text-xs text-cream/70" title={session.user.email}>{session.user.email}</p>
        <div className="mt-2 flex gap-2">
          <a href="/en" target="_blank" rel="noopener" className="flex min-h-11 flex-1 items-center justify-center gap-1 rounded-xl border border-cream/25 text-sm hover:bg-cream/10">
            <Icon name="globe" size={16} /> Site
          </a>
          <button type="button" onClick={() => void signOut()} className="min-h-11 flex-1 rounded-xl border border-cream/25 text-sm hover:bg-cream/10">
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar + tabs */}
      <header className="on-dark sticky top-0 z-40 bg-maroon text-cream lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <p className="font-display text-lg font-semibold">HFK Admin</p>
          <button type="button" onClick={() => void signOut()} className="min-h-11 rounded-full px-3 text-sm font-medium hover:bg-cream/10">
            Log out
          </button>
        </div>
        <nav aria-label="Admin">
          <ul className="grid grid-cols-4">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={active(n.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 flex-col items-center justify-center gap-0.5 border-b-[3px] border-transparent text-xs font-medium",
                    active(n.href) ? "border-mustard text-mustard" : "text-cream/85",
                  )}
                >
                  <Icon name={n.icon} size={18} /> {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl p-4 pb-28 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}
