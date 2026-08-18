"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const GA_ID = "G-DE1J3QFREE";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Solo se monta cuando CookieConsent confirma que el visitante aceptó —
 * nunca se inyecta este script sin ese permiso.
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const primeraVez = useRef(true);

  // Next.js navega entre páginas sin recargar el documento, así que
  // gtag nunca se entera sola de un cambio de ruta. La primera vista ya
  // la manda `gtag('config', ...)` al cargar el script; acá mandamos el
  // resto a mano, salteando esa primera para no duplicarla.
  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: pathname });
    }
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
