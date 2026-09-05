import type { NextConfig } from "next";

// Sitio sin backend propio: solo carga script externo de Google
// Analytics (tras consentimiento) e imágenes de Supabase Storage. La
// CSP se arma alrededor de esas dos únicas fuentes externas.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://ijmygnxkuutgbcdgkjqj.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
  "media-src 'self' https://ijmygnxkuutgbcdgkjqj.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-ancestors 'none'",
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
