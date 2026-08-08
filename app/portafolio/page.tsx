import type { Metadata } from "next";
import PortafolioGrid from "@/components/portafolio/PortafolioGrid";

export const metadata: Metadata = {
  title: "Portafolio — FORST",
  description:
    "Casos reales de FORST: DFG y VELKAI. Problema, solución y resultado, sin humo.",
};

export default function PortafolioPage() {
  return (
    <div className="bg-white">
      <PortafolioGrid />
    </div>
  );
}
