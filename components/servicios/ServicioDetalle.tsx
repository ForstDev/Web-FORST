"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Servicio } from "@/data/servicios";
import PiezaGlyph from "@/components/ui/PiezaGlyph";
import RevealImage from "@/components/animations/RevealImage";
import IsotipoWatermark from "@/components/animations/IsotipoWatermark";
import Star from "@/components/ui/Star";
import { staggerChildren, fadeUp } from "@/lib/motion-variants";

export default function ServicioDetalle({
  servicio,
  index,
}: {
  servicio: Servicio;
  index: number;
}) {
  const waHref = `https://wa.me/51962316856?text=${encodeURIComponent(
    `Hola FORST, me interesa el servicio de ${servicio.titulo}.`
  )}`;

  return (
    <section
      id={servicio.slug}
      className="border-t border-[var(--forst-line)] scroll-mt-20"
    >
      <div className="max-w-[104rem] mx-auto px-6 md:px-10 py-14 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        {/* Columna izquierda: identidad del servicio (sticky) */}
        <div className="md:col-span-4">
          <div className="relative md:sticky md:top-28 overflow-hidden rounded-2xl border border-[var(--forst-line)] p-7 md:p-8">
            <div className="absolute -right-14 -bottom-16 w-64 h-64 opacity-[0.07] pointer-events-none">
              <IsotipoWatermark color="var(--forst-green)" strokeWidth={1.2} direction={index % 2 === 0 ? 1 : -1} duration={80} className="w-full h-full" />
            </div>
            <PiezaGlyph
              pieza={index as 0 | 1 | 2}
              filled
              stroke="var(--forst-green)"
              className="relative w-24 h-24 md:w-28 md:h-28 opacity-[0.85] select-none"
            />
            <div className="relative flex items-center gap-2.5 flex-wrap">
              <p className="text-[11px] tracking-[0.07em] uppercase text-[var(--forst-green)]">
                Plan {servicio.numero}/03
              </p>
              {servicio.destacado && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--forst-tan)]/25 px-2.5 py-0.5 text-[10px] tracking-[0.05em] uppercase text-[var(--forst-green)]">
                  <Star className="w-2 h-2 shrink-0" color="currentColor" />
                  Plan estrella
                </span>
              )}
            </div>
            <h2
              lang="es"
              className="relative mt-4 font-display font-medium text-2xl md:text-3xl text-black break-words hyphens-auto"
            >
              {servicio.titulo}
            </h2>
            <p className="relative mt-2 text-sm font-medium text-[var(--forst-green)]">
              {servicio.herramienta}
            </p>
            <p className="relative mt-3 text-sm text-black/55 leading-relaxed max-w-xs">
              {servicio.resumen}
            </p>
            {servicio.entrega && (
              <p className="relative mt-4 flex items-center gap-2 text-[12px] text-black/45">
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                {servicio.entrega}
              </p>
            )}
          </div>
        </div>

        {/* Columna derecha: el detalle */}
        <div className="md:col-span-8">
          <div className="relative">
            <RevealImage
              src={servicio.imagen}
              alt={servicio.imagenAlt}
              className="w-full aspect-[16/9] mb-10 ring-1 ring-[var(--forst-line)]"
            />
            <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[11px] tracking-[0.05em] uppercase text-black/60 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
              <Star className="w-2.5 h-2.5 shrink-0" color="var(--forst-green)" />
              {servicio.herramienta}
            </span>
          </div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="text-lg md:text-xl text-black/75 leading-relaxed"
          >
            {servicio.descripcion}
          </motion.p>

          <div className="mt-10">
            <p className="text-[11px] tracking-[0.07em] uppercase text-black/45 mb-3">
              Qué incluye
            </p>
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="grid sm:grid-cols-2 gap-3"
            >
              {servicio.incluye.map((item, i) => (
                <motion.div
                  key={item}
                  variants={fadeUp}
                  className="flex items-start gap-3 rounded-xl border border-[var(--forst-line)] p-4 text-[14px] text-black/75 hover:border-[var(--forst-tan)] transition-colors"
                >
                  <span className="font-display text-xs text-black/25 shrink-0 mt-0.5">
                    0{i + 1}
                  </span>
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mt-10">
            <p className="text-[11px] tracking-[0.07em] uppercase text-black/45 mb-3">
              Para quién es
            </p>
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              {servicio.paraQuien.map((p) => (
                <motion.p
                  key={p}
                  variants={fadeUp}
                  className="inline-flex items-center gap-2.5 rounded-full border border-[var(--forst-line)] bg-[var(--forst-tint)] px-4 py-2 text-[13px] text-black/70 leading-snug"
                >
                  <Star className="w-2.5 h-2.5 shrink-0" color="var(--forst-green)" />
                  {p}
                </motion.p>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--forst-green)] text-white px-7 py-3.5 text-sm uppercase tracking-wide hover:bg-[var(--forst-green-soft)] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:translate-x-1 transition-transform" />
              {servicio.ctaTexto}
            </a>
            <Link
              href="/contacto"
              className="group relative text-sm text-black/60 hover:text-black transition-colors"
            >
              O escríbenos por formulario
              <span className="absolute -bottom-1 left-0 h-px w-full bg-[var(--forst-green)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
