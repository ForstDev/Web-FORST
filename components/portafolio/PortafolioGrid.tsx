"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import { portafolio, Caso } from "@/data/portafolio";
import CasePlate from "./CasePlate";
import CaseContent from "./CaseContent";
import PaginaMockup from "./PaginaMockup";
import WordReveal from "@/components/animations/WordReveal";
import Resaltado from "@/components/ui/Resaltado";
import { fadeUp, EASE } from "@/lib/motion-variants";

/**
 * Persiana de casos: cada caso es una franja vertical angosta con el
 * título en vertical — al pasar el cursor se expande (solo flex-grow,
 * CSS puro, sin JS) mostrando logo, sector y resumen, mientras las
 * demás se comprimen. Como una persiana que abre una lama a la vez.
 * En mobile (sin hover) cada caso es simplemente una tarjeta apilada.
 */

function PanelCaso({
  caso,
  index,
  onOpen,
  onEnter,
  onLeave,
}: {
  caso: Caso;
  index: number;
  onOpen: () => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const claro = caso.textoClaro;
  const [aquiHover, setAquiHover] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.15 + index * 0.1 }}
      onClick={onOpen}
      onMouseEnter={() => {
        onEnter();
        setAquiHover(true);
      }}
      onMouseLeave={() => {
        onLeave();
        setAquiHover(false);
      }}
      className="group relative flex-1 hover:flex-[2.6] min-w-0 overflow-hidden rounded-xl text-left cursor-pointer transition-[flex-grow] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ background: caso.fondo }}
    >
      {/* La escena real del caso, de fondo — sin esto la franja en reposo
          era un rectángulo de color liso y nada más. Se atenúa al pasar
          el cursor para que el contenido expandido siga leyéndose sobre
          un fondo casi sólido. */}
      <img
        src={caso.imagen}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-10 transition-opacity duration-500"
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: caso.fondo, opacity: 0.6 }}
      />

      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-1.5 z-10"
        style={{ background: caso.acento }}
      />

      {/* Colapsada: título vertical + índice */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-8 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
        <span
          className={`text-[10px] tracking-[0.07em] uppercase ${claro ? "text-white/70" : "text-black/65"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`font-display font-medium text-sm md:text-base tracking-[0.05em] uppercase ${claro ? "text-white/80" : "text-black/70"}`}
          style={{ writingMode: "vertical-rl" }}
        >
          {caso.titulo}
        </span>
        <span
          className="w-2 h-2 rotate-45"
          style={{ background: caso.acento }}
        />
      </div>

      {/* Expandida: contenido completo */}
      <div className="absolute inset-0 flex flex-col gap-3 md:gap-4 p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
        <div
          className={`flex items-center justify-between text-[10px] md:text-[11px] tracking-[0.07em] uppercase shrink-0 ${claro ? "text-white/50" : "text-black/65"}`}
        >
          <span>{caso.sector}</span>
          <span className={claro ? "text-white/70" : "text-black/65"}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <img
          src={caso.logo}
          alt={caso.logoAlt}
          className="max-w-[45%] max-h-9 md:max-h-10 object-contain shrink-0"
        />

        <PaginaMockup
          caso={caso}
          activo={aquiHover}
          compact
          claro={claro}
          className="flex-1 min-h-0"
          mediaClassName="w-full h-full object-contain"
        />

        <div className="shrink-0">
          <p
            className={`text-sm leading-relaxed max-w-xs mb-3 ${claro ? "text-white/70" : "text-black/65"}`}
          >
            {caso.resumen}
          </p>
          <span
            className={`inline-flex items-center gap-2 text-xs font-medium ${claro ? "text-white/90" : "text-black/80"}`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full group-hover:translate-x-1 transition-transform"
              style={{ background: caso.acento }}
            />
            Ver caso
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function PanelCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
      className="flex-1 hover:flex-[2.6] min-w-0 transition-[flex-grow] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      <Link
        href="/contacto"
        className="group relative block w-full h-full overflow-hidden rounded-xl bg-[var(--forst-green)] text-white"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-between py-8 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <span className="text-[10px] tracking-[0.07em] uppercase text-white/65">
            03
          </span>
          <span
            className="font-display font-medium text-sm md:text-base tracking-[0.05em] uppercase text-white/85"
            style={{ writingMode: "vertical-rl" }}
          >
            Tu marca
          </span>
          <span className="w-2 h-2 rotate-45 bg-white" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <span className="text-[10px] md:text-[11px] tracking-[0.07em] uppercase text-white/65">
            Siguiente proyecto
          </span>
          <span className="font-display text-2xl md:text-3xl leading-tight">
            ¿Tu negocio?
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:translate-x-1 transition-transform" />
            Conversemos
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PortafolioGrid() {
  const [activo, setActivo] = useState<Caso | null>(null);
  const [pillVisible, setPillVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Cursor acompañante "Ver caso" que sigue al puntero sobre las placas.
  const px = useMotionValue(-100);
  const py = useMotionValue(-100);
  const pillX = useSpring(px, { stiffness: 350, damping: 30, mass: 0.4 });
  const pillY = useSpring(py, { stiffness: 350, damping: 30, mass: 0.4 });

  const onGridPointerMove = (e: React.PointerEvent) => {
    px.set(e.clientX);
    py.set(e.clientY);
  };

  const abrir = (caso: Caso) => {
    setActivo(caso);
    window.history.pushState({ forstCase: caso.slug }, "", `/portafolio/${caso.slug}`);
  };

  const cerrar = useCallback(() => {
    // El popstate se encarga de limpiar el estado.
    window.history.back();
  }, []);

  useEffect(() => {
    const onPop = () => {
      const m = window.location.pathname.match(/^\/portafolio\/([^/]+)\/?$/);
      const caso = m ? portafolio.find((c) => c.slug === m[1]) ?? null : null;
      setActivo(caso);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Única fuente de verdad para el bloqueo de scroll del body: se deriva
  // de `activo` en vez de mutarse a mano en cada lugar que lo cambia
  // (abrir, cerrar, back/forward), que es justo donde se desincronizaba.
  useEffect(() => {
    document.body.style.overflow = activo ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activo) cerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activo, cerrar]);

  return (
    <>
      <section className="max-w-[104rem] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-24 md:pb-32">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.07em] uppercase text-black/50 mb-7"
        >
          <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
          Casos
        </motion.p>

        <h1 className="font-display font-medium uppercase text-[clamp(2rem,5vw,4.2rem)] leading-[1.08] text-black text-pretty">
          <WordReveal text="Marcas que" />
          <span className="text-[var(--forst-green)] uppercase">
            <WordReveal text="evolucionaron." />
          </span>
        </h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="mt-6 max-w-xl text-black/60 text-[15px] md:text-base leading-relaxed"
        >
          Trabajamos de cerca con cada marca, del problema al resultado,{" "}
          <Resaltado>sin humo.</Resaltado>
        </motion.p>

        {/* Persiana: desktop. Alto por aspect-ratio en vez de un px
            fijo — con un alto fijo, al unificar los márgenes del sitio
            a 104rem la fila se ensanchó ~30% sin crecer en alto, y los
            paneles quedaban aplastados/desproporcionados. */}
        <div
          onPointerMove={onGridPointerMove}
          className="hidden md:flex mt-16 md:mt-20 aspect-[3/2] lg:aspect-[12/5] gap-3"
        >
          {portafolio.map((caso, i) => (
            <PanelCaso
              key={caso.slug}
              caso={caso}
              index={i}
              onOpen={() => abrir(caso)}
              onEnter={() => setPillVisible(true)}
              onLeave={() => setPillVisible(false)}
            />
          ))}
          <PanelCTA />
        </div>

        {/* Apiladas: mobile */}
        <div className="md:hidden mt-16 flex flex-col gap-5">
          {portafolio.map((caso, i) => (
            <motion.button
              key={caso.slug}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.1 }}
              onClick={() => abrir(caso)}
              className="text-left aspect-[4/3] cursor-pointer"
            >
              <CasePlate caso={caso} index={i} />
            </motion.button>
          ))}
          <Link
            href="/contacto"
            className="group flex flex-col justify-between w-full aspect-[4/3] rounded-xl border border-dashed border-[var(--forst-green)]/40 p-7 hover:border-[var(--forst-green)] hover:bg-[var(--forst-tint)] transition-colors"
          >
            <span className="text-[11px] tracking-[0.07em] uppercase text-black/65">
              Siguiente proyecto
            </span>
            <span className="font-display text-xl text-[var(--forst-green)]">
              ¿Tu negocio?
            </span>
            <span className="text-xs text-black/50 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--forst-green)] group-hover:translate-x-1 transition-transform" />
              Conversemos
            </span>
          </Link>
        </div>
      </section>

      {/* Cursor acompañante (solo punteros finos) */}
      <motion.div
        style={{ x: pillX, y: pillY }}
        className="pointer-events-none fixed top-0 left-0 z-[65] hidden [@media(pointer:fine)]:md:block"
        aria-hidden
      >
        <AnimatePresence>
          {pillVisible && !activo && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="flex items-center gap-2 -translate-x-1/2 -translate-y-[130%] rounded-full bg-white border border-[var(--forst-green)] text-[var(--forst-green)] px-4 py-2 text-[11px] tracking-[0.05em] uppercase whitespace-nowrap"
            >
              Ver caso
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--forst-green)]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Vista de caso a pantalla completa */}
      <AnimatePresence>
        {activo && (
          <motion.div
            key={activo.slug}
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            data-lenis-prevent
            className="fixed inset-0 z-[70] overflow-y-auto"
            style={{ background: activo.fondo }}
          >
            <div className="max-w-[104rem] mx-auto px-6 md:px-10 pt-10 md:pt-14">
              <button
                onClick={cerrar}
                className={`group inline-flex items-center gap-3 text-sm transition-colors mb-6 cursor-pointer ${
                  activo.textoClaro
                    ? "text-white/60 hover:text-white"
                    : "text-black/60 hover:text-black"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rotate-45 group-hover:-translate-x-1 transition-transform"
                  style={{ background: activo.acento }}
                />
                Volver a casos
              </button>
              <CasePlate
                caso={activo}
                index={portafolio.findIndex((c) => c.slug === activo.slug)}
                hero
              />
            </div>
            <CaseContent caso={activo} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
