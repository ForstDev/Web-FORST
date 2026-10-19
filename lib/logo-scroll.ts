import { motionValue } from "motion/react";

/**
 * Progreso de la transición "cartel → logo" del Inicio, de 0 a 1.
 *
 * 0: arriba del todo, el nombre FORST ocupa el ancho del Hero y el header
 * no muestra logo. 1: el nombre ya llegó al lugar del logo y el logo real
 * del header lo reemplaza. El Hero lo escribe al hacer scroll y el header
 * lo lee; vive acá porque los dos componentes no se tocan entre sí.
 */
export const progresoLogo = motionValue(0);
