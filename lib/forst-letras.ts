/**
 * Letras del nombre "FORST" en Lexend Giga, compartidas por el cartel del
 * Hero y el logo del header: los dos usan la misma caja por letra, así el
 * nombre que viaja al header aterriza encima del logo real sin diferencias.
 *
 * Cada ancho es el de la letra en su peso más grueso (900), en em. Cada
 * letra vive en una caja de ese ancho: cuando el cursor cambia los grosores
 * en el Hero, las letras engordan o adelgazan dentro de su caja y el nombre
 * no se mueve de lado.
 */
export const LETRAS = [
  { ch: "F", ancho: 0.795 },
  { ch: "O", ancho: 1.013 },
  { ch: "R", ancho: 0.884 },
  { ch: "S", ancho: 0.818 },
  { ch: "T", ancho: 0.865 },
] as const;

/** Ancho total del nombre en em (4.375). */
export const ANCHO_TOTAL = LETRAS.reduce((s, l) => s + l.ancho, 0);
