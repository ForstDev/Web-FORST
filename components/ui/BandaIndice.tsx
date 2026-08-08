/**
 * La banda que cruza la composición con el número de sección fantasma
 * detrás — el gesto más distintivo del registro aireado.
 *
 * No es decoración suelta: la banda ancla horizontalmente al sujeto de la
 * sección (el video, una imagen, un bloque) y el número da el sentido de
 * secuencia sin ocupar espacio de lectura. Va detrás del contenido, con
 * `aria-hidden`, porque no aporta nada a quien navega con lector de
 * pantalla; la numeración real vive en el texto.
 */
export default function BandaIndice({
  indice,
  tono = "claro",
  alineacion = "derecha",
  fondo = true,
  className = "",
}: {
  /** El número visible: "01", "02"… */
  indice: string;
  /** "claro" = sobre hueso · "oscuro" = sobre verde */
  tono?: "claro" | "oscuro";
  /** De qué lado se apoya el número dentro de la banda. */
  alineacion?: "derecha" | "izquierda";
  /** false = solo el numeral, sin el rectángulo de fondo — para cuando
   * el sujeto ya tiene sus propios bordes (una foto) y la banda de
   * fondo se lee como una segunda caja compitiendo con la primera. */
  fondo?: boolean;
  className?: string;
}) {
  const oscuro = tono === "oscuro";
  // Sobre hueso la banda es el verde de marca a muy baja opacidad: no es
  // un color nuevo, es el mismo verde respirando.
  const banda = oscuro ? "rgba(247,246,242,0.06)" : "rgba(0,46,44,0.055)";
  const numero = oscuro ? "rgba(247,246,242,0.16)" : "rgba(0,46,44,0.10)";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 flex items-center ${
        alineacion === "derecha" ? "justify-end" : "justify-start"
      } ${className}`}
      style={{ background: fondo ? banda : "transparent" }}
    >
      <span
        className="font-display font-light leading-none select-none px-6 md:px-12"
        style={{
          color: numero,
          fontSize: "clamp(4rem, 11vw, 11rem)",
          letterSpacing: "-0.04em",
        }}
      >
        {indice}
      </span>
    </div>
  );
}
