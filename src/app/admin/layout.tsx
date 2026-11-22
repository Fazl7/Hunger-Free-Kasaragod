import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { fraunces, poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { AdminAuthProvider } from "@/components/admin/AdminAuth";
import { ToastProvider } from "@/components/admin/Toast";
import { ConfirmProvider } from "@/components/admin/ConfirmDialog";

/**
 * Admin root layout: English only, outside the locale system, never indexed
 * (meta robots here + X-Robots-Tag header in next.config.ts), never linked from
 * the public site. Its JavaScript is a separate route bundle, so public pages
 * never download any admin code.
 */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · HFK Admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#7A1F1F", width: "device-width", initialScale: 1 };

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(fraunces.variable, poppins.variable)}>
      <body className="min-h-dvh bg-cream">
        <AdminAuthProvider>
          <ToastProvider>
            <ConfirmProvider>{children}</ConfirmProvider>
          </ToastProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
