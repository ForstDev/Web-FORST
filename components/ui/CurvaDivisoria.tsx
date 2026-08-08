/**
 * Divisoria de sección con la curva cóncava del cojín del isotipo:
 * la transición blanco→verde no es una línea recta, es la firma
 * geométrica de FORST. Se coloca como primer hijo de la sección verde.
 */
export default function CurvaDivisoria({
  fill = "var(--forst-white)",
  className = "",
}: {
  fill?: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={`w-full leading-none ${className}`}>
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block w-full h-10 md:h-[72px]"
      >
        <path d="M0 0 H1440 V72 Q720 6 0 72 Z" fill={fill} />
      </svg>
    </div>
  );
}
