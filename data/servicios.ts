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
      "Tu primera página web profesional, diseñada a la medida de tu negocio.",
    descripcion:
      "Para negocios que todavía no tienen página web, o que tienen una hecha a medias y quieren renovarla. La construimos desde cero, con todo lo que un cliente necesita para encontrarte, escribirte y confiar en lo que ve.",
    incluye: [
      "Página web diseñada a tu medida",
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
      "Para negocios que ya venden y quieren dejar de llevar el control a mano.",
    descripcion:
      "Todo lo del plan Presencia, más un sistema hecho a tu medida para ordenar las ventas: cada consulta que llega queda registrada sola, las cotizaciones y respuestas salen automáticas, y un panel te muestra cómo va el negocio sin que nadie arme el reporte a mano cada fin de mes. Antes de tocar nada, revisamos las partes del día a día que más te están costando.",
    incluye: [
      "Todo lo del plan Presencia",
      "Revisión de los procesos que más te cuestan",
      "CRM propio para ordenar a tus clientes",
      "Cada consulta entra sola al sistema",
      "Respuestas y cotizaciones automáticas",
      "Recordatorios y reportes de ventas",
      "Panel de control a medida y acompañamiento mensual",
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
      "Para empresas que ya funcionan y necesitan ordenar el trabajo interno antes de crecer.",
    descripcion:
      "El rediseño completo: revisamos cómo trabaja cada área, reordenamos los procesos que ya no dan abasto y construimos el sistema (CRM, automatizaciones, agentes de IA) que sostiene ese crecimiento, conectado con las herramientas que tu equipo ya usa.",
    incluye: [
      "Revisión completa de cómo trabaja la empresa",
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
