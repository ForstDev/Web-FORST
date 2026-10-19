"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import WordReveal from "@/components/animations/WordReveal";
import { categorias } from "@/data/categorias";
import { progresoLogo } from "@/lib/logo-scroll";

/**
 * Hero en formato cartel ("brutalist billboard"): el nombre FORST ocupa
 * todo el ancho, verde sobre marfil, en la tipografía real del logo.
 *
 * Al hacer scroll el nombre se encoge y viaja hasta el lugar del logo en
 * el header. Ahí se funde con el logo real, que recién entonces aparece:
 * mientras el cartel está a la vista, el header no repite el nombre. Al
 * volver arriba el recorrido se deshace, porque va atado al scroll.
 *
 * Cada letra además cambia de grosor según la cercanía del cursor, como
 * una lupa hecha con la tipografía.
 */

/** Ancho de cada letra de Lexend Giga en su peso más grueso (900), en
 * em. Cada letra vive en una caja de ese ancho: cuando el cursor cambia
 * los grosores, las letras engordan o adelgazan dentro de su caja y el
 * cartel no se mueve de lado. La suma (4.375em) fija el tamaño de letra
 * para que FORST ocupe todo el ancho. */
const LETRAS = [
  { ch: "F", ancho: 0.795 },
  { ch: "O", ancho: 1.013 },
  { ch: "R", ancho: 0.884 },
  { ch: "S", ancho: 0.818 },
  { ch: "T", ancho: 0.865 },
];
const ANCHO_TOTAL = LETRAS.reduce((s, l) => s + l.ancho, 0);

const PESO_REPOSO = 600;
const PESO_MIN = 220;
const PESO_MAX = 900;
/** Peso del "FORST" del logo en el header: al llegar, el cartel ya tiene
 * su mismo grosor y el relevo no se nota. */
const PESO_LOGO = 400;

