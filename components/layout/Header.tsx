"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, useTransform } from "motion/react";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import MobileMenu from "@/components/layout/MobileMenu";
import BotonSignIn from "@/components/layout/BotonSignIn";
import { progresoLogo } from "@/lib/logo-scroll";
import { LETRAS } from "@/lib/forst-letras";

/**
 * Header fijo con navegación en "píldoras" agrupadas. Al inicio flota
 * transparente sobre la página y al hacer scroll pasa a blanco sólido.
 *
 * En Inicio el logo no está arriba del todo: el nombre gigante del Hero
 * es el logo. Al hacer scroll ese nombre viaja hasta acá, y el logo real
 * aparece en el último tramo del viaje (lee `progresoLogo`, que escribe
 * el Hero). El "FORST" de este logo lleva el id `logo-header-texto`
 * porque es el punto de llegada que mide el Hero. En todo el sitio se
 * dibuja igual que el nombre del Hero ya aterrizado: verde, Lexend Giga
 * en peso 400 y la misma caja por letra (LETRAS), así el relevo no se nota.
 *
 * Textos en plomo carbón (#191919): sobre el marfil, el gris al 65 % se
 * leía débil.
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

const enlaceBase =
  "px-3 xl:px-4 py-2 rounded-full text-[13px] uppercase tracking-wide transition-colors flex items-center gap-2";
const enlaceInactivo = "text-[var(--forst-black)] hover:text-[var(--forst-green)] hover:bg-black/[0.04]";
const enlaceActivo = "text-[var(--forst-green)] font-medium";

/** `portal`: si el portal de clientes está activo (lo decide el servidor
 * según sus variables de entorno). Sin portal no hay botón Sign in. */
