"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  // true justo antes de que este efecto corra si la navegación fue un
  // atrás/adelante del historial — así "irAlDestino" sabe si debe
  // restaurar dónde estabas en vez de mandarte arriba de todo.
  const esNavegacionHistorial = useRef(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    // Expuesto para que cualquier componente (p.ej. el header al hacer
    // clic en el link de la página en la que ya estás) pueda pedir un
    // scroll-to-top sin tener que perforar props/contexto.
    window.__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = undefined;
    };
  }, []);

  // Next.js App Router no fuerza scroll-to-top cuando Lenis controla el
  // scroll — sin esto, cambiar de página te deja en la misma posición Y,
  // mostrando el contenido a mitad de la página nueva. Si la URL trae un
  // hash (p.ej. una tarjeta de servicios que manda a /servicios#operacion),
  // va directo a esa sección en vez de arrancar en 0 e ignorar el ancla.
  //
  // Acá conviven tres mecanismos que quieren mover el scroll al cargar:
  // el salto nativo del navegador al ancla, la restauración de scroll del
  // historial, y este efecto. Cuál ganaba dependía del timing, así que el
  // mismo link aterrizaba bien, tapado por el header, o directamente
  // arriba del todo sin scrollear. `scrollRestoration = "manual"` saca al
  // navegador de la competencia y deja este efecto como única autoridad.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // Guarda en dónde estás parado en esta ruta, actualizado en cada
  // scroll — no alcanza con guardarlo recién al salir: la limpieza de
  // un efecto corre DESPUÉS de que la URL ya cambió (React confirma el
  // render nuevo antes de limpiar el anterior), así que para ese
  // momento `window.scrollY` ya es el de la página siguiente, no el de
  // la que se está dejando.
  useEffect(() => {
    const onScroll = () => {
      sessionStorage.setItem(`forst-scroll:${pathname}`, String(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // popstate solo se dispara con atrás/adelante del navegador (botón
  // físico del navegador), nunca con un <Link> normal. Es la señal para
  // ese caso, pero llega de forma asíncrona — para el botón "Volver"
  // propio (VolverBoton, que llama a router.back()) no alcanza a tiempo
  // siempre, así que ese además deja escrita una marca explícita en
  // sessionStorage justo antes de navegar (ver VolverBoton.tsx). Acá se
  // acepta cualquiera de las dos señales como "esto es un regreso".
  useEffect(() => {
    const marcar = () => {
      esNavegacionHistorial.current = true;
    };
    window.addEventListener("popstate", marcar);
    return () => window.removeEventListener("popstate", marcar);
  }, []);

  useEffect(() => {
    const irAlDestino = () => {
      const marcaExplicita = sessionStorage.getItem("forst-volver") === "1";
      sessionStorage.removeItem("forst-volver");
      const eraHistorial = esNavegacionHistorial.current || marcaExplicita;
      esNavegacionHistorial.current = false;

      const hash = window.location.hash;
      let destino: Element | null = null;

      if (hash.length > 1) {
        // Un hash inválido como selector (p.ej. "#1") revienta
        // querySelector; ahí simplemente no hay destino.
        try {
          destino = document.querySelector(hash);
        } catch {
          destino = null;
        }
      }

      if (!destino) {
        // Atrás/adelante sin hash: restaura dónde te habías quedado en
        // esta ruta, si lo guardamos antes. Cualquier otra navegación
        // (un <Link> nuevo) sigue arrancando arriba de todo.
        const guardado = eraHistorial
          ? sessionStorage.getItem(`forst-scroll:${pathname}`)
          : null;
        const y = guardado ? parseFloat(guardado) : 0;
        lenisRef.current?.scrollTo(y, { immediate: true });
        window.scrollTo(0, y);
        return;
      }

      // `scroll-margin-top` es lo que respeta el scroll nativo del
      // navegador para no dejar el destino debajo del header fijo. Un
      // scrollTo manual no lo aplica solo, así que lo restamos nosotros:
      // así el offset sigue viviendo en el CSS de cada ancla (una sola
      // fuente de verdad) en vez de quedar duplicado acá como un número.
      const margen =
        parseFloat(getComputedStyle(destino).scrollMarginTop) || 0;
      const top = Math.max(
        destino.getBoundingClientRect().top + window.scrollY - margen,
        0
      );

      lenisRef.current?.scrollTo(top, { immediate: true });
      window.scrollTo(0, top);
    };

    // Dos frames de margen: el primero deja montar el árbol de la página
    // nueva (incluido el panel que se abre solo al llegar por ancla), el
    // segundo deja que Lenis termine de sincronizar su posición interna.
    // Con un solo frame, Lenis todavía tenía su scroll viejo en memoria y
    // pisaba el salto apenas corría su siguiente raf.
    let rafInterno = 0;
    const rafExterno = requestAnimationFrame(() => {
      rafInterno = requestAnimationFrame(irAlDestino);
    });

    // Cambiar solo el hash (mismo pathname) no vuelve a disparar este
    // efecto, así que el ancla quedaría sin atender.
    window.addEventListener("hashchange", irAlDestino);

    return () => {
      cancelAnimationFrame(rafExterno);
      cancelAnimationFrame(rafInterno);
      window.removeEventListener("hashchange", irAlDestino);
    };
  }, [pathname]);

  return <>{children}</>;
}
