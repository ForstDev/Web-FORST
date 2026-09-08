"use client";

import { useRouter } from "next/navigation";

/**
 * "Volver" en vez de "Volver a casos": si entraste a este caso desde la
 * home (no desde /portafolio), un link fijo a /portafolio te sacaba de
 * donde realmente estabas. router.back() en cambio repite la navegación
 * real del visitante — vuelve a la home si viniste de ahí, a /portafolio
 * si viniste de ahí — y dispara un popstate real, que es lo que
 * SmoothScrollProvider usa para restaurar el scroll exacto de esa página.
 */
export default function VolverBoton({
  acento,
  claro,
}: {
  acento: string;
  claro?: boolean;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`group inline-flex items-center gap-3 text-sm transition-colors mb-6 cursor-pointer ${
        claro ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"
      }`}
    >
      <span
        className="w-1.5 h-1.5 rotate-45 group-hover:-translate-x-1 transition-transform"
        style={{ background: acento }}
      />
      Volver
    </button>
  );
}