export default function Header({ portal = false }: { portal?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Logo de Inicio, atado al viaje del nombre del Hero. Solo recibe
  // clics cuando ya se ve.
  const opLogo = useTransform(progresoLogo, [0.94, 1], [0, 1]);
  const opTexto = useTransform(progresoLogo, (p) => (p >= 0.999 ? 1 : 0));
  const escalaIsotipo = useTransform(progresoLogo, [0.9, 1], [0.4, 1]);
  const giroIsotipo = useTransform(progresoLogo, [0.9, 1], [-90, 0]);
  const clicLogo = useTransform(progresoLogo, (p) => (p >= 0.94 ? "auto" : "none"));
  // En Inicio el borde inferior del header espera a que el nombre se
  // acople: si no, la línea le cruza las letras en pleno viaje.
  const [acoplado, setAcoplado] = useState(() => progresoLogo.get() >= 0.98);
  useMotionValueEvent(progresoLogo, "change", (p) => setAcoplado(p >= 0.98));

  // La página de un caso (Casos > DFG/VELKAI) es una experiencia propia,
  // sin el chrome del sitio encima — cada caso trae su propia
  // caracterización de fondo/colores, y el header rompía esa inmersión.
  const enCasoDetalle = /^\/portafolio\/[^/]+\/?$/.test(pathname);
  // El portal de clientes trae su propia barra (cliente, cerrar sesión).
  const enPortal = pathname.startsWith("/clientes");
  const enHome = pathname === "/";

  // El menú se cierra solo al tocar un link, pero si esa navegación
  // llegara a interrumpir el cierre, quedaría abierto sobre la página
  // nueva. Cerrarlo también al cambiar de ruta lo deja siempre en un
  // estado coherente, venga el cambio de donde venga (link, botón atrás).
  // Ajustado durante el render y no en un efecto: es el patrón que React
  // recomienda para estado derivado de un valor que cambia.
  const [rutaDelMenu, setRutaDelMenu] = useState(pathname);
  if (rutaDelMenu !== pathname) {
    setRutaDelMenu(pathname);
    setOpen(false);
  }

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 32));

  const pillBase = scrolled
    ? "bg-black/[0.05]"
    : "bg-white/80 backdrop-blur-md border border-[var(--forst-line)]";

  if (enCasoDetalle || enPortal) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto] xl:grid-cols-[1fr_auto_1fr] px-6 md:px-10 transition-colors duration-500 ${
          scrolled
            ? `py-3 bg-white border-b ${enHome && !acoplado ? "border-transparent" : "border-[var(--forst-line)]"}`
            : "py-4 bg-transparent border-b border-transparent"
        }`}
      >
        <motion.div
          className="lg:justify-self-start"
          // Valores explícitos fuera de Inicio: si solo se quitara el
          // estilo, Motion dejaría puesta la última opacidad (0) al navegar
          // desde Inicio a otra página.
          style={{ pointerEvents: enHome ? clicLogo : "auto" }}
        >
          <Link
            href="/"
            onClick={(e) => irArriba(pathname, "/", e)}
            aria-label="FORST, ir al inicio"
            className="flex items-center gap-2.5 group"
          >
            <motion.span
              className="block"
              style={{
                opacity: enHome ? opLogo : 1,
                scale: enHome ? escalaIsotipo : 1,
                rotate: enHome ? giroIsotipo : 0,
              }}
            >
              <AnimatedLogo size={40} animateOnMount={false} />
            </motion.span>
            {/* Misma caja que el nombre del Hero (leading, relleno y ancho
                por letra), a 18 px: unos 79 px de ancho en total. Como al
                llegar coinciden píxel a píxel, el relevo es seco en p = 1:
                un fundido cruzado mostraba dos "FORST" desfasados. */}
            <motion.span
              id="logo-header-texto"
              className="font-logo text-[18px] leading-[0.8] pt-[0.04em] whitespace-nowrap text-[var(--forst-green)]"
              style={{ fontVariationSettings: '"wght" 400', opacity: enHome ? opTexto : 1 }}
            >
              {LETRAS.map((l) => (
                <span key={l.ch} className="inline-block text-center" style={{ width: `${l.ancho}em` }}>
                  {l.ch}
                </span>
              ))}
            </motion.span>
          </Link>
        </motion.div>

        {/* Navegación principal, centrada entre el logo y el CTA. */}
        <nav className={`hidden lg:flex items-center rounded-full p-1 transition-colors duration-500 lg:justify-self-center ${pillBase}`}>
          {grupoPrincipal.map((l, i) => {
            const active = pathname.startsWith(l.href);
            return (
              <span key={l.href} className="flex items-center">
                {i > 0 && <span className="w-px h-4 bg-black/10" />}
                <Link
                  href={l.href}
                  onClick={(e) => irArriba(pathname, l.href, e)}
                  className={`${enlaceBase} ${active ? enlaceActivo : enlaceInactivo}`}
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
        </nav>

        <div className="hidden lg:flex items-center gap-3 lg:justify-self-end">
          {portal && <BotonSignIn fondo={pillBase} />}
          <nav className={`flex items-center rounded-full p-1 transition-colors duration-500 ${pillBase}`}>
            <Link
              href="/contacto"
              onClick={(e) => irArriba(pathname, "/contacto", e)}
              className={`${enlaceBase} ${pathname.startsWith("/contacto") ? enlaceActivo : enlaceInactivo}`}
            >
              {pathname.startsWith("/contacto") && (
                <motion.span
                  layoutId="nav-diamond"
                  className="w-[6px] h-[6px] rotate-45 bg-[var(--forst-tan)]"
                />
              )}
              Contacto
            </Link>
          </nav>

          <a
            href="https://wa.me/51962316856?text=Hola%20FORST%2C%20quiero%20conversar%20sobre%20mi%20negocio."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full text-[13px] font-medium uppercase tracking-wide px-5 py-3 bg-[var(--forst-green)] text-white hover:bg-[var(--forst-green-soft)] transition-colors duration-300"
          >
            Conversemos
          </a>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          {portal && <BotonSignIn fondo={pillBase} />}
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="flex flex-col justify-center items-end gap-1.5 w-10 h-10"
          >
            <span className="block w-6 h-[2px] bg-[var(--forst-black)]" />
            <span className="block w-4 h-[2px] bg-[var(--forst-black)]" />
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
