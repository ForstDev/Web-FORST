"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  MotionValue,
} from "motion/react";
import CurvaDivisoria from "@/components/ui/CurvaDivisoria";
import { EASE } from "@/lib/motion-variants";

/**
 * La sección volcada a verde: el valor diferencial de FORST (manual de
 * marca) contado con movimiento. Dos líneas se dibujan de forma
 * automática al entrar en vista — nunca antes, nunca ligadas al scroll:
 * la de "una agencia típica" se detiene en la entrega; la de FORST sigue
 * dibujándose a través de cómo trabajamos: analiza, estructura, proyecta
 * y acompaña.
 */

const HITOS = [
  {
    pos: 4,
    titulo: "Analiza",
    texto: "Antes de tocar una línea de código, estudiamos tu mercado, tu rubro y tu contexto real.",
  },
  {
    pos: 36,
    titulo: "Estructura",
    texto: "Proponemos una solución con dirección propia, no una plantilla que ya usan mil negocios.",
  },
  {
    pos: 66,
    titulo: "Proyecta",
    texto: "Cada pieza queda preparada para crecer con tu negocio, no solo para el lanzamiento.",
  },
  {
    pos: 96,
    titulo: "Acompaña",
    texto: "Seguimos al costado después de la entrega, ajustando con datos reales.",
  },
];

function Hito({
  hito,
  progreso,
  arriba,
  dorado = false,
}: {
  hito: (typeof HITOS)[number];
  progreso: MotionValue<number>;
  arriba: boolean;
  /** El último hito — el pago del argumento — se marca en dorado. */
  dorado?: boolean;
}) {
  const desde = Math.max(hito.pos - 6, 0);
  const opacity = useTransform(progreso, [desde, hito.pos + 2], [0, 1]);
  const scale = useTransform(progreso, [desde, hito.pos + 2], [0.3, 1]);

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2"
      style={{ left: `${hito.pos}%` }}
    >
      <motion.span
        style={{
          opacity,
          scale,
          background: dorado ? "var(--forst-tan)" : "white",
        }}
        className="block w-3 h-3 -translate-x-1/2 rotate-45"
      />
      <motion.div
        style={{ opacity }}
        className={`absolute w-40 -translate-x-1/2 left-1.5 ${
          arriba ? "bottom-7 text-left" : "top-7 text-left"
        }`}
      >
        <p className="text-[15px] font-medium text-white">{hito.titulo}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-white/55">
          {hito.texto}
        </p>
      </motion.div>
    </div>
  );
}

