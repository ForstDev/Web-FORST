import { NextRequest, NextResponse } from "next/server";
import { configGoogle, disponibilidad, ErrorAgenda, reservarCita } from "@/lib/citas/google";
import { diaReservable, horariosDelDia } from "@/lib/citas/horarios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const intentos = new Map<string, { cantidad: number; hasta: number }>();
const json = (datos: unknown, status = 200) => NextResponse.json(datos, { status, headers: { "Cache-Control": "no-store" } });

function limitar(req: NextRequest, maximo: number, accion: string) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const clave = `${accion}:${ip}`;
  const ahora = Date.now();
  for (const [k, v] of intentos) if (v.hasta < ahora) intentos.delete(k);
  const registro = intentos.get(clave) ?? { cantidad: 0, hasta: ahora + 600000 };
  registro.cantidad++;
  if (intentos.size >= 10000 && !intentos.has(clave)) return false;
  intentos.set(clave, registro);
  return registro.cantidad <= maximo;
}

function fallo(e: unknown) {
  return json({ error: e instanceof ErrorAgenda ? e.message : "No pudimos conectar con Google Calendar. Vuelve a intentarlo." }, e instanceof ErrorAgenda ? e.status : 503);
}

export async function GET(req: NextRequest) {
  if (!limitar(req, 120, "leer")) return json({ error: "Espera unos minutos antes de consultar más horarios." }, 429);
  if (!configGoogle()) return json({ configurada: false, horarios: [] });
  const fecha = req.nextUrl.searchParams.get("fecha") || "";
  if (!diaReservable(fecha)) return json({ error: "Elige un día laborable dentro de los próximos 60 días." }, 400);
  try { return json({ configurada: true, horarios: await disponibilidad(fecha) }); } catch (e) { return fallo(e); }
}

export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin) return json({ error: "Envía la reserva desde esta web." }, 403);
  if (!limitar(req, 5, "reservar")) return json({ error: "Has realizado varios intentos. Espera unos minutos o contáctanos." }, 429);
  if (!configGoogle()) return json({ error: "La agenda todavía no está habilitada." }, 503);
  const cuerpo = await req.text();
  if (cuerpo.length > 5000) return json({ error: "El mensaje es demasiado largo." }, 413);
  let b: Record<string, unknown>;
  try { b = JSON.parse(cuerpo); } catch { return json({ error: "No pudimos leer tus datos." }, 400); }
  if (!b || typeof b !== "object" || Array.isArray(b)) return json({ error: "Revisa los datos de la reserva." }, 400);
  const texto = (k: string, max: number) => typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : "";
  const datos = { fecha: texto("fecha", 10), hora: texto("hora", 5), nombre: texto("nombre", 100), correo: texto("correo", 254), negocio: texto("negocio", 120), mensaje: texto("mensaje", 1000), solicitudId: texto("solicitudId", 36) };
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(datos.solicitudId)) return json({ error: "Recarga la página y vuelve a intentar la reserva." }, 422);
  if (b.sitio || b.acepta !== true || datos.nombre.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) return json({ error: "Completa tu nombre, un correo válido y acepta el uso de tus datos para la cita." }, 422);
  if (!horariosDelDia(datos.fecha).includes(datos.hora)) return json({ error: "Elige un horario disponible con al menos 4 horas de anticipación." }, 422);
  try { return json({ ok: true, ...await reservarCita(datos) }); } catch (e) { return fallo(e); }
}
