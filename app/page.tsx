import Hero from "@/components/sections/Hero";
import Manifiesto from "@/components/sections/Manifiesto";
import ServiciosPreview from "@/components/sections/ServiciosPreview";
import CasosDestacados from "@/components/sections/CasosDestacados";
import Resultados from "@/components/sections/Resultados";
import CTAFinal from "@/components/sections/CTAFinal";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifiesto />
      <ServiciosPreview />
      <CasosDestacados />
      <Resultados />
      <CTAFinal />
    </>
  );
}
