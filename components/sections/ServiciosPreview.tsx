"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { servicios } from "@/data/servicios";
import PiezaGlyph from "@/components/ui/PiezaGlyph";
import EtiquetaVertical from "@/components/ui/EtiquetaVertical";
import Resaltado from "@/components/ui/Resaltado";
import { fadeUp, staggerChildren } from "@/lib/motion-variants";

/**
 * Servicios en la home: el texto manda desde la izquierda y las tarjetas
 * de los 3 planes ocupan la derecha, en una fila — tres planes, tres
 * tarjetas, sin un cuarto elemento que no cuadre con el título.
 *
 * El Diagnóstico FORST va aparte, debajo: no es un plan que se elige,
 * es la herramienta para decidir cuál — por eso lleva un tratamiento
 * distinto (borde, no relleno) en vez de sumarse como una cuarta
 * tarjeta igual a las otras.
 *
 * Regla de color: el canela no se usa como fondo de tarjeta — los tres
 * colores de fondo son verde, marfil y plomo, los mismos de sus paneles
 * en /servicios (Presencia, Operación, Estructura).
 */

type Paleta = "verde" | "marfil" | "plomo";

type Casilla = {
  href: string;
  titulo: string;
  bajada: string;
  pieza: 0 | 1 | 2;
  paleta: Paleta;
};

const PLANES: Casilla[] = [
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
          // El marfil es casi el mismo hueso de la página: el anillo solo
          // no alcanza en pantallas anchas, con más aire alrededor para
          // que se pierda. La sombra le da profundidad real, no depende
          // de que el color contraste.
          paleta === "marfil"
            ? "ring-1 ring-inset ring-[var(--forst-line)] shadow-[0_4px_20px_rgba(0,46,44,0.10)]"
            : ""
        }`}
        style={{ background: fondo }}
      >
        <span className="relative flex items-start justify-between">
          <span className="w-8 h-8 md:w-9 md:h-9">
            <PiezaGlyph
              pieza={casilla.pieza}
              stroke={icono}
              filled
              className="w-full h-full"
            />
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

/** El Diagnóstico no es un cuarto plan — es la herramienta para elegir
 * entre los tres. Por eso va aparte, con borde en vez de relleno: se lee
 * como una franja de ayuda, no como una tarjeta más de la misma fila. */
function DiagnosticoBanner() {
  return (
    <motion.div variants={fadeUp}>
      <Link
        href="/servicios#diagnostico"
        className="group relative flex items-center gap-5 md:gap-6 rounded-2xl border border-[var(--forst-line)] px-6 py-5 md:px-8 md:py-6 hover:border-[var(--forst-green)]/40 hover:bg-[var(--forst-tint)] transition-colors"
      >
        <span className="shrink-0 w-9 h-9 md:w-10 md:h-10">
          {/* Lupa, no una pieza del isotipo: el Diagnóstico es la parte
              de "revisar tu negocio", no un servicio más, así que no
              comparte el lenguaje geométrico de las 3 piezas de arriba
              (ni repite el logo, que ya está en todos lados). */}
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill="none"
            aria-hidden
          >
            <circle
              cx="10.5"
              cy="10.5"
              r="6.5"
              stroke="var(--forst-green)"
              strokeWidth="1.6"
            />
            <path
              d="M15.5 15.5L20 20"
              stroke="var(--forst-green)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block t-h3 text-[var(--forst-green)]">
            Diagnóstico FORST
          </span>
          <span className="block mt-1 text-[13.5px] leading-snug text-black/65">
            Empieza por acá si no sabes cuál de los tres te conviene
          </span>
        </span>

        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="shrink-0 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          <path
            d="M7 17L17 7M17 7H9M17 7V15"
            stroke="var(--forst-green)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </Link>
    </motion.div>
  );
}

export default function ServiciosPreview() {
  return (
    <section className="relative seccion">
      <div className="relative max-w-[104rem] mx-auto px-6 md:px-10 flex gap-8 lg:gap-14">
        <EtiquetaVertical className="pt-2">Servicios</EtiquetaVertical>
        <div className="min-w-0 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Columna de texto */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="min-w-0 lg:col-span-5 lg:sticky lg:top-32"
          >
            <h2>
              <span className="block t-air text-[var(--forst-green)]">
                Tres planes
              </span>
              <span
                className="block t-air-caps t-air-caps-lg mt-4 text-[var(--forst-black)]"
                // t-air-caps fija font-weight:500 y le gana en cascada a
                // las utilidades de peso de Tailwind (mismo problema de
                // especificidad que ya documenta esa clase para el
                // tamaño) — con el tracking tan abierto, ese peso medio
                // se ve más liviano/gris de lo que es. Inline sí gana
                // siempre, sin pelearse con la cascada.
                style={{ fontWeight: 650 }}
              >
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

          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Los 3 planes, en fila — el vertical apilado era para el
                acordeón de /servicios, no para acá. */}
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid sm:grid-cols-3 gap-px bg-[var(--forst-line)] rounded-2xl overflow-hidden ring-1 ring-[var(--forst-line)]"
            >
              {PLANES.map((c) => (
                <Tarjeta key={c.href} casilla={c} />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <DiagnosticoBanner />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

