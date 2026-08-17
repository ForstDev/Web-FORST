"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import { EASE } from "@/lib/motion-variants";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/portafolio", label: "Casos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

/** Sube arriba con Lenis; si ya estás en esa ruta, Next no hace nada por
 * su cuenta (no hay navegación), así que forzamos el scroll a mano. */
function irArriba(pathname: string, href: string, e: React.MouseEvent) {
  if (pathname === href) {
    e.preventDefault();
    window.__lenis?.scrollTo(0, { duration: 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/** El menú móvil, extraído de Header para que también lo pueda abrir el
 * header dentro del marco del Hero en Inicio — un solo componente, sin
 * duplicar el overlay verde en dos archivos. */
export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // AnimatePresence necesita una `key` estable para seguirle el
          // rastro a lo que entra y sale: sin ella no completaba la salida
          // y el overlay quedaba montado para siempre, invisible pero
          // tapando la página, y al reabrir reutilizaba ese nodo muerto.
          key="menu-movil"
          initial={{ opacity: 0, pointerEvents: "none" }}
          animate={{ opacity: 1, pointerEvents: "auto" }}
          // Al tocar un link, la navegación de Next re-renderiza el árbol
          // en medio de la animación de salida y AnimatePresence se queda
          // sin quitar el nodo: el overlay permanecía montado, ya
          // invisible, pero interceptando cada toque en el centro de la
          // pantalla — la página se veía normal y no respondía a nada.
          // `pointerEvents` viaja en el propio `exit` (y no en `style`,
          // que queda congelado con el valor del último render abierto)
          // para que deje de capturar eventos apenas empieza a cerrarse.
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[80] bg-[var(--forst-green)] text-white flex flex-col md:hidden"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <span className="flex items-center gap-2.5">
              <AnimatedLogo
                size={38}
                color="var(--forst-white)"
                bg="var(--forst-green)"
                animateOnMount={false}
              />
              <span className="font-logo text-lg tracking-[0.04em]">
                FORST
              </span>
            </span>
            <button
              onClick={onClose}
              aria-label="Cerrar menú"
              className="w-10 h-10 relative"
            >
              <span className="absolute inset-0 m-auto w-6 h-[2px] bg-white rotate-45" />
              <span className="absolute inset-0 m-auto w-6 h-[2px] bg-white -rotate-45" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
            {enlaces.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12 + i * 0.07, duration: 0.5, ease: EASE }}
              >
                <Link
                  href={l.href}
                  onClick={(e) => {
                    onClose();
                    irArriba(pathname, l.href, e);
                  }}
                  className="font-display text-3xl py-2 flex items-center gap-4"
                >
                  <span className="w-2 h-2 rotate-45 bg-[var(--forst-tan)]" />
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="px-8 pb-10 text-sm text-white/60">
            <p>Lima, Perú</p>
            <a href="mailto:forst.pe@outlook.com" className="hover:text-white">
              forst.pe@outlook.com
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
