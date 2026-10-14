import type { Metadata } from "next";
import { BookOpenText } from "lucide-react";
import FormularioReclamo from "@/components/legal/FormularioReclamo";
import { empresa } from "@/data/empresa";

export const metadata: Metadata = {
  title: "Libro de reclamaciones | FORST",
  description:
    "Libro de reclamaciones virtual de FORST E.I.R.L. Registra un reclamo o una queja y recibe respuesta por escrito en un máximo de 15 días hábiles.",
  alternates: { canonical: "/libro-de-reclamaciones" },
};

export default function LibroReclamacionesPage() {
  return (
    <article className="max-w-[104rem] mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-24 md:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <header className="lg:col-span-4 no-imprimir">
          <div className="lg:sticky lg:top-32">
            <p className="t-eyebrow flex items-center gap-3 text-black/60">
              <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
              Legal
            </p>
            <h1 className="t-h2 mt-6 text-[var(--forst-green)] text-balance">
              Libro de reclamaciones
            </h1>

            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[var(--forst-green)] p-5">
              <BookOpenText className="w-6 h-6 shrink-0 text-[var(--forst-green)]" aria-hidden />
              <p className="text-[14px] leading-relaxed text-black">
                Conforme a lo establecido en el Código de Protección y Defensa del
                Consumidor, este establecimiento cuenta con un Libro de
                Reclamaciones a tu disposición.
              </p>
            </div>

            <dl className="mt-8 space-y-3 text-[14px] leading-relaxed">
              <div>
                <dt className="text-black/55">Razón social</dt>
                <dd className="text-black">{empresa.razonSocial}</dd>
              </div>
              <div>
                <dt className="text-black/55">RUC</dt>
                <dd className="text-black tabular-nums">{empresa.ruc}</dd>
              </div>
              <div>
                <dt className="text-black/55">Domicilio</dt>
                <dd className="text-black">{empresa.domicilio}</dd>
              </div>
            </dl>

            <div className="mt-8 space-y-3 text-[13px] leading-relaxed text-black/65 measure">
              <p>
                Al registrar tu reclamo te mostramos la hoja con su número y fecha
                para que la imprimas o la guardes en PDF. Te respondemos por
                correo en un plazo máximo de 15 días hábiles.
              </p>
              <p>
                La formulación del reclamo no impide acudir a otras vías de
                solución de controversias ni es requisito previo para interponer
                una denuncia ante el INDECOPI.
              </p>
            </div>
          </div>
        </header>

        <div className="lg:col-span-8 relative">
          <FormularioReclamo />
        </div>
      </div>
    </article>
  );
}
