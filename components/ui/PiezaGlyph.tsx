"use client";

import { motion } from "motion/react";
import {
  PETAL_R,
  CUSHION_PATH,
  DIAMOND_PATH,
  VIEWBOX,
  CENTER,
} from "@/components/animations/logo-geometry";

/**
 * Una pieza suelta del isotipo (círculo, cojín o diamante) dibujada en
 * línea. Es el glifo que identifica a cada servicio: cada servicio es
 * una pieza del sistema.
 */
export default function PiezaGlyph({
  pieza,
  className = "",
  stroke = "var(--forst-green)",
  filled = false,
}: {
  pieza: 0 | 1 | 2;
  className?: string;
  stroke?: string;
  /** Pieza rellena (masa) en vez de contorno. */
  filled?: boolean;
}) {
  const common = filled
    ? { fill: stroke, stroke: "none" as const, strokeWidth: 0 }
    : { fill: "none" as const, stroke, strokeWidth: 1.4 };

  return (
    <motion.svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className={className}
      initial={{ rotate: -8, opacity: 0 }}
      whileInView={{ rotate: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      {pieza === 0 && (
        <circle cx={CENTER} cy={CENTER} r={PETAL_R * 1.55} {...common} />
      )}
      {pieza === 1 && (
        <g
          transform={`translate(${CENTER} ${CENTER}) scale(1.55) translate(${-CENTER} ${-CENTER})`}
        >
          <path d={CUSHION_PATH} {...common} strokeWidth={1} />
        </g>
      )}
      {pieza === 2 && (
        <g
          transform={`translate(${CENTER} ${CENTER}) scale(2) translate(${-CENTER} ${-CENTER})`}
        >
          <path d={DIAMOND_PATH} {...common} strokeWidth={0.8} />
        </g>
      )}
    </motion.svg>
  );
}
