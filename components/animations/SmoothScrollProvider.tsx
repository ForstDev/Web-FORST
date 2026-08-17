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

  useEffect(() => {
    const irAlDestino = () => {
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
        lenisRef.current?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
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
