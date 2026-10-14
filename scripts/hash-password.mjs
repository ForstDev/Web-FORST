// Genera el hash de una contraseña para PORTAL_DEMO_PASSWORD_HASH.
//   node scripts/hash-password.mjs "la-contraseña"
// Copia la línea que imprime en .env.local. La contraseña en texto no se
// guarda en ningún lado.
import { randomBytes, scryptSync } from "node:crypto";

const clave = process.argv[2];
if (!clave || clave.length < 10) {
  console.error('Uso: node scripts/hash-password.mjs "contraseña de al menos 10 caracteres"');
  process.exit(1);
}
const sal = randomBytes(16);
const hash = scryptSync(clave, sal, 32);
// Separador ":" y no "$": Next expande "$VARIABLE" dentro de .env.
console.log(`PORTAL_DEMO_PASSWORD_HASH=scrypt:${sal.toString("hex")}:${hash.toString("hex")}`);
