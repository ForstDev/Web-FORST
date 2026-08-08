"use client";

import { motion } from "motion/react";
import IsotipoWatermark from "@/components/animations/IsotipoWatermark";
import EtiquetaVertical from "@/components/ui/EtiquetaVertical";
import { staggerChildren, fadeUp } from "@/lib/motion-variants";

/**
 * El capítulo oscuro de la home: el mismo mensaje de "por qué FORST",
 * en números en vez de párrafos. Es el único bloque verde a sangre
 * completa antes del cierre, así que carga el peso tipográfico más
 * fuerte de la página — sobre verde, el canela por fin contrasta y se
 * usa para los datos.
 */

const DATOS = [
  {
    numero: "24–48H",
    label: "Para responder cualquier ajuste, incluso después de entregado el proyecto.",
  },
  {
    numero: "1",
    label: "Solo equipo del inicio al soporte. Tu proyecto no se subcontrata a terceros.",
  },
  {
    numero: "2",
    label: "Rubros distintos, ya transformados con la misma metodología.",
  },
  {
    numero: "100%",
    label: "Acompañamiento real después del lanzamiento.",
  },
];

export default function Resultados() {
  return (
    <section className="relative bg-[var(--forst-green)] text-white overflow-hidden">
      <div
        aria-hidden
        className="hidden lg:block absolute -right-24 top-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none opacity-[0.07]"
      >
        <IsotipoWatermark
          color="var(--forst-tan)"
          strokeWidth={1.2}
          direction={-1}
          duration={90}
          className="w-full h-full"
        />
      </div>

      <div className="relative seccion max-w-[104rem] mx-auto px-6 md:px-10 flex gap-8 lg:gap-14">
        <EtiquetaVertical tono="oscuro" className="pt-2">
          Por qué FORST
        </EtiquetaVertical>
        <div className="min-w-0 flex-1">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-8">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              <span className="block t-air text-white">No solo ejecutamos</span>
              <span className="block t-air-caps mt-4 text-white/70">
                Analizamos, estructuramos y proyectamos
              </span>
            </motion.h2>
          </div>
        </div>

        <motion.dl
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
        >
          {DATOS.map((d) => (
            <motion.div key={d.numero} variants={fadeUp} className="relative pt-6">
              <span
                aria-hidden
                className="absolute top-0 left-0 h-px w-full bg-white/15"
              />
              <dt className="font-display font-light text-[clamp(2.25rem,4vw,3.5rem)] leading-none tracking-[-0.02em] text-white">
                {d.numero}
              </dt>
              <dd className="mt-4 text-[13.5px] leading-relaxed text-white/70 max-w-[22ch]">
                {d.label}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
        </div>
      </div>
    </section>
  );
}