function Letra({
  ch,
  ancho,
  indice,
  mx,
  my,
  reducido,
}: {
  ch: string;
  ancho: number;
  indice: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reducido: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Arranca finísima y "se infla" hasta el peso de reposo, una letra
  // detrás de otra. Con movimiento reducido queda fija en el reposo.
  const peso = useSpring(reducido ? PESO_REPOSO : 100, {
    stiffness: 120,
    damping: 20,
    mass: 0.7,
  });
  const variacion = useTransform(peso, (w) => `"wght" ${Math.round(w)}`);

  useEffect(() => {
    if (reducido) return;
    const t = setTimeout(() => {
      if (progresoLogo.get() < 0.01) peso.set(PESO_REPOSO);
    }, 350 + indice * 110);
    return () => clearTimeout(t);
  }, [peso, indice, reducido]);

  // Lupa tipográfica: el grosor de cada letra depende de qué tan cerca
  // está el cursor de su centro. La más cercana llega a 900, las lejanas
  // bajan a 220, y fuera del Hero todas vuelven al reposo. Mientras el
  // nombre viaja al header, el grosor lo manda el scroll.
  const recalcular = () => {
    if (reducido || !ref.current) return;
    const p = progresoLogo.get();
    if (p > 0.01) return peso.jump(PESO_REPOSO + (PESO_LOGO - PESO_REPOSO) * p);
    const x = mx.get();
    const y = my.get();
    if (x < 0) return peso.set(PESO_REPOSO);
    const r = ref.current.getBoundingClientRect();
    const radio = Math.max(r.width * 2.2, 260);
    const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
    const cercania = Math.exp(-((d / radio) ** 2));
    peso.set(PESO_MIN + (PESO_MAX - PESO_MIN) * cercania);
  };
  useMotionValueEvent(mx, "change", recalcular);
  useMotionValueEvent(my, "change", recalcular);
  useMotionValueEvent(progresoLogo, "change", recalcular);

  return (
    <motion.span
      ref={ref}
      className="aparecer-letra inline-block text-center"
      style={{
        width: `${ancho}em`,
        fontVariationSettings: variacion,
        ["--retraso" as string]: `${0.15 + indice * 0.08}s`,
      }}
    >
      {ch}
    </motion.span>
  );
}

/** Escuadra de esquina del plano técnico de la marca. */
function Escuadra({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={`absolute w-4 h-4 md:w-5 md:h-5 ${className}`}>
      <path d="M1 12 V1 H12" fill="none" stroke="var(--forst-green)" strokeWidth="1.4" opacity="0.55" />
    </svg>
  );
}

/** Curva suave de entrada y salida para el recorrido atado al scroll. */
const suave = (p: number) => p * p * (3 - 2 * p);

/**
 * El cartel: FORST a todo el ancho, verde sobre marfil. El nombre es
 * decorativo para lectores de pantalla (el h1 real va debajo).
 */
function Cartel({ mx, my }: { mx: MotionValue<number>; my: MotionValue<number> }) {
  const reducido = useReducedMotion() ?? false;
  const nombreRef = useRef<HTMLParagraphElement>(null);
  // Caja del nombre sin transformar, en coordenadas del documento.
  const base = useRef<{ L: number; T: number; W: number; H: number } | null>(null);
  const { scrollY } = useScroll();
  // Escuadras y cota se apagan apenas el nombre empieza a viajar.
  const opDetalles = useTransform(progresoLogo, [0, 0.25], [1, 0]);

  const actualizar = useCallback(
    (s: number) => {
      const el = nombreRef.current;
      const b = base.current;
      const destino = document.getElementById("logo-header-texto");
      if (!el || !b) return;
      if (reducido || !destino) {
        // Sin viaje: el nombre se queda en el Hero y el logo del header
        // se ve desde el principio.
        el.style.transform = "";
        el.style.opacity = "";
        progresoLogo.set(reducido ? 1 : 0);
        return;
      }
      const d = destino.getBoundingClientRect();
      const kFinal = d.width / b.W;
      // Borde superior que deja al nombre, ya en tamaño de logo, centrado
      // en la altura del logo del header.
      const topeFinal = d.top + d.height / 2 - (kFinal * b.H) / 2;
      // El nombre sube con la página (así el contenido de abajo nunca le
      // pasa por encima) mientras se encoge, y se acopla al header cuando
      // lo alcanza. El encogimiento dura un poco más que la subida para
      // que el aterrizaje sea suave.
      const recorrido = Math.max((b.T - topeFinal) * 1.2, 140);
      const p = Math.min(Math.max(s / recorrido, 0), 1);
      const e = suave(p);
      const k = 1 + (kFinal - 1) * e;
      const izquierda = b.L + (d.left - b.L) * e;
      const tope = Math.max(topeFinal, b.T - s);
      const tx = izquierda - b.L;
      const ty = tope - (b.T - s);
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${k})`;
      // Relevo: en el último tramo el cartel se apaga y el logo del
      // header (que lee este mismo progreso) se enciende.
      el.style.opacity = String(p < 0.88 ? 1 : Math.max(0, 1 - (p - 0.88) / 0.12));
      progresoLogo.set(p);
    },
    [reducido]
  );

  useEffect(() => {
    const medir = () => {
      const el = nombreRef.current;
      if (!el) return;
      const previo = el.style.transform;
      el.style.transform = "none";
      const r = el.getBoundingClientRect();
      base.current = { L: r.left, T: r.top + window.scrollY, W: r.width, H: r.height };
      el.style.transform = previo;
      actualizar(window.scrollY);
    };
    medir();
    // La fuente cambia el ancho real del nombre: se vuelve a medir cuando
    // termina de cargar, y al cambiar el tamaño de la ventana.
    document.fonts?.ready.then(medir);
    window.addEventListener("resize", medir);
    return () => {
      window.removeEventListener("resize", medir);
      progresoLogo.set(0);
    };
  }, [actualizar]);

  useMotionValueEvent(scrollY, "change", actualizar);

  return (
    <div className="relative [container-type:inline-size]">
      <motion.div style={{ opacity: opDetalles }}>
        <Escuadra className="-left-2 -top-3 md:-left-4 md:-top-5" />
        <Escuadra className="-right-2 -top-3 md:-right-4 md:-top-5 rotate-90" />
      </motion.div>
      {/* z-[60]: en su viaje el nombre pasa por encima del header fijo. */}
      <p
        ref={nombreRef}
        aria-hidden
        className="relative z-[60] origin-top-left will-change-transform font-logo text-[var(--forst-green)] whitespace-nowrap select-none leading-[0.8] pt-[0.04em]"
        style={{ fontSize: `calc(100cqw / ${ANCHO_TOTAL})` }}
      >
        {LETRAS.map((l, i) => (
          <Letra key={l.ch} ch={l.ch} ancho={l.ancho} indice={i} mx={mx} my={my} reducido={reducido} />
        ))}
      </p>
      {/* Línea base con la ubicación, como la cota de un plano. */}
      {/* La entrada (CSS) va en el hijo: una animación CSS le ganaría a la
          opacidad que el scroll le pone al contenedor. */}
      <motion.div style={{ opacity: opDetalles }} className="mt-3 md:mt-4">
        <div className="aparecer flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--forst-green)]/25" />
          <span className="hidden sm:inline t-eyebrow text-[var(--forst-black)]/55 whitespace-nowrap">12°02′ S · 77°02′ O</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  // Posición del cursor en la ventana. -1 significa "fuera del Hero":
  // las letras vuelven al peso de reposo. Solo cuenta el mouse; en
  // pantallas táctiles el cartel queda quieto después de la entrada.
  const mx = useMotionValue(-1);
  const my = useMotionValue(-1);

  return (
    <section
      id="hero-foto"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
      onPointerLeave={() => {
        mx.set(-1);
        my.set(-1);
      }}
      className="relative overflow-hidden min-h-[100svh] flex flex-col px-6 md:px-10 pt-24 md:pt-28 pb-10 md:pb-12"
    >
      <div className="max-w-[104rem] mx-auto w-full flex-1 flex flex-col">
        <div className="aparecer flex items-center justify-between gap-6 whitespace-nowrap t-eyebrow text-[var(--forst-black)]/60">
          <span className="flex items-center gap-3">
            <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
            Plataforma empresarial
          </span>
          <span className="hidden md:inline">Soluciones digitales a la medida</span>
          <span className="hidden sm:inline">Lima, Perú</span>
        </div>

        <div className="flex-1 flex flex-col justify-center py-10 lg:py-8">
          <Cartel mx={mx} my={my} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end">
          {/* `min-w-0`: un item de grid no encoge por debajo de su palabra
              más larga, y en pantallas angostas desbordaba. */}
          <div className="min-w-0 lg:col-span-5 xl:col-span-4">
            <h1 className="font-display text-[clamp(1.4rem,2.1vw,2rem)] leading-[1.18] text-[var(--forst-green)] text-balance">
              <WordReveal text="Creamos soluciones para negocios" />
              <span className="text-[var(--forst-black)]/75">
                <WordReveal text="listos para evolucionar." />
              </span>
            </h1>

            <div
              style={{ "--retraso": "1s" } as React.CSSProperties}
              className="aparecer mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {/* `max-w-full` + `shrink-0` en el punto: en pantallas muy
                  angostas el texto del botón envuelve en vez de desbordar. */}
              <Link
                href="/contacto"
                className="group inline-flex max-w-full items-center gap-3 rounded-full bg-[var(--forst-green)] text-[var(--forst-white)] px-6 sm:px-8 py-4 text-[12px] font-medium uppercase tracking-[0.12em] sm:tracking-[0.18em] transition-[background-color,transform] duration-200 hover:bg-[var(--forst-green-soft)] active:scale-[0.98]"
              >
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[var(--forst-tan)] group-hover:translate-x-1 transition-transform" />
                Hablemos de tu negocio
              </Link>
              <Link
                href="/portafolio"
                className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--forst-black)] underline underline-offset-[6px] decoration-[var(--forst-line)] hover:text-[var(--forst-green)] hover:decoration-[var(--forst-green)] transition-colors"
              >
                Ver casos reales
              </Link>
            </div>
          </div>

          {/* Las cinco áreas, como índice del cartel. Cada una lleva a su
              sección en /servicios. */}
          <nav
            aria-label="Áreas de servicio"
            style={{ "--retraso": "1.1s" } as React.CSSProperties}
            className="aparecer min-w-0 lg:col-span-4 lg:col-start-9 xl:col-span-3 xl:col-start-10"
          >
            <p className="t-eyebrow text-[var(--forst-black)]/60">Qué hacemos</p>
            <ol className="mt-3 border-t border-[var(--forst-line)]">
              {categorias.map((c) => (
                <li key={c.slug} className="border-b border-[var(--forst-line)]">
                  <Link
                    href={`/servicios#${c.slug}`}
                    className="group flex items-baseline gap-3 py-2 text-[14px] text-[var(--forst-black)] hover:text-[var(--forst-green)] transition-colors"
                  >
                    <span className="tabular-nums text-[11px] text-[var(--forst-green)]">{c.numero}</span>
                    {c.nombre}
                    <ArrowUpRight
                      aria-hidden
                      className="ml-auto h-3.5 w-3.5 self-center opacity-0 -translate-x-1 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
