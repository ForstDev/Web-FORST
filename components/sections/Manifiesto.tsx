"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, Variants } from "motion/react";
import {
  petals,
  PETAL_R,
  CUSHION_PATH,
  DIAMOND_PATH,
  VIEWBOX,
} from "@/components/animations/logo-geometry";
import EtiquetaVertical from "@/components/ui/EtiquetaVertical";
import { EASE } from "@/lib/motion-variants";

/**
 * Manifiesto: el porqué de FORST, revelado palabra por palabra al entrar
 * en vista — automático, no ligado al scroll, así siempre se completa.
 * De fondo, el isotipo se dibuja en línea al mismo ritmo, una sola vez.
 */

type Palabra = { t: string; accent?: boolean; bold?: boolean };

const frase = (t: string, opts: { accent?: boolean; bold?: boolean } = {}): Palabra[] =>
  t.split(" ").map((w) => ({ t: w, ...opts }));

const TITULO: Palabra[] = [
  ...frase("FORST es el punto de partida.", { accent: true }),
];

const CUERPO: Palabra[] = [
  ...frase("Nos volvemos"),
  ...frase("especialistas de tu rubro,", { bold: true }),
  ...frase("diseñamos soluciones precisas y coherentes,"),
];

const FRASE_DESTACADA = "hechas para crecer.";

const contenedorPalabras: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
};

const contenedorCuerpo: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.5 } },
};

const palabraVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

function Word({ palabra }: { palabra: Palabra }) {
  return (
    <motion.span
      variants={palabraVariant}
      className={`inline-block mr-[0.2em] ${
        palabra.accent
          ? "text-[var(--forst-green)] uppercase font-bold"
          : palabra.bold
            ? "text-black font-bold"
            : "text-black"
      }`}
    >
      {palabra.t}
    </motion.span>
  );
}

/** La frase de cierre, marcada como con resaltador — una franja de
 * tostado que se dibuja de izquierda a derecha detrás del texto en
 * cursiva, como si alguien la subrayara justo al leerla. */
function FraseDestacada({
  texto,
  visible,
  delay = 0,
}: {
  texto: string;
  visible: boolean;
  delay?: number;
}) {
  return (
    <span className="relative inline-block">
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={visible ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay }}
        className="absolute -inset-y-[0.05em] -inset-x-[0.08em] bg-[var(--forst-tan)] origin-left"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: EASE, delay: delay + 0.35 }}
        className="relative italic font-semibold text-black"
      >
        {texto}
      </motion.span>
    </span>
  );
}

/**
 * `whileInView` por sí solo dispara apenas el elemento intersecta el
 * viewport EN EL MONTAJE — si el hero renderiza más corto que la
 * pantalla del usuario (monitores grandes), el Manifiesto ya está
 * parcialmente "visible" en el primer pintado y la animación arranca
 * sin que nadie haya scrolleado un píxel. Este hook exige, además de la
 * intersección, que el usuario haya movido el scroll de verdad.
 */
function useEntradaReal(
  ref: React.RefObject<Element | null>,
  amount: number
) {
  const interseca = useInView(ref, { once: true, amount });
  // Lee el scroll inicial al crear el estado, no dentro del efecto: así el
  // efecto solo se suscribe a futuros scrolls en vez de también disparar un
  // setState de entrada (que fuerza un render extra apenas monta).
  const [scrolleado, setScrolleado] = useState(
    () => typeof window !== "undefined" && window.scrollY > 30
  );

  useEffect(() => {
    if (scrolleado) return;
    const onScroll = () => {
      if (window.scrollY > 30) setScrolleado(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolleado]);

  return interseca && scrolleado;
}

/** El isotipo dibujándose en línea, pieza por pieza — automático y lento,
 * arranca solo cuando la sección entra en vista de verdad (con scroll de
 * por medio), nunca en el primer pintado de la página. */
function IsotipoDibujado() {
  const ref = useRef<SVGSVGElement>(null);
  const visible = useEntradaReal(ref, 0.6);
  const trazo = { duration: 1.3, ease: EASE };

  return (
    <motion.div
      animate={visible ? { scale: [1, 1.04, 1] } : {}}
      transition={{
        duration: 3.6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 4.6,
      }}
    >
      <motion.svg
        ref={ref}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        initial={{ rotate: -10, scale: 0.9 }}
        animate={visible ? { rotate: [-10, 4, 0], scale: [0.9, 1.05, 1] } : {}}
        transition={{ duration: 5, ease: [0.16, 1, 0.3, 1], times: [0, 0.7, 1] }}
        className="w-full max-w-[760px] h-auto opacity-[0.3] pointer-events-none"
        aria-hidden
      >
        {petals.map((p, i) => (
          <motion.circle
            key={p.id}
            cx={p.cx}
            cy={p.cy}
            r={PETAL_R}
            fill="none"
            stroke="var(--forst-green)"
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={visible ? { pathLength: 1 } : {}}
            transition={{ ...trazo, delay: i * 0.32 }}
          />
        ))}
        <motion.path
          d={CUSHION_PATH}
          fill="none"
          stroke="var(--forst-green)"
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          animate={visible ? { pathLength: 1 } : {}}
          transition={{ ...trazo, delay: 1.6 }}
        />
        <motion.path
          d={DIAMOND_PATH}
          fill="none"
          stroke="var(--forst-green)"
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          animate={visible ? { pathLength: 1 } : {}}
          transition={{ ...trazo, delay: 2.8 }}
        />
      </motion.svg>
    </motion.div>
  );
}

export default function Manifiesto() {
  const textoRef = useRef<HTMLParagraphElement>(null);
  const textoVisible = useEntradaReal(textoRef, 0.5);

  return (
    <section className="relative seccion overflow-hidden">
      <div className="max-w-[104rem] mx-auto w-full px-6 md:px-10 flex gap-8 lg:gap-14">
        <EtiquetaVertical className="pt-2">Por qué existimos</EtiquetaVertical>
        <div className="min-w-0 flex-1 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        <div className="max-w-2xl">
          <motion.p
            ref={textoRef}
            variants={contenedorPalabras}
            initial="hidden"
            animate={textoVisible ? "visible" : "hidden"}
            className="font-display font-medium text-[clamp(1.5rem,3.6vw,3rem)] leading-[1.35] text-pretty"
          >
            {TITULO.map((p, i) => (
              <Word key={i} palabra={p} />
            ))}
          </motion.p>
          <motion.p
            variants={contenedorCuerpo}
            initial="hidden"
            animate={textoVisible ? "visible" : "hidden"}
            className="mt-6 md:mt-8 font-display font-medium text-[clamp(1.5rem,3.6vw,3rem)] leading-[1.35] text-pretty"
          >
            {CUERPO.map((p, i) => (
              <Word key={i} palabra={p} />
            ))}
            <FraseDestacada texto={FRASE_DESTACADA} visible={textoVisible} delay={1.4} />
          </motion.p>
        </div>
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <IsotipoDibujado />
        </div>
        </div>
      </div>
    </section>
  );
}
