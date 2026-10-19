"use client";

import Link from "next/link";
import { Power } from "lucide-react";

/**
 * Acceso al portal de clientes: un ícono de encendido que, al pasar el
 * mouse (o al llegar con el teclado), se estira y muestra "Sign in". En
 * táctil no hay hover, así que el toque lleva directo al login.
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
        className="group flex h-9 items-center rounded-full px-[0.6rem] text-[13px] uppercase tracking-wide text-[var(--forst-black)] transition-colors hover:bg-black/[0.04] hover:text-[var(--forst-green)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forst-green)]"
      >
        <Power className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-2 group-hover:max-w-[5rem] group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-[5rem] group-focus-visible:opacity-100">
          Sign in
        </span>
      </Link>
    </div>
  );
}
