"use client";

import { motion } from "motion/react";
import { wordReveal, wordItem } from "@/lib/motion-variants";

/**
 * Titular que entra palabra por palabra, subiendo desde abajo.
 *
 * Al montar (el caso de los titulares de la primera pantalla) la entrada
 * es CSS: cada palabra trae su retraso en el HTML y arranca apenas el
 * navegador pinta, sin esperar a que cargue el JavaScript. Mismos tiempos
 * que antes: 0.3 s de espera y 0.06 s entre palabras.
 *
 * Con `inView` sigue siendo Motion, porque necesita saber cuándo el
 * titular entra en pantalla.
 */
export default function WordReveal({
  text,
  className = "",
  inView = false,
}: {
  text: string;
  className?: string;
  /** Si es true, anima cuando entra al viewport en vez de al montar. */
  inView?: boolean;
}) {
  const words = text.split(" ");

  if (!inView) {
    return (
      <span className={`inline-block ${className}`}>
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-top mr-[0.18em] pb-[0.18em] -mb-[0.18em]"
          >
            <span
              className="inline-block palabra-entra"
              style={{ "--retraso": `${0.3 + i * 0.06}s` } as React.CSSProperties}
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      variants={wordReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      className={`inline-block ${className}`}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-top mr-[0.18em] pb-[0.18em] -mb-[0.18em]"
        >
          <motion.span variants={wordItem} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
