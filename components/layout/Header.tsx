"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import MobileMenu from "@/components/layout/MobileMenu";
import { EASE } from "@/lib/motion-variants";

/**
 * Header con navegación en "píldoras" agrupadas (referencia Cofounder):
 * la barra en sí no tiene fondo — al inicio flota sobre el hero y al
 * hacer scroll pasa a blanco SÓLIDO (nada translúcido). Los grupos de
 * links llevan su propia píldora, colocados hacia la derecha pero con
 * aire (no pegados al borde).
 *
 * En Inicio, mientras estás arriba del todo, la navegación la trae el
 * marco del Hero (HeaderEnMarco, en Hero.tsx) — este header fijo recién
 * se monta cuando esa fila ya salió de la vista (el umbral se mide
 * contra su posición real, no un número fijo). Logo, nav, Contacto y el
 * CTA comparten layoutId con sus contrapartes del marco: al montar o
 * desmontar, Framer anima cada pieza desde su posición en el marco hasta
 * acá (o al revés) — un solo header transformándose, no dos cruzando en
 * opacidad.
 */

const grupoPrincipal = [
  { href: "/servicios", label: "Servicios" },
  { href: "/portafolio", label: "Casos" },
  { href: "/nosotros", label: "Nosotros" },
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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // La página de un caso (Casos > DFG/VELKAI) es una experiencia propia,
  // sin el chrome del sitio encima — cada caso trae su propia
  // caracterización de fondo/colores, y el header rompía esa inmersión.
  const enCasoDetalle = /^\/portafolio\/[^/]+\/?$/.test(pathname);
  const enHome = pathname === "/";

  // El menú se cierra solo al tocar un link, pero si esa navegación
  // llegara a interrumpir el cierre, quedaría abierto sobre la página
  // nueva. Cerrarlo también al cambiar de ruta lo deja siempre en un
  // estado coherente, venga el cambio de donde venga (link, botón atrás).
  // Ajustado durante el render y no en un efecto: es el patrón que React
  // recomienda para estado derivado de un valor que cambia, y evita el
  // render extra que provoca un setState dentro de useEffect.
  const [rutaDelMenu, setRutaDelMenu] = useState(pathname);
  if (rutaDelMenu !== pathname) {
    setRutaDelMenu(pathname);
    setOpen(false);
  }

  // En el resto del sitio el umbral es chico, nomás para pasar de
  // transparente a blanco sólido. En Inicio el umbral real es dónde
  // termina la fila de navegación del marco del Hero — se mide contra
  // su posición en el documento, no un número fijo, porque esa fila
  // cambia de alto según el viewport.
  const umbralRef = useRef(32);
  useEffect(() => {
    if (!enHome) {
      umbralRef.current = 32;
      return;
    }
    const medir = () => {
      const fila = document.getElementById("header-en-marco");
      if (fila) {
        umbralRef.current = fila.getBoundingClientRect().bottom + window.scrollY;
      }
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [enHome]);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > umbralRef.current));

  const pillBase = scrolled
    ? "bg-black/[0.05]"
    : "bg-white/80 backdrop-blur-md border border-[var(--forst-line)]";

  if (enCasoDetalle) return null;

  // En el resto del sitio este header vive montado siempre. En Inicio
  // solo se monta una vez pasado el umbral — mientras tanto es
  // HeaderEnMarco (en Hero.tsx) el que existe, y el layoutId compartido
  // es lo que conecta a los dos como si fueran uno.
  const montado = enHome ? scrolled : true;

  return (
    <>
      <AnimatePresence>
        {montado && (
          <motion.header
            key="header-fijo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] px-6 md:px-10 transition-colors duration-500 ${
              scrolled
                ? "py-3 bg-white border-b border-[var(--forst-line)]"
                : "py-4 bg-transparent border-b border-transparent"
            }`}
          >
            <motion.div layoutId="site-logo" className="md:justify-self-start">
              <Link
                href="/"
                onClick={(e) => irArriba(pathname, "/", e)}
                className="flex items-center gap-2.5 group"
              >
                <AnimatedLogo size={40} animateOnMount={false} />
                <span className="font-logo text-lg tracking-[0.04em] text-black">
                  FORST
                </span>
              </Link>
            </motion.div>

            {/* Navegación principal, centrada entre el logo y el CTA. */}
            <motion.nav
              layoutId="site-nav-pill"
              className={`hidden md:flex items-center rounded-full p-1 transition-colors duration-500 md:justify-self-center ${pillBase}`}
            >
              {grupoPrincipal.map((l, i) => {
                const active = pathname.startsWith(l.href);
                return (
                  <span key={l.href} className="flex items-center">
                    {i > 0 && <span className="w-px h-4 bg-black/10" />}
                    <Link
                      href={l.href}
                      onClick={(e) => irArriba(pathname, l.href, e)}
                      className={`px-4 py-2 rounded-full text-[13px] uppercase tracking-wide transition-colors flex items-center gap-2 ${
                        active
                          ? "text-[var(--forst-green)] font-medium"
                          : "text-black/65 hover:text-black hover:bg-black/[0.04]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-diamond"
                          className="w-[6px] h-[6px] rotate-45 bg-[var(--forst-green)]"
                        />
                      )}
                      {l.label}
                    </Link>
                  </span>
                );
              })}
            </motion.nav>

            <div className="hidden md:flex items-center gap-3 md:justify-self-end">
              <motion.nav
                layoutId="site-contacto-pill"
                className={`flex items-center rounded-full p-1 transition-colors duration-500 ${pillBase}`}
              >
                <Link
                  href="/contacto"
                  onClick={(e) => irArriba(pathname, "/contacto", e)}
                  className={`px-4 py-2 rounded-full text-[13px] uppercase tracking-wide transition-colors flex items-center gap-2 ${
                    pathname.startsWith("/contacto")
                      ? "text-[var(--forst-green)] font-medium"
                      : "text-black/65 hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  {pathname.startsWith("/contacto") && (
                    <motion.span
                      layoutId="nav-diamond"
                      className="w-[6px] h-[6px] rotate-45 bg-[var(--forst-tan)]"
                    />
                  )}
                  Contacto
                </Link>
              </motion.nav>

              <motion.a
                layoutId="site-cta"
                href="https://wa.me/51962316856?text=Hola%20FORST%2C%20quiero%20conversar%20sobre%20mi%20negocio."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full text-[13px] font-medium uppercase tracking-wide px-5 py-3 bg-[var(--forst-green)]/80 text-white backdrop-blur-md hover:bg-[var(--forst-green)] transition-colors duration-300"
              >
                Conversemos
              </motion.a>
            </div>

            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              className="md:hidden flex flex-col justify-center items-end gap-1.5 w-10 h-10"
            >
              <span className="block w-6 h-[2px] bg-black" />
              <span className="block w-4 h-[2px] bg-black" />
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
