import type { LucideIcon } from "lucide-react";
import {
  MousePointerClick,
  LayoutTemplate,
  ShoppingCart,
  MonitorSmartphone,
  Contact,
  Building2,
  BadgeDollarSign,
  Package,
  ReceiptText,
  CreditCard,
  Workflow,
  Cable,
  ChartColumn,
  Smartphone,
  ScanSearch,
  MessagesSquare,
} from "lucide-react";

/**
 * El catálogo de servicios sueltos, agrupado en cinco categorías. Los
 * tres planes (data/servicios.ts) combinan varios de estos servicios;
 * este archivo es lo que FORST hace, servicio por servicio.
 */

export type ServicioCatalogo = {
  nombre: string;
  descripcion: string;
  icono: LucideIcon;
};

export type Categoria = {
  slug: string;
  numero: string;
  nombre: string;
  /** Una línea que explica la categoría en palabras del cliente. */
  bajada: string;
  servicios: ServicioCatalogo[];
};

export const categorias: Categoria[] = [
  {
    slug: "productos-web",
    numero: "01",
    nombre: "Productos web",
    bajada:
      "Lo primero que ven tus clientes. Páginas y tiendas que cargan rápido y se entienden sin explicación.",
    servicios: [
      {
        nombre: "Landing page",
        descripcion:
          "Página de una sola sección enfocada en captar clientes y convertir visitas en consultas.",
        icono: MousePointerClick,
      },
      {
        nombre: "Página web",
        descripcion:
          "Sitio web de varias secciones: corporativo, institucional o informativo, diseñado a la medida.",
        icono: LayoutTemplate,
      },
      {
        nombre: "E-commerce",
        descripcion:
          "Tienda en línea con catálogo y carrito de compras, sin pasarela de pagos.",
        icono: ShoppingCart,
      },
      {
        nombre: "PWA",
        descripcion:
          "Aplicación web instalable desde el navegador que se siente como una app.",
        icono: MonitorSmartphone,
      },
    ],
  },
  {
    slug: "sistemas-de-gestion",
    numero: "02",
    nombre: "Sistemas de gestión",
    bajada:
      "Software para el trabajo de todos los días: clientes, ventas, stock y cobros en un mismo lugar.",
    servicios: [
      {
        nombre: "CRM",
        descripcion:
          "Ordena clientes, consultas y seguimiento comercial en un solo lugar.",
        icono: Contact,
      },
      {
        nombre: "ERP",
        descripcion: "Integra las áreas de la empresa en un solo sistema de gestión.",
        icono: Building2,
      },
      {
        nombre: "Sistema de ventas",
        descripcion: "Registro y control de ventas, cotizaciones y clientes.",
        icono: BadgeDollarSign,
      },
      {
        nombre: "Inventario (Kardex)",
        descripcion: "Control de productos, entradas, salidas y stock.",
        icono: Package,
      },
      {
        nombre: "Facturación",
        descripcion: "Emisión y control de comprobantes y facturas.",
        icono: ReceiptText,
      },
      {
        nombre: "Sistema de pagos",
        descripcion:
          "Registro y seguimiento de cobros y pagos dentro del sistema.",
        icono: CreditCard,
      },
    ],
  },
  {
    slug: "automatizacion-y-datos",
    numero: "03",
    nombre: "Automatización y datos",
    bajada:
      "Menos tareas repetidas a mano y números que se leen de un vistazo.",
    servicios: [
      {
        nombre: "Automatización de procesos",
        descripcion:
          "Elimina tareas manuales repetitivas para que el trabajo fluya solo.",
        icono: Workflow,
      },
      {
        nombre: "Integraciones",
        descripcion:
          "Conecta el sistema con las herramientas que el negocio ya usa.",
        icono: Cable,
      },
      {
        nombre: "Dashboards y reportes",
        descripcion:
          "Paneles con indicadores y reportes a medida para decidir con datos.",
        icono: ChartColumn,
      },
    ],
  },
  {
    slug: "app-movil",
    numero: "04",
    nombre: "App móvil",
    bajada: "Tu negocio en el teléfono de tus clientes.",
    servicios: [
      {
        nombre: "App móvil básica",
        descripcion:
          "Aplicación para Android e iOS con las funciones esenciales de tu negocio, lista para publicar en las tiendas.",
        icono: Smartphone,
      },
    ],
  },
  {
    slug: "posicionamiento",
    numero: "05",
    nombre: "Posicionamiento",
    bajada:
      "Que te encuentren cuando buscan lo que ofreces, en Google y en los asistentes con IA.",
    servicios: [
      {
        nombre: "SEO técnico",
        descripcion:
          "Optimización técnica del sitio para aparecer mejor en los buscadores.",
        icono: ScanSearch,
      },
      {
        nombre: "GEO y AEO",
        descripcion:
          "Optimización para buscadores con IA y motores de respuesta, como ChatGPT o Perplexity.",
        icono: MessagesSquare,
      },
    ],
  },
];

export const totalServicios = categorias.reduce((n, c) => n + c.servicios.length, 0);
