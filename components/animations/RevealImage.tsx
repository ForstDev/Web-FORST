"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Imagen con revelado editorial: cortina que sube + la imagen asienta
 * su escala. Limpio y sobrio — la imagen es la protagonista, no el
 * efecto. Reemplaza al antiguo revelado pixelado.
 *
 * La transición corre en CSS puro (no Framer Motion) a propósito: con
 * scroll de Lenis + columnas `sticky` (como en ServicioDetalle), el
 * `whileInView` de Framer a veces nunca disparaba y la imagen se
 * quedaba clippeada a 0 para siempre — el "cuadro en blanco" que
 * reportó el usuario. Un IntersectionObserver nativo + un listener de
 * scroll de respaldo, combinados con `transition` de CSS, no dependen
 * de que el scheduler de Framer llegue a correr.
 */
export default function RevealImage({
  src,
  alt = "",
  className = "",
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  /** true para imágenes above-the-fold (carga inmediata). */
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const enPantalla = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.9 && r.bottom > 0;
    };

    if (enPantalla()) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);

    const onScroll = () => {
      if (enPantalla()) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
        io.disconnect();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Si quien llama ya pasa su propio "absolute" (p.ej. para llenar un
  // contenedor con aspect-ratio), no forzamos "relative" — Tailwind no
  // garantiza qué clase de "position" gana cuando las dos conviven en el
  // mismo elemento, y en la práctica "relative" ganaba, dejando este div
  // sin position:absolute real y por lo tanto con altura 0 (la imagen
  // interna es la que está absolutamente posicionada, así que si este
  // div pierde su propio position, no tiene nada que le dé alto).
  const posClass = /\b(absolute|fixed)\b/.test(className) ? "" : "relative";

  return (
    <div
      ref={ref}
      className={`${posClass} overflow-hidden rounded-xl ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover select-none"
        style={{
          clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          transform: visible ? "scale(1)" : "scale(1.08)",
          transition:
            "clip-path 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}
