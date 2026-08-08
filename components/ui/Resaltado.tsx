"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion-variants";

/**
 * El resaltador de "hechas para crecer." (Manifiesto), reutilizable: una
 * franja canela se dibuja de izquierda a derecha detrás del texto en
 * cursiva, como si alguien lo subrayara al leerlo. Pensado para frases
 * cortas que hoy no tienen fondo propio — viven sobre el hueso general de
 * la página — y necesitan ese mismo peso sin convertirse en una tarjeta.
 */
export default function Resaltado({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: EASE, delay }}
        className="absolute -inset-y-[0.05em] -inset-x-[0.08em] bg-[var(--forst-tan)] origin-left"
      />
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.4, ease: EASE, delay: delay + 0.35 }}
        className="relative italic font-semibold text-black"
      >
        {children}
      </motion.span>
    </span>
  );
}
