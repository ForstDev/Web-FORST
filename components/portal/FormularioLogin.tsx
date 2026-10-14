"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, CircleAlert } from "lucide-react";
import { iniciarSesion, type EstadoLogin } from "@/app/clientes/acciones";

const campo =
  "mt-2 w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-[15px] text-white placeholder:text-white/45 transition-colors focus:outline-none focus:border-white/70 focus:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/40";

export default function FormularioLogin() {
  const [estado, accion, enviando] = useActionState<EstadoLogin, FormData>(iniciarSesion, {
    error: null,
    email: "",
  });
  const [verClave, setVerClave] = useState(false);

  return (
    <form action={accion} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="text-[13px] font-medium text-white/90">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          defaultValue={estado.email}
          aria-invalid={estado.error ? true : undefined}
          aria-describedby={estado.error ? "login-error" : undefined}
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="password" className="text-[13px] font-medium text-white/90">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={verClave ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={estado.error ? true : undefined}
            aria-describedby={estado.error ? "login-error" : undefined}
            className={`${campo} pr-12`}
          />
          <button
            type="button"
            onClick={() => setVerClave((v) => !v)}
            aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={verClave}
            className="absolute right-1.5 top-[calc(50%+4px)] -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white/60"
          >
            {verClave ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {estado.error && (
        <p
          id="login-error"
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-[#ffb4a8]/40 bg-[#ffb4a8]/10 p-3.5 text-[14px] leading-snug text-[#ffd9d2]"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-full bg-[var(--forst-white)] px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--forst-green)] transition-[background-color,transform] hover:bg-white active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {enviando ? "Ingresando…" : "Ingresar"}
      </button>

      <p className="text-center text-[13px] text-white/70">
        ¿Olvidaste tu contraseña?{" "}
        <a
          href="https://wa.me/51962316856?text=Hola%20FORST%2C%20olvid%C3%A9%20mi%20contrase%C3%B1a%20del%20portal."
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 text-white hover:text-[var(--forst-tan)]"
        >
          Te ayudamos
        </a>
      </p>
    </form>
  );
}
