"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categorias, totalServicios } from "@/data/categorias";
import EtiquetaVertical from "@/components/ui/EtiquetaVertical";
import Resaltado from "@/components/ui/Resaltado";
import { fadeUp, staggerChildren } from "@/lib/motion-variants";

/**
 * Servicios en la home: el texto manda desde la izquierda y a la derecha
 * va el índice de las cinco áreas, cada una con enlace a su sección en
 * /servicios. Es un índice y no tarjetas: cinco tarjetas no arman una
 * grilla pareja, y una lista numerada se recorre de un vistazo.
 *
 * Al pasar el cursor por una fila, las otras se desenfocan un poco (la
 * misma técnica que el catálogo de /servicios) y la fila activa muestra
 * qué servicios tiene dentro.
 *
 * El Diagnóstico FORST va aparte, debajo: no es un área de servicios,
 * es la herramienta para decidir por dónde empezar.
 */

function IndiceCategorias() {
  const [encima, setEncima] = useState<string | null>(null);

  return (
    <motion.ol
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      onMouseLeave={() => setEncima(null)}
      className="border-t border-[var(--forst-line)]"
    >
      {categorias.map((c) => {
        const atenuado = encima !== null && encima !== c.slug;
        const abierto = encima === c.slug;
        return (
          <motion.li key={c.slug} variants={fadeUp} className="border-b border-[var(--forst-line)]">
            <Link
              href={`/servicios#${c.slug}`}
              onMouseEnter={() => setEncima(c.slug)}
              onFocus={() => setEncima(c.slug)}
              onBlur={() => setEncima(null)}
              className={`group grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-3 py-6 md:py-7 transition-[opacity,filter] duration-300 ${
                atenuado ? "[@media(hover:hover)]:opacity-45 [@media(hover:hover)]:blur-[1px]" : ""
              }`}
            >
              <span className="tabular-nums text-[13px] text-[var(--forst-green)]">
                {c.numero}
              </span>
              <span className="min-w-0">
                <span className="block t-h3 text-[var(--forst-black)] group-hover:text-[var(--forst-green)] transition-colors">
                  {c.nombre}
                </span>
                {/* La lista de servicios se ve siempre en táctil; con mouse
                    se despliega solo en la fila bajo el cursor. */}
                <span
                  className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    abierto
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[1fr] opacity-100 [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0"
                  }`}
                >
                  <span className="overflow-hidden">
                    <span className="block pt-2 text-[14px] leading-relaxed text-black/60 text-pretty">
                      {c.servicios.map((s) => s.nombre).join(" · ")}
                    </span>
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-3 self-center">
                <span className="hidden sm:inline tabular-nums text-[12px] text-black/45">
                  {c.servicios.length} {c.servicios.length === 1 ? "servicio" : "servicios"}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 text-[var(--forst-green)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

/** El Diagnóstico no es un área de servicios: es la herramienta para
 * elegir por dónde empezar. Por eso va aparte, con borde en vez de
 * relleno: se lee como una franja de ayuda, no como una fila más. */
function DiagnosticoBanner() {
  return (
    <Link
      href="/servicios#diagnostico"
      className="group relative flex items-center gap-5 md:gap-6 rounded-2xl border border-[var(--forst-line)] px-6 py-5 md:px-8 md:py-6 hover:border-[var(--forst-green)]/40 hover:bg-[var(--forst-tint)] transition-colors"
    >
      <span className="shrink-0 w-9 h-9 md:w-10 md:h-10">
        {/* Lupa, no una pieza del isotipo: el Diagnóstico es la parte de
            "revisar tu negocio", no un servicio más. */}
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" aria-hidden>
          <circle cx="10.5" cy="10.5" r="6.5" stroke="var(--forst-green)" strokeWidth="1.6" />
          <path d="M15.5 15.5L20 20" stroke="var(--forst-green)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block t-h3 text-[var(--forst-green)]">Diagnóstico FORST</span>
        <span className="block mt-1 text-[13.5px] leading-snug text-black/65">
          Empieza por acá si no sabes qué necesita tu negocio
        </span>
      </span>

      <ArrowUpRight
        aria-hidden
        className="shrink-0 w-4 h-4 text-[var(--forst-green)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
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
                Cinco áreas
              </span>
              <span
                className="block t-air-caps t-air-caps-lg mt-4 text-[var(--forst-black)]"
                // t-air-caps fija font-weight:500 y le gana en cascada a
                // las utilidades de peso de Tailwind; inline sí gana.
                style={{ fontWeight: 650 }}
              >
                un solo equipo
              </span>
            </h2>

            <p className="t-lead mt-7 measure text-black/65">
              {totalServicios} servicios, desde la página web hasta el sistema
              que ordena tu operación. Puedes pedir uno suelto o un plan
              completo que junte varios.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed measure text-black/70">
              Todo{" "}
              <Resaltado>queda funcionando desde el día uno</Resaltado>, y
              seguimos contigo después del lanzamiento.
            </p>

            <Link
              href="/servicios"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[var(--forst-green)] text-white px-8 py-4 text-[12px] font-medium uppercase transition-[background-color,transform] duration-200 hover:bg-[var(--forst-green-soft)] active:scale-[0.98]"
              style={{ letterSpacing: "0.18em" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--forst-tan)] group-hover:translate-x-1 transition-transform" />
              Ver servicios y planes
            </Link>
          </motion.div>

          <div className="lg:col-span-7 flex flex-col gap-8">
            <IndiceCategorias />
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
