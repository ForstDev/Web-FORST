/**
 * Los 3 planes del paquete de servicios FORST (ver "FORST - Paquete de
 * Servicios.pptx" en la raíz del proyecto, fuente de verdad). Presencia es
 * el punto de partida, Operación el plan destacado, Estructura el
 * rediseño completo. Sin precios en el sitio a propósito — la inversión
 * se cotiza por caso, no se lista.
 */

export type Servicio = {
  slug: string;
  numero: string;
  /** El nombre del plan. */
  titulo: string;
  /** La promesa del plan — la sub-línea. */
  herramienta: string;
  resumen: string;
  descripcion: string;
  incluye: string[];
  paraQuien: string[];
  /** Tiempo estimado de entrega — no es un precio. */
  entrega?: string;
  ctaTexto: string;
  imagen: string;
  imagenAlt: string;
  /** El plan que FORST recomienda primero — el "plan estrella". */
  destacado?: boolean;
};

export const servicios: Servicio[] = [
  {
    slug: "presencia",
    numero: "01",
    titulo: "Presencia",
    herramienta: "El punto de partida",
    resumen:
      "Tu primera presencia digital de verdad, no una tarjeta de presentación improvisada.",
    descripcion:
      "Para negocios que todavía no existen digitalmente, o que tienen algo armado a medias y quieren modernizarlo. Construimos tu web o landing desde cero, nunca sobre una plantilla que ya usan otros mil negocios, con todo lo que necesita un cliente para encontrarte, escribirte y confiar en lo que ve.",
    incluye: [
      "Web o landing a la medida, nunca plantilla",
      "Dominio y hosting configurados",
      "Formularios y WhatsApp Business que sí funcionan",
      "Base de datos en la nube",
      "SEO y capacitación de entrega",
      "Seguimiento incluido los primeros meses",
    ],
    paraQuien: [
      "Negocios que aún no existen digitalmente",
      "Marcas con algo improvisado que quieren modernizarse",
    ],
    entrega: "Entrega en 3 a 4 semanas",
    ctaTexto: "Quiero mi presencia digital",
    imagen: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/servicio-vende.webp",
    imagenAlt:
      "Laptop sobre el mostrador de una tienda mostrando una página web verde y blanca",
  },
  {
    slug: "operacion",
    numero: "02",
    titulo: "Operación",
    herramienta: "Ordena lo que ya vendes",
    resumen:
      "Para negocios que ya venden pero quieren la tecnología trabajando a su favor, no en un cuaderno aparte.",
    descripcion:
      "Todo lo del plan Presencia, más un CRM a tu medida: los leads entran directo, las cotizaciones y respuestas se disparan solas, y un dashboard te muestra cómo va el negocio sin que nadie tenga que armarlo a mano cada fin de mes. Empezamos con un diagnóstico de tus flujos más críticos antes de tocar nada.",
    incluye: [
      "Todo lo del plan Presencia",
      "Diagnóstico de flujos críticos",
      "CRM personalizado",
      "Leads que entran directo a tu CRM",
      "Respuestas y cotizaciones automáticas",
      "Recordatorios y reportes de ventas",
      "Dashboard a medida + acompañamiento mensual",
    ],
    paraQuien: [
      "Negocios que ya venden pero operan a mano",
      "Equipos que quieren tecnología a la vanguardia dentro de su empresa",
    ],
    ctaTexto: "Quiero ordenar mi operación",
    imagen: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/servicio-automatiza.webp",
    imagenAlt:
      "Teléfono en el mostrador de una tienda respondiendo mensajes solo, mientras el dueño atiende a una clienta",
    destacado: true,
  },
  {
    slug: "estructura",
    numero: "03",
    titulo: "Estructura",
    herramienta: "Rediseña toda la operación",
    resumen:
      "Para empresas que ya operan y necesitan ordenar y escalar toda la operación con FORST al costado.",
    descripcion:
      "El rediseño completo: mapeamos cómo trabajan todas tus áreas, reordenamos los procesos que ya no dan abasto y construimos el sistema (CRM, automatizaciones, agentes de IA) que sostiene ese crecimiento, integrado con las herramientas que tu equipo ya usa y no quiere perder.",
    incluye: [
      "Diagnóstico operativo completo",
      "Rediseño de procesos entre áreas",
      "CRM a la medida del negocio",
      "Automatizaciones y agentes de IA",
      "Integración con las herramientas que ya usan",
      "Capacitación al equipo del cliente",
    ],
    paraQuien: [
      "Empresas que ya operan y necesitan ordenar antes de escalar",
      "Negocios listos para crecer con FORST como aliado permanente",
    ],
    entrega: "Cotizado por proyecto",
    ctaTexto: "Quiero rediseñar mi operación",
    imagen: "https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/servicio-decide.webp",
    imagenAlt:
      "Tienda de noche con una laptop encendida mostrando un gráfico verde de crecimiento",
  },
];
