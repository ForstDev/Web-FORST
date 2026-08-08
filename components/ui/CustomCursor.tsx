"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Cursor propio de FORST: un diamante (el mismo motivo que bullets,
 * indicadores de nav y flechas de CTA en todo el sitio) que sigue al
 * puntero y crece al pasar sobre algo interactivo. Con mix-blend-difference
 * se mantiene visible sobre cualquier fondo, claro u oscuro, sin lógica
 * de color por sección. Solo en punteros finos (mouse/trackpad) — en
 * touch no se monta, así que no interfiere con el tap.
 */
export default function CustomCursor() {
  const [activo, setActivo] = useState(false);
  const [hover, setHover] = useState(false);
  const [sobreTexto, setSobreTexto] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fino = window.matchMedia("(pointer: fine)").matches;
    if (!fino) return;
    // A propósito en el efecto: `matchMedia` no existe en el servidor, así
    // que si el estado inicial lo leyera directo, el primer render del
    // cliente montaría el cursor mientras el servidor no renderizó nada —
    // mismatch de hidratación. Diferirlo al efecto lo evita del todo.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivo(true);

    const mover = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const campoTexto = target.closest("input, textarea, select, [contenteditable='true']");
      setSobreTexto(!!campoTexto);
      const interactivo = target.closest(
        "a, button, [role='button'], [data-cursor-hover]"
      );
      setHover(!!interactivo && !campoTexto);
    };
    const salir = () => setVisible(false);
    const entrar = () => setVisible(true);

    window.addEventListener("mousemove", mover);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", salir);
    document.documentElement.addEventListener("mouseenter", entrar);
    return () => {
      window.removeEventListener("mousemove", mover);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", salir);
      document.documentElement.removeEventListener("mouseenter", entrar);
    };
  }, [x, y]);

  if (!activo) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy, opacity: visible && !sobreTexto ? 1 : 0 }}
      transition={{ opacity: { duration: 0.2 } }}
    >
      <motion.span
        className="block -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white"
        animate={{
          width: hover ? 30 : 7,
          height: hover ? 30 : 7,
          opacity: hover ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      />
    </motion.div>
  );
}
