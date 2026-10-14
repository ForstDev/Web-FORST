import { NextRequest, NextResponse } from "next/server";
import {
  ErrorConfiguracion,
  ErrorValidacion,
  registrarReclamo,
  validarReclamo,
} from "@/lib/reclamos";

/** Límite simple por IP: 5 envíos cada 10 minutos. Vive en la memoria de
 * cada instancia, así que en Vercel no es exacto, pero corta el abuso
 * más común (alguien reenviando el formulario en bucle). */
const VENTANA_MS = 10 * 60 * 1000;
const MAX_ENVIOS = 5;
const envios = new Map<string, number[]>();

function excedeLimite(ip: string) {
  const ahora = Date.now();
  const recientes = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (recientes.length >= MAX_ENVIOS) {
    envios.set(ip, recientes);
    return true;
  }
  recientes.push(ahora);
  envios.set(ip, recientes);
  if (envios.size > 5000) envios.clear();
  return false;
}

function error(mensaje: string, status: number, campo?: string) {
  return NextResponse.json({ ok: false, mensaje, campo }, { status });
}

export async function POST(req: NextRequest) {
  // Solo se aceptan envíos hechos desde el propio sitio.
  let hostOrigen = "";
  try {
    hostOrigen = new URL(req.headers.get("origin") ?? "").host;
  } catch {}
  if (!hostOrigen || hostOrigen !== req.headers.get("host")) {
    return error("Envía el reclamo desde el formulario del sitio.", 403);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (excedeLimite(ip)) {
    return error("Recibimos varios envíos seguidos. Espera unos minutos y vuelve a intentarlo.", 429);
  }

  const crudo = await req.text();
  if (crudo.length > 20_000) return error("El texto es demasiado largo.", 413);

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = JSON.parse(crudo);
  } catch {
    return error("No pudimos leer el formulario. Vuelve a intentarlo.", 400);
  }

  // Campo trampa: invisible para personas, los programas lo llenan.
  // Se responde como si todo saliera bien para no darles pistas.
  if (typeof cuerpo.sitio === "string" && cuerpo.sitio.length > 0) {
    return NextResponse.json({ ok: true, numero: "000000-0000", fecha: new Date().toISOString() });
  }

  try {
    const datos = validarReclamo(cuerpo);
    const registrado = await registrarReclamo(datos);
    return NextResponse.json({ ok: true, ...registrado });
  } catch (e) {
    if (e instanceof ErrorValidacion) return error(e.message, 422, e.campo);
    if (e instanceof ErrorConfiguracion) {
      console.error("reclamos:", e.message);
      return error(
        "El libro de reclamaciones no está disponible en este momento. Escríbenos a forst.pe@outlook.com y registramos tu reclamo.",
        503
      );
    }
    console.error("reclamos:", e);
    return error("No pudimos registrar tu reclamo. Vuelve a intentarlo en unos minutos.", 500);
  }
}
