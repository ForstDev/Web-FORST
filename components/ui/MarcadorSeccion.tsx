/**
 * El marcador que abre cada sección. Antes era un rombo de 8px con una
 * etiqueta de 11px, y a esa escala no separaba nada: se leía como un
 * detalle perdido, no como el inicio de un capítulo.
 *
 * Ahora tiene tres piezas con jerarquía: el rombo de marca, la etiqueta
 * con más cuerpo y tracking, y una línea que se extiende hacia la
 * derecha. La línea es la que hace el trabajo de "separador": ocupa
 * ancho real en vez de depender del largo del texto.
 *
 * Sin animación propia a propósito. Aparece en todas las secciones del
 * sitio, y un elemento que se repite tanto no gana nada con moverse; la
 * entrada ya la da la sección que lo contiene. Además, animarlo desde
 * `scale: 0` lo dejaba invisible si la animación no llegaba a correr.
 */
export default function MarcadorSeccion({
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
  // Sobre hueso el canela no contrasta, así que el rombo va en verde;
  // sobre fondo oscuro sí puede ir en canela y ahí resalta.
  const rombo = oscuro ? "var(--forst-tan)" : "var(--forst-green)";
  const etiqueta = oscuro ? "rgba(247,246,242,0.85)" : "var(--forst-green)";
  const linea = oscuro ? "rgba(247,246,242,0.22)" : "rgba(0,46,44,0.18)";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span
        aria-hidden
        className="w-3 h-3 shrink-0 rotate-45"
        style={{ background: rombo }}
      />
      <span
        className="text-[13px] font-medium uppercase leading-none whitespace-nowrap"
        style={{ color: etiqueta, letterSpacing: "0.18em" }}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="h-px flex-1"
        style={{ background: linea }}
      />
    </div>
  );
}
