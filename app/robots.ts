import { MetadataRoute } from "next";

const SITE_URL = "https://web-forst.vercel.app";

/**
 * Convención de Next.js: se sirve en /robots.txt sin escribirlo a mano.
 * Las páginas públicas quedan abiertas. Se excluyen las rutas de API y el
 * portal de clientes, que no tienen nada que indexar.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/clientes"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
