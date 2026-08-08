export type Caso = {
  slug: string;
  titulo: string;
  sector: string;
  resumen: string;
  problema: string;
  solucion: string;
  resultado: string;
  entregamos: string[];
  url: string;
  host: string;
  imagen: string;
  imagenAlt: string;
  /** Captura real de la página del cliente — para los previews de Casos/Portafolio. */
  paginaPreview: string;
  paginaPreviewAlt: string;
  /** Video de prueba navegando la página real — reemplaza a paginaPreview donde existe. */
  paginaVideo?: string;
  /** Identidad visual del cliente — extraída de su web real. */
  logo: string;
  logoAlt: string;
  /** Composición "MARCA | FORST" que se muestra al expandir el caso. */
  composicion: string;
  /** Color de acento de la marca del cliente. */
  acento: string;
  /** Fondo de la placa del caso. */
  fondo: string;
  /** true si el fondo es oscuro y el texto debe ser claro (DFG: negro). */
  textoClaro?: boolean;
};

export const portafolio: Caso[] = [
  {
    slug: "dfg",
    titulo: "DFG",
    sector: "Repuestos para camiones",
    resumen: "Calidad alemana en repuestos, con una presencia digital a la altura.",
    problema:
      "DFG trabaja repuestos y autopartes de calidad alemana para camiones, pero su presencia digital no respaldaba la seriedad del producto. Un catálogo amplio y difícil de recorrer, y una marca que no se sentía en la web.",
    solucion:
      "Construimos su sitio con un catálogo navegable y una identidad digital que transmite lo que la marca ya es en físico, pensado para el comprador de repuestos que necesita encontrar la pieza correcta sin perder tiempo.",
    resultado:
      "Una presencia digital que acompaña la venta en vez de estorbarla, y que sigue creciendo con la marca después de la entrega, con FORST al costado.",
    entregamos: [
      "Sitio web con catálogo",
      "Identidad digital de marca",
      "SEO técnico",
      "Acompañamiento post-entrega",
    ],
    url: "https://dfgtruckparts.com/",
    host: "dfgtruckparts.com",
    imagen: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/caso-dfg-escena.webp",
    imagenAlt:
      "Camión de carga en una carretera costera peruana al amanecer",
    paginaPreview: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/pagina-dfg.webp",
    paginaPreviewAlt: "Captura de la página de inicio de DFG Truck Parts",
    paginaVideo: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/video/caso-dfg.mp4",
    logo: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/logo-dfg-white.webp",
    logoAlt: "Logo de DFG Truck Parts",
    composicion: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/comp-dfg.webp",
    acento: "#ee2624",
    fondo: "#000000",
    textoClaro: true,
  },
  {
    slug: "velkai",
    titulo: "VELKAI",
    sector: "Moda exclusiva",
    resumen: "Ropa con identidad propia, ahora también en digital.",
    problema:
      "VELKAI es una marca de ropa exclusiva con carácter fuerte, pero sin un canal digital propio esa identidad se diluía entre marketplaces y redes sociales que no controla.",
    solucion:
      "Diseñamos una experiencia digital a la altura de sus prendas, un canal propio con dirección visual de la marca, listo para crecer colección tras colección.",
    resultado:
      "Un espacio donde VELKAI controla cómo se ve, cómo se siente y cómo se compra su ropa, sin depender de plataformas de terceros.",
    entregamos: [
      "Tienda digital propia",
      "Dirección visual digital",
      "Optimización móvil",
      "Acompañamiento post-entrega",
    ],
    url: "https://web-production-5cf12.up.railway.app/",
    host: "velkai.com",
    imagen: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/caso-velkai-escena.webp",
    imagenAlt:
      "Fachada de la boutique VELKAI de noche, con una prenda iluminada en la vitrina",
    paginaPreview: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/pagina-velkai.webp",
    paginaPreviewAlt: "Captura de la página de inicio de VELKAI",
    paginaVideo: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/video/caso-velkai.mp4",
    logo: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/logo-velkai-black.webp",
    logoAlt: "Logo de VELKAI",
    composicion: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/comp-velkai.webp",
    acento: "#0c0c0c",
    fondo: "#f4f2ef",
  },
];
