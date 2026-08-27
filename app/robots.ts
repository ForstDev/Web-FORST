import { MetadataRoute } from "next";

const SITE_URL = "https://web-forst.vercel.app";

/**
 * Convención de Next.js: se sirve en /robots.txt sin escribirlo a mano.
 * Todo el sitio es público, así que no hay nada que bloquear — la única
 * regla real es señalar dónde está el sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
