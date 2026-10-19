"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";

/**
 * Acceso al portal de clientes: pastilla con un ícono de persona y la etiqueta "Sign in" siempre visible, sin
 * efectos que dependan del hover. Comparte el estilo de la pastilla "Contacto" del header (mismo fondo por la
 * prop `fondo`, mismo color y hover) y muestra un contorno verde al llegar con el teclado.
 */
export default function BotonSignIn({
  fondo = "border border-[var(--forst-line)]",
}: {
  fondo?: string;
}) {
  return (
    <div className={`rounded-full p-1 transition-colors duration-500 ${fondo}`}>
      <Link
        href="/clientes"
        aria-label="Sign in, acceso clientes"
        className="flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[13px] uppercase tracking-wide text-[var(--forst-black)] transition-colors hover:bg-black/[0.04] hover:text-[var(--forst-green)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forst-green)] xl:px-4"
      >
        <UserRound className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
        <span>Sign in</span>
      </Link>
    </div>
  );
}
