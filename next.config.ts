import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
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
};

export default nextConfig;
