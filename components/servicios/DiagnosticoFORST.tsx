"use client";

import { motion } from "motion/react";
import DiamondField from "@/components/animations/DiamondField";
import IsotipoWatermark from "@/components/animations/IsotipoWatermark";
import { fadeUp, staggerChildren } from "@/lib/motion-variants";

/**
 * El Diagnóstico FORST — la "puerta de entrada" antes de un plan grande.
 * Vive aparte de los 3 planes porque no es un plan, es cómo empieza la
 * conversación con quien todavía no nos conoce.
 */

const PASOS = [
  {
    titulo: "Mapeamos",
    texto: "Toda la operación: ventas, atención, entregas, cobranza.",
  },
  {
    titulo: "Detectamos",
    texto: "Dónde se pierde tiempo y dinero.",
  },
  {
    titulo: "Proponemos",
    texto: "Qué automatizar y en qué orden.",
  },
];

export default function DiagnosticoFORST() {
  const waHref = `https://wa.me/51962316856?text=${encodeURIComponent(
    "Hola FORST, quiero el Diagnóstico FORST para mi negocio."
  )}`;

  return (
    <section
      id="diagnostico"
      className="border-t border-[var(--forst-line)] scroll-mt-28"
    >
      <div className="max-w-[104rem] mx-auto px-6 md:px-10 py-16 md:py-24">
        {/* Verde de marca, no el tinte claro: es el mismo verde que
            Resultados, así que dentro nada puede quedar calibrado para
            hueso — título, textos, tarjetas y CTA se invierten. Sin
            canela acá: sobre este verde se ve apagado, así que el acento
            es blanco puro en vez del tostado de marca. */}
        <div className="relative overflow-hidden rounded-2xl bg-[var(--forst-green)] p-8 md:p-14">
          <DiamondField
            spacing={56}
            baseAlpha={0.1}
            baseSize={2.6}
            color="247,246,242"
            className="[mask-image:radial-gradient(65%_70%_at_85%_20%,black_10%,transparent_100%)]"
          />

          {/* Marca de agua grande en la esquina — el mismo peso de marca
              que usan las tarjetas de ServicioDetalle, para que la tarjeta
              no se sienta un rectángulo verde liso con texto encima. */}
          <IsotipoWatermark
            color="var(--forst-white)"
            strokeWidth={1}
            duration={70}
            className="absolute -right-16 -bottom-20 w-72 h-72 md:w-96 md:h-96 opacity-[0.06] pointer-events-none"
          />

          <div className="relative grid md:grid-cols-12 gap-10 md:gap-14 items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="md:col-span-5"
            >
              <p className="flex items-center gap-3 text-[11px] tracking-[0.07em] uppercase text-white/55 mb-5">
                <span className="w-2 h-2 rotate-45 bg-white inline-block" />
                Puerta de entrada
              </p>
              <h2 className="font-display font-medium uppercase text-3xl md:text-4xl leading-tight text-white text-pretty">
                El Diagnóstico FORST
              </h2>
              <p className="mt-4 text-white/65 text-[15px] leading-relaxed max-w-sm">
                Nadie firma un proyecto grande sin conocernos primero. El
                diagnóstico resuelve eso: es nuestro diferencial convertido
                en un producto de entrada, descontable si después contratas
                la implementación.
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white text-[var(--forst-green)] px-7 py-3.5 text-sm uppercase tracking-wide hover:bg-white/90 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--forst-green)] group-hover:translate-x-1 transition-transform" />
                Quiero mi diagnóstico
              </a>
            </motion.div>

            {/* Mismo lenguaje que Resultados (la otra sección a sangre
                completa en este verde): línea fina arriba + número
                liviano, sin tarjeta de vidrio — las cartillas con blur
                quedaban apagadas contra este mismo fondo. */}
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="md:col-span-7 grid sm:grid-cols-3 gap-x-8 gap-y-10"
            >
              {PASOS.map((p, i) => (
                <motion.div
                  key={p.titulo}
                  variants={fadeUp}
                  whileHover="hover"
                  className="group relative pt-6"
                >
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0.4, opacity: 0.5 }}
                    variants={{ hover: { scaleX: 1, opacity: 1 } }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-px w-full origin-left bg-white/15 group-hover:bg-[var(--forst-tan)]"
                  />
                  <span
                    aria-hidden
                    className="font-display font-light text-[clamp(2rem,3.2vw,2.75rem)] leading-none tracking-[-0.02em] text-white/30 transition-colors duration-300 group-hover:text-white/55"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 font-display text-lg text-white transition-transform duration-300 group-hover:translate-x-1">
                    {p.titulo}
                  </p>
                  <p className="mt-2 text-sm text-white/65 leading-relaxed">
                    {p.texto}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
