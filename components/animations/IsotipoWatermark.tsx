"use client";

import { motion } from "motion/react";
import {
  petals,
  PETAL_R,
  CUSHION_PATH,
  DIAMOND_PATH,
  VIEWBOX,
} from "@/components/animations/logo-geometry";

/**
 * El isotipo completo, en línea, como marca de agua decorativa grande —
 * no se dibuja (ya está armado), solo gira lento en el fondo de una
 * tarjeta para darle peso de marca sin competir con el texto.
 */
export default function IsotipoWatermark({
  className = "",
  color = "currentColor",
  strokeWidth = 1,
  direction = 1,
  duration = 60,
}: {
  className?: string;
  color?: string;
  strokeWidth?: number;
  /** 1 gira en sentido horario, -1 antihorario. */
  direction?: 1 | -1;
  duration?: number;
}) {
  return (
    <motion.svg
      aria-hidden
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className={className}
      animate={{ rotate: 360 * direction }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {petals.map((p) => (
        <circle
          key={p.id}
          cx={p.cx}
          cy={p.cy}
          r={PETAL_R}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      ))}
      <path d={CUSHION_PATH} fill="none" stroke={color} strokeWidth={strokeWidth} />
      <path d={DIAMOND_PATH} fill="none" stroke={color} strokeWidth={strokeWidth} />
    </motion.svg>
  );
}
