import type { ReactNode } from "react";
import Link from "next/link";
import { empresa, legalActualizado } from "@/data/empresa";

export type SeccionLegal = {
  id: string;
  titulo: string;
  contenido: ReactNode;
};

/**
 * Plantilla común de las páginas legales. Es un documento para leer, no
 * una página de venta: ancho de lectura acotado, índice fijo a la
 * izquierda en escritorio (en móvil va arriba, plegado) y numeración en
 * los títulos porque los textos legales se citan por número.
 */
export default function DocumentoLegal({
  etiqueta,
  titulo,
  intro,
  secciones,
}: {
  etiqueta: string;
  titulo: string;
  intro: ReactNode;
  secciones: SeccionLegal[];
}) {
  return (
    <article className="max-w-[104rem] mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-24 md:pb-32">
      <header className="max-w-3xl">
        <p className="t-eyebrow flex items-center gap-3 text-black/60">
          <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
          {etiqueta}
        </p>
        <h1 className="t-h2 mt-6 text-[var(--forst-green)] text-balance">
          {titulo}
        </h1>
        <div className="mt-6 text-[15px] md:text-base leading-relaxed text-black/75 measure space-y-4">
          {intro}
        </div>
        <p className="mt-6 text-[13px] text-black/60">
          Última actualización: {legalActualizado}
        </p>
      </header>

      <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <nav aria-label="Índice" className="lg:col-span-3">
          <details className="lg:hidden rounded-xl border border-[var(--forst-line)] p-5" open={false}>
            <summary className="t-eyebrow cursor-pointer text-black/70">
              Índice
            </summary>
            <ol className="mt-4 space-y-2 text-sm">
              {secciones.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-black/70 hover:text-[var(--forst-green)]">
                    {i + 1}. {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </details>
          <ol className="hidden lg:block sticky top-32 space-y-1 text-sm border-l border-[var(--forst-line)]">
            {secciones.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block py-1.5 pl-5 -ml-px border-l border-transparent text-black/60 hover:text-[var(--forst-green)] hover:border-[var(--forst-green)] transition-colors"
                >
                  <span className="tabular-nums text-black/40 mr-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="lg:col-span-8 lg:col-start-5 space-y-14">
          {secciones.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-32">
              <h2 className="font-display font-medium text-xl md:text-2xl text-black flex items-baseline gap-4">
                <span className="tabular-nums text-[var(--forst-green)] text-base md:text-lg">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.titulo}
              </h2>
              <div className="legal-cuerpo mt-5 measure text-[15px] md:text-base leading-relaxed text-black/75 space-y-4">
                {s.contenido}
              </div>
            </section>
          ))}

          <aside className="rounded-2xl bg-[var(--forst-tint)] p-6 md:p-8 measure text-sm leading-relaxed text-black/75">
            <p className="font-medium text-black">{empresa.razonSocial}</p>
            <p className="mt-1">RUC {empresa.ruc}</p>
            <p>{empresa.domicilio}</p>
            <p className="mt-3">
              Consultas:{" "}
              <a href={`mailto:${empresa.correo}`} className="underline underline-offset-4 hover:text-[var(--forst-green)]">
                {empresa.correo}
              </a>
            </p>
            <p className="mt-3">
              Ver también:{" "}
              <Link href="/terminos-y-condiciones" className="underline underline-offset-4 hover:text-[var(--forst-green)]">términos y condiciones</Link>,{" "}
              <Link href="/politica-de-privacidad" className="underline underline-offset-4 hover:text-[var(--forst-green)]">política de privacidad</Link>,{" "}
              <Link href="/politica-de-cookies" className="underline underline-offset-4 hover:text-[var(--forst-green)]">política de cookies</Link> y{" "}
              <Link href="/libro-de-reclamaciones" className="underline underline-offset-4 hover:text-[var(--forst-green)]">libro de reclamaciones</Link>.
            </p>
          </aside>
        </div>
      </div>
    </article>
  );
}
