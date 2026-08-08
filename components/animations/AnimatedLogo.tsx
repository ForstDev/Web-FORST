"use client";

import { motion, Variants } from "motion/react";
import {
  petals,
  PETAL_R,
  CUSHION_PATH,
  DIAMOND_PATH,
  VIEWBOX,
} from "./logo-geometry";

/**
 * Isotipo FORST como piezas independientes (4 pétalos + cojín + diamante),
 * fiel a la geometría del archivo oficial, para poder animar el ensamblaje
 * y la reacción al hover. Para usos estáticos de marca sigue existiendo el
 * SVG oficial en /public/assets/logo.
 */

type PetalCustom = { x: number; y: number; i: number; speed: number };
type PieceCustom = { speed: number };

/** `speed` estira delay/mass en el mismo spring — 1 = ensamblaje normal
 * (header, footer), >1 = más lento y pausado (p.ej. el cierre del CTA). */
const petalVariants: Variants = {
  hidden: ({ x, y }: PetalCustom) => ({
    x: x * 70,
    y: y * 70,
    scale: 0.4,
    opacity: 0,
  }),
  visible: ({ i, speed }: PetalCustom) => ({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.07 * speed,
      type: "spring",
      stiffness: 150,
      damping: 16,
      mass: 0.8 * speed,
    },
  }),
  hover: ({ x, y }: PetalCustom) => ({
    x: x * 5,
    y: y * 5,
    transition: { type: "spring", stiffness: 320, damping: 14 },
  }),
};

const cushionVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: ({ speed }: PieceCustom) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.38 * speed,
      type: "spring",
      stiffness: 170,
      damping: 15,
      mass: speed,
    },
  }),
};

const diamondVariants: Variants = {
  hidden: { scale: 0, rotate: -135, opacity: 0 },
  visible: ({ speed }: PieceCustom) => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      delay: 0.52 * speed,
      type: "spring",
      stiffness: 180,
      damping: 14,
      mass: speed,
    },
  }),
  hover: {
    rotate: 90,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

const centered = {
  transformBox: "fill-box",
  transformOrigin: "center",
} as const;

export default function AnimatedLogo({
  size = 96,
  color = "var(--forst-green)",
  bg = "var(--forst-white)",
  className = "",
  animateOnMount = true,
  triggerOnView = false,
  speed = 1,
}: {
  size?: number;
  /** Color de pétalos y diamante. */
  color?: string;
  /** Color del cojín central — debe coincidir con el fondo donde vive el logo. */
  bg?: string;
  className?: string;
  animateOnMount?: boolean;
  /** En vez de ensamblar al montar, ensambla la primera vez que entra al viewport. */
  triggerOnView?: boolean;
  /** Multiplicador de duración del ensamblaje — 1 = normal, más alto = más lento. */
  speed?: number;
}) {
  const viewTrigger = triggerOnView
    ? { whileInView: "visible" as const, viewport: { once: true, amount: 0.7 } }
    : { animate: "visible" as const };

  return (
    <motion.svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      width={size}
      height={size}
      className={className}
      initial={animateOnMount || triggerOnView ? "hidden" : "visible"}
      {...viewTrigger}
      whileHover="hover"
      role="img"
      aria-label="Isotipo FORST"
    >
      {petals.map((p, i) => (
        <motion.circle
          key={p.id}
          cx={p.cx}
          cy={p.cy}
          r={PETAL_R}
          fill={color}
          custom={{ x: p.dir.x, y: p.dir.y, i, speed }}
          variants={petalVariants}
          style={centered}
        />
      ))}
      <motion.path
        d={CUSHION_PATH}
        fill={bg}
        custom={{ speed }}
        variants={cushionVariants}
        style={centered}
      />
      <motion.path
        d={DIAMOND_PATH}
        fill={color}
        custom={{ speed }}
        variants={diamondVariants}
        style={centered}
      />
    </motion.svg>
  );
}