export default function PostVenta() {
  // El disparador vive en el propio bloque de diagramas, no en toda la
  // sección — así el dibujo empieza solo cuando ESE bloque ya se ve, no
  // apenas asoma el título de la sección más arriba.
  const diagramaRef = useRef<HTMLDivElement>(null);
  const enVista = useInView(diagramaRef, { once: true, amount: 0.5 });

  // Todo el recorrido es automático, disparado una sola vez al entrar en
  // vista — nunca antes de que se vea, nunca dependiente del scroll.
  const tipica = useMotionValue(0);
  const cruz = useMotionValue(0);
  const progreso = useMotionValue(0);
  const final = useMotionValue(0);

  useEffect(() => {
    if (!enVista) return;
    const controles = [
      animate(tipica, 30, { duration: 0.7, ease: EASE }),
      animate(cruz, 1, { duration: 0.3, delay: 0.85 }),
      animate(progreso, 100, { duration: 2.4, delay: 1.25, ease: EASE }),
      animate(final, 1, { duration: 0.6, delay: 3.85 }),
    ];
    return () => controles.forEach((c) => c.stop());
  }, [enVista, tipica, cruz, progreso, final]);

  const tipicaWidth = useTransform(tipica, (v) => `${v}%`);
  const forstWidth = useTransform(progreso, (v) => `${v}%`);
  const tipX = useTransform(progreso, (v) => `${v}%`);
  const tipOpacity = useTransform(progreso, [0, 4, 96, 100], [0, 1, 1, 0]);
  const finalY = useTransform(final, [0, 1], [24, 0]);

  return (
    <section className="relative bg-[var(--forst-green)] text-white overflow-hidden">
      <CurvaDivisoria />
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-24 md:pt-24 md:pb-24">
        <p className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.07em] uppercase text-white/50 mb-6">
          <span className="w-2 h-2 rotate-45 bg-white inline-block" />
          El diferencial
        </p>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-3xl">
            <h2 className="font-display font-medium uppercase text-[clamp(2.1rem,5.2vw,4.6rem)] leading-[1.06]">
              FORST no solo ejecuta.
              <br />
              <span className="text-white/55">
                También analiza, estructura y proyecta.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-sm md:text-base text-white/60 leading-relaxed">
              Antes de desarrollar una solución, analizamos a profundidad el
              mercado, el rubro y el contexto de cada cliente. No entregamos
              plantillas: proponemos herramientas precisas, coherentes y
              preparadas para crecer.
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-[var(--forst-tan)]/25 bg-[var(--forst-tan)]/[0.08] px-6 py-5 md:min-w-[200px]">
            <p className="font-display text-3xl md:text-4xl text-white">
              24–48h
            </p>
            <p className="mt-1.5 text-[11px] tracking-[0.05em] uppercase text-white/50 leading-relaxed">
              Tiempo de respuesta promedio, incluso meses después de la entrega.
            </p>
          </div>
        </div>

        <div ref={diagramaRef}>
        {/* ——— Desktop: líneas horizontales ——— */}
        <div className="hidden md:block mt-16 space-y-20">
          <div>
            <p className="text-[11px] tracking-[0.07em] uppercase text-white/40 mb-6">
              Una agencia típica
            </p>
            <div className="relative h-10">
              <div className="absolute top-1/2 left-0 w-full h-px bg-white/10" />
              <motion.div
                style={{ width: tipicaWidth }}
                className="absolute top-1/2 left-0 h-px bg-white/35"
              />
              <motion.div
                style={{ opacity: cruz }}
                className="absolute top-1/2 -translate-y-1/2 left-[30%]"
              >
                <span className="relative block w-3 h-3 -translate-x-1/2">
                  <span className="absolute inset-0 m-auto w-3.5 h-px bg-white/45 rotate-45" />
                  <span className="absolute inset-0 m-auto w-3.5 h-px bg-white/45 -rotate-45" />
                </span>
                <p className="mt-3 -translate-x-1/2 w-44 text-[11px] text-white/45">
                  Entrega: fin del contacto.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="pt-8">
            <p className="text-[11px] tracking-[0.07em] uppercase text-white/70 mb-6">
              FORST
            </p>
            <div className="relative h-32 pr-6">
              <div className="absolute top-1/2 left-0 w-full h-px bg-white/10" />
              <motion.div
                style={{ width: forstWidth }}
                className="absolute top-1/2 left-0 h-[2.5px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
              />
              <motion.span
                aria-hidden
                style={{ left: tipX, opacity: tipOpacity }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rotate-45 z-10"
              >
                <motion.span
                  className="absolute inset-0 rotate-45"
                  style={{ background: "var(--forst-tan)" }}
                  animate={{
                    boxShadow: [
                      "0 0 6px 2px rgba(184,147,90,0.6)",
                      "0 0 14px 5px rgba(184,147,90,0.9)",
                      "0 0 6px 2px rgba(184,147,90,0.6)",
                    ],
                  }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.span>
              {HITOS.map((h, i) => (
                <Hito
                  key={h.titulo}
                  hito={h}
                  progreso={progreso}
                  arriba={i % 2 === 1}
                  dorado={i === HITOS.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ——— Mobile: línea vertical ——— */}
        <div className="md:hidden mt-16">
          <p className="text-[11px] tracking-[0.07em] uppercase text-white/40 mb-4">
            Una agencia típica
          </p>
          <div className="relative pl-6 pb-8">
            <div className="absolute left-0 top-0 h-full w-px bg-white/10" />
            <motion.div
              style={{ height: tipicaWidth }}
              className="absolute left-0 top-0 w-px bg-white/35"
            />
            <p className="text-sm text-white/45">Entrega: fin del contacto.</p>
          </div>

          <p className="text-[11px] tracking-[0.07em] uppercase text-white/70 mt-10 mb-4">
            FORST
          </p>
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-px bg-white/10" />
            <motion.div
              style={{ height: forstWidth }}
              className="absolute left-0 top-0 w-[2px] bg-white"
            />
            <div className="flex flex-col gap-8">
              {HITOS.map((h, i) => {
                const dorado = i === HITOS.length - 1;
                return (
                  <div key={h.titulo} className="relative">
                    <span
                      className="absolute -left-[29px] top-1 w-2.5 h-2.5 rotate-45"
                      style={{ background: dorado ? "var(--forst-tan)" : "white" }}
                    />
                    <p className="text-base font-medium text-white">
                      {h.titulo}
                    </p>
                    <p className="mt-1 text-sm text-white/55">{h.texto}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>

        <motion.div
          style={{ opacity: final, y: finalY }}
          className="mt-16 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <p className="font-display text-xl md:text-3xl max-w-xl">
            Seguimos siendo tu equipo{" "}
            <span className="text-white/55">después del lanzamiento.</span>
          </p>
          <Link
            href="/nosotros"
            className="group inline-flex items-center gap-3 rounded-full border border-white/40 px-6 py-3 text-sm hover:bg-white hover:text-[var(--forst-green)] transition-colors w-fit"
          >
            Así trabajamos
            <span className="w-1.5 h-1.5 rounded-full bg-current group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
