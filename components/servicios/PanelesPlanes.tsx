"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Servicio } from "@/data/servicios";
import PiezaGlyph from "@/components/ui/PiezaGlyph";
import Star from "@/components/ui/Star";
import { EASE } from "@/lib/motion-variants";

/**
 * Los 3 planes como filas verticales, tipo acordeón: el header (número,
 * ícono, nombre) siempre visible, los datos duros debajo también, y el
 * detalle completo se despliega en alto al pasar el mouse por la fila —
 * sin tapar a las otras ni obligar a leer en horizontal.
 *
 * Tres colores de la paleta, uno por plan: Presencia en verde, Operación
 * en marfil, Estructura en plomo.
 */

type Paleta = {
  fondo: string;
  titulo: string;
  cuerpo: string;
  meta: string;
  linea: string;
  /** Texto/número de acento — siempre un color de marca para texto
   * (verde o marfil), nunca canela. */
  acentoTexto: string;
  /** Íconos y puntos de acento — acá sí puede ser canela cuando el
   * fondo es oscuro; sobre marfil el canela no se lee, así que cae a
   * verde. */
  acentoGrafico: string;
  chip: string;
  botonFondo: string;
  botonTexto: string;
};

const PALETAS: Paleta[] = [
  {
    // Presencia — verde.
    fondo: "var(--forst-green)",
    titulo: "var(--forst-white)",
    cuerpo: "rgba(247,246,242,0.8)",
    meta: "rgba(247,246,242,0.68)",
    linea: "rgba(247,246,242,0.18)",
    acentoTexto: "var(--forst-white)",
    acentoGrafico: "var(--forst-tan)",
    chip: "rgba(247,246,242,0.08)",
    botonFondo: "var(--forst-white)",
    botonTexto: "var(--forst-green)",
  },
  {
    // Operación — marfil.
    fondo: "var(--forst-white)",
    titulo: "var(--forst-green)",
    cuerpo: "rgba(0,46,44,0.78)",
    meta: "rgba(0,46,44,0.72)",
    linea: "rgba(0,46,44,0.14)",
    acentoTexto: "var(--forst-green)",
    acentoGrafico: "var(--forst-green)",
    chip: "rgba(0,46,44,0.06)",
    botonFondo: "var(--forst-green)",
    botonTexto: "var(--forst-white)",
  },
  {
    // Estructura — plomo.
    fondo: "var(--forst-black)",
    titulo: "var(--forst-white)",
    cuerpo: "rgba(247,246,242,0.78)",
    meta: "rgba(247,246,242,0.68)",
    linea: "rgba(247,246,242,0.16)",
    acentoTexto: "var(--forst-white)",
    // Plomo es un fondo oscuro, así que acá sí puede entrar el canela
    // como acento gráfico.
    acentoGrafico: "var(--forst-tan)",
    chip: "rgba(247,246,242,0.08)",
    botonFondo: "var(--forst-white)",
    botonTexto: "var(--forst-green)",
  },
];

const springPanel = { type: "spring" as const, bounce: 0, duration: 0.62 };

