import type { Metadata } from "next";
import AgendaCitas from "@/components/citas/AgendaCitas";
import { fechaPeru } from "@/lib/citas/horarios";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Agenda una cita — FORST",
  description: "Hablemos de tu negocio. Elige un día y una hora para una reunión virtual de hasta 45 minutos por Google Meet. Hora de Perú.",
  alternates: { canonical: "/citas" },
  robots: { index: false, follow: false },
};

export default function CitasPage() {
  return <AgendaCitas hoy={fechaPeru()} />;
}
