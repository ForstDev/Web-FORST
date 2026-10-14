import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import FormularioLogin from "@/components/portal/FormularioLogin";
import { leerSesion } from "@/lib/portal/sesion";

export default async function LoginClientesPage() {
  if (await leerSesion()) redirect("/clientes/panel");

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden flex items-center justify-center px-4 py-20">
      {/* Fondo: un fotograma del video del Hero anterior, a calidad
          completa. El video original pesa 24 MB y su movimiento casi no
          se nota detrás de la tarjeta; la foto, con un acercamiento muy
          lento, da la misma sensación y carga al instante. */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-[var(--forst-green)]">
        <Image
          src="https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/fotograma_login.jpg"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-[65%_center] login-acercamiento"
        />
        {/* Velo verde en los bordes: la tarjeta queda al centro sin
            competir con el cielo ni con el follaje más brillante. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,46,44,0.12)_0%,rgba(0,46,44,0.38)_70%,rgba(0,46,44,0.6)_100%)]" />
      </div>

      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-6 inline-flex items-center gap-2 rounded-full bg-[rgba(0,46,44,0.45)] px-4 py-2 text-[13px] text-white backdrop-blur-sm hover:bg-[rgba(0,46,44,0.65)] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Volver al sitio
      </Link>

      <div className="w-full max-w-[25rem] rounded-[1.75rem] bg-[var(--forst-white)] px-7 py-9 md:px-10 md:py-11 shadow-[0_30px_80px_rgba(0,30,28,0.35)]">
        <div className="flex flex-col items-center text-center">
          <AnimatedLogo size={52} />
          <span className="mt-3 font-logo text-lg tracking-[0.06em] text-[var(--forst-green)]">FORST</span>

          <p className="mt-7 t-eyebrow text-black/50">Portal de clientes</p>
          <h1 className="mt-3 font-display text-[1.6rem] leading-tight font-medium text-black">
            Ingresa a tu cuenta
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-black/60">
            Revisa tus pagos, tu plan y tus comprobantes.
          </p>
        </div>

        <FormularioLogin />

        <p className="mt-8 border-t border-[var(--forst-line)] pt-5 text-center text-[12px] leading-relaxed text-black/55">
          Prototipo con datos de ejemplo. Si eres cliente y no tienes acceso,{" "}
          <a
            href="https://wa.me/51962316856?text=Hola%20FORST%2C%20necesito%20acceso%20al%20portal%20de%20clientes."
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-[var(--forst-green)] hover:text-black"
          >
            escríbenos por WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  );
}
