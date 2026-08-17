"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import WordReveal from "@/components/animations/WordReveal";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import EtiquetaVertical from "@/components/ui/EtiquetaVertical";
import Resaltado from "@/components/ui/Resaltado";
import MobileMenu from "@/components/layout/MobileMenu";
import { fadeUp, EASE } from "@/lib/motion-variants";

/**
 * El sujeto del Hero es la isla de musgo, sola, dentro del plano técnico
 * de la marca (grilla, escuadras, anillos, coordenadas de Lima).
 */

const NAV_PRINCIPAL = [
  { href: "/servicios", label: "Servicios" },
  { href: "/portafolio", label: "Casos" },
  { href: "/nosotros", label: "Nosotros" },
];

/** El header, adentro del marco: no es fijo, es la fila de arriba de la
 * misma tarjeta, y vive siempre montado (nunca se oculta) — el header
 * fijo de afuera (Header.tsx) solo existe mientras estás scrolleado más
 * allá de esta fila. Logo, nav, Contacto y el CTA comparten layoutId con
 * sus contrapartes del header fijo: cuando ese header fijo aparece o
 * desaparece, Framer anima cada pieza desde acá hasta allá (o al revés),
 * como si fuera un solo header transformándose, no dos cruzando en
 * opacidad. En mobile se reduce a logo + hamburguesa. */