function Panel({
  servicio,
  index,
  activo,
  onActivar,
}: {
  servicio: Servicio;
  index: number;
  activo: boolean;
  onActivar: () => void;
}) {
  const p = PALETAS[index];
  const waHref = `https://wa.me/51962316856?text=${encodeURIComponent(
    `Hola FORST, me interesa el plan ${servicio.titulo}.`
  )}`;

  return (
    <div
      id={servicio.slug}
      style={{ background: p.fondo }}
      className="relative overflow-hidden scroll-mt-28"
    >
      {/* Toda la fila es el control de selección — con el mouse encima
          alcanza, no hace falta clickear para ver el plan. Vive aparte
          del contenido (no lo envuelve) para que el link del CTA siga
          siendo clickeable sin anidar <a> dentro de <button>. */}
      <button
        onMouseEnter={onActivar}
        onFocus={onActivar}
        aria-expanded={activo}
        aria-label={`Plan ${servicio.titulo}`}
        className="absolute inset-0 z-20 cursor-pointer"
        style={{ pointerEvents: activo ? "none" : "auto" }}
      />

      {/* Header: número, ícono y nombre, siempre visible. */}
      <div className="relative flex items-center gap-5 md:gap-7 px-6 md:px-10 pt-7 md:pt-9">
        <span
          className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-lg shrink-0"
          style={{ background: p.chip }}
        >
          <PiezaGlyph
            pieza={index as 0 | 1 | 2}
            filled
            stroke={p.acentoGrafico}
            className="w-5 h-5"
          />
        </span>

        <div className="min-w-0 flex-1">
          <span className="t-eyebrow block" style={{ color: p.acentoTexto }}>
            {servicio.numero} / 03
          </span>
          <span
            className="t-h2 block mt-1 leading-tight"
            style={{ color: p.titulo }}
          >
            {servicio.titulo.toUpperCase()}
          </span>
        </div>

        <span
          className="shrink-0 t-eyebrow hidden md:block"
          style={{ color: p.meta }}
        >
          {activo ? "Cerrar" : "Ver plan"}
        </span>
      </div>

      {/* Datos duros: siempre visibles, sin esperar al hover. */}
      <div
        className="relative px-6 md:px-10 pt-5 pb-6 md:pb-8 mt-5 border-t"
        style={{ borderColor: p.linea }}
      >
        <p className="text-[13px] leading-relaxed" style={{ color: p.cuerpo }}>
          {servicio.herramienta}
        </p>
        {servicio.entrega && (
          <p className="mt-2 t-eyebrow" style={{ color: p.meta }}>
            {servicio.entrega}
          </p>
        )}
        {servicio.destacado && (
          <p
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.05em] uppercase"
            style={{ background: "var(--forst-green)", color: "var(--forst-white)" }}
          >
            <Star className="w-2.5 h-2.5" color="currentColor" />
            Plan estrella
          </p>
        )}
      </div>

      {/* Detalle: se despliega en alto al pasar el mouse por la fila. */}
      <AnimatePresence initial={false}>
        {activo && (
          <motion.div
            key="detalle"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springPanel}
            className="relative z-30 overflow-hidden"
          >
            <div className="px-6 md:px-10 pb-8 md:pb-10 md:flex md:items-start md:gap-10">
              {/* La foto solo existe acá, dentro del detalle — no hay
                  degradado que resolver porque no tiene que fundirse con
                  nada: es una tarjeta propia, aparece con la apertura. */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.12 }}
                className="shrink-0 w-full md:w-64 lg:w-72 aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden"
              >
                <img
                  src={servicio.imagen}
                  alt={servicio.imagenAlt}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="mt-6 md:mt-0 min-w-0 flex-1">
                <p className="t-lead measure" style={{ color: p.cuerpo }}>
                  {servicio.resumen}
                </p>

                <p className="t-eyebrow mt-8 mb-4" style={{ color: p.meta }}>
                  Qué incluye
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-8">
                  {servicio.incluye.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 py-2.5 border-b text-[13.5px] leading-snug"
                      style={{ borderColor: p.linea, color: p.cuerpo }}
                    >
                      <Star
                        className="mt-1 w-2.5 h-2.5 shrink-0"
                        color={p.acentoGrafico}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium uppercase tracking-wide transition-transform duration-200 active:scale-[0.98]"
                  style={{ background: p.botonFondo, color: p.botonTexto }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full group-hover:translate-x-1 transition-transform"
                    style={{ background: p.botonTexto }}
                  />
                  {servicio.ctaTexto}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PanelesPlanes({ servicios }: { servicios: Servicio[] }) {
  // Los tres arrancan cerrados y de la misma altura — nada abierto de
  // entrada. Solo el hover decide cuál se alarga.
  const [activo, setActivo] = useState<number | null>(null);

  // Si llegás desde una tarjeta de la home (p.ej. /servicios#operacion),
  // el plan correspondiente se abre solo en vez de aterrizar cerrado —
  // el clic ya dijo qué plan te interesa, no hace falta pasar el mouse
  // de nuevo para verlo. A propósito en un efecto y no en el estado
  // inicial: leer `window.location.hash` en el inicializador de useState
  // abriría el panel ya en el primer render del cliente mientras el
  // servidor lo renderizó cerrado, un mismatch de hidratación real.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const i = servicios.findIndex((s) => s.slug === hash);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (i !== -1) setActivo(i);
  }, [servicios]);

  return (
    <section className="relative max-w-[104rem] mx-auto px-6 md:px-10 pb-20 md:pb-28">
      {/* Filas apiladas, alto orgánico: cada una crece solo lo que su
          detalle necesita, así que no hace falta una altura fija ni
          scroll de respaldo. Al salir el mouse de toda la columna las
          tres vuelven a cerrarse; moverse entre filas vecinas no cierra
          nada de rebote. */}
      <div
        onMouseLeave={() => setActivo(null)}
        className="flex flex-col gap-px rounded-2xl overflow-hidden"
      >
        {servicios.map((s, i) => (
          <Panel
            key={s.slug}
            servicio={s}
            index={i}
            activo={activo === i}
            onActivar={() => setActivo(i)}
          />
        ))}
      </div>
    </section>
  );
}
