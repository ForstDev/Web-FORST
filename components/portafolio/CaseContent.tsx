"use client";

import { motion } from "motion/react";
import { Caso } from "@/data/portafolio";
import PaginaMockup from "@/components/portafolio/PaginaMockup";
import EtiquetaVertical from "@/components/ui/EtiquetaVertical";
import Star from "@/components/ui/Star";
import { fadeUp, staggerChildren } from "@/lib/motion-variants";

/**
 * La página de un caso, reescrita como una sola historia en vez de tres
 * tarjetas sueltas + una demo abajo: el mockup de la página real queda
 * fijo a un lado mientras Problema/Solución/Resultado se leen apilados al
 * otro, cada uno marcado con el mismo numeral grande en contorno que usa
 * CasosDestacados en la home — así el caso individual hereda la misma
 * personalidad, no una versión más plana de sí mismo. El riel
 * EtiquetaVertical suma los márgenes que ya usa el resto del sitio, que
 * esta página nunca había tenido.
 */

const BLOQUES = [
  { key: "problema", label: "El problema" },
  { key: "solucion", label: "La solución" },
  { key: "resultado", label: "El resultado" },
] as const;

export default function CaseContent({ caso }: { caso: Caso }) {
  const claro = caso.textoClaro;
  const eyebrow = claro ? "text-white/65" : "text-black/65";
  const cuerpo = claro ? "text-white/78" : "text-black/78";
  const cuerpoSuave = claro ? "text-white/70" : "text-black/70";
  const linea = claro ? "border-white/15" : "border-[var(--forst-line)]";
  const stroke = claro ? "text-stroke-white" : "text-stroke-green";

  return (
    <div className="max-w-[104rem] mx-auto px-6 md:px-10 py-10 md:py-14 flex gap-8 lg:gap-14">
      <EtiquetaVertical tono={claro ? "oscuro" : "claro"} className="pt-2">
        El caso
      </EtiquetaVertical>

      <div className="min-w-0 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* La página real: fija a un lado mientras se lee la historia. */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 lg:sticky lg:top-28"
        >
          <p
            className={`flex items-center gap-2.5 text-[11px] tracking-[0.07em] uppercase mb-4 ${eyebrow}`}
          >
            <span
              aria-hidden
              className="w-2 h-2 rotate-45 inline-block"
              style={{ background: caso.acento }}
            />
            La página real
          </p>
          <PaginaMockup caso={caso} claro={claro} className="w-full" />
        </motion.div>

        {/* La historia: un capítulo por bloque, no una tarjeta suelta. */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 flex flex-col gap-10 md:gap-12"
        >
          {BLOQUES.map((b, i) => (
            <motion.div key={b.key} variants={fadeUp} className="relative">
              <span
                aria-hidden
                className={`absolute -top-3 right-0 font-display font-medium text-[clamp(2.75rem,5vw,3.75rem)] leading-none select-none ${stroke}`}
              >
                0{i + 1}
              </span>
              <p
                className="relative flex items-center gap-2.5 text-[11px] tracking-[0.07em] uppercase mb-4 font-semibold"
                style={{ color: caso.acento }}
              >
                <span
                  aria-hidden
                  className="w-2 h-2 rotate-45 inline-block"
                  style={{ background: caso.acento }}
                />
                {b.label}
              </p>
              <p
                className={`relative max-w-md text-[15px] md:text-base leading-relaxed border-t pt-4 ${cuerpo} ${linea}`}
              >
                {caso[b.key]}
              </p>
            </motion.div>
          ))}

          <motion.div variants={fadeUp}>
            <p className={`text-[11px] tracking-[0.07em] uppercase mb-4 ${eyebrow}`}>
              Qué entregamos
            </p>
            <ul className="flex flex-col gap-2.5">
              {caso.entregamos.map((e) => (
                <li
                  key={e}
                  className={`flex items-center gap-2.5 text-[13.5px] ${cuerpoSuave}`}
                >
                  <Star className="w-2.5 h-2.5 shrink-0" color={caso.acento} />
                  {e}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <a
              href={caso.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm uppercase tracking-wide transition-colors ${
                claro
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-[var(--forst-green)] text-white hover:bg-[var(--forst-green-soft)]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${claro ? "bg-black" : "bg-white"}`}
              />
              Visítalos en {caso.host}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
