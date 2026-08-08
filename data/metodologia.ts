/**
 * La Metodología FORST — el proceso real con el que se trabaja cada
 * proyecto. Cada letra del nombre es una fase. Se muestra en /nosotros
 * y en el proceso de /servicios.
 */

export type Fase = {
  letra: string;
  nombre: string;
  texto: string;
};

export const metodologia: Fase[] = [
  {
    letra: "F",
    nombre: "Foundations",
    texto:
      "Antes de diseñar nada, entendemos tu negocio a fondo. Qué vendes, a quién le vendes y qué necesitas que tu proyecto digital haga por ti.",
  },
  {
    letra: "O",
    nombre: "Orientation",
    texto:
      "Definimos el rumbo creativo. Cómo se ve, se siente y se mueve tu marca en digital, antes de construir una sola pantalla.",
  },
  {
    letra: "R",
    nombre: "Resources",
    texto:
      "Reunimos todo lo que el proyecto necesita para avanzar sin frenar a mitad de camino. Textos, fotos, accesos y contenidos, listos antes de programar.",
  },
  {
    letra: "S",
    nombre: "Synthesis",
    texto:
      "Diseñamos y armamos el proyecto completo para que lo apruebes antes de construirlo. Así sabes exactamente qué vas a recibir.",
  },
  {
    letra: "T",
    nombre: "Tuning",
    texto:
      "Construimos, probamos y lanzamos. Y nos quedamos después, midiendo resultados y ajustando lo que haga falta.",
  },
];
