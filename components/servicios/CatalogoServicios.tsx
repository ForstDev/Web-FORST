"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categorias, totalServicios, type Categoria } from "@/data/categorias";
import { empresa } from "@/data/empresa";
import { EASE } from "@/lib/motion-variants";

/**
 * Catálogo de servicios por categoría. Cuatro técnicas de movimiento,
 * cada una con un trabajo concreto:
 *
 * - Elemento compartido: el marcador del índice es un solo elemento
 *   (layoutId) que viaja a la categoría que estás leyendo.
 * - Desenfoque: al recorrer el índice o una fila de servicios, lo que no
 *   está bajo el cursor se desenfoca y baja de opacidad.
 * - Lupa: el servicio bajo el cursor se ensancha y los vecinos ceden
 *   espacio, como el dock de macOS.
 * - Fundido cruzado: al ensancharse, la descripción aparece sobre el
 *   panel mientras el fondo pasa de marfil a verde.
 *
 * Todo eso solo con mouse y pantalla ancha (variante `lupa`). En móvil y
 * táctil cada servicio es una fila con su descripción siempre visible.
 */

function enlaceWhatsApp(servicio: string) {
  return `${empresa.whatsappUrl}?text=${encodeURIComponent(
    `Hola FORST, quiero cotizar: ${servicio}.`
  )}`;
}

