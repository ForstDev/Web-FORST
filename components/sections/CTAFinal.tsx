"use client";

import Link from "next/link";
import { motion } from "motion/react";
import WordReveal from "@/components/animations/WordReveal";
import DiamondField from "@/components/animations/DiamondField";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import { fadeUp } from "@/lib/motion-variants";

export default function CTAFinal() {
  return (
    <section className="py-14 md:py-22">
      <div className="max-w-[104rem] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-[var(--forst-green)] text-white overflow-hidden rounded-2xl px-8 py-16 md:px-16 md:py-16 lg:px-24"
        >
          <DiamondField
            color="255,255,255"
            spacing={60}
            baseAlpha={0.09}
            maxAlpha={0.5}
            baseSize={4.1}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10 md:gap-10">
            <div className="md:max-w-[62%]">
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.07em] uppercase text-white/50 mb-5"
              >
                <span className="w-2 h-2 rotate-45 bg-[var(--forst-tan)] inline-block" />
                El siguiente paso
              </motion.p>

              <h2 className="font-display font-medium uppercase text-[clamp(2rem,5.2vw,4.4rem)] leading-[1.06] text-pretty">
                <WordReveal text="¿Hablamos de" inView />
                <span className="text-white/55">
                  <WordReveal text="tu negocio?" inView />
                </span>
              </h2>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-xs text-white/50"
              >
                Respuesta el mismo día. Sin compromiso.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.45 }}
                className="mt-6 flex flex-wrap items-center gap-4"
              >
                <a
                  href="https://wa.me/51962316856?text=Hola%20FORST%2C%20quiero%20conversar%20sobre%20mi%20negocio."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-white text-[var(--forst-green)] px-8 py-4 text-sm font-medium uppercase tracking-wide hover:bg-white/90 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--forst-green)] group-hover:translate-x-1 transition-transform" />
                  Escríbenos por WhatsApp
                </a>
                <Link
                  href="/contacto"
                  className="group inline-flex items-center gap-3 rounded-full border border-white/50 text-white px-8 py-4 text-sm uppercase tracking-wide hover:bg-white hover:text-[var(--forst-green)] transition-colors"
                >
                  O cuéntanos por formulario
                </Link>
              </motion.div>
            </div>

            {/* El isotipo que se ensambla al llegar aquí con scroll — el
                sello de FORST cerrando la página, lento para que se note.
                Vive en su propia columna con aire real a los costados,
                nunca pegado al texto ni al borde de la tarjeta. */}
            <div className="flex md:flex-1 items-center justify-center opacity-90">
              <AnimatedLogo
                size={192}
                color="var(--forst-white)"
                bg="var(--forst-green)"
                triggerOnView
                speed={4}
                className="w-20 h-20 md:w-[144px] md:h-[144px] lg:w-[192px] lg:h-[192px]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
