"use client";

import { useEffect } from "react";
import { recorridoLogo } from "@/lib/logo-scroll";

/**
 * Asentado direccional del viaje "cartel → logo" del Inicio.
 *
 * Si el usuario deja de hacer scroll con la rueda o el teclado mientras el
 * nombre del Hero está a mitad de camino, la página termina sola el tramo
 * hacia donde iba: abajo hasta que el nombre se acopla al header, o arriba
 * hasta el cartel completo. Así el viaje nunca queda a medias.
 *
 * Solo se arma por intención del usuario (rueda o teclas de scroll). El
 * scroll por foco (Tab), por ancla, por restauración del historial o por
 * el "ir arriba" del logo nunca lo dispara. En táctil queda apagado y con
 * movimiento reducido no existe (tampoco hay viaje).
 */

/** Reposo tras el último evento de rueda. */
const ESPERA_RUEDA_MS = 140;
/** Reposo tras el último evento de scroll armado por tecla. */
const ESPERA_TECLA_MS = 160;
/** Si el destino queda por debajo de esto, siempre vuelve a 0. */
const ZONA_MUERTA_PX = 16;
/** Apagado: en táctil el scroll es nativo con inercia. Queda listo para
 * probarlo en un teléfono real (se arma al soltar el dedo). */
const ASENTAR_EN_TACTIL = false;

/** La misma curva del SmoothScrollProvider: retoma el lanzamiento de la
 * rueda sin frenar y volver a arrancar. */
const expoOut = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
/** En táctil la inercia ya terminó: arranca y frena suave. */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Duración del asentado en segundos según la distancia que falta. */
const duracion = (dist: number) => Math.min(0.95, Math.max(0.55, 0.35 + dist / 700));

const TECLAS_BAJAR = new Set(["ArrowDown", "PageDown", "End"]);
const TECLAS_SUBIR = new Set(["ArrowUp", "PageUp", "Home"]);

/** Dirección de scroll de una tecla: 1 baja, -1 sube, 0 no hace scroll. */
function direccionTecla(e: KeyboardEvent): number {
  const t = e.target instanceof Element ? e.target : null;
  // En un campo de texto las teclas mueven el cursor, no la página.
  if (t?.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) return 0;
  if (e.key === " ") {
    // Sobre un botón o un link, Space activa el control.
    if (t?.closest("button, a")) return 0;
    return e.shiftKey ? -1 : 1;
  }
  if (TECLAS_BAJAR.has(e.key)) return 1;
  if (TECLAS_SUBIR.has(e.key)) return -1;
  return 0;
}

export function useAsentarLogo(reducido: boolean) {
  useEffect(() => {
    if (reducido) return;

    let dir = 0;
    let armadoPorTecla = false;
    let armadoPorTactil = false;
    let asentando = false;
    let ultimoScroll = window.scrollY;
    let temporizador: ReturnType<typeof setTimeout> | undefined;

    const desarmar = () => {
      armadoPorTecla = false;
      armadoPorTactil = false;
      asentando = false;
      clearTimeout(temporizador);
    };

    const decidir = () => {
      const porTactil = armadoPorTactil;
      armadoPorTecla = false;
      armadoPorTactil = false;
      const R = recorridoLogo.get();
      if (R <= 0 || dir === 0) return;
      const lenis = window.__lenis;
      // Dónde va a quedar: con rueda, Lenis ya conoce el destino de su animación.
      const destino = lenis ? (lenis as unknown as { targetScroll: number }).targetScroll : window.scrollY;
      if (destino <= 0 || destino >= R) return; // ya está en un extremo o más allá
      const objetivo = destino < ZONA_MUERTA_PX ? 0 : dir > 0 ? R : 0;
      const dist = Math.abs(objetivo - window.scrollY);
      if (lenis) {
        asentando = true;
        lenis.scrollTo(objetivo, {
          duration: duracion(dist),
          easing: porTactil ? easeInOutCubic : expoOut,
          onComplete: desarmar,
        });
      } else {
        window.scrollTo({ top: objetivo, behavior: "smooth" });
      }
    };

    const programar = (ms: number) => {
      clearTimeout(temporizador);
      temporizador = setTimeout(decidir, ms);
    };

    /** Detiene el asentado en curso donde esté. */
    const cancelar = () => {
      if (asentando) window.__lenis?.scrollTo(window.scrollY, { immediate: true });
      desarmar();
    };

    const alRodar = (e: WheelEvent) => {
      if (e.ctrlKey) return; // zoom con la rueda
      const d = Math.sign(e.deltaY);
      if (d === 0) return;
      // Una rueda nueva durante el asentado: Lenis lo redirige solo desde
      // donde está, así que acá solo se vuelve a armar.
      asentando = false;
      armadoPorTecla = false;
      dir = d;
      programar(ESPERA_RUEDA_MS);
    };

    const alTeclear = (e: KeyboardEvent) => {
      const d = direccionTecla(e);
      if (d === 0) return;
      cancelar();
      dir = d;
      armadoPorTecla = true;
      // Si la tecla no llega a mover la página, el armado vence solo.
      programar(ESPERA_TECLA_MS);
    };

    const alHacerScroll = () => {
      const y = window.scrollY;
      if (armadoPorTactil && y !== ultimoScroll) dir = Math.sign(y - ultimoScroll);
      ultimoScroll = y;
      // El scroll a secas nunca arma: solo alarga la espera de una tecla
      // (o del dedo) que ya armó.
      if (!asentando && (armadoPorTecla || armadoPorTactil)) programar(ESPERA_TECLA_MS);
    };

    const alSoltarDedo = () => {
      if (!ASENTAR_EN_TACTIL) return;
      armadoPorTactil = true;
      programar(ESPERA_TECLA_MS);
    };

    window.addEventListener("wheel", alRodar, { passive: true });
    window.addEventListener("keydown", alTeclear, { passive: true });
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    window.addEventListener("pointerdown", cancelar, { passive: true });
    window.addEventListener("touchstart", cancelar, { passive: true });
    if (ASENTAR_EN_TACTIL) window.addEventListener("touchend", alSoltarDedo, { passive: true });

    return () => {
      clearTimeout(temporizador);
      window.removeEventListener("wheel", alRodar);
      window.removeEventListener("keydown", alTeclear);
      window.removeEventListener("scroll", alHacerScroll);
      window.removeEventListener("pointerdown", cancelar);
      window.removeEventListener("touchstart", cancelar);
      window.removeEventListener("touchend", alSoltarDedo);
    };
  }, [reducido]);
}
