"use client";

import { useRef, useState } from "react";
import { X, Smartphone, Landmark, CreditCard, Info } from "lucide-react";

const METODOS = [
  { id: "yape", nombre: "Yape o Plin", Icono: Smartphone },
  { id: "transferencia", nombre: "Transferencia bancaria", Icono: Landmark },
  { id: "tarjeta", nombre: "Tarjeta de crédito o débito", Icono: CreditCard },
] as const;

/**
 * Botón "Pagar mantenimiento" y su ventana. Es un prototipo: no procesa
 * pagos ni pide datos de tarjeta. Al confirmar abre WhatsApp con el
 * detalle para coordinar el pago con FORST. Usa <dialog> nativo, que ya
 * maneja el foco, Escape y el fondo inerte.
 */
export default function BotonPagar({
  concepto,
  periodo,
  monto,
  empresa,
}: {
  concepto: string;
  periodo: string;
  monto: string;
  empresa: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [metodo, setMetodo] = useState<(typeof METODOS)[number]["id"]>("yape");
  const nombreMetodo = METODOS.find((m) => m.id === metodo)!.nombre;

  const whatsapp = `https://wa.me/51962316856?text=${encodeURIComponent(
    `Hola FORST, soy de ${empresa}. Quiero pagar el ${concepto.toLowerCase()} de ${periodo} (${monto}) con ${nombreMetodo}.`
  )}`;

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex items-center justify-center rounded-full bg-[var(--forst-green)] px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] text-white transition-[background-color,transform] hover:bg-[var(--forst-green-soft)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forst-green)]"
      >
        Pagar mantenimiento
      </button>

      <dialog
        ref={ref}
        aria-labelledby="pago-titulo"
        className="m-auto w-[min(30rem,calc(100vw-2rem))] rounded-3xl bg-[var(--forst-white)] p-0 text-[var(--forst-black)] shadow-[0_30px_80px_rgba(0,46,44,0.3)] backdrop:bg-[rgba(0,46,44,0.45)] backdrop:backdrop-blur-sm"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="t-eyebrow text-black/55">Pago</p>
              <h2 id="pago-titulo" className="mt-2 font-display text-xl font-medium leading-snug">
                {concepto} de {periodo}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Cerrar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/60 hover:bg-black/5 hover:text-black"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <p className="mt-5 font-display text-[2rem] font-medium tabular-nums text-[var(--forst-green)]">{monto}</p>

          <fieldset className="mt-6">
            <legend className="text-[13px] font-medium">Cómo quieres pagar</legend>
            <div className="mt-3 space-y-2">
              {METODOS.map(({ id, nombre, Icono }) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--forst-line)] px-4 py-3 text-[14px] transition-colors has-[:checked]:border-[var(--forst-green)] has-[:checked]:bg-[var(--forst-tint)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--forst-green)]/30"
                >
                  <input
                    type="radio"
                    name="metodo"
                    value={id}
                    checked={metodo === id}
                    onChange={() => setMetodo(id)}
                    className="accent-[var(--forst-green)]"
                  />
                  <Icono className="h-4 w-4 text-[var(--forst-green)]" aria-hidden />
                  {nombre}
                </label>
              ))}
            </div>
          </fieldset>

          <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-[#f3e4d8] p-3.5 text-[13px] leading-relaxed text-[#6b4126]">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Versión de prueba: todavía no procesamos pagos en línea. Al
            continuar se abre WhatsApp con el detalle para coordinar tu pago.
          </p>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => ref.current?.close()}
            className="mt-6 flex w-full items-center justify-center rounded-full bg-[var(--forst-green)] px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] text-white hover:bg-[var(--forst-green-soft)]"
          >
            Continuar por WhatsApp
          </a>
        </div>
      </dialog>
    </>
  );
}
