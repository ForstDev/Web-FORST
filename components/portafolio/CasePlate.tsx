"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Caso } from "@/data/portafolio";
import Star from "@/components/ui/Star";

/**
 * La "placa" de un caso, con la identidad real del cliente — no el verde
 * de FORST. Cerrada: fondo y acento de la marca del cliente con su logo
 * real centrado. Al expandir (hero): la composición "MARCA × FORST" a
 * modo de certificado/presentación. Ambos estados comparten layoutId,
 * así que Motion anima el vuelo entre uno y otro.
 *
 * DFG tiene fondo negro — ahí el texto usa el acento (rojo) por pedido
 * explícito del cliente; el resto de casos usa texto neutro.
 */
export default function CasePlate({
  caso,
  index,
  hero = false,
  withLayoutId = true,
}: {
  caso: Caso;
  index: number;
  /** true cuando la placa es el hero del caso abierto — muestra la composición. */
  hero?: boolean;
  withLayoutId?: boolean;
}) {
  const textoEyebrow = caso.textoClaro
    ? { color: caso.acento }
    : undefined;
  const claseEyebrow = caso.textoClaro ? "" : "text-black/65";
  const claseResumen = caso.textoClaro ? "text-white/70" : "text-black/65";

  if (hero) {
    // El bloque "Powered by FORST" invierte el color respecto a la placa
    // del caso a propósito: el logo nuevo de DFG es rojo (necesita fondo
    // claro) y el de VELKAI es blanco (necesita fondo oscuro) — lo
    // contrario del fondo que usa el resto de la página de cada caso.
    const composicionClaro = !!caso.textoClaro;
    return (
      <motion.div
        layoutId={withLayoutId ? `plate-${caso.slug}` : undefined}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full overflow-hidden rounded-xl flex items-center justify-center"
        style={{ background: composicionClaro ? "var(--forst-white)" : "var(--forst-black)" }}
      >
        <Image
          src={caso.composicion}
          alt={`${caso.titulo}, en alianza con FORST`}
          width={1200}
          height={500}
          className="w-full h-[26vh] md:h-[34vh] object-contain p-12 md:p-16"
        />
        <div
          className="absolute top-0 inset-x-0 flex items-center justify-between px-6 md:px-9 py-5 text-[10px] md:text-[11px] tracking-[0.05em] uppercase font-semibold"
          style={{ color: composicionClaro ? caso.acento : "var(--forst-white)" }}
        >
          <span className="flex items-center gap-2">
            <Star className="w-2.5 h-2.5 shrink-0" color="currentColor" />
            {caso.sector}
          </span>
          <span className="flex items-center gap-2">
            {String(index + 1).padStart(2, "0")}
            <span className="w-1.5 h-1.5 rounded-full inline-block bg-current" />
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={withLayoutId ? `plate-${caso.slug}` : undefined}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden rounded-xl"
      style={{ background: caso.fondo }}
    >
      {/* La escena real del caso, de fondo — misma idea que la persiana
          de desktop: la tarjeta deja de ser un rectángulo de color liso. */}
      <Image
        src={caso.imagen}
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover opacity-25"
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: caso.fondo, opacity: 0.7 }}
      />

      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: caso.acento }}
      />
      <div
        className={`relative z-10 flex items-start justify-between text-[10px] md:text-[11px] tracking-[0.05em] uppercase ${claseEyebrow}`}
        style={textoEyebrow}
      >
        <span className="px-7 pt-7">{caso.sector}</span>
        <span className="px-7 pt-7 flex items-center gap-2">
          {String(index + 1).padStart(2, "0")}
          <span
            className="w-1.5 h-1.5 rotate-45 inline-block"
            style={{ background: caso.acento }}
          />
        </span>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-10 py-4">
        <Image
          src={caso.logo}
          alt={caso.logoAlt}
          width={400}
          height={200}
          className="max-w-[62%] max-h-[38%] w-auto h-auto object-contain"
        />
      </div>

      <div className="relative z-10 flex items-end justify-between px-7 pb-7 gap-4">
        <p className={`text-xs max-w-[220px] leading-relaxed ${claseResumen}`}>
          {caso.resumen}
        </p>
        <span
          className="shrink-0 w-2.5 h-2.5 rotate-45 border transition-colors"
          style={{ borderColor: caso.acento }}
        />
      </div>
    </motion.div>
  );
}
