"use client";

import { useEffect, useRef } from "react";

/**
 * Campo de piezas de marca dibujado en canvas: una retícula casi
 * imperceptible que respira lentamente y reacciona al cursor — las piezas
 * cercanas giran, crecen y se encienden. Las celdas se reparten en las
 * tres piezas reales del isotipo (círculo del pétalo, cojín de lados
 * cóncavos, diamante) en vez de ser todas el mismo rombo, para que el
 * campo se sienta hecho de piezas de FORST y no de una retícula genérica.
 * Es el "material" del que está hecho el fondo FORST: interactivo, propio
 * y barato de renderizar (un solo canvas, sin nodos DOM por partícula).
 *
 * Respeta prefers-reduced-motion (queda estático) y se pausa fuera del
 * viewport.
 */

/** Proporción del cojín (kIn/C en logo-geometry.ts) — el punto de control
 * de cada curva cóncava, como fracción del radio de la celda. */
const COJIN_K = 0.6716;
export default function DiamondField({
  spacing = 64,
  baseAlpha = 0.09,
  maxAlpha = 0.55,
  baseSize = 3,
  influence = 180,
  color = "0,46,44",
  className = "",
}: {
  spacing?: number;
  baseAlpha?: number;
  maxAlpha?: number;
  baseSize?: number;
  influence?: number;
  /** Canal RGB del rombo, como "r,g,b" — verde de marca por defecto. */
  color?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    if (!parent || !ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let running = false;
    let W = 0;
    let H = 0;
    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    /** 0 = círculo (pétalo), 1 = cojín (lados cóncavos), 2 = diamante. */
    let cells: { x: number; y: number; phase: number; forma: 0 | 1 | 2 }[] = [];

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const c of cells) {
        const dx = c.x - smooth.x;
        const dy = c.y - smooth.y;
        const d = Math.hypot(dx, dy);
        const k = reduced ? 0 : Math.max(0, 1 - d / influence);
        const breathe = reduced
          ? 0.5
          : Math.sin(t * 0.0006 + c.phase) * 0.5 + 0.5;
        const alpha = baseAlpha + breathe * 0.05 + k * (maxAlpha - baseAlpha);
        const s = baseSize + breathe * 0.7 + k * 3.6;
        ctx.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;

        if (c.forma === 0) {
          // El pétalo: un círculo, sin rotación — no tendría sentido.
          ctx.beginPath();
          ctx.arc(c.x, c.y, s / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (c.forma === 1) {
          // El cojín: mismas curvas que CUSHION_PATH (logo-geometry.ts),
          // reescaladas al tamaño de la celda en vez de al viewBox 200x200.
          const R = s / 2;
          const K = R * COJIN_K;
          const rot = k * (Math.PI / 4);
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(rot);
          ctx.beginPath();
          ctx.moveTo(-R, -R);
          ctx.quadraticCurveTo(0, -K, R, -R);
          ctx.quadraticCurveTo(K, 0, R, R);
          ctx.quadraticCurveTo(0, K, -R, R);
          ctx.quadraticCurveTo(-K, 0, -R, -R);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else {
          const rot = Math.PI / 4 + k * (Math.PI / 2);
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(rot);
          ctx.fillRect(-s / 2, -s / 2, s, s);
          ctx.restore();
        }
      }
    };

    const resize = () => {
      const r = parent.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, W * dpr);
      canvas.height = Math.max(1, H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = [];
      let col = 0;
      for (let y = spacing / 2; y < H; y += spacing) {
        let row = 0;
        for (let x = spacing / 2; x < W; x += spacing) {
          // Las tres piezas repartidas por posición de grilla, no al azar
          // en cada resize, para que el campo no "baraje" sus piezas cada
          // vez que cambia el tamaño de ventana.
          const forma = ((col * 7 + row * 13) % 3) as 0 | 1 | 2;
          cells.push({
            x,
            y,
            phase: (x * 0.37 + y * 0.53) % (Math.PI * 2),
            forma,
          });
          row++;
        }
        col++;
      }
      draw(performance.now());
    };

    const loop = (t: number) => {
      smooth.x += (mouse.x - smooth.x) * 0.14;
      smooth.y += (mouse.y - smooth.y) * 0.14;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop()
    );
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [spacing, baseAlpha, maxAlpha, baseSize, influence, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}
