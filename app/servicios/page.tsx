import type { Metadata } from "next";
import { servicios } from "@/data/servicios";
import ServiciosHero from "@/components/servicios/ServiciosHero";
import CatalogoServicios from "@/components/servicios/CatalogoServicios";
import PanelesPlanes from "@/components/servicios/PanelesPlanes";
import DiagnosticoFORST from "@/components/servicios/DiagnosticoFORST";

export const metadata: Metadata = {
  title: "Servicios | FORST",
  description:
    "Páginas web, e-commerce, CRM, ERP, facturación, inventario, automatización, dashboards, apps móviles, SEO y GEO. Servicios sueltos o en tres planes, con acompañamiento después de la entrega.",
  alternates: { canonical: "/servicios" },
};

export default function ServiciosPage() {
  return (
    <>
      <ServiciosHero />
      <CatalogoServicios />

      <section
        id="planes"
        aria-labelledby="planes-titulo"
        className="scroll-mt-28 border-t border-[var(--forst-line)]"
      >
        <div className="max-w-[104rem] mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-10 md:pb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <p className="t-eyebrow flex items-center gap-3 text-black/60">
              <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
              Planes
            </p>
            <h2 id="planes-titulo" className="t-h2 mt-6 text-[var(--forst-green)] text-balance">
              O un plan completo según la etapa de tu negocio
            </h2>
          </div>
          <p className="lg:col-span-5 t-lead measure text-black/60">
            Cada plan junta varios de los servicios de arriba. Presencia es
            para empezar, Operación para ordenar lo que ya vendes y
            Estructura para rediseñar cómo trabaja toda la empresa.
          </p>
        </div>
        <PanelesPlanes servicios={servicios} />
      </section>

      <DiagnosticoFORST />
    </>
  );
}
