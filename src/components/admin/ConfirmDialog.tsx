"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ui } from "./ui";
import { cn } from "@/lib/utils";

/**
 * Promise-based confirmation modal built on the native <dialog>:
 * showModal() makes the rest of the page inert (focus is trapped), Escape
 * cancels, focus returns to the trigger afterwards.
 *   const confirm = useConfirm();
 *   if (await confirm({ title: "Delete entry?", danger: true })) …
 */
type ConfirmOptions = { title: string; body?: string; confirmLabel?: string; danger?: boolean };

const ConfirmContext = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelBtn = useRef<HTMLButtonElement>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback((o: ConfirmOptions) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpts(o);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  useEffect(() => {
    if (!opts || !dialog.current || dialog.current.open) return;
    dialog.current.showModal();
    cancelBtn.current?.focus(); // safe default for destructive actions
  }, [opts]);

  const close = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    dialog.current?.close();
    setOpts(null);
    returnFocus.current?.focus?.();
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="confirm-title"
        aria-describedby={opts?.body ? "confirm-body" : undefined}
        onCancel={(e) => {
          e.preventDefault();
          close(false);
        }}
        onClick={(e) => e.target === dialog.current && close(false)}
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-[var(--radius-card)] bg-cream p-0 text-ink shadow-2xl backdrop:bg-ink/50"
      >
        {opts && (
          <div className="p-6">
            <h2 id="confirm-title" className="text-2xl font-semibold">{opts.title}</h2>
            {opts.body && <p id="confirm-body" className="mt-2 text-ink-soft">{opts.body}</p>}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button ref={cancelBtn} type="button" className={cn(ui.btn, ui.outline)} onClick={() => close(false)}>
                Cancel
              </button>
              <button type="button" className={cn(ui.btn, opts.danger ? ui.danger : ui.primary)} onClick={() => close(true)}>
                {opts.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  );
}
