/**
 * Geometría del isotipo FORST en un viewBox de 200×200.
 *
 * El símbolo real es un cuatrofolio: 4 círculos en disposición 2×2 que se
 * tocan entre sí, un "cojín" (cuadrado de lados cóncavos) en el color
 * opuesto cubriendo el centro, y un diamante del color base calado dentro.
 *
 * Estas constantes existen para que TODAS las piezas del sitio que juegan
 * con el logo (AnimatedLogo, Hero, marcadores de sección) compartan la
 * misma geometría en vez de re-dibujarla a mano.
 */

export const VIEWBOX = 200;
export const CENTER = 100;

/** Radio de cada círculo (pétalo). */
export const PETAL_R = 42;

/** Distancia del centro del símbolo al centro de cada círculo (en x e y). */
export const PETAL_OFFSET = 42;

/** Los 4 pétalos, con la dirección diagonal desde la que ensamblan. */
export const petals = [
  { id: "nw", cx: CENTER - PETAL_OFFSET, cy: CENTER - PETAL_OFFSET, dir: { x: -1, y: -1 } },
  { id: "ne", cx: CENTER + PETAL_OFFSET, cy: CENTER - PETAL_OFFSET, dir: { x: 1, y: -1 } },
  { id: "se", cx: CENTER + PETAL_OFFSET, cy: CENTER + PETAL_OFFSET, dir: { x: 1, y: 1 } },
  { id: "sw", cx: CENTER - PETAL_OFFSET, cy: CENTER + PETAL_OFFSET, dir: { x: -1, y: 1 } },
] as const;

/** Semi-lado del cojín (distancia del centro a cada esquina, en x e y). */
const CUSHION_C = 47.2;
/** Profundidad de la curva cóncava de cada lado del cojín. */
const CUSHION_K = 15.5;

const c0 = CENTER - CUSHION_C;
const c1 = CENTER + CUSHION_C;
const kIn0 = CENTER - CUSHION_C + CUSHION_K;
const kIn1 = CENTER + CUSHION_C - CUSHION_K;

/** Cuadrado de lados cóncavos que cubre el centro del cuatrofolio. */
export const CUSHION_PATH = [
  `M ${c0} ${c0}`,
  `Q ${CENTER} ${kIn0} ${c1} ${c0}`,
  `Q ${kIn1} ${CENTER} ${c1} ${c1}`,
  `Q ${CENTER} ${kIn1} ${c0} ${c1}`,
  `Q ${kIn0} ${CENTER} ${c0} ${c0}`,
  "Z",
].join(" ");

/** Semi-diagonal del diamante central. */
export const DIAMOND_D = 27.5;

export const DIAMOND_PATH = [
  `M ${CENTER} ${CENTER - DIAMOND_D}`,
  `L ${CENTER + DIAMOND_D} ${CENTER}`,
  `L ${CENTER} ${CENTER + DIAMOND_D}`,
  `L ${CENTER - DIAMOND_D} ${CENTER}`,
  "Z",
].join(" ");
