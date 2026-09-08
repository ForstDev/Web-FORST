import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { casosVisibles } from "@/data/portafolio";
import CasePlate from "@/components/portafolio/CasePlate";
import CaseContent from "@/components/portafolio/CaseContent";
import VolverBoton from "@/components/portafolio/VolverBoton";

/**
 * Vista de caso para carga directa (URL compartida, refresh, SEO).
 * La navegación desde el grid usa el overlay con layoutId de
 * PortafolioGrid; esta página cubre el resto de caminos.
 */

export function generateStaticParams() {
  return casosVisibles.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caso = casosVisibles.find((c) => c.slug === slug);
  if (!caso) return { title: "Caso no encontrado — FORST" };
  return {
    title: `${caso.titulo} — Portafolio FORST`,
    description: caso.resumen,
  };
}

export default async function PortafolioDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = casosVisibles.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const caso = casosVisibles[index];
  // Con un solo caso visible no hay a dónde apuntar "siguiente" sin
  // repetir el mismo — la sección simplemente no se muestra en ese caso.
  const siguiente =
    casosVisibles.length > 1
      ? casosVisibles[(index + 1) % casosVisibles.length]
      : null;
  const claro = caso.textoClaro;

  return (
    <div className="pt-10 md:pt-14" style={{ background: caso.fondo }}>
      <div className="max-w-[104rem] mx-auto px-6 md:px-10">
        <VolverBoton acento={caso.acento} claro={claro} />
        <CasePlate caso={caso} index={index} hero withLayoutId={false} />
      </div>

      <CaseContent caso={caso} />

      {siguiente && (
        <div className="max-w-[104rem] mx-auto px-6 md:px-10 pb-24">
          <Link
            href={`/portafolio/${siguiente.slug}`}
            className={`group flex items-center justify-between border-t pt-8 ${
              claro ? "border-white/15" : "border-[var(--forst-line)]"
            }`}
          >
            <div>
              <p className={`text-[11px] tracking-[0.12em] uppercase ${claro ? "text-white/70" : "text-black/70"}`}>
                Siguiente caso
              </p>
              <p
                className={`mt-2 font-display font-medium text-2xl md:text-3xl transition-colors ${
                  claro ? "text-white" : "text-black"
                }`}
              >
                {siguiente.titulo}
              </p>
            </div>
            <span
              className="w-2.5 h-2.5 rotate-45 border group-hover:translate-x-1 transition-all"
              style={{ borderColor: caso.acento }}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
