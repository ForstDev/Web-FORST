import type { Metadata } from "next";
import { servicios } from "@/data/servicios";
import ServiciosHero from "@/components/servicios/ServiciosHero";
import PanelesPlanes from "@/components/servicios/PanelesPlanes";
import DiagnosticoFORST from "@/components/servicios/DiagnosticoFORST";

export const metadata: Metadata = {
  title: "Servicios — FORST",
  description:
    "Presencia, Operación y Estructura: de tu primera web al rediseño completo de la operación con CRM, automatizaciones y agentes de IA, con acompañamiento real después de la entrega.",
};

export default function ServiciosPage() {
  return (
    <>
      <ServiciosHero />
      <PanelesPlanes servicios={servicios} />
      <DiagnosticoFORST />
    </>
  );
}
