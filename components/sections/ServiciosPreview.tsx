"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { servicios } from "@/data/servicios";
import PiezaGlyph from "@/components/ui/PiezaGlyph";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import EtiquetaVertical from "@/components/ui/EtiquetaVertical";
import Resaltado from "@/components/ui/Resaltado";
import { fadeUp, staggerChildren } from "@/lib/motion-variants";

/**
 * Servicios en la home: el texto manda desde la izquierda y las tarjetas
 * ocupan la derecha en tablero de ajedrez, en vez de tres columnas
 * iguales una al lado de la otra.
 *
 * La cuarta casilla la ocupa el Diagnóstico FORST: completa la grilla y
 * pone a la vista el producto de entrada, que antes solo existía dentro
 * de /servicios.
 *
 * Regla de color: el canela no se usa como fondo de tarjeta — los cuatro
 * colores de fondo son verde, marfil y plomo, los mismos tres planes de
 * /servicios (Presencia, Operación, Estructura), más verde otra vez para
 * Diagnóstico.
 */

type Paleta = "verde" | "marfil" | "plomo";

type Casilla = {
  href: string;
  titulo: string;
  bajada: string;
  /** Pieza del isotipo, o la estrella para el diagnóstico. */
  pieza: 0 | 1 | 2 | "estrella";
  paleta: Paleta;
};

const CASILLAS: Casilla[] = [
  {
    href: `/servicios#${servicios[0].slug}`,
    titulo: servicios[0].titulo,
    bajada: servicios[0].herramienta,
    pieza: 0,
    // Mismos colores que sus paneles en /servicios: Presencia verde,
    // Operación marfil, Estructura plomo — el canela ya no se usa como
    // fondo de tarjeta en ningún lado del sitio.
    paleta: "verde",
  },
  {
    href: `/servicios#${servicios[1].slug}`,
    titulo: servicios[1].titulo,
    bajada: servicios[1].herramienta,
    pieza: 1,
    paleta: "marfil",
  },
  {
    href: `/servicios#${servicios[2].slug}`,
    titulo: servicios[2].titulo,
    bajada: servicios[2].herramienta,
    pieza: 2,
    paleta: "plomo",
  },
  {
    href: "/servicios#diagnostico",
    titulo: "Diagnóstico",
    bajada: "Empieza por acá si no sabes cuál",
    pieza: "estrella",
    paleta: "verde",
  },
];

const FONDOS: Record<Paleta, string> = {
  verde: "var(--forst-green)",
  marfil: "var(--forst-white)",
  plomo: "var(--forst-black)",
};

function Tarjeta({ casilla }: { casilla: Casilla }) {
  const { paleta } = casilla;
  const fondo = FONDOS[paleta];
  const oscura = paleta === "verde" || paleta === "plomo";
  const titulo = oscura ? "var(--forst-white)" : "var(--forst-green)";
  const bajada = oscura ? "rgba(247,246,242,0.66)" : "rgba(0,46,44,0.78)";
  // Acento gráfico: canela sobre fondo oscuro (verde/plomo), verde sobre
  // marfil — ahí el canela no se lee y cae al color de marca.
  const icono = oscura ? "var(--forst-tan)" : "var(--forst-green)";

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={casilla.href}
        className={`group relative flex flex-col justify-between h-full min-h-[188px] md:min-h-[212px] p-6 md:p-8 overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${
          // El marfil es casi el mismo hueso de la página: sin este anillo
          // interno, el borde exterior de la tarjeta se pierde contra el
          // fondo de la sección.
          paleta === "marfil" ? "ring-1 ring-inset ring-[var(--forst-line)]" : ""
        }`}
        style={{ background: fondo }}
      >
        <span className="relative flex items-start justify-between">
          <span className="w-8 h-8 md:w-9 md:h-9">
            {casilla.pieza === "estrella" ? (
              // Diagnóstico no es una pieza del sistema como las otras
              // tres — es el punto de partida, así que lleva el isotipo
              // completo en vez de una sola pieza suelta (antes usaba el
              // mismo diamante que Estructura y se confundían).
              <AnimatedLogo
                size={34}
                color={icono}
                bg={fondo}
                animateOnMount={false}
                className="w-full h-full"
              />
            ) : (
              <PiezaGlyph
                pieza={casilla.pieza}
                stroke={icono}
                filled
                className="w-full h-full"
              />
            )}
          </span>

          {/* Flecha de redirección: la afordancia de "esto te lleva a
              otro lado", igual que un link de verdad — no hace falta
              clickear para saber que es clickeable. */}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <path
              d="M7 17L17 7M17 7H9M17 7V15"
              stroke={icono}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>

        <span className="relative mt-8">
          <span
            className="block t-h3"
            style={{ color: titulo }}
          >
            {casilla.titulo}
          </span>
          {/* La bajada se queda oculta hasta que pasas el mouse: la
              tarjeta se lee primero por el título, y el detalle aparece
              como una revelación, no como texto compitiendo de entrada. */}
          <span
            className="block mt-2 text-[13.5px] leading-snug opacity-0 -translate-y-1 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:translate-y-0"
            style={{ color: bajada }}
          >
            {casilla.bajada}
          </span>
        </span>

        {/* Línea que se dibuja al pasar el cursor — el mismo acento del
            marcador de sección, aplicado a la tarjeta. */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: icono }}
        />
      </Link>
    </motion.div>
  );
}

export default function ServiciosPreview() {
  return (
    <section className="relative seccion">
      <div className="relative max-w-[104rem] mx-auto px-6 md:px-10 flex gap-8 lg:gap-14">
        <EtiquetaVertical className="pt-2">Servicios</EtiquetaVertical>
        <div className="min-w-0 flex-1 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Columna de texto */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="lg:col-span-5 lg:sticky lg:top-32"
          >
            <h2>
              <span className="block t-air text-[var(--forst-green)]">
                Tres planes
              </span>
              <span className="block t-air-caps t-air-caps-lg mt-4 text-[var(--forst-black)]/80">
                un mismo punto de llegada
              </span>
            </h2>

            <p className="t-lead mt-7 measure text-black/65">
              De tu primera presencia digital al rediseño completo de la
              operación. Cada plan responde a dónde está tu negocio hoy, no a
              un catálogo de productos sueltos.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed measure text-black/70">
              Todos{" "}
              <Resaltado>quedan funcionando desde el día uno</Resaltado>, y
              seguimos contigo después del lanzamiento.
            </p>

            <Link
              href="/servicios"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[var(--forst-green)] text-white px-8 py-4 text-[12px] font-medium uppercase transition-[background-color,transform] duration-200 hover:bg-[var(--forst-green-soft)] active:scale-[0.98]"
              style={{ letterSpacing: "0.18em" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--forst-tan)] group-hover:translate-x-1 transition-transform" />
              Ver los 3 en detalle
            </Link>
          </motion.div>

          {/* Tarjetas en tablero de ajedrez, dos por fila — el vertical
              apilado era para el acordeón de /servicios, no para acá. */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-[var(--forst-line)] rounded-2xl overflow-hidden"
          >
            {CASILLAS.map((c) => (
              <Tarjeta key={c.href} casilla={c} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

