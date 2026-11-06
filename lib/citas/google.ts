import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { DURACION_CITA, inicioCita, horariosDelDia, ZONA_CITAS } from "./horarios";

export class ErrorAgenda extends Error {
  constructor(message: string, public status = 503) { super(message); }
}

export function configGoogle() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  return clientId && clientSecret && refreshToken ? { clientId, clientSecret, refreshToken, calendarId } : null;
}

export async function tokenGoogle() {
  const cfg = configGoogle();
  if (!cfg) throw new ErrorAgenda("La agenda todavía no está habilitada. Puedes coordinar tu cita desde Contacto.");
  const respuesta = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(15000),
    body: new URLSearchParams({ client_id: cfg.clientId, client_secret: cfg.clientSecret, refresh_token: cfg.refreshToken, grant_type: "refresh_token" }),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok || !datos.access_token) throw new ErrorAgenda("No pudimos conectar con la agenda. Inténtalo más tarde o escríbenos desde Contacto.");
  return { token: datos.access_token as string, calendarId: cfg.calendarId };
}

export async function disponibilidad(fecha: string, auth?: Awaited<ReturnType<typeof tokenGoogle>>) {
  const horas = horariosDelDia(fecha);
  if (!horas.length) return [];
  const { token, calendarId } = auth ?? await tokenGoogle();
  const respuesta = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(15000),
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin: `${fecha}T00:00:00-05:00`, timeMax: `${fecha}T23:59:59-05:00`, timeZone: ZONA_CITAS, items: [{ id: calendarId }] }),
  });
  const datos = await respuesta.json();
  const calendario = datos.calendars?.[calendarId];
  if (!respuesta.ok || !calendario || calendario.errors?.length || !Array.isArray(calendario.busy)) throw new ErrorAgenda("No pudimos consultar los horarios. Vuelve a intentarlo.");
  return horas.filter(hora => {
    const inicio = inicioCita(fecha, hora).getTime();
    const fin = inicio + DURACION_CITA * 60000;
    return !calendario.busy.some((b: { start: string; end: string }) => inicio < Date.parse(b.end) && fin > Date.parse(b.start));
  });
}

type Reserva = { fecha: string; hora: string; nombre: string; correo: string; negocio: string; mensaje: string; solicitudId: string };
type Evento = { id: string; status?: string; hangoutLink?: string; conferenceData?: { createRequest?: { status?: { statusCode?: string } } }; extendedProperties?: { private?: { solicitud?: string } } };

export async function reservarCita(datos: Reserva) {
  const auth = await tokenGoogle();
  const inicio = inicioCita(datos.fecha, datos.hora);
  // ID estable por horario: Google rechaza una segunda inserción incluso
  // si dos instancias de Vercel comprobaron disponibilidad simultáneamente.
  const id = createHash("sha256").update(`forst:${datos.fecha}:${datos.hora}`).digest("hex");
  const solicitud = createHash("sha256").update(`${id}:${datos.solicitudId}:${datos.correo.toLowerCase()}`).digest("hex");
  const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(auth.calendarId)}/events`;
  const headers = { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" };
  const resultado = (evento: Evento) => ({ fecha: datos.fecha, hora: datos.hora, meet: evento.hangoutLink || null, meetPendiente: !evento.hangoutLink });
  // Una repetición tras perder la respuesta devuelve la misma reserva.
  const anterior = await fetch(`${base}/${id}`, { headers, cache: "no-store", signal: AbortSignal.timeout(15000) });
  if (anterior.ok) {
    const evento: Evento = await anterior.json();
    if (evento.status !== "cancelled" && evento.extendedProperties?.private?.solicitud === solicitud) return resultado(evento);
    throw new ErrorAgenda("Ese horario ya no está disponible. Elige otro.", 409);
  }
  if (anterior.status !== 404 && anterior.status !== 410) throw new ErrorAgenda("No pudimos verificar la reserva. Vuelve a intentarlo.");
  if (!(await disponibilidad(datos.fecha, auth)).includes(datos.hora)) throw new ErrorAgenda("Ese horario ya no está disponible. Elige otro.", 409);
  const respuesta = await fetch(`${base}?conferenceDataVersion=1&sendUpdates=all`, {
    method: "POST", headers, cache: "no-store", signal: AbortSignal.timeout(20000),
    body: JSON.stringify({
      id, summary: "Tu cita con Diego Acosta | FORST",
      description: `Conversación con ${datos.nombre}\nNegocio: ${datos.negocio || "No indicado"}\n\n${datos.mensaje}`,
      start: { dateTime: inicio.toISOString(), timeZone: ZONA_CITAS },
      end: { dateTime: new Date(inicio.getTime() + DURACION_CITA * 60000).toISOString(), timeZone: ZONA_CITAS },
      attendees: [{ email: datos.correo, displayName: datos.nombre }],
      guestsCanModify: false, guestsCanInviteOthers: false, guestsCanSeeOtherGuests: false,
      extendedProperties: { private: { solicitud } },
      conferenceData: { createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } },
    }),
  });
  if (respuesta.status === 409) throw new ErrorAgenda("Ese horario acaba de reservarse. Elige otro.", 409);
  if (!respuesta.ok) throw new ErrorAgenda("No pudimos completar la reserva. Vuelve a intentarlo o contáctanos.");
  let evento: Evento = await respuesta.json();
  // La generación de Meet puede ser asíncrona. Consultar una vez antes
  // de mostrar la confirmación; nunca inventar un enlace.
  if (!evento.hangoutLink) {
    const consulta = await fetch(`${base}/${id}`, { headers, cache: "no-store", signal: AbortSignal.timeout(10000) }).catch(() => null);
    if (consulta?.ok) evento = await consulta.json();
  }
  return resultado(evento);
}
