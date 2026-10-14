"use client";

import { EVENTO_ABRIR_COOKIES } from "@/components/analytics/CookieConsent";

/** Reabre el aviso de cookies para cambiar la elección. */
export default function BotonConfigurarCookies({
  className,
  children = "Cambiar mi elección de cookies",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR_COOKIES))}
      className={
        className ??
        "inline-flex items-center gap-3 rounded-full border border-[var(--forst-green)] px-5 py-2.5 text-[13px] font-medium text-[var(--forst-green)] hover:bg-[var(--forst-tint)] transition-colors"
      }
    >
      {children}
    </button>
  );
}
