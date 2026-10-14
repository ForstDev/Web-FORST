import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import FormularioLogin from "@/components/portal/FormularioLogin";
import { leerSesion } from "@/lib/portal/sesion";
import { configPortal } from "@/lib/portal/config";

export default async function LoginClientesPage() {
  if (await leerSesion()) redirect("/clientes/panel");
  const configurado = configPortal() !== null;

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[var(--forst-green)] text-[var(--forst-white)] flex items-center justify-center px-6 py-24">
      {/* Fondo: manchas de luz de la paleta y la isla al costado. El
          vidrio necesita algo con color detrás para que se note. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-32 h-[34rem] w-[34rem] rounded-full bg-[var(--forst-tan)] opacity-35 blur-[120px]" />
        <div className="absolute -bottom-48 -left-40 h-[38rem] w-[38rem] rounded-full bg-[#2f7a6f] opacity-45 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(247,246,242,0.08),transparent_60%)]" />
        <div className="absolute right-[-6%] top-1/2 hidden w-[44%] max-w-[640px] -translate-y-1/2 opacity-90 md:block">
          <Image
            src="https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/hero-isla.webp"
            alt=""
            width={1122}
            height={1284}
            priority
            sizes="44vw"
            className="w-full h-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>

      <Link href="/" className="absolute left-6 top-6 md:left-10 md:top-8 flex items-center gap-2.5">
        <AnimatedLogo size={32} color="var(--forst-white)" bg="var(--forst-green)" animateOnMount={false} />
        <span className="font-logo text-base tracking-[0.04em]">FORST</span>
      </Link>

      <div className="vidrio w-full max-w-[26rem] rounded-[1.75rem] p-8 md:p-10 md:-translate-x-[18%]">
        <p className="t-eyebrow text-white/70">Portal de clientes</p>
        <h1 className="mt-4 font-display text-[1.75rem] leading-tight font-medium">
          Ingresa a tu cuenta
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/75">
          Revisa tus pagos, tu plan y tus comprobantes.
        </p>

        {configurado ? (
          <FormularioLogin />
        ) : (
          <p role="alert" className="mt-8 rounded-xl border border-white/25 bg-white/10 p-4 text-[14px] leading-relaxed">
            El portal todavía no está configurado en este equipo. Revisa las
            variables PORTAL_ del archivo .env.local.
          </p>
        )}

        <p className="mt-8 border-t border-white/15 pt-5 text-[12px] leading-relaxed text-white/65">
          Prototipo con datos de ejemplo. Si eres cliente y no tienes acceso,{" "}
          <a
            href="https://wa.me/51962316856?text=Hola%20FORST%2C%20necesito%20acceso%20al%20portal%20de%20clientes."
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-white hover:text-[var(--forst-tan)]"
          >
            escríbenos por WhatsApp
          </a>
          .
        </p>
      </div>
    </section>
  );
}
