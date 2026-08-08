import type { Metadata } from "next";
import { Montserrat, Lexend_Giga } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";

const poppins = localFont({
  variable: "--font-poppins",
  src: [
    { path: "./fonts/poppins/Poppins-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/poppins/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/poppins/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/poppins/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/poppins/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/poppins/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

/** Solo para el nombre "FORST" del logo — es la tipografía real del
 * isotipo, no la del sitio (Poppins/Montserrat). */
const lexendGiga = Lexend_Giga({
  variable: "--font-lexend-giga",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "FORST — Plataforma empresarial que no desaparece",
  description:
    "FORST es una plataforma empresarial peruana. Páginas y tiendas online, automatizaciones y dashboards para negocios que están listos para evolucionar, con acompañamiento real después de la entrega.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${montserrat.variable} ${lexendGiga.variable}`}>
      <body className="antialiased">
        <SmoothScrollProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <GrainOverlay />
          <CustomCursor />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