function HeaderEnMarco() {
  const [open, setOpen] = useState(false);

  return (
    <div
      id="header-en-marco"
      className="flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] mb-10 md:mb-14 lg:mb-16"
    >
      <motion.div layoutId="site-logo" className="md:justify-self-start">
        <Link href="/" className="flex items-center gap-2.5">
          <AnimatedLogo size={36} animateOnMount={false} />
          <span className="font-logo text-lg tracking-[0.04em] text-black">
            FORST
          </span>
        </Link>
      </motion.div>

      <motion.nav
        layoutId="site-nav-pill"
        className="hidden md:flex items-center rounded-full p-1 border border-[var(--forst-line)] justify-self-center"
      >
        {NAV_PRINCIPAL.map((l, i) => (
          <span key={l.href} className="flex items-center">
            {i > 0 && <span className="w-px h-4 bg-black/10" />}
            <Link
              href={l.href}
              className="px-4 py-2 rounded-full text-[13px] uppercase tracking-wide text-black/65 hover:text-black hover:bg-black/[0.04] transition-colors"
            >
              {l.label}
            </Link>
          </span>
        ))}
      </motion.nav>

      <div className="hidden md:flex items-center gap-3 justify-self-end">
        <motion.nav
          layoutId="site-contacto-pill"
          className="rounded-full border border-[var(--forst-line)] p-1"
        >
          <Link
            href="/contacto"
            className="block px-4 py-2 rounded-full text-[13px] uppercase tracking-wide text-black/65 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            Contacto
          </Link>
        </motion.nav>
        <motion.a
          layoutId="site-cta"
          href="https://wa.me/51962316856?text=Hola%20FORST%2C%20quiero%20conversar%20sobre%20mi%20negocio."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full text-[13px] font-medium uppercase tracking-wide px-5 py-3 bg-[var(--forst-green)] text-white hover:bg-[var(--forst-green-soft)] transition-colors"
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

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function MarcoIsla() {
  const trazo = { duration: 1.3, ease: EASE };
  const lineas = [50, 100, 150, 200, 250, 300, 350];
  const esquinas = [
    { x: 34, y: 34, dx: 1, dy: 1 },
    { x: 366, y: 34, dx: -1, dy: 1 },
    { x: 366, y: 366, dx: -1, dy: -1 },
    { x: 34, y: 366, dx: 1, dy: -1 },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Plano técnico de fondo: grilla, escuadras y anillos, el mismo
          lenguaje geométrico del isotipo, ahora como marco en vez de
          como sujeto. */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <g stroke="var(--forst-green)" strokeWidth="1" opacity="0.07">
          {lineas.map((v) => (
            <line key={`h${v}`} x1="0" y1={v} x2="400" y2={v} />
          ))}
          {lineas.map((v) => (
            <line key={`v${v}`} x1={v} y1="0" x2={v} y2="400" />
          ))}
        </g>

        {esquinas.map((c, i) => (
          <motion.path
            key={i}
            d={`M ${c.x} ${c.y + 26 * c.dy} L ${c.x} ${c.y} L ${c.x + 26 * c.dx} ${c.y}`}
            fill="none"
            stroke="var(--forst-green)"
            strokeWidth="1.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ ...trazo, delay: 0.1 + i * 0.08 }}
          />
        ))}

        {[126, 156].map((r, i) => (
          <motion.circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="var(--forst-green)"
            strokeWidth="1"
            opacity="0.14"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...trazo, delay: 0.35 + i * 0.15 }}
          />
        ))}

        {/* Único acento canela: una mota que orbita muy lento, como el
            indicador de un instrumento que sigue vivo. */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.6, delay: 1.5 },
            rotate: { duration: 28, repeat: Infinity, ease: "linear", delay: 1.5 },
          }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle cx="200" cy="44" r="3.5" fill="var(--forst-tan)" />
        </motion.g>
      </svg>

      {/* La isla: sujeto principal, flotando dentro del marco. */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.img
          src="https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/hero-isla.webp"
          alt="Isla de musgo con una laptop, como escenario de trabajo de FORST"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
          className="w-[74%] h-auto drop-shadow-[0_30px_44px_rgba(0,46,44,0.22)]"
        />
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero-foto"
      className="relative overflow-hidden min-h-[100svh] flex items-center pt-6 pb-14 md:pt-10 md:pb-16 px-6 md:px-10"
    >
      {/* El marco tipo "web dentro de web": el hero completo, header
          incluido, vive dentro de una ventana con borde propio, en vez
          de flotar suelto sobre el hueso con el header fijo separado.
          Mismo margen que el header real (px-6 md:px-10) para que los
          bordes queden alineados. */}
      <div className="max-w-[104rem] mx-auto w-full rounded-[2rem] md:rounded-[2.5rem] border border-[var(--forst-line)] p-6 md:p-10 lg:p-14">
        <HeaderEnMarco />
        <div className="flex gap-8 lg:gap-14">
          <EtiquetaVertical className="pt-2">
            Plataforma empresarial · Lima, Perú
          </EtiquetaVertical>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Texto: arriba-izquierda, nunca centrado. */}
              {/* `min-w-0`: por defecto un item de grid no encoge por
                  debajo del ancho de su palabra más larga, así que en
                  pantallas muy angostas el titular ensanchaba la columna
                  y se salía del marco. */}
              <div className="min-w-0 lg:col-span-5">
                <h1 className="text-[var(--forst-green)]">
                  <span className="block t-air">
                    <WordReveal text="Creamos soluciones para negocios" />
                  </span>
                  <span className="block t-air-caps t-air-caps-lg mt-5 text-black/70">
                    <WordReveal text="listos para evolucionar" />
                  </span>
                </h1>

                <motion.p
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.85 }}
                  className="mt-7 measure-tight text-[15px] leading-relaxed text-black/60"
                >
                  Una plataforma empresarial{" "}
                  <Resaltado delay={1.3}>hecha a la medida</Resaltado> de tu
                  negocio. Construida desde cero, sin plantillas que ya usan
                  mil negocios más.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 1 }}
                  className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
                >
                  {/* `max-w-full` + `shrink-0` en el punto: un inline-flex
                      toma el ancho de su contenido y no encoge, así que en
                      pantallas muy angostas el botón ensanchaba la columna
                      entera. Con el tope, el texto envuelve en dos líneas
                      en vez de desbordar; donde entra, no cambia nada. */}
                  <Link
                    href="/contacto"
                    className="group inline-flex max-w-full items-center gap-3 rounded-full bg-[var(--forst-green)] text-[var(--forst-white)] px-6 sm:px-8 py-4 text-[12px] font-medium uppercase tracking-[0.12em] sm:tracking-[0.18em] transition-[background-color,transform] duration-200 hover:bg-[var(--forst-green-soft)] active:scale-[0.98]"
                  >
                    <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[var(--forst-tan)] group-hover:translate-x-1 transition-transform" />
                    Hablemos de tu negocio
                  </Link>
                  {/* `py-1.5` para llegar al mínimo de área tocable; el
                      subrayado sube a `bottom-0.5` para seguir pegado al
                      texto en vez de quedar flotando bajo el padding. */}
                  <Link
                    href="/portafolio"
                    className="group relative inline-block py-1.5 text-[13px] font-medium text-black/75 hover:text-[var(--forst-green)] transition-colors"
                  >
                    Ver casos reales
                    <span
                      aria-hidden
                      className="absolute bottom-0.5 left-0 h-px w-full bg-[var(--forst-green)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    />
                  </Link>
                </motion.div>
              </div>

              {/* El sujeto: la isla, enmarcada en el plano técnico de la
                  marca — la escena que ya funcionaba, ahora hablando el
                  idioma visual del resto del sitio. */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: EASE, delay: 0.2 }}
                className="lg:col-span-7 relative flex items-center justify-center"
              >
                <div
                  className="relative"
                  style={{
                    width: "clamp(280px, min(56vh, 84vw), 600px)",
                    height: "clamp(280px, min(56vh, 84vw), 600px)",
                  }}
                >
                  <MarcoIsla />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
