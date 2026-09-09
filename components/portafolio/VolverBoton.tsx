"use client";

import { useRouter } from "next/navigation";

/**
 * "Volver" en vez de "Volver a casos": si entraste a este caso desde la
 * home (no desde /portafolio), un link fijo a /portafolio te sacaba de
 * donde realmente estabas. router.back() en cambio repite la navegación
 * real del visitante — vuelve a la home si viniste de ahí, a /portafolio
 * si viniste de ahí.
 *
 * Antes de navegar, deja una marca explícita en sessionStorage: el
 * popstate que dispara router.back() es la señal "normal" para que
 * SmoothScrollProvider sepa que debe restaurar el scroll en vez de
 * mandar arriba de todo, pero llega de forma asíncrona y en producción
 * no siempre alcanza a tiempo antes de que se resuelva el destino. La
 * marca explícita no depende de ese timing.
 */
export default function VolverBoton({
  acento,
  claro,
}: {
  acento: string;
  claro?: boolean;
}) {
  const router = useRouter();

  const volver = () => {
    sessionStorage.setItem("forst-volver", "1");
    router.back();
  };

  return (
    <button
      onClick={volver}
      className={`group inline-flex items-center gap-3 mb-6 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
        claro
          ? "border-white/25 text-white/85 hover:bg-white/10 hover:border-white/50"
          : "border-[var(--forst-line)] text-black/75 hover:bg-black/[0.04] hover:border-black/30"
      }`}
    >
      <span
        className="w-1.5 h-1.5 shrink-0 rotate-45 group-hover:-translate-x-1 transition-transform"
        style={{ background: acento }}
      />
      Volver
    </button>
  );
}
