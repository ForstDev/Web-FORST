import Link from "next/link";
import { BookOpenText } from "lucide-react";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import BotonConfigurarCookies from "@/components/analytics/BotonConfigurarCookies";
import { empresa } from "@/data/empresa";
import { portalHabilitado } from "@/lib/portal/config";

const legales = [
  { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
  { href: "/politica-de-privacidad", label: "Privacidad" },
  { href: "/politica-de-cookies", label: "Cookies" },
];

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="relative bg-black text-white">
      <div className="relative z-10 max-w-[104rem] mx-auto px-6 md:px-10 pt-14 pb-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-10 border-b border-white/15">
          <div>
            <div className="flex items-center gap-4">
              <AnimatedLogo
                size={44}
                color="var(--forst-white)"
                bg="var(--forst-black)"
                animateOnMount={false}
              />
              <span className="font-logo text-2xl md:text-3xl tracking-[0.04em]">
                FORST
              </span>
            </div>
            <p className="mt-6 max-w-sm text-sm text-white/60 leading-relaxed">
              Plataforma empresarial para negocios listos para evolucionar.
              Nos quedamos contigo después de la entrega.
            </p>
          </div>

          {/* `py-2` en cada enlace: con solo el alto de la línea, el área
              táctil quedaba en 20px, por debajo del mínimo de 24px que pide
              la WCAG y muy incómoda para el dedo en una lista apretada. El
              `gap` baja de 3 a 1 para compensar, así el espaciado visual
              queda casi igual y lo que crece es la zona tocable. */}
          <div className="flex gap-16">
            <nav className="flex flex-col gap-1 text-sm">
              <span className="text-white/55 text-xs tracking-wider uppercase mb-1">
                Mapa
              </span>
              {nav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-2 text-white/75 hover:text-[var(--forst-white)] transition-colors w-fit"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-1 text-sm">
              <span className="text-white/55 text-xs tracking-wider uppercase mb-1">
                Contacto
              </span>
              <a
                href={empresa.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 w-fit text-white/75 hover:text-[var(--forst-white)] transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${empresa.correo}`}
                className="py-2 w-fit text-white/75 hover:text-[var(--forst-white)] transition-colors"
              >
                {empresa.correo}
              </a>
              <span className="py-2 text-white/75">Lima, Perú</span>
              {/* Solo aparece donde el portal está activo (en local, por
                  ahora). En producción el enlace no existe. */}
              {portalHabilitado() && (
                <Link
                  href="/clientes"
                  className="py-2 w-fit text-white/75 hover:text-[var(--forst-white)] transition-colors"
                >
                  Acceso clientes
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Datos legales y enlaces. El Código del Consumidor pide razón
            social y RUC visibles donde se ofrecen los servicios, y la Ley
            32495 un acceso permanente al libro de reclamaciones. */}
        <div className="pt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8 text-xs text-white/55">
          <div className="space-y-1.5 leading-relaxed">
            <p>
              © {new Date().getFullYear()} {empresa.razonSocial} · RUC {empresa.ruc}
            </p>
            <p>{empresa.domicilio}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1">
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5">
              {legales.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-2 text-white/65 hover:text-[var(--forst-white)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <BotonConfigurarCookies className="py-2 text-white/65 hover:text-[var(--forst-white)] transition-colors">
                Configurar cookies
              </BotonConfigurarCookies>
            </nav>
            <Link
              href="/libro-de-reclamaciones"
              className="mt-3 sm:mt-0 inline-flex w-fit items-center gap-2.5 rounded-lg border border-white/25 px-4 py-2.5 text-white/85 hover:border-white/60 hover:text-[var(--forst-white)] transition-colors"
            >
              <BookOpenText className="w-4 h-4" aria-hidden />
              Libro de reclamaciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
