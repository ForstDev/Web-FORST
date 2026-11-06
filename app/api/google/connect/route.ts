import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { configOAuth, COOKIE_OAUTH, SCOPES_CITAS } from "@/lib/citas/oauth";

export const runtime = "nodejs";
const error = (mensaje: string, status: number) => NextResponse.json({ error: mensaje }, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(req: NextRequest) {
  const cfg = configOAuth();
  if (!cfg) return error("Falta configurar Google Calendar en el servidor. Revisa las variables y reinicia el servidor.", 503);
  if (req.headers.get("origin") !== cfg.origin) return error(`Abre el asistente desde ${cfg.origin}/citas/conectar. Debe coincidir con GOOGLE_REDIRECT_URI.`, 403);
  if (Number(req.headers.get("content-length") || 0) > 4096) return error("Solicitud demasiado grande.", 413);
  let form: FormData;
  try { form = await req.formData(); } catch { return error("No pudimos leer la clave. Vuelve a intentarlo.", 400); }
  const clave = String(form.get("clave") || "");
  const recibida = createHash("sha256").update(clave).digest();
  const esperada = createHash("sha256").update(cfg.setupSecret).digest();
  if (!timingSafeEqual(recibida, esperada)) return error("Clave incorrecta. Usa el valor de GOOGLE_SETUP_SECRET de tu archivo .env.local y comprueba que reiniciaste el servidor.", 403);
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: cfg.clientId, redirect_uri: cfg.redirectUri, response_type: "code", scope: SCOPES_CITAS.join(" "), access_type: "offline", prompt: "consent", state, code_challenge: challenge, code_challenge_method: "S256" }).toString();
  const respuesta = NextResponse.json({ url: url.toString() });
  respuesta.headers.set("Cache-Control", "no-store");
  respuesta.cookies.set(COOKIE_OAUTH, JSON.stringify({ state, verifier }), { httpOnly: true, secure: cfg.origin.startsWith("https:"), sameSite: "lax", path: "/api/google", maxAge: 600 });
  return respuesta;
}
