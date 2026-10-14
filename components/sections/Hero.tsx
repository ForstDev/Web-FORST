"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import WordReveal from "@/components/animations/WordReveal";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import Resaltado from "@/components/ui/Resaltado";
import MobileMenu from "@/components/layout/MobileMenu";
import BotonSignIn from "@/components/layout/BotonSignIn";
import { categorias } from "@/data/categorias";
import { EASE } from "@/lib/motion-variants";

/**
 * Hero en formato cartel ("brutalist billboard"): el nombre FORST ocupa
 * todo el ancho del marco, verde sobre marfil, en la tipografía real del
 * logo. La isla de musgo flota delante. Cada letra cambia de grosor según
 * la cercanía del cursor, como una lupa hecha con la tipografía.
 */

const NAV_PRINCIPAL = [
  { href: "/servicios", label: "Servicios" },
  { href: "/portafolio", label: "Casos" },
  { href: "/nosotros", label: "Nosotros" },
];

/** El header, adentro del marco: no es fijo, es la fila de arriba de la
 * misma tarjeta, y vive siempre montado (nunca se oculta) — el header
 * fijo de afuera (Header.tsx) solo existe mientras estás scrolleado más
 * allá de esta fila. Logo, nav, Contacto y el CTA comparten layoutId con
 * sus contrapartes del header fijo: cuando ese header fijo aparece o
 * desaparece, Framer anima cada pieza desde acá hasta allá (o al revés),
 * como si fuera un solo header transformándose, no dos cruzando en
 * opacidad. En mobile se reduce a logo + hamburguesa. */
