"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { EASE } from "@/lib/motion-variants";

const CLAVE = "forst-cookies";

type Eleccion = "aceptado" | "rechazado";

/**
 * El aviso vive en una esquina, chico, sin overlay ni bloquear el resto
 * de la página — visible pero no invasivo. Google Analytics no se
 * inyecta hasta que el visitante toca "Aceptar"; si rechaza o no
 * responde, el sitio funciona exactamente igual, solo que sin medir.
 */
export default function CookieConsent() {
  // null = todavía no sabemos (primera visita, o el servidor sin
  // acceso a localStorage). Se resuelve recién en el cliente para no
  // generar un mismatch de hidratación.
  const [eleccion, setEleccion] = useState<Eleccion | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (guardado === "aceptado" || guardado === "rechazado") setEleccion(guardado);
    setListo(true);
  }, []);

  const elegir = (valor: Eleccion) => {
    localStorage.setItem(CLAVE, valor);
    setEleccion(valor);
  };

  return (
    <>
      {eleccion === "aceptado" && <GoogleAnalytics />}

      <AnimatePresence>
        {listo && eleccion === null && (
          <motion.div
            key="aviso-cookies"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[90] rounded-2xl border border-[var(--forst-line)] bg-[var(--forst-white)] p-5 shadow-[0_8px_32px_rgba(0,46,44,0.14)]"
          >
            <p className="text-[13px] leading-relaxed text-black/70">
              Este sitio usa cookies para mejorar tu experiencia de
              navegación.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <button
                onClick={() => elegir("aceptado")}
                className="rounded-full bg-[var(--forst-green)] text-white px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide hover:bg-[var(--forst-green-soft)] transition-colors"
              >
                Aceptar
              </button>
              <button
                onClick={() => elegir("rechazado")}
                className="rounded-full border border-[var(--forst-line)] px-5 py-2.5 text-[12px] font-medium uppercase tracking-wide text-black/65 hover:text-black hover:border-black/30 transition-colors"
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
