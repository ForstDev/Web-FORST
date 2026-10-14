"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { EASE } from "@/lib/motion-variants";

const CLAVE = "forst-cookies";
/** Evento para reabrir el aviso desde el footer o la política de cookies. */
export const EVENTO_ABRIR_COOKIES = "forst:abrir-cookies";

type Eleccion = "aceptado" | "rechazado";

/** Lee la elección guardada. Acepta el formato anterior (solo el texto)
 * y el actual (JSON con fecha), para no volver a preguntarle a quien ya
 * eligió con la versión previa del aviso. */
function leerEleccion(): Eleccion | null {
  const crudo = localStorage.getItem(CLAVE);
  if (!crudo) return null;
  if (crudo === "aceptado" || crudo === "rechazado") return crudo;
  try {
    const v = JSON.parse(crudo) as { valor?: string };
    return v.valor === "aceptado" || v.valor === "rechazado" ? v.valor : null;
  } catch {
    return null;
  }
}

/** Google Analytics crea `_ga` y `_ga_<ID>` en el dominio del sitio. Al
 * retirar el consentimiento hay que borrarlas en todas las variantes de
 * dominio en las que pudieron quedar. */
function borrarCookiesAnalitica() {
  const host = location.hostname;
  const dominios = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const par of document.cookie.split(";")) {
    const nombre = par.split("=")[0].trim();
    if (nombre === "_ga" || nombre.startsWith("_ga_")) {
      for (const d of dominios) {
        document.cookie = `${nombre}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
      }
    }
  }
}

/**
 * Aviso de cookies chico, en una esquina, sin bloquear la página. Google
 * Analytics no se carga hasta que la persona acepta. La elección se
 * guarda con su fecha (el reglamento de la Ley 29733 pide poder demostrar
 * cuándo se dio el consentimiento) y se puede cambiar desde el footer o
 * la política de cookies.
 */
export default function CookieConsent() {
  const [eleccion, setEleccion] = useState<Eleccion | null>(null);
  const [listo, setListo] = useState(false);
  const [reabierto, setReabierto] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEleccion(leerEleccion());
    setListo(true);
    const abrir = () => setReabierto(true);
    window.addEventListener(EVENTO_ABRIR_COOKIES, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_COOKIES, abrir);
  }, []);

  const elegir = (valor: Eleccion) => {
    const anterior = eleccion;
    localStorage.setItem(
      CLAVE,
      JSON.stringify({ valor, fecha: new Date().toISOString(), version: 2 })
    );
    setEleccion(valor);
    setReabierto(false);
    // Google Analytics no se puede descargar de una página ya cargada:
    // se borran sus cookies y se recarga para que deje de medir.
    if (anterior === "aceptado" && valor === "rechazado") {
      borrarCookiesAnalitica();
      location.reload();
    }
  };

  const visible = listo && (eleccion === null || reabierto);

  return (
    <>
      {eleccion === "aceptado" && <GoogleAnalytics />}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="aviso-cookies"
            role="region"
            aria-label="Aviso de cookies"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[90] rounded-2xl border border-[var(--forst-line)] bg-[var(--forst-white)] p-5 shadow-[0_8px_32px_rgba(0,46,44,0.14)]"
          >
            <p className="text-[13px] leading-relaxed text-black/75 text-pretty">
              Usamos cookies propias y de terceros para que el sitio funcione
              y para analizar cómo se usa. Puedes aceptar o rechazar las de
              analítica.{" "}
              <Link
                href="/politica-de-cookies"
                className="underline underline-offset-4 text-black hover:text-[var(--forst-green)]"
              >
                Política de cookies
              </Link>
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => elegir("aceptado")}
                className="flex-1 rounded-full bg-[var(--forst-green)] text-white px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide hover:bg-[var(--forst-green-soft)] transition-colors"
              >
                Aceptar
              </button>
              <button
                onClick={() => elegir("rechazado")}
                className="flex-1 rounded-full border border-[var(--forst-green)] px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide text-[var(--forst-green)] hover:bg-[var(--forst-tint)] transition-colors"
              >
                Rechazar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