function HeaderEnMarco({ portal }: { portal: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      id="header-en-marco"
      className="flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto] xl:grid-cols-[1fr_auto_1fr] mb-8 md:mb-10"
    >
      <motion.div layoutId="site-logo" className="lg:justify-self-start">
        <Link href="/" className="flex items-center gap-2.5">
          <AnimatedLogo size={36} animateOnMount={false} />
          <span className="font-logo text-lg tracking-[0.04em] text-black">
            FORST
          </span>
        </Link>
      </motion.div>

      <motion.nav
        layoutId="site-nav-pill"
        className="hidden lg:flex items-center rounded-full p-1 border border-[var(--forst-line)] justify-self-center"
      >
        {NAV_PRINCIPAL.map((l, i) => (
          <span key={l.href} className="flex items-center">
            {i > 0 && <span className="w-px h-4 bg-black/10" />}
            <Link
              href={l.href}
              className="px-3 xl:px-4 py-2 rounded-full text-[13px] uppercase tracking-wide text-black/65 hover:text-black hover:bg-black/[0.04] transition-colors"
            >
              {l.label}
            </Link>
          </span>
        ))}
      </motion.nav>

      <div className="hidden lg:flex items-center gap-3 justify-self-end">
        {portal && <BotonSignIn layoutId="site-signin" />}
        <motion.nav
          layoutId="site-contacto-pill"
          className="rounded-full border border-[var(--forst-line)] p-1"
        >
          <Link
            href="/contacto"
            className="block px-3 xl:px-4 py-2 rounded-full text-[13px] uppercase tracking-wide text-black/65 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            Contacto
          </Link>
        </motion.nav>
        <motion.a
          layoutId="site-cta"
          href="https://wa.me/51962316856?text=Hola%20FORST%2C%20quiero%20conversar%20sobre%20mi%20negocio."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full text-[13px] font-medium uppercase tracking-wide px-5 py-3 bg-[var(--forst-green)] text-white hover:bg-[var(--forst-green-soft)] transition-colors"
        >
          Conversemos
        </motion.a>
      </div>

      <div className="lg:hidden flex items-center gap-2">
        {portal && <BotonSignIn />}
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="flex flex-col justify-center items-end gap-1.5 w-10 h-10"
        >
          <span className="block w-6 h-[2px] bg-black" />
          <span className="block w-4 h-[2px] bg-black" />
        </button>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

/** Ancho de cada letra de Lexend Giga en su peso más grueso (900), en
 * em. Cada letra vive en una caja de ese ancho: cuando el cursor cambia
 * los grosores, las letras engordan o adelgazan dentro de su caja y el
 * cartel no se mueve de lado. La suma (4.375em) fija el tamaño de letra
 * para que FORST ocupe todo el ancho del marco. */
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
    const t = setTimeout(() => peso.set(PESO_REPOSO), 350 + indice * 110);
    return () => clearTimeout(t);
  }, [peso, indice, reducido]);

  // Lupa tipográfica: el grosor de cada letra depende de qué tan cerca
  // está el cursor de su centro. La más cercana llega a 900, las lejanas
  // bajan a 220, y fuera del Hero todas vuelven al reposo.
  const recalcular = () => {
    if (reducido || !ref.current) return;
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

/**
 * El cartel: FORST a todo el ancho del marco, en la tipografía real del
 * logo, verde sobre marfil, y la isla de musgo flotando delante. El
 * nombre es decorativo para lectores de pantalla (el h1 real va debajo).
 */
function Cartel({ mx, my }: { mx: MotionValue<number>; my: MotionValue<number> }) {
  const reducido = useReducedMotion() ?? false;

  return (
    <div className="relative">
      <div className="relative [container-type:inline-size]">
        <Escuadra className="-left-2 -top-3 md:-left-4 md:-top-5" />
        <Escuadra className="-right-2 -top-3 md:-right-4 md:-top-5 rotate-90" />
        <p
          aria-hidden
          className="font-logo text-[var(--forst-green)] whitespace-nowrap select-none leading-[0.8] pt-[0.04em]"
          style={{ fontSize: `calc(100cqw / ${ANCHO_TOTAL})` }}
        >
          {LETRAS.map((l, i) => (
            <Letra key={l.ch} ch={l.ch} ancho={l.ancho} indice={i} mx={mx} my={my} reducido={reducido} />
          ))}
        </p>
        {/* Línea base con la ubicación, como la cota de un plano. */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
          className="mt-3 md:mt-4 flex items-center gap-3 origin-left"
        >
          <span className="h-px flex-1 bg-[var(--forst-green)]/25" />
          <span className="hidden sm:inline t-eyebrow text-black/45 whitespace-nowrap">12°02′ S · 77°02′ O</span>
        </motion.div>
      </div>

      {/* La isla, delante del nombre. En escritorio flota sobre el centro
          del cartel; en pantallas chicas baja al flujo y solo pisa el
          borde inferior de las letras. `pointer-events-none` para que la
          lupa siga respondiendo aunque el cursor pase por encima. */}
      <div
        style={{ "--retraso": "0.55s" } as React.CSSProperties}
        className="aparecer pointer-events-none relative z-10 mx-auto -mt-[5%] w-[64%] sm:w-[46%] lg:absolute lg:left-1/2 lg:top-[30%] lg:mt-0 lg:w-[20%] lg:-translate-x-1/2"
      >
        <motion.div
          animate={reducido ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
        >
          <Image
            src="https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/hero-isla.webp"
            alt="Isla de musgo con una laptop, como escenario de trabajo de FORST"
            width={1122}
            height={1284}
            priority
            sizes="(max-width: 640px) 64vw, (max-width: 1024px) 46vw, 26vw"
            className="w-full h-auto drop-shadow-[0_34px_40px_rgba(0,46,44,0.25)]"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function Hero({ portal = false }: { portal?: boolean }) {
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
      className="relative overflow-hidden min-h-[100svh] flex pt-6 pb-10 md:pt-10 md:pb-12 px-6 md:px-10"
    >
      {/* El marco tipo "web dentro de web": el Hero completo, header
          incluido, vive dentro de una ventana con borde propio. Mismo
          margen que el header real para que los bordes queden alineados. */}
      <div className="max-w-[104rem] mx-auto w-full rounded-[2rem] md:rounded-[2.5rem] border border-[var(--forst-line)] p-6 md:p-10 xl:p-14 flex flex-col">
        <HeaderEnMarco portal={portal} />

        <div className="aparecer flex items-center justify-between gap-6 whitespace-nowrap t-eyebrow text-black/55">
          <span className="flex items-center gap-3">
            <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
            Plataforma empresarial
          </span>
          <span className="hidden md:inline">Soluciones digitales a la medida</span>
          <span className="hidden sm:inline">Lima, Perú</span>
        </div>

        <div className="flex-1 flex flex-col justify-center py-8 lg:py-6">
          <Cartel mx={mx} my={my} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end">
          {/* `min-w-0`: un item de grid no encoge por debajo de su palabra
              más larga, y en pantallas angostas desbordaba el marco. */}
          <div className="min-w-0 lg:col-span-5 xl:col-span-4">
            <h1 className="font-display text-[clamp(1.4rem,2.1vw,2rem)] leading-[1.18] text-[var(--forst-green)] text-balance">
              <WordReveal text="Creamos soluciones para negocios" />
              <span className="text-black/70">
                <WordReveal text="listos para evolucionar." />
              </span>
            </h1>

            <p
              style={{ "--retraso": "0.85s" } as React.CSSProperties}
              className="aparecer mt-5 measure-tight text-[15px] leading-relaxed text-black/60"
            >
              Una plataforma empresarial{" "}
              <Resaltado delay={1.3}>hecha a la medida</Resaltado> de tu
              negocio, con la cara de tu marca y no la de una plantilla.
            </p>

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
                className="text-[12px] font-medium uppercase tracking-[0.14em] text-black/70 underline underline-offset-[6px] decoration-[var(--forst-line)] hover:text-[var(--forst-green)] hover:decoration-[var(--forst-green)] transition-colors"
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
            <p className="t-eyebrow text-black/50">Qué hacemos</p>
            <ol className="mt-3 border-t border-[var(--forst-line)]">
              {categorias.map((c) => (
                <li key={c.slug} className="border-b border-[var(--forst-line)]">
                  <Link
                    href={`/servicios#${c.slug}`}
                    className="group flex items-baseline gap-3 py-2 text-[14px] text-black/70 hover:text-[var(--forst-green)] transition-colors"
                  >
                    <span className="tabular-nums text-[11px] text-[var(--forst-green)]/70">{c.numero}</span>
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
