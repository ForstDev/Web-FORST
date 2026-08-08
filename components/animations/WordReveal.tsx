"use client";

import { motion } from "motion/react";
import { wordReveal, wordItem } from "@/lib/motion-variants";

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
  const trigger = inView
    ? { whileInView: "visible" as const, viewport: { once: true, amount: 0.6 } }
    : { animate: "visible" as const };

  return (
    <motion.span
      variants={wordReveal}
      initial="hidden"
      {...trigger}
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
