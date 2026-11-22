"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/utils";

/**
 * Toasts for success/failure, with an optional action (e.g. "Undo").
 *   const toast = useToast();
 *   toast({ message: "Saved", action: { label: "Undo", onClick: undo } });
 * Announced politely to screen readers (errors assertively).
 */
type ToastInput = {
  message: string;
  type?: "success" | "error" | "info";
  action?: { label: string; onClick: () => void };
  duration?: number;
};
type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<(t: ToastInput) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (t: ToastInput) => {
      const id = nextId.current++;
      setItems((all) => [...all.slice(-3), { ...t, id }]);
      setTimeout(() => dismiss(id), t.duration ?? (t.action ? 7000 : t.type === "error" ? 6000 : 3500));
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex flex-col items-center gap-2 p-4 sm:items-end">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-[0_20px_40px_-16px_rgba(30,26,23,.6)] motion-safe:animate-[toast-in_.25s_ease-out]",
              t.type === "error" ? "bg-[#b42318] text-white" : "bg-ink text-cream",
            )}
          >
            <Icon name={t.type === "error" ? "close" : "check"} size={18} className={t.type === "error" ? "" : "text-mustard"} />
            <p className="flex-1">{t.message}</p>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
                className="min-h-10 rounded-full px-3 font-semibold text-mustard hover:bg-cream/10"
              >
                {t.action.label}
              </button>
            )}
            <button type="button" onClick={() => dismiss(t.id)} className="-mr-1 inline-flex size-9 items-center justify-center rounded-full hover:bg-cream/10" aria-label="Dismiss">
              <Icon name="close" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
