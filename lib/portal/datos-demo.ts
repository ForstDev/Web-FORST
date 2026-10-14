import "server-only";

/**
 * Datos de ejemplo del portal. Empresa y personas son inventadas. Cuando
 * el portal se conecte a la base de datos, este archivo se reemplaza por
 * consultas reales filtradas por el cliente de la sesión.
 */

export type EstadoPago = "pagado" | "pendiente" | "vencido";

export type Pago = {
  id: string;
  /** Mes al que corresponde, AAAA-MM. */
  periodo: string;
  concepto: string;
  monto: number;
  vence: string;
  pagadoEl: string | null;
  estado: EstadoPago;
  comprobante: string | null;
};

export type ClienteDemo = {
  nombre: string;
  empresa: string;
  ruc: string;
  plan: string;
  servicio: string;
  incluye: string[];
  inicio: string;
  cuotaMensual: number;
  pagos: Pago[];
};

const pagosMantenimiento: Pago[] = [
  ["2026-10", "2026-10-20", null, "pendiente", null],
  ["2026-09", "2026-09-20", "2026-09-18", "pagado", "B001-000214"],
  ["2026-08", "2026-08-20", "2026-08-19", "pagado", "B001-000198"],
  ["2026-07", "2026-07-20", "2026-07-24", "pagado", "B001-000181"],
  ["2026-06", "2026-06-20", "2026-06-17", "pagado", "B001-000167"],
  ["2026-05", "2026-05-20", "2026-05-20", "pagado", "B001-000150"],
].map(([periodo, vence, pagadoEl, estado, comprobante]) => ({
  id: `m-${periodo}`,
  periodo: periodo as string,
  concepto: "Mantenimiento mensual",
  monto: 350,
  vence: vence as string,
  pagadoEl: pagadoEl as string | null,
  estado: estado as EstadoPago,
  comprobante: comprobante as string | null,
}));

export const clienteDemo: ClienteDemo = {
  nombre: "Mariana",
  empresa: "Ferretería El Roble S.A.C.",
  ruc: "20600000001",
  plan: "Operación",
  servicio: "Página web, CRM y automatización de cotizaciones",
  incluye: [
    "Hosting, dominio y certificados al día",
    "Copias de seguridad semanales",
    "Ajustes y cambios menores cada mes",
    "Soporte por WhatsApp en horario de oficina",
  ],
  inicio: "2026-04-06",
  cuotaMensual: 350,
  pagos: [
    ...pagosMantenimiento,
    {
      id: "p-final",
      periodo: "2026-04",
      concepto: "Proyecto: segundo pago (entrega)",
      monto: 2400,
      vence: "2026-04-30",
      pagadoEl: "2026-04-28",
      estado: "pagado",
      comprobante: "F001-000032",
    },
    {
      id: "p-inicial",
      periodo: "2026-03",
      concepto: "Proyecto: primer pago (inicio)",
      monto: 2400,
      vence: "2026-03-10",
      pagadoEl: "2026-03-09",
      estado: "pagado",
      comprobante: "F001-000027",
    },
  ],
};
