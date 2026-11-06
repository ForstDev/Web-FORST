"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Clock3, Globe2, LoaderCircle, Video } from "lucide-react";
import { diaReservable, DURACION_CITA, etiquetaFecha, etiquetaHora, HORIZONTE_DIAS } from "@/lib/citas/horarios";
import styles from "./agenda.module.css";

type Consulta = { fecha: string; estado: "cargando" | "lista" | "error" | "desconectada"; horas: string[]; error?: string };
type Confirmacion = { fecha: string; hora: string; meet: string | null; meetPendiente: boolean };

function primerDia(hoy: string) {
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(`${hoy}T12:00:00Z`);
    fecha.setUTCDate(fecha.getUTCDate() + i);
    const valor = fecha.toISOString().slice(0, 10);
    if (diaReservable(valor)) return valor;
  }
  return hoy;
}

export default function AgendaCitas({ hoy }: { hoy: string }) {
  const [fecha, setFecha] = useState(() => primerDia(hoy));
  const [mes, setMes] = useState(() => primerDia(hoy).slice(0, 7));
  const [hora, setHora] = useState("");
  const [paso, setPaso] = useState<"horario" | "datos">("horario");
  const [consulta, setConsulta] = useState<Consulta>({ fecha: "", estado: "cargando", horas: [] });
  const [recarga, setRecarga] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState<Confirmacion | null>(null);
  const tituloPaso = useRef<HTMLHeadingElement>(null);
  const solicitudId = useRef("");
  const consultaActual = consulta.fecha === fecha;
  const cargando = !consultaActual || consulta.estado === "cargando";
  const horas = consultaActual ? consulta.horas : [];

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/citas?fecha=${fecha}`, { signal: controller.signal, cache: "no-store" })
      .then(async respuesta => {
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.error || "No pudimos cargar los horarios.");
        setConsulta({ fecha, estado: datos.configurada ? "lista" : "desconectada", horas: datos.horarios });
      })
      .catch(e => { if (!controller.signal.aborted) setConsulta({ fecha, estado: "error", horas: [], error: e.message }); });
    return () => controller.abort();
  }, [fecha, recarga]);

  useEffect(() => { if (paso === "datos" || confirmacion) tituloPaso.current?.focus(); }, [paso, confirmacion]);

  const [ano, numeroMes] = mes.split("-").map(Number);
  const comienzo = new Date(Date.UTC(ano, numeroMes - 1, 1));
  const diasMes = new Date(Date.UTC(ano, numeroMes, 0)).getUTCDate();
  const desplazamiento = (comienzo.getUTCDay() + 6) % 7;
  const nombreMes = new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric", timeZone: "UTC" }).format(comienzo);
  const limiteMes = new Date(new Date(`${hoy}T12:00:00Z`).getTime() + HORIZONTE_DIAS * 86400000).toISOString().slice(0, 7);

  function cambiarMes(direccion: number) {
    const siguiente = new Date(Date.UTC(ano, numeroMes - 1 + direccion, 1));
    setMes(siguiente.toISOString().slice(0, 7));
  }

  async function reservar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;
    const formulario = new FormData(e.currentTarget);
    if (!solicitudId.current) solicitudId.current = crypto.randomUUID();
    setEnviando(true);
    setError("");
    try {
      const respuesta = await fetch("/api/citas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha, hora, solicitudId: solicitudId.current, nombre: formulario.get("nombre"), correo: formulario.get("correo"), negocio: formulario.get("negocio"), mensaje: formulario.get("mensaje"), sitio: formulario.get("sitio"), acepta: formulario.get("acepta") === "on" }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        if (respuesta.status === 409) { setHora(""); setPaso("horario"); setConsulta({ fecha, estado: "cargando", horas: [] }); setRecarga(v => v + 1); }
        throw new Error(datos.error || "No pudimos confirmar la cita. Inténtalo de nuevo.");
      }
      setConfirmacion(datos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos conectar. Revisa tu conexión y vuelve a intentarlo.");
    } finally { setEnviando(false); }
  }

  return (
    <section className={styles.page}>
      <div className={styles.topline}>
        <Link href="/contacto"><ArrowLeft size={14} /> Volver a contacto</Link>
        <span>Una conversación. Un punto de partida.</span>
      </div>
      <div className={styles.agenda}>
        <aside className={styles.presentacion}>
          <div className={styles.retrato}>
            <Image src="/assets/img/diego-acosta.jpg" alt="Diego Acosta" fill sizes="(max-width: 540px) 84px, (max-width: 820px) 190px, (max-width: 1050px) 240px, 282px" priority className={styles.foto} />
          </div>
          <div className={styles.anfitrion}><strong>Diego Acosta</strong><span>De tu idea al siguiente paso.</span></div>
          <h1>Hablemos de<br /> <span>tu negocio.</span></h1>
          <p className={styles.descripcion}>Cuéntanos dónde estás y a dónde quieres llegar. Juntos encontramos por dónde empezar.</p>
          <ul className={styles.detalles}>
            <li><Clock3 size={15} /> Hasta {DURACION_CITA} minutos</li>
            <li><Video size={15} /> Google Meet</li>
            <li><Globe2 size={15} /> Hora de Perú · UTC−5</li>
          </ul>
          <p className={styles.nota}>Elige un día y una hora. Recibirás la invitación en tu correo al confirmar.</p>
        </aside>

        <div className={styles.contenido}>
          <div className={styles.pasos} aria-label="Progreso de la reserva">
            <span aria-current={paso === "horario" && !confirmacion ? "step" : undefined}><i>{paso === "datos" || confirmacion ? <Check size={12} /> : "1"}</i> Día y hora</span>
            <span className={styles.lineaPaso} />
            <span aria-current={paso === "datos" || confirmacion ? "step" : undefined}><i>{confirmacion ? <Check size={12} /> : "2"}</i> Tus datos</span>
          </div>

          {confirmacion ? <div className={styles.confirmacion}>
            <span className={styles.sello}><Check size={28} /></span>
            <h2 ref={tituloPaso} tabIndex={-1}>Ya tenemos una cita.</h2>
            <p>Google Calendar ha creado la reunión y solicitado el envío de la invitación a tu correo.</p>
            <div className={styles.resumen}><strong>{etiquetaFecha(confirmacion.fecha)}</strong><span>{etiquetaHora(confirmacion.hora)} · Hora de Perú</span><span>{DURACION_CITA} minutos · Google Meet</span></div>
            <p>Cuando llegue la hora de tu cita, entra desde el enlace de Google Meet de la invitación en tu correo o en Google Calendar.</p>
            {!confirmacion.meet && <p>El enlace de Meet aún no está disponible. Revisa la invitación en Calendar; si no aparece, escríbenos desde Contacto.</p>}
            <p className={styles.nota}>¿Necesitas cancelar? Puedes rechazar la invitación en Google Calendar o <Link href="/contacto">contactarnos</Link>.</p>
          </div> : paso === "datos" ? <div className={styles.datos}>
            <button className={styles.volver} onClick={() => { setPaso("horario"); setError(""); }} disabled={enviando}><ArrowLeft size={15} /> Cambiar horario</button>
            <h2 ref={tituloPaso} tabIndex={-1}>Un poco sobre ti.</h2>
            <p className={styles.subtitulo}>Para que nuestra conversación empiece bien.</p>
            <div className={styles.resumenCompacto}><Video size={18} /><div><strong>{etiquetaFecha(fecha)}</strong><span>{etiquetaHora(hora)} · {DURACION_CITA} min · Hora de Perú</span></div></div>
            <form onSubmit={reservar} className={styles.formulario}>
              <fieldset disabled={enviando}>
                <div className={styles.dosCampos}>
                  <label>Tu nombre <input name="nombre" autoComplete="name" required minLength={2} maxLength={100} placeholder="¿Cómo te llamas?" /></label>
                  <label>Tu correo <input name="correo" type="email" autoComplete="email" required maxLength={254} placeholder="nombre@empresa.com" /></label>
                </div>
                <label>Tu negocio <span className={styles.opcional}>(opcional)</span><input name="negocio" autoComplete="organization" maxLength={120} placeholder="Nombre de tu negocio" /></label>
                <label>¿Qué te gustaría conversar? <span className={styles.opcional}>(opcional)</span><textarea name="mensaje" rows={3} maxLength={1000} placeholder="Una idea, un reto o algo que quieres mejorar…" /></label>
                <div className={styles.trampa} aria-hidden="true"><label>Sitio web<input name="sitio" tabIndex={-1} autoComplete="off" /></label></div>
                <label className={styles.consentimiento}><input name="acepta" type="checkbox" required /><span>Acepto el uso de mis datos para coordinar esta cita, según la <Link href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer">política de privacidad</Link>.</span></label>
              </fieldset>
              {error && <p role="alert" className={styles.error}>{error}</p>}
              <button type="submit" className={styles.primario} disabled={enviando}>{enviando ? <><LoaderCircle size={16} className={styles.girando} /> Confirmando…</> : <>Confirmar cita <ArrowRight size={16} /></>}</button>
              <p className={styles.nota}>La invitación llegará al correo que indiques. Revisa también tu carpeta de spam.</p>
            </form>
          </div> : <>
            <div className={styles.selector}>
              <div className={styles.calendario}>
                <h2>Elige un día.</h2>
                <p className={styles.subtitulo}>Hagamos espacio para tu próxima idea.</p>
                <div className={styles.mes}><strong aria-live="polite">{nombreMes}</strong><div><button aria-label="Mes anterior" disabled={mes <= hoy.slice(0, 7)} onClick={() => cambiarMes(-1)}><ChevronLeft size={17} /></button><button aria-label="Mes siguiente" disabled={mes >= limiteMes} onClick={() => cambiarMes(1)}><ChevronRight size={17} /></button></div></div>
                <div className={styles.semana} aria-hidden="true">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => <span key={d}>{d}</span>)}</div>
                <div className={styles.dias} role="group" aria-label={`Días de ${nombreMes}`}>
                  {Array.from({ length: desplazamiento }, (_, i) => <span key={`vacio-${i}`} />)}
                  {Array.from({ length: diasMes }, (_, i) => {
                    const dia = i + 1;
                    const valor = `${mes}-${String(dia).padStart(2, "0")}`;
                    return <button key={valor} disabled={!diaReservable(valor)} aria-pressed={fecha === valor} aria-label={etiquetaFecha(valor)} aria-current={valor === hoy ? "date" : undefined} onClick={() => { setFecha(valor); setHora(""); setError(""); }}>{dia}{valor === hoy && <span className={styles.hoy} />}</button>;
                  })}
                </div>
                <div className={styles.leyenda}><span /> Día seleccionado <small>De lunes a viernes</small></div>
              </div>

              <div className={styles.horarios}>
                <h3>{etiquetaFecha(fecha)}</h3>
                <p className={styles.zona}>Hora de Perú · UTC−5</p>
                <div aria-live="polite" aria-busy={cargando} className={styles.listaHorarios}>
                  {cargando ? <div className={styles.estado}><LoaderCircle size={22} className={styles.girando} /><p>Consultando horarios…</p></div> : consulta.estado === "desconectada" ? <div className={styles.estado}><Video size={24} /><strong>Pronto podrás reservar aquí.</strong><p>Estamos preparando la agenda. Por ahora, coordinemos tu cita directamente.</p><Link href="/contacto">Coordinar una cita <ArrowRight size={14} /></Link></div> : consulta.estado === "error" ? <div className={styles.estado}><p>{consulta.error}</p><button onClick={() => { setConsulta({ fecha, estado: "cargando", horas: [] }); setRecarga(v => v + 1); }}>Volver a intentar</button></div> : horas.length === 0 ? <div className={styles.estado}><Clock3 size={23} /><strong>Este día está completo.</strong><p>Elige otra fecha para ver más horarios.</p></div> : ["Mañana", "Tarde"].map((grupo, i) => {
                    const lista = horas.filter(h => i === 0 ? Number(h.slice(0, 2)) < 12 : Number(h.slice(0, 2)) >= 12);
                    return lista.length > 0 && <div className={styles.grupo} key={grupo}><span>{grupo}</span>{lista.map(h => <button key={h} aria-pressed={hora === h} onClick={() => { setHora(h); setError(""); }}>{etiquetaHora(h)}{hora === h && <Check size={14} />}</button>)}</div>;
                  })}
                </div>
              </div>
            </div>
            <div className={styles.pieSelector}>
              <p>{hora ? <>{etiquetaFecha(fecha)}<br /><strong>{etiquetaHora(hora)} · {DURACION_CITA} minutos</strong></> : <>Un primer encuentro para<br /><strong>entender tu negocio.</strong></>}</p>
              <button className={styles.primario} disabled={!hora || cargando || !horas.includes(hora)} onClick={() => setPaso("datos")}>Continuar <ArrowRight size={16} /></button>
            </div>
            {error && <p role="alert" className={styles.error}>{error}</p>}
          </>}
        </div>
      </div>
      <p className={styles.cierre}>Sin rodeos. Sin compromiso. <span>Con ganas de conocer tu negocio.</span></p>
    </section>
  );
}
