import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { configOAuth, COOKIE_OAUTH, SCOPES_CITAS } from "@/lib/citas/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const escapar = (texto: string) => texto.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function pagina(mensaje: string, token?: string) {
  const respuesta = new NextResponse(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>Conectar agenda — FORST</title><style>body{font-family:system-ui;background:#f7f6f2;color:#002e2c;max-width:650px;margin:12vh auto;padding:24px;line-height:1.7}textarea{box-sizing:border-box;width:100%;padding:16px;background:transparent;border:1px solid #002e2c;border-radius:8px;overflow-wrap:anywhere}a{color:inherit}h1{line-height:1.2}</style></head><body><h1>${token ? "Cuenta autorizada." : "No se completó la conexión."}</h1><p>${escapar(mensaje)}</p>${token ? `<p>Copia esta línea en <strong>.env.local</strong> y en las variables privadas de Vercel. Reinicia el servidor o vuelve a desplegar.</p><textarea readonly rows="5" aria-label="Variable privada de Google Calendar">GOOGLE_REFRESH_TOKEN=${escapar(token)}</textarea><p>Este valor da acceso a tu calendario. No lo compartas por chat ni lo subas a Git. Después de guardarlo, cierra esta pestaña y elimina GOOGLE_SETUP_SECRET para deshabilitar nuevas conexiones.</p>` : ""}<a href="/citas">Volver a la agenda</a></body></html>`, {
    status: token ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer", "X-Frame-Options": "DENY", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" },
  });
  respuesta.cookies.set(COOKIE_OAUTH, "", { path: "/api/google", maxAge: 0 });
  return respuesta;
}

export async function GET(req: NextRequest) {
  const cfg = configOAuth();
  if (!cfg) return pagina("Falta la configuración privada del servidor.");
  let sesion: { state: string; verifier: string };
  try { sesion = JSON.parse(req.cookies.get(COOKIE_OAUTH)?.value || ""); } catch { return pagina("La conexión expiró. Vuelve a iniciarla desde /citas/conectar."); }
  const state = req.nextUrl.searchParams.get("state") || "";
  if (typeof sesion.state !== "string" || typeof sesion.verifier !== "string") return pagina("La conexión no es válida. Vuelve a iniciarla.");
  const a = Buffer.from(state), b = Buffer.from(sesion.state);
  if (!a.length || a.length !== b.length || !timingSafeEqual(a, b)) return pagina("No pudimos verificar la conexión. Vuelve a iniciarla.");
  if (req.nextUrl.searchParams.has("error")) return pagina("No autorizaste la conexión. Puedes volver a intentarlo.");
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return pagina("Google no devolvió un código de autorización.");
  try {
    const respuesta = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(15000),
      body: new URLSearchParams({ client_id: cfg.clientId, client_secret: cfg.clientSecret, code, code_verifier: sesion.verifier, redirect_uri: cfg.redirectUri, grant_type: "authorization_code" }),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) return pagina("Google no pudo completar la autorización. Revisa el ID, el secreto y la URI de redireccionamiento.");
    const scopes = new Set(String(datos.scope || "").split(" "));
    if (!SCOPES_CITAS.every(scope => scopes.has(scope))) return pagina("Faltan permisos. Autoriza disponibilidad y eventos de tus calendarios al volver a conectar.");
    if (!datos.refresh_token) return pagina("No se recibió un token permanente. Inicia de nuevo la autorización y acepta los permisos.");
    return pagina("La cuenta de Google quedó autorizada. Falta guardar el token privado para habilitar las reservas.", datos.refresh_token);
  } catch { return pagina("No pudimos comunicarnos con Google. Vuelve a iniciar la conexión."); }
}
