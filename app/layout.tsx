import type { Metadata } from "next";
import { Montserrat, Lexend_Giga, Poppins } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";
import CookieConsent from "@/components/analytics/CookieConsent";
import { portalHabilitado } from "@/lib/portal/config";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

/** Poppins: titulares y textos de display. Desde Google Fonts y no como
 * .ttf local: next/font la descarga al compilar, la sirve desde el propio
 * dominio en woff2 y solo con caracteres latinos (unos 8 KB por peso
 * contra 155 KB de cada .ttf). Solo los pesos que el sitio usa. */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/** Solo para el nombre "FORST": es la tipografía real del isotipo, no la
 * del sitio (Poppins/Montserrat). Se carga como fuente variable, sin
 * fijar pesos, porque el cartel del Hero mueve el grosor de cada letra
 * en continuo según dónde está el cursor. */
const lexendGiga = Lexend_Giga({
  variable: "--font-lexend-giga",
  subsets: ["latin"],
});

const SITE_URL = "https://web-forst.vercel.app";

export const metadata: Metadata = {
  // Sin esto, las URLs de imágenes para compartir (Open Graph) y las
  // rutas del sitemap quedarían relativas — Google y WhatsApp necesitan
  // la dirección completa para poder resolverlas.
  metadataBase: new URL(SITE_URL),
  title: "FORST — Plataforma empresarial que no desaparece",
  description:
    "FORST es una plataforma empresarial peruana. Páginas y tiendas online, automatizaciones y dashboards para negocios que están listos para evolucionar, con acompañamiento real después de la entrega.",
  // Acá va el código de Google Search Console cuando lo tengas — ver
  // instrucciones en la respuesta del chat. Mientras esté vacío, Next.js
  // simplemente no imprime la etiqueta, así que no rompe nada dejarlo así.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${montserrat.variable} ${lexendGiga.variable}`}>
      <body className="antialiased">
        <OrganizationJsonLd />
        <SmoothScrollProvider>
          <Header portal={portalHabilitado()} />
          <main>{children}</main>
          <Footer />
          <GrainOverlay />
          <CustomCursor />
          <CookieConsent />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
