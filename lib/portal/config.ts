import "server-only";

/**
 * El portal de clientes es un prototipo: funciona con `npm run dev` y
 * en producción queda apagado (404) salvo que se active a propósito con
 * PORTAL_HABILITADO=true. Las credenciales de prueba y el secreto de la
 * sesión viven solo en .env.local, nunca en el código.
 */
export function portalHabilitado() {
  return process.env.NODE_ENV !== "production" || process.env.PORTAL_HABILITADO === "true";
}

export function configPortal() {
  const email = process.env.PORTAL_DEMO_EMAIL?.trim().toLowerCase();
  const hash = process.env.PORTAL_DEMO_PASSWORD_HASH?.trim();
  const secreto = process.env.PORTAL_SESSION_SECRET?.trim();
  if (!email || !hash || !secreto || secreto.length < 32) return null;
  return { email, hash, secreto };
}
