import Link from "next/link";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import Resaltado from "@/components/ui/Resaltado";

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

          <div className="flex gap-16">
            <nav className="flex flex-col gap-3 text-sm">
              <span className="text-white/55 text-xs tracking-wider uppercase mb-1">
                Mapa
              </span>
              {nav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-white/75 hover:text-[var(--forst-white)] transition-colors w-fit"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 text-sm">
              <span className="text-white/55 text-xs tracking-wider uppercase mb-1">
                Contacto
              </span>
              <a
                href="https://wa.me/51962316856"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 hover:text-[var(--forst-white)] transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="mailto:forst.pe@outlook.com"
                className="text-white/75 hover:text-[var(--forst-white)] transition-colors"
              >
                forst.pe@outlook.com
              </a>
              <span className="text-white/75">Lima, Perú</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/55">
          <p>© {new Date().getFullYear()} FORST. Plataforma empresarial.</p>
          <p>
            <Resaltado>La entrega no es el final.</Resaltado>
          </p>
        </div>
      </div>
    </footer>
  );
}
