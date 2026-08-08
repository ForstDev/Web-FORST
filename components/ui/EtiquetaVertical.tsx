/**
 * El nombre de la sección rotado contra el borde izquierdo, leyendo de
 * abajo hacia arriba. Reemplaza al marcador horizontal en las secciones
 * del registro aireado: deja de consumir una línea encima del titular y
 * pasa a ser un margen tipográfico, que es lo que le da a la composición
 * el aire de la referencia.
 *
 * Se oculta por debajo de `lg`: en pantallas angostas no hay margen
 * lateral que lo sostenga, y rotar texto ahí solo lo vuelve ilegible.
 */
export default function EtiquetaVertical({
  children,
  tono = "claro",
  className = "",
}: {
  children: React.ReactNode;
  /** "claro" = sobre hueso · "oscuro" = sobre verde o negro */
  tono?: "claro" | "oscuro";
  className?: string;
}) {
  const oscuro = tono === "oscuro";
  const color = oscuro ? "rgba(247,246,242,0.72)" : "rgba(0,46,44,0.66)";
  const linea = oscuro ? "rgba(247,246,242,0.22)" : "rgba(0,46,44,0.2)";
  const rombo = oscuro ? "var(--forst-tan)" : "var(--forst-green)";

  return (
    <div
      className={`hidden lg:flex flex-col items-center gap-5 shrink-0 ${className}`}
    >
      <span
        aria-hidden
        className="w-2.5 h-2.5 rotate-45 shrink-0"
        style={{ background: rombo }}
      />
      <span
        className="t-vertical text-[12px] font-medium uppercase whitespace-nowrap"
        style={{ color, letterSpacing: "0.24em" }}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="w-px flex-1 min-h-16"
        style={{ background: linea }}
      />
    </div>
  );
}
