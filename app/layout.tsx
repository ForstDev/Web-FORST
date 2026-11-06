import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";
import CookieConsent from "@/components/analytics/CookieConsent";
import { portalHabilitado } from "@/lib/portal/config";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

// Mismas familias y pesos, servidos localmente en WOFF2 (subconjunto
// latino). La compilación ya no depende de Google Fonts ni su red.
const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "../public/assets/fonts/poppins-300.woff2", weight: "300", style: "normal" },
    { path: "../public/assets/fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../public/assets/fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../public/assets/fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../public/assets/fonts/poppins-700.woff2", weight: "700", style: "normal" },
  ],
});

const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  src: [
    { path: "../public/assets/fonts/montserrat-400.woff2", weight: "400", style: "normal" },
    { path: "../public/assets/fonts/montserrat-500.woff2", weight: "500", style: "normal" },
    { path: "../public/assets/fonts/montserrat-600.woff2", weight: "600", style: "normal" },
  ],
});

// El nombre FORST conserva Lexend Giga variable para la interacción del Hero.
const lexendGiga = localFont({
  variable: "--font-lexend-giga",
  display: "swap",
  src: [{ path: "../public/assets/fonts/lexend-giga-100-900.woff2", weight: "100 900", style: "normal" }],
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
