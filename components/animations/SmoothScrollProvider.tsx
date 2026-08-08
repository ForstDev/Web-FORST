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
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;

    if (target) {
      // Un frame de margen: deja que el resto de la página (p.ej. el
      // panel que se abre solo al llegar por ancla) termine de montar
      // antes de medir su posición.
      const raf = requestAnimationFrame(() => {
        const top = target.getBoundingClientRect().top + window.scrollY;
        lenisRef.current?.scrollTo(top, { immediate: true });
        window.scrollTo(0, top);
      });
      return () => cancelAnimationFrame(raf);
    }

    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
