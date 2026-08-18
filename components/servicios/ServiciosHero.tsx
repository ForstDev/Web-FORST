"use client";

import { motion } from "motion/react";
import WordReveal from "@/components/animations/WordReveal";
import { fadeUp } from "@/lib/motion-variants";

/**
 * Encabezado de /servicios. No repite los 3 planes en un índice propio:
 * ya bajan como filas numeradas justo debajo, así que un segundo listado
 * acá arriba era la misma información dos veces seguidas.
 */
export default function ServiciosHero() {
  return (
    <section className="max-w-[104rem] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-14 md:pb-20">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="t-eyebrow flex items-center gap-3 text-black/50 mb-7"
      >
        <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
        Servicios
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
        <h1 className="lg:col-span-7 t-h1 text-balance">
          <span className="text-[var(--forst-black)]">
            <WordReveal text="Tres planes, un mismo" />
          </span>
          <span className="text-[var(--forst-green)]">
            <WordReveal text="punto de llegada." />
          </span>
        </h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          className="lg:col-span-5 t-lead measure text-black/60"
        >
          De tu primera página web al rediseño completo de cómo trabaja tu
          empresa. Cada plan corresponde a una etapa distinta, así que
          eliges según el momento en el que está tu negocio hoy. Los tres
          quedan funcionando desde el día uno, y seguimos contigo después
          del lanzamiento.
        </motion.p>
      </div>
    </section>
  );
}
