"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { configPortal, portalHabilitado } from "@/lib/portal/config";
import { cerrarSesionCookie, crearSesion, verificarCredenciales } from "@/lib/portal/sesion";

export type EstadoLogin = { error: string | null; email: string };

/** Freno de intentos por IP: 5 fallidos cada 15 minutos. En memoria,
 * suficiente para el prototipo local. */
const VENTANA_MS = 15 * 60 * 1000;
const MAX_FALLOS = 5;
const fallos = new Map<string, number[]>();

function recientes(ip: string) {
  const ahora = Date.now();
  const lista = (fallos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  fallos.set(ip, lista);
  return lista;
}

export async function iniciarSesion(_prev: EstadoLogin, form: FormData): Promise<EstadoLogin> {
  const email = String(form.get("email") ?? "").trim().slice(0, 120);
  const clave = String(form.get("password") ?? "").slice(0, 200);

  if (!portalHabilitado()) return { error: "El portal no está disponible.", email };
  if (!configPortal()) {
    return { error: "El portal todavía no está configurado en este equipo.", email };
  }
  if (!email || !clave) return { error: "Escribe tu correo y tu contraseña.", email };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (recientes(ip).length >= MAX_FALLOS) {
    return { error: "Hubo varios intentos seguidos. Espera unos minutos y vuelve a probar.", email };
  }

  if (!(await verificarCredenciales(email, clave))) {
    recientes(ip).push(Date.now());
    // Mismo mensaje para correo o contraseña: no revela cuál falló.
    return { error: "Correo o contraseña incorrectos.", email };
  }

  fallos.delete(ip);
  await crearSesion(email);
  redirect("/clientes/panel");
}

export async function cerrarSesion() {
  await cerrarSesionCookie();
  redirect("/clientes");
}
