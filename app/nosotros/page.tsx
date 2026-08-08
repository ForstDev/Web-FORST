import type { Metadata } from "next";
import NosotrosContenido from "@/components/nosotros/NosotrosContenido";

export const metadata: Metadata = {
  title: "Nosotros — FORST",
  description:
    "FORST es una plataforma empresarial peruana. La metodología lleva nuestro nombre y el post-venta es la mitad del servicio.",
};

export default function NosotrosPage() {
  return (
    <>
      <NosotrosContenido />
    </>
  );
}
