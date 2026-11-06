"use client";

import { useState, type FormEvent } from "react";

export default function ConectarGoogle() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function conectar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;
    const datos = new FormData(e.currentTarget);
    setEnviando(true);
    setError("");
    try {
      // Validar en el propio dominio; la navegación posterior no es una
      // redirección de formulario bloqueada por form-action 'self'.
      const respuesta = await fetch("/api/google/connect", {
        method: "POST", body: datos, headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.error || "No pudimos iniciar la conexión.");
      const destino = new URL(resultado.url);
      if (destino.origin !== "https://accounts.google.com" || destino.pathname !== "/o/oauth2/v2/auth") throw new Error("La dirección de autorización no es válida.");
      window.location.assign(destino.href);
    } catch (e) {
      setError(e instanceof Error && e.name !== "TimeoutError" ? e.message : "La conexión tardó demasiado. Vuelve a intentarlo.");
      setEnviando(false);
    }
  }

  return <form onSubmit={conectar} onInvalid={() => setError("Introduce tu clave de configuración completa: debe tener al menos 32 caracteres.")} className="flex flex-col gap-5">
    <label className="text-sm">Clave privada de configuración
      <input type="password" name="clave" required autoComplete="off" minLength={32} maxLength={512} disabled={enviando} aria-describedby="ayuda-clave" className="block w-full p-3 border border-[var(--forst-line)] rounded-lg mt-2" />
    </label>
    <button type="submit" disabled={enviando} className="rounded-full px-6 py-3 bg-[var(--forst-green)] text-white text-sm self-start disabled:opacity-50">{enviando ? "Abriendo Google…" : "Autorizar con Google"}</button>
    {error && <p role="alert" className="text-sm leading-6 border border-[var(--forst-line)] rounded-lg p-4">{error}</p>}
    <p id="ayuda-clave" className="text-xs leading-6">Usa el valor de GOOGLE_SETUP_SECRET, no el secreto de cliente de Google. Google solicitará acceso a tu disponibilidad y a los eventos de tus calendarios.</p>
    <noscript>Activa JavaScript para iniciar la autorización con Google.</noscript>
  </form>;
}
