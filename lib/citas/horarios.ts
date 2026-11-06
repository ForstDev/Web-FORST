export const ZONA_CITAS = "America/Lima";
export const DURACION_CITA = 45;
export const HORARIOS = ["09:30", "10:30", "11:30", "13:30", "14:30", "15:30", "16:30"];
export const ANTICIPACION_MS = 4 * 60 * 60 * 1000;
export const HORIZONTE_DIAS = 60;

export function fechaPeru(ahora = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_CITAS, year: "numeric", month: "2-digit", day: "2-digit" }).format(ahora);
}

export function fechaValida(fecha: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const dia = new Date(`${fecha}T12:00:00-05:00`);
  return Number.isFinite(dia.getTime()) && fechaPeru(dia) === fecha;
}

export function diaReservable(fecha: string, ahora = new Date()) {
  if (!fechaValida(fecha)) return false;
  const dia = new Date(`${fecha}T12:00:00-05:00`);
  const limite = new Date(ahora.getTime() + HORIZONTE_DIAS * 86400000);
  return fecha >= fechaPeru(ahora) && fecha <= fechaPeru(limite) && ![0, 6].includes(dia.getUTCDay());
}

export function inicioCita(fecha: string, hora: string) {
  return new Date(`${fecha}T${hora}:00-05:00`);
}

export function horariosDelDia(fecha: string, ahora = new Date()) {
  if (!diaReservable(fecha, ahora)) return [];
  return HORARIOS.filter(hora => inicioCita(fecha, hora).getTime() >= ahora.getTime() + ANTICIPACION_MS);
}

export function etiquetaHora(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

export function etiquetaFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", { timeZone: ZONA_CITAS, weekday: "long", day: "numeric", month: "long" }).format(new Date(`${fecha}T12:00:00-05:00`));
}
