import { MetadataRoute } from "next";
import { servicios } from "@/data/servicios";
import { portafolio } from "@/data/portafolio";

const SITE_URL = "https://web-forst.vercel.app";

/**
 * Convención de Next.js: este archivo se sirve solo en /sitemap.xml, sin
 * escribir el XML a mano. Las rutas de servicios y casos salen de los
 * mismos datos que arman esas páginas — si se agrega un servicio o un
 * caso nuevo, entra acá sin tocar este archivo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paginasFijas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/servicios`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/portafolio`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/nosotros`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const anclasDeServicios: MetadataRoute.Sitemap = servicios.map((s) => ({
    url: `${SITE_URL}/servicios#${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const casos: MetadataRoute.Sitemap = portafolio.map((c) => ({
    url: `${SITE_URL}/portafolio/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...paginasFijas, ...anclasDeServicios, ...casos];
}
