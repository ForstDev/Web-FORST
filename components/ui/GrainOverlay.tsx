/**
 * Grano de papel sutilísimo sobre toda la página. Quita la sensación de
 * "template plano" y le da materialidad de impreso — invisible como
 * elemento, presente como textura. Es un div fijo con ruido SVG, sin JS.
 */

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] opacity-[0.035] mix-blend-multiply"
      style={{ backgroundImage: NOISE, backgroundSize: "180px 180px" }}
    />
  );
}
