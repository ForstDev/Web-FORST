/** Formatos del portal. Las fechas vienen como AAAA-MM-DD y se leen en
 * UTC: si se leyeran en hora de Lima (UTC-5) caerían un día antes. */

const soles = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const fechaCorta = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const fechaLarga = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const mesAnio = new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric", timeZone: "UTC" });
const mesCorto = new Intl.DateTimeFormat("es-PE", { month: "short", timeZone: "UTC" });

export const formatoSoles = (n: number) => soles.format(n);
export const formatoFecha = (iso: string) => fechaCorta.format(new Date(iso)).replace(".", "");
export const formatoFechaLarga = (iso: string) => fechaLarga.format(new Date(iso));
export const formatoPeriodo = (periodo: string) => mesAnio.format(new Date(`${periodo}-01`));
export const formatoMesCorto = (periodo: string) => mesCorto.format(new Date(`${periodo}-01`)).replace(".", "");
