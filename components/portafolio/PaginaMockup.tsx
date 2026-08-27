"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Caso } from "@/data/portafolio";

const VELOCIDAD = 1.5;

/**
 * La página real del cliente, enmarcada como una ventana de navegador
 * (barra con puntos + host) — "una web dentro de la web". Si el caso
 * trae `paginaVideo` (y no se pide `soloImagen`), se reproduce ahí mismo
 * a 1.5x, silencioso y en loop; si no, se ve la foto.
 *
 * `activo` controla la reproducción a mano (para previews por hover) —
 * cada vez que pasa a `true` el video vuelve a empezar desde cero, como
 * una demo fresca cada vez que se pasa el cursor. Si se omite `activo`,
 * el video se reproduce solo mientras está en pantalla.
 */
export default function PaginaMockup({
  caso,
  activo,
  compact = false,
  claro = false,
  soloImagen = false,
  className = "",
  mediaClassName = "w-full h-auto",
}: {
  caso: Caso;
  activo?: boolean;
  compact?: boolean;
  /** true cuando el marco vive sobre un fondo oscuro (p.ej. DFG) — cambia
   * el tono del chrome para que siga siendo visible. */
  claro?: boolean;
  /** Fuerza la captura estática aunque el caso tenga video. */
  soloImagen?: boolean;
  className?: string;
  /** Clases del propio <img>/<video> — por defecto ancho completo y alto
   * natural (sin recorte); pásale "w-full h-full object-contain" si el
   * contenedor ya tiene una altura fija (previews chicos por hover). */
  mediaClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mostrarVideo = !soloImagen && !!caso.paginaVideo;

  // Control manual (hover): cada vez que se activa, arranca desde cero.
  useEffect(() => {
    if (activo === undefined) return;
    const v = videoRef.current;
    if (!v) return;
    if (activo) {
      v.currentTime = 0;
      v.playbackRate = VELOCIDAD;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [activo]);

  // Sin control manual: solo reproduce mientras está en pantalla, para
  // no gastar ancho de banda de fondo en algo que nadie está viendo.
  useEffect(() => {
    if (activo !== undefined) return;
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.playbackRate = VELOCIDAD;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [activo]);

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden ring-1 ${
        claro ? "ring-white" : "ring-black"
      } ${className}`}
    >
      <div
        className={`shrink-0 flex items-center gap-2 border-b ${
          claro
            ? "border-white bg-white/10"
            : "border-black bg-black/5"
        } ${compact ? "px-3 py-2" : "px-4 py-3"}`}
      >
        <span
          className={`rounded-full ${claro ? "bg-white/60" : "bg-black/30"} ${compact ? "w-1.5 h-1.5" : "w-2.5 h-2.5"}`}
        />
        <span
          className={`rounded-full bg-[var(--forst-tan)] ${compact ? "w-1.5 h-1.5" : "w-2.5 h-2.5"}`}
        />
        <span
          className={`rounded-full ${claro ? "bg-white/60" : "bg-black/30"} ${compact ? "w-1.5 h-1.5" : "w-2.5 h-2.5"}`}
        />
        <span
          className={`ml-2 truncate ${claro ? "text-white/85" : "text-black/70"} ${compact ? "text-[10px]" : "text-[12px]"}`}
        >
          {caso.host}
        </span>
      </div>
      <div
        className="flex-1 min-h-0 flex items-center justify-center"
        style={{ background: caso.fondo }}
      >
        {mostrarVideo ? (
          <video
            ref={videoRef}
            src={caso.paginaVideo}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = VELOCIDAD;
            }}
            className={mediaClassName}
            aria-label={caso.paginaPreviewAlt}
          />
        ) : (
          <Image
            src={caso.paginaPreview}
            alt={caso.paginaPreviewAlt}
            width={1200}
            height={686}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={mediaClassName}
          />
        )}
      </div>
    </div>
  );
}