function FilaServicios({ categoria }: { categoria: Categoria }) {
  const [activo, setActivo] = useState<number | null>(null);
  const n = categoria.servicios.length;
  const unico = n === 1;
  // Con cinco o más servicios las franjas cerradas quedan muy angostas
  // para un nombre horizontal: ahí el nombre va en vertical mientras la
  // franja está cerrada y pasa a horizontal cuando se ensancha.
  const compacta = n >= 5;
  const crece = compacta
    ? "lupa:data-[activo=true]:grow-[2.6]"
    : "lupa:data-[activo=true]:grow-[2]";

  return (
    <ul
      onMouseLeave={() => setActivo(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setActivo(null);
      }}
      className="mt-8 flex flex-col gap-2 lupa:flex-row lupa:h-[21rem]"
    >
      {categoria.servicios.map((s, i) => {
        const Icono = s.icono;
        const esActivo = unico || activo === i;
        const atenuado = activo !== null && activo !== i;
        return (
          <li
            key={s.nombre}
            data-activo={esActivo}
            data-atenuado={atenuado}
            className={`group min-w-0 lupa:flex-1 ${crece} lupa:transition-[flex-grow,opacity,filter] lupa:duration-500 lupa:ease-[cubic-bezier(0.22,1,0.36,1)] lupa:data-[atenuado=true]:opacity-60 lupa:data-[atenuado=true]:blur-[1.5px]`}
          >
            <a
              href={enlaceWhatsApp(s.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setActivo(i)}
              onFocus={() => setActivo(i)}
              className="relative flex h-full items-start gap-4 overflow-hidden rounded-xl bg-[var(--forst-tint)] p-5 transition-colors duration-500 lupa:flex-col lupa:justify-between lupa:p-6 lupa:group-data-[activo=true]:bg-[var(--forst-green)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forst-green)]"
            >
              <span className="flex shrink-0 items-start justify-between gap-3 lupa:w-full">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--forst-white)] text-[var(--forst-green)] transition-colors duration-500 lupa:group-data-[activo=true]:bg-white/10 lupa:group-data-[activo=true]:text-[var(--forst-tan)]">
                  <Icono className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="hidden lupa:block h-4 w-4 text-[var(--forst-green)]/50 transition-[color,transform] duration-500 lupa:group-data-[activo=true]:text-[var(--forst-white)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>

              {compacta && (
                <span
                  aria-hidden
                  className="hidden lupa:block absolute left-6 bottom-6 rotate-180 [writing-mode:vertical-rl] whitespace-nowrap font-display text-lg font-medium leading-none text-black transition-opacity duration-200 lupa:group-data-[activo=true]:opacity-0"
                >
                  {s.nombre}
                </span>
              )}

              <span className="min-w-0 flex-1 lupa:flex-none lupa:w-full">
                <span
                  className={`block font-display text-[17px] lupa:text-lg font-medium leading-tight text-black transition-colors duration-500 lupa:group-data-[activo=true]:text-[var(--forst-white)] ${
                    compacta
                      ? "lupa:w-[16rem] lupa:opacity-0 lupa:transition-[opacity,color] lupa:group-data-[activo=true]:opacity-100 lupa:group-data-[activo=true]:delay-150"
                      : ""
                  }`}
                >
                  {s.nombre}
                </span>
                {/* Ancho fijo en escritorio: mientras el panel se
                    ensancha, el texto no se reacomoda línea por línea;
                    solo aparece cuando ya hay lugar. Alto fijo (cuatro
                    líneas) para que todos los nombres queden a la misma
                    altura aunque las descripciones midan distinto. */}
                <span className="mt-1.5 block text-[14px] leading-snug text-black/65 lupa:mt-3 lupa:w-[16rem] lupa:h-[5.25rem] lupa:opacity-0 lupa:translate-y-2 lupa:transition-[opacity,transform,color] lupa:duration-300 lupa:group-data-[activo=true]:opacity-100 lupa:group-data-[activo=true]:translate-y-0 lupa:group-data-[activo=true]:delay-150 lupa:group-data-[activo=true]:text-white/75">
                  {s.descripcion}
                </span>
                <span className="sr-only"> Cotizar por WhatsApp.</span>
              </span>

              <ArrowUpRight aria-hidden className="lupa:hidden mt-1 h-4 w-4 shrink-0 text-[var(--forst-green)]/60" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function CatalogoServicios() {
  const [actual, setActual] = useState(categorias[0].slug);
  const [encima, setEncima] = useState<string | null>(null);

  // La categoría "actual" es la que cruza la franja central de la
  // pantalla. El marcador del índice la sigue.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActual(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const c of categorias) {
      const el = document.getElementById(c.slug);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  return (
    <section
      aria-label="Catálogo de servicios"
      className="max-w-[104rem] mx-auto px-6 md:px-10 pb-24 md:pb-32"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <nav aria-label="Categorías de servicios" className="lg:col-span-3">
          <div className="lg:sticky lg:top-32">
            <p className="t-eyebrow text-black/55">
              {totalServicios} servicios en {categorias.length} áreas
            </p>
            <ol
              onMouseLeave={() => setEncima(null)}
              className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:pb-0 lg:block lg:overflow-visible lg:space-y-0.5 lg:border-l lg:border-[var(--forst-line)]"
            >
              {categorias.map((c) => {
                const esActual = actual === c.slug;
                const atenuado = encima !== null && encima !== c.slug;
                return (
                  <li key={c.slug} className="shrink-0">
                    <a
                      href={`#${c.slug}`}
                      onMouseEnter={() => setEncima(c.slug)}
                      aria-current={esActual ? "true" : undefined}
                      className={`relative flex items-baseline gap-3 whitespace-nowrap rounded-full border px-4 py-2 text-[14px] transition-[color,opacity,filter,border-color] duration-300 lg:rounded-none lg:border-0 lg:py-2.5 lg:pl-5 lg:pr-0 ${
                        esActual
                          ? "border-[var(--forst-green)] text-[var(--forst-green)]"
                          : "border-[var(--forst-line)] text-black/60 hover:text-black"
                      } ${atenuado ? "lg:opacity-50 lg:blur-[1px]" : ""}`}
                    >
                      {esActual && (
                        <motion.span
                          layoutId="indice-categoria"
                          transition={{ duration: 0.45, ease: EASE }}
                          className="hidden lg:block absolute -left-px top-2 bottom-2 w-[2px] bg-[var(--forst-green)]"
                        />
                      )}
                      <span className="tabular-nums text-[12px] opacity-60">{c.numero}</span>
                      <span className="font-medium">{c.nombre}</span>
                      <span className="hidden lg:inline ml-auto tabular-nums text-[12px] opacity-50">
                        {c.servicios.length}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>

        <div className="lg:col-span-9 space-y-20 md:space-y-28">
          {categorias.map((c) => (
            <section
              key={c.slug}
              id={c.slug}
              aria-labelledby={`${c.slug}-titulo`}
              className="scroll-mt-32"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-10 pb-6 border-b border-[var(--forst-line)]">
                <div>
                  <p className="t-eyebrow text-[var(--forst-green)]">
                    {c.numero} / {String(categorias.length).padStart(2, "0")}
                  </p>
                  <h2 id={`${c.slug}-titulo`} className="t-h2 mt-3 text-[var(--forst-black)]">
                    {c.nombre}
                  </h2>
                </div>
                <p className="md:max-w-sm text-[15px] leading-relaxed text-black/65 text-pretty">
                  {c.bajada}
                </p>
              </header>
              <FilaServicios categoria={c} />
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
