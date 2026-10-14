import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portalHabilitado } from "@/lib/portal/config";

export const metadata: Metadata = {
  title: "Portal de clientes | FORST",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  // En producción el prototipo no existe salvo que se active a propósito.
  if (!portalHabilitado()) notFound();
  return children;
}
