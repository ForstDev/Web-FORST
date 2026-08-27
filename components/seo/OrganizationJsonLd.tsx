const SITE_URL = "https://web-forst.vercel.app";

/**
 * Datos estructurados (schema.org) de la organización — le dice a Google
 * explícitamente qué es FORST, no solo lo que el texto de la página
 * sugiere. No lleva `sameAs` (redes sociales) porque el sitio todavía no
 * enlaza ninguna; se agrega el día que eso exista.
 */
export default function OrganizationJsonLd() {
  const datos = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FORST",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    email: "forst.pe@outlook.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lima",
      addressCountry: "PE",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}
