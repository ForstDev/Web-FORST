import { DIAMOND_PATH, VIEWBOX, CENTER } from "@/components/animations/logo-geometry";

/**
 * No es una estrella inventada — es el diamante real del centro del
 * isotipo FORST (la pieza que queda calada dentro del cojín), la misma
 * geometría que usa el logo oficial. Nombre "Star" por cómo se le llama
 * puertas adentro, pero la forma es 100% de marca.
 */
export default function Star({
  className = "",
  color,
  scale = 1,
}: {
  className?: string;
  color?: string;
  /** Igual que en PiezaGlyph — para que el diamante pese lo mismo que
   * las otras piezas del isotipo cuando comparten tarjeta con ellas. */
  scale?: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className={className}
      fill={color ?? "currentColor"}
      aria-hidden
    >
      <g
        transform={`translate(${CENTER} ${CENTER}) scale(${scale}) translate(${-CENTER} ${-CENTER})`}
      >
        <path d={DIAMOND_PATH} />
      </g>
    </svg>
  );
}
