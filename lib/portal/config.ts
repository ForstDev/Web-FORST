import "server-only";

/**
 * El portal de clientes es un prototipo. Existe solo donde están sus
 * tres variables (PORTAL_DEMO_EMAIL, PORTAL_DEMO_PASSWORD_HASH y
 * PORTAL_SESSION_SECRET): en local vienen de .env.local y en producción
 * de las variables de Vercel. Sin ellas, /clientes responde 404 y el
 * enlace del footer no aparece. Para apagarlo basta con borrarlas.
 * Las credenciales nunca van en el código.
 */
export function configPortal() {
  const email = process.env.PORTAL_DEMO_EMAIL?.trim().toLowerCase();
  const hash = process.env.PORTAL_DEMO_PASSWORD_HASH?.trim();
  const secreto = process.env.PORTAL_SESSION_SECRET?.trim();
  if (!email || !hash || !secreto || secreto.length < 32) return null;
  return { email, hash, secreto };
}

export function portalHabilitado() {
  return configPortal() !== null;
}
