import type { Metadata } from "next";
import Link from "next/link";
import { configOAuth } from "@/lib/citas/oauth";
import ConectarGoogle from "@/components/citas/ConectarGoogle";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Conectar agenda — FORST", robots: { index: false, follow: false } };

export default function ConectarAgendaPage() {
  const lista = !!configOAuth();
  return <section className="max-w-xl mx-auto px-6 pt-36 pb-24 text-[var(--forst-green)]">
    <h1 className="font-display text-3xl mb-5">Conecta la agenda de FORST.</h1>
    <p className="text-sm leading-7 mb-7">Acceso exclusivo para quien administra la agenda. Autoriza la cuenta que recibirá las citas; los visitantes no necesitan conectar su cuenta.</p>
    {lista ? <ConectarGoogle /> : <p className="text-sm leading-7 border border-[var(--forst-line)] rounded-xl p-5">Falta la configuración privada de Google. Sigue las instrucciones de <code>docs/citas.md</code> en el repositorio y reinicia el servidor.</p>}
    <Link href="/citas" className="inline-block text-xs underline underline-offset-4 mt-8">Volver a la agenda</Link>
  </section>;
}
