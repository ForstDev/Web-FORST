import Hero from "@/components/sections/Hero";
import Manifiesto from "@/components/sections/Manifiesto";
import ServiciosPreview from "@/components/sections/ServiciosPreview";
import CasosDestacados from "@/components/sections/CasosDestacados";
import Resultados from "@/components/sections/Resultados";
import CTAFinal from "@/components/sections/CTAFinal";
import { portalHabilitado } from "@/lib/portal/config";

export default function Home() {
  return (
    <>
      <Hero portal={portalHabilitado()} />
      <Manifiesto />
      <ServiciosPreview />
      <CasosDestacados />
      <Resultados />
      <CTAFinal />
    </>
  );
}
