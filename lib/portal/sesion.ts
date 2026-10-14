import "server-only";
import { createHmac, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { cache } from "react";
import { configPortal } from "@/lib/portal/config";

const scryptAsync = promisify(scrypt) as (
  clave: string,
  sal: Buffer,
  largo: number
) => Promise<Buffer>;

export const COOKIE_SESION = "forst_portal";
const DURACION_S = 8 * 60 * 60;

/** Compara la contraseña con el hash guardado en .env.local
 * (formato `scrypt:<sal hex>:<hash hex>`, ver scripts/hash-password.mjs).
 * La comparación es de tiempo constante. */
export async function verificarCredenciales(email: string, clave: string) {
  const cfg = configPortal();
  if (!cfg) return false;
  const [algoritmo, salHex, hashHex] = cfg.hash.split(":");
  if (algoritmo !== "scrypt" || !salHex || !hashHex) return false;
  const esperado = Buffer.from(hashHex, "hex");
  const calculado = await scryptAsync(clave, Buffer.from(salHex, "hex"), esperado.length);
  const claveOk = timingSafeEqual(calculado, esperado);
  // Se calcula el hash aunque el correo no coincida, así el tiempo de
  // respuesta no revela si el correo existe.
  const correoOk = email.trim().toLowerCase() === cfg.email;
  return claveOk && correoOk;
}

function firmar(datos: string, secreto: string) {
  return createHmac("sha256", secreto).update(datos).digest("base64url");
}

export async function crearSesion(email: string) {
  const cfg = configPortal();
  if (!cfg) throw new Error("Portal sin configurar");
  const carga = Buffer.from(
    JSON.stringify({ sub: email.trim().toLowerCase(), exp: Math.floor(Date.now() / 1000) + DURACION_S })
  ).toString("base64url");
  const almacen = await cookies();
  almacen.set(COOKIE_SESION, `${carga}.${firmar(carga, cfg.secreto)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/clientes",
    maxAge: DURACION_S,
  });
}

export async function cerrarSesionCookie() {
  const almacen = await cookies();
  almacen.set(COOKIE_SESION, "", { path: "/clientes", maxAge: 0 });
}

/** Lee y valida la sesión. Devuelve el correo del cliente o null. Se
 * memoriza por petición con `cache` para no repetir el trabajo si varias
 * partes de la página la piden. */
export const leerSesion = cache(async (): Promise<{ email: string } | null> => {
  const cfg = configPortal();
  if (!cfg) return null;
  const valor = (await cookies()).get(COOKIE_SESION)?.value;
  if (!valor) return null;
  const [carga, firma] = valor.split(".");
  if (!carga || !firma) return null;
  const esperada = Buffer.from(firmar(carga, cfg.secreto));
  const recibida = Buffer.from(firma);
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return null;
  try {
    const { sub, exp } = JSON.parse(Buffer.from(carga, "base64url").toString()) as { sub: string; exp: number };
    if (typeof exp !== "number" || exp < Date.now() / 1000) return null;
    return { email: sub };
  } catch {
    return null;
  }
});
