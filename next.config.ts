import type { NextConfig } from "next";

// El navegador solo carga un script externo, Google Analytics (tras
// consentimiento), e imágenes y videos de Supabase Storage. El libro de
// reclamaciones habla con Supabase desde el servidor, así que no suma
// nada aquí. React en desarrollo necesita eval para sus herramientas de
// depuración; en producción no se permite.
const DEV = process.env.NODE_ENV === "development";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${DEV ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://ijmygnxkuutgbcdgkjqj.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
  "media-src 'self' https://ijmygnxkuutgbcdgkjqj.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-ancestors 'self' https://www.alvarodev.site https://alvarodev.site",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // No exponer la versión/framework en la cabecera X-Powered-By.
  poweredByHeader: false,
  // Las imágenes y videos del sitio viven en Supabase Storage, no en
  // /public — next/image necesita el dominio en la lista blanca antes
  // de poder optimizarlas.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ijmygnxkuutgbcdgkjqj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
