/**
 * Datos legales de la empresa, tal como figuran en la consulta RUC de
 * SUNAT. Una sola fuente para el footer, las páginas legales y el libro
 * de reclamaciones: si algo cambia (domicilio, correo), se cambia acá.
 */
export const empresa = {
  razonSocial: "FORST E.I.R.L.",
  nombreComercial: "FORST",
  ruc: "20616490096",
  domicilio:
    "Mz. L1 Lote 22, Urb. Las Praderas Etapa 2, Santa Anita, Lima, Perú",
  correo: "forst.pe@outlook.com",
  whatsapp: "+51 962 316 856",
  whatsappUrl: "https://wa.me/51962316856",
  sitio: "https://web-forst.vercel.app",
} as const;

/** Fecha de la última revisión de los textos legales. */
export const legalActualizado = "14 de octubre de 2026";
