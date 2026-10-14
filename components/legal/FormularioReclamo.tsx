"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Printer, CircleAlert, CheckCircle2 } from "lucide-react";
import { empresa } from "@/data/empresa";

type Valores = {
  tipo: "reclamo" | "queja" | "";
  nombres: string;
  tipoDocumento: "DNI" | "CE" | "PASAPORTE" | "RUC";
  numeroDocumento: string;
  domicilio: string;
  telefono: string;
  correo: string;
  menorDeEdad: boolean;
  apoderado: string;
  bienTipo: "producto" | "servicio" | "";
  monto: string;
  bienDescripcion: string;
  detalle: string;
  pedido: string;
  aceptaDatos: boolean;
  sitio: string;
};

const INICIAL: Valores = {
  tipo: "",
  nombres: "",
  tipoDocumento: "DNI",
  numeroDocumento: "",
  domicilio: "",
  telefono: "",
  correo: "",
  menorDeEdad: false,
  apoderado: "",
  bienTipo: "servicio",
  monto: "",
  bienDescripcion: "",
  detalle: "",
  pedido: "",
  aceptaDatos: false,
  sitio: "",
};

/** Orden en que aparecen los campos, para llevar el foco al primer error. */
const ORDEN: (keyof Valores)[] = [
  "nombres", "numeroDocumento", "domicilio", "telefono", "correo", "apoderado",
  "monto", "bienDescripcion", "tipo", "detalle", "pedido", "aceptaDatos",
];

const NOMBRE_DOCUMENTO = {
  DNI: "DNI",
  CE: "Carné de extranjería",
  PASAPORTE: "Pasaporte",
  RUC: "RUC",
} as const;

const campoBase =
  "mt-2 w-full rounded-xl border border-[var(--forst-line)] bg-white px-4 py-3 text-[15px] text-black placeholder:text-black/35 transition-colors focus:outline-none focus:border-[var(--forst-green)] focus:ring-2 focus:ring-[var(--forst-green)]/20 aria-[invalid=true]:border-[#b42318]";

function formatearFecha(iso: string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(new Date(iso));
}

function Campo({
  id,
  etiqueta,
  ayuda,
  error,
  children,
  className = "",
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[13px] font-medium text-black">
        {etiqueta}
      </label>
      {children}
      {ayuda && !error && (
        <p id={`${id}-ayuda`} className="mt-1.5 text-[12px] text-black/55">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#b42318]">
          <CircleAlert className="w-3.5 h-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

function Bloque({ numero, titulo, children }: { numero: string; titulo: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-[var(--forst-line)] pt-8">
      <legend className="float-left w-full font-display font-medium text-lg md:text-xl text-black flex items-baseline gap-4">
        <span className="tabular-nums text-[var(--forst-green)] text-base">{numero}</span>
        {titulo}
      </legend>
      <div className="clear-both pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">{children}</div>
    </fieldset>
  );
}

/** Fila de la hoja impresa: etiqueta a la izquierda, valor a la derecha. */
function Fila({ etiqueta, valor }: { etiqueta: string; valor: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-0.5 sm:gap-4 py-2.5 border-b border-[var(--forst-line)] text-sm">
      <dt className="text-black/55">{etiqueta}</dt>
      <dd className="text-black whitespace-pre-wrap break-words">{valor}</dd>
    </div>
  );
}

export default function FormularioReclamo() {
  const [v, setV] = useState<Valores>(INICIAL);
  const [errores, setErrores] = useState<Partial<Record<keyof Valores, string>>>({});
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [hoja, setHoja] = useState<{ numero: string; fecha: string; datos: Valores } | null>(null);
  const hojaRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Valores>(k: K, valor: Valores[K]) => {
    setV((p) => ({ ...p, [k]: valor }));
    if (errores[k]) setErrores((p) => ({ ...p, [k]: undefined }));
  };

  const propsCampo = (k: keyof Valores, conAyuda = false) => ({
    id: k,
    name: k,
    "aria-invalid": errores[k] ? true : undefined,
    "aria-describedby": errores[k] ? `${k}-error` : conAyuda ? `${k}-ayuda` : undefined,
  });

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setMensaje(null);

    // Revisión rápida en el navegador. La validación que vale es la del
    // servidor; esta solo evita un viaje para los olvidos más comunes.
    const faltan: Partial<Record<keyof Valores, string>> = {};
    if (!v.tipo) faltan.tipo = "Elige si es un reclamo o una queja.";
    if (v.nombres.trim().length < 3) faltan.nombres = "Completa tus nombres y apellidos.";
    if (!v.numeroDocumento.trim()) faltan.numeroDocumento = "Completa el número de documento.";
    if (v.domicilio.trim().length < 5) faltan.domicilio = "Completa tu domicilio.";
    if (!v.telefono.trim()) faltan.telefono = "Completa el teléfono.";
    if (!v.correo.includes("@")) faltan.correo = "Revisa el correo electrónico.";
    if (v.menorDeEdad && v.apoderado.trim().length < 3)
      faltan.apoderado = "Completa el nombre de tu madre, padre o apoderado.";
    if (v.bienDescripcion.trim().length < 3) faltan.bienDescripcion = "Describe el producto o servicio.";
    if (v.detalle.trim().length < 10) faltan.detalle = "Cuéntanos qué pasó con un poco más de detalle.";
    if (v.pedido.trim().length < 5) faltan.pedido = "Indica qué solución esperas.";
    if (!v.aceptaDatos) faltan.aceptaDatos = "Necesitamos tu autorización para registrar el reclamo.";
    const primero = ORDEN.find((k) => faltan[k]);
    if (primero) {
      setErrores(faltan);
      document.getElementById(primero)?.focus();
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/reclamos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const r = (await res.json()) as { ok: boolean; numero?: string; fecha?: string; mensaje?: string; campo?: keyof Valores };
      if (!r.ok || !r.numero || !r.fecha) {
        if (r.campo) {
          setErrores({ [r.campo]: r.mensaje });
          document.getElementById(r.campo)?.focus();
        } else {
          setMensaje(r.mensaje ?? "No pudimos registrar tu reclamo. Vuelve a intentarlo.");
        }
        return;
      }
      setHoja({ numero: r.numero, fecha: r.fecha, datos: v });
      requestAnimationFrame(() => {
        hojaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        hojaRef.current?.focus();
      });
    } catch {
      setMensaje("No hay conexión. Revisa tu internet y vuelve a intentarlo.");
    } finally {
      setEnviando(false);
    }
  }

  if (hoja) {
    const d = hoja.datos;
    return (
      <div ref={hojaRef} tabIndex={-1} className="scroll-mt-32 outline-none">
        <div className="no-imprimir mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between rounded-2xl bg-[var(--forst-tint)] p-6">
          <p className="flex items-start gap-3 text-[15px] text-black">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-[var(--forst-green)] shrink-0" aria-hidden />
            <span>
              Registramos tu {d.tipo} con el número <strong>{hoja.numero}</strong>.
              Guarda esta hoja. Te responderemos a {d.correo} en un plazo máximo de 15
              días hábiles.
            </span>
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--forst-green)] px-6 py-3 text-[13px] font-medium text-white hover:bg-[var(--forst-green-soft)] transition-colors"
          >
            <Printer className="w-4 h-4" aria-hidden />
            Imprimir o guardar en PDF
          </button>
        </div>

        <article className="hoja-imprimible rounded-2xl border border-[var(--forst-line)] bg-white p-6 md:p-10">
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-[var(--forst-green)]">
            <div>
              <p className="t-eyebrow text-black/55">Libro de reclamaciones</p>
              <h2 className="mt-2 font-display font-medium text-2xl text-black">
                Hoja de reclamación
              </h2>
            </div>
            <div className="text-sm sm:text-right">
              <p className="text-black/55">N.º</p>
              <p className="font-medium text-lg tabular-nums text-black">{hoja.numero}</p>
              <p className="mt-1 text-black/70">{formatearFecha(hoja.fecha)}</p>
            </div>
          </header>

          <section className="mt-6">
            <h3 className="t-eyebrow text-[var(--forst-green)]">Proveedor</h3>
            <dl className="mt-2">
              <Fila etiqueta="Razón social" valor={empresa.razonSocial} />
              <Fila etiqueta="RUC" valor={empresa.ruc} />
              <Fila etiqueta="Domicilio" valor={empresa.domicilio} />
            </dl>
          </section>

          <section className="mt-8">
            <h3 className="t-eyebrow text-[var(--forst-green)]">1. Consumidor reclamante</h3>
            <dl className="mt-2">
              <Fila etiqueta="Nombres y apellidos" valor={d.nombres} />
              <Fila etiqueta={NOMBRE_DOCUMENTO[d.tipoDocumento]} valor={d.numeroDocumento} />
              <Fila etiqueta="Domicilio" valor={d.domicilio} />
              <Fila etiqueta="Teléfono" valor={d.telefono} />
              <Fila etiqueta="Correo" valor={d.correo} />
              {d.menorDeEdad && <Fila etiqueta="Madre, padre o apoderado" valor={d.apoderado} />}
            </dl>
          </section>

          <section className="mt-8">
            <h3 className="t-eyebrow text-[var(--forst-green)]">2. Bien contratado</h3>
            <dl className="mt-2">
              <Fila etiqueta="Tipo" valor={d.bienTipo === "producto" ? "Producto" : "Servicio"} />
              <Fila etiqueta="Monto reclamado" valor={d.monto ? `S/ ${Number(d.monto).toFixed(2)}` : "No indicado"} />
              <Fila etiqueta="Descripción" valor={d.bienDescripcion} />
            </dl>
          </section>

          <section className="mt-8">
            <h3 className="t-eyebrow text-[var(--forst-green)]">3. Detalle</h3>
            <dl className="mt-2">
              <Fila etiqueta="Tipo" valor={d.tipo === "reclamo" ? "Reclamo" : "Queja"} />
              <Fila etiqueta="Detalle" valor={d.detalle} />
              <Fila etiqueta="Pedido" valor={d.pedido} />
            </dl>
          </section>

          <section className="mt-8">
            <h3 className="t-eyebrow text-[var(--forst-green)]">4. Observaciones y acciones del proveedor</h3>
            <p className="mt-3 text-sm text-black/60">
              FORST completará esta sección al responder, por escrito, a tu correo.
            </p>
          </section>

          <footer className="mt-10 pt-6 border-t border-[var(--forst-line)] space-y-2 text-[12px] leading-relaxed text-black/60">
            <p>
              <strong className="text-black/80">Reclamo:</strong> disconformidad
              relacionada con los productos o servicios.{" "}
              <strong className="text-black/80">Queja:</strong> disconformidad que no
              se relaciona con los productos o servicios, o malestar con la atención
              al público.
            </p>
            <p>
              El proveedor debe responder en un plazo no mayor a 15 días hábiles. La
              formulación del reclamo no impide acudir a otras vías de solución de
              controversias ni es requisito previo para interponer una denuncia ante el
              INDECOPI.
            </p>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-12">
      {/* Campo trampa para programas automáticos. Fuera de la vista y del
          orden de tabulación; los lectores de pantalla lo ignoran. */}
      <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="sitio">No completar</label>
        <input id="sitio" name="sitio" tabIndex={-1} autoComplete="off" value={v.sitio} onChange={(e) => set("sitio", e.target.value)} />
      </div>

      <Bloque numero="01" titulo="Tus datos">
        <Campo id="nombres" etiqueta="Nombres y apellidos" error={errores.nombres} className="md:col-span-2">
          <input {...propsCampo("nombres")} autoComplete="name" className={campoBase} value={v.nombres} onChange={(e) => set("nombres", e.target.value)} />
        </Campo>
        <Campo id="tipoDocumento" etiqueta="Tipo de documento" error={errores.tipoDocumento}>
          <select {...propsCampo("tipoDocumento")} className={campoBase} value={v.tipoDocumento} onChange={(e) => set("tipoDocumento", e.target.value as Valores["tipoDocumento"])}>
            {Object.entries(NOMBRE_DOCUMENTO).map(([valor, nombre]) => (
              <option key={valor} value={valor}>{nombre}</option>
            ))}
          </select>
        </Campo>
        <Campo id="numeroDocumento" etiqueta="Número de documento" error={errores.numeroDocumento}>
          <input
            {...propsCampo("numeroDocumento")}
            inputMode={v.tipoDocumento === "DNI" || v.tipoDocumento === "RUC" ? "numeric" : "text"}
            maxLength={12}
            className={campoBase}
            value={v.numeroDocumento}
            onChange={(e) => set("numeroDocumento", e.target.value.trim())}
          />
        </Campo>
        <Campo id="domicilio" etiqueta="Domicilio" error={errores.domicilio} className="md:col-span-2">
          <input {...propsCampo("domicilio")} autoComplete="street-address" className={campoBase} value={v.domicilio} onChange={(e) => set("domicilio", e.target.value)} />
        </Campo>
        <Campo id="telefono" etiqueta="Teléfono" error={errores.telefono}>
          <input {...propsCampo("telefono")} type="tel" autoComplete="tel" className={campoBase} value={v.telefono} onChange={(e) => set("telefono", e.target.value)} />
        </Campo>
        <Campo id="correo" etiqueta="Correo electrónico" ayuda="Aquí te enviaremos la respuesta." error={errores.correo}>
          <input {...propsCampo("correo", true)} type="email" autoComplete="email" className={campoBase} value={v.correo} onChange={(e) => set("correo", e.target.value)} />
        </Campo>
        <div className="md:col-span-2">
          <label className="inline-flex items-center gap-3 text-[14px] text-black cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[var(--forst-green)]" checked={v.menorDeEdad} onChange={(e) => set("menorDeEdad", e.target.checked)} />
            Soy menor de edad
          </label>
        </div>
        {v.menorDeEdad && (
          <Campo id="apoderado" etiqueta="Nombre de tu madre, padre o apoderado" error={errores.apoderado} className="md:col-span-2">
            <input {...propsCampo("apoderado")} className={campoBase} value={v.apoderado} onChange={(e) => set("apoderado", e.target.value)} />
          </Campo>
        )}
      </Bloque>

      <Bloque numero="02" titulo="Qué contrataste">
        <div className="md:col-span-2" role="radiogroup" aria-label="Tipo de bien contratado">
          <p className="text-[13px] font-medium text-black">Tipo</p>
          <div className="mt-2 flex gap-3">
            {(["servicio", "producto"] as const).map((t) => (
              <label
                key={t}
                className="inline-flex items-center gap-2.5 rounded-full border border-[var(--forst-line)] px-5 py-2.5 text-[14px] cursor-pointer has-[:checked]:border-[var(--forst-green)] has-[:checked]:bg-[var(--forst-tint)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--forst-green)]/30"
              >
                <input type="radio" name="bienTipo" value={t} className="accent-[var(--forst-green)]" checked={v.bienTipo === t} onChange={() => set("bienTipo", t)} />
                {t === "servicio" ? "Servicio" : "Producto"}
              </label>
            ))}
          </div>
        </div>
        <Campo id="monto" etiqueta="Monto reclamado en soles (opcional)" error={errores.monto}>
          <input {...propsCampo("monto")} type="number" inputMode="decimal" min={0} step="0.01" placeholder="0.00" className={campoBase} value={v.monto} onChange={(e) => set("monto", e.target.value)} />
        </Campo>
        <Campo
          id="bienDescripcion"
          etiqueta="Descripción"
          ayuda="Por ejemplo: página web corporativa, mantenimiento mensual."
          error={errores.bienDescripcion}
          className="md:col-span-2"
        >
          <input {...propsCampo("bienDescripcion", true)} maxLength={500} className={campoBase} value={v.bienDescripcion} onChange={(e) => set("bienDescripcion", e.target.value)} />
        </Campo>
      </Bloque>

      <Bloque numero="03" titulo="Detalle">
        <div className="md:col-span-2" role="radiogroup" aria-label="Reclamo o queja" aria-describedby={errores.tipo ? "tipo-error" : undefined}>
          <p className="text-[13px] font-medium text-black">¿Es un reclamo o una queja?</p>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                ["reclamo", "Reclamo", "No estás conforme con el producto o el servicio."],
                ["queja", "Queja", "No estás conforme con la atención o con algo que no es el producto o el servicio."],
              ] as const
            ).map(([valor, titulo, texto]) => (
              <label
                key={valor}
                className="flex items-start gap-3 rounded-xl border border-[var(--forst-line)] p-4 cursor-pointer transition-colors has-[:checked]:border-[var(--forst-green)] has-[:checked]:bg-[var(--forst-tint)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--forst-green)]/30"
              >
                <input
                  type="radio"
                  name="tipo"
                  id={valor === "reclamo" ? "tipo" : undefined}
                  value={valor}
                  className="mt-1 accent-[var(--forst-green)]"
                  checked={v.tipo === valor}
                  onChange={() => set("tipo", valor)}
                />
                <span>
                  <span className="block text-[14px] font-medium text-black">{titulo}</span>
                  <span className="block mt-0.5 text-[13px] text-black/60 leading-snug">{texto}</span>
                </span>
              </label>
            ))}
          </div>
          {errores.tipo && (
            <p id="tipo-error" className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#b42318]">
              <CircleAlert className="w-3.5 h-3.5 shrink-0" aria-hidden />
              {errores.tipo}
            </p>
          )}
        </div>
        <Campo id="detalle" etiqueta="Qué pasó" ayuda="Cuéntalo con fechas y hechos concretos." error={errores.detalle} className="md:col-span-2">
          <textarea {...propsCampo("detalle", true)} rows={6} maxLength={3000} className={`${campoBase} resize-y`} value={v.detalle} onChange={(e) => set("detalle", e.target.value)} />
        </Campo>
        <Campo id="pedido" etiqueta="Qué solución esperas" error={errores.pedido} className="md:col-span-2">
          <textarea {...propsCampo("pedido")} rows={3} maxLength={1500} className={`${campoBase} resize-y`} value={v.pedido} onChange={(e) => set("pedido", e.target.value)} />
        </Campo>
      </Bloque>

      <div className="border-t border-[var(--forst-line)] pt-8 space-y-6">
        <div>
          <label className="flex items-start gap-3 text-[14px] leading-relaxed text-black/80 cursor-pointer">
            <input
              id="aceptaDatos"
              type="checkbox"
              className="mt-1 w-4 h-4 shrink-0 accent-[var(--forst-green)]"
              checked={v.aceptaDatos}
              aria-invalid={errores.aceptaDatos ? true : undefined}
              aria-describedby={errores.aceptaDatos ? "aceptaDatos-error" : undefined}
              onChange={(e) => set("aceptaDatos", e.target.checked)}
            />
            <span>
              Autorizo a {empresa.razonSocial} a usar mis datos para atender este
              reclamo y responderme, según su{" "}
              <Link href="/politica-de-privacidad" className="underline underline-offset-4 hover:text-[var(--forst-green)]">
                política de privacidad
              </Link>
              .
            </span>
          </label>
          {errores.aceptaDatos && (
            <p id="aceptaDatos-error" className="mt-1.5 ml-7 flex items-center gap-1.5 text-[12px] text-[#b42318]">
              <CircleAlert className="w-3.5 h-3.5 shrink-0" aria-hidden />
              {errores.aceptaDatos}
            </p>
          )}
        </div>

        {mensaje && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-[#b42318]/30 bg-[#b42318]/5 p-4 text-[14px] text-[#b42318]">
            <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
            {mensaje}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="inline-flex items-center justify-center rounded-full bg-[var(--forst-green)] px-8 py-3.5 text-[13px] font-medium uppercase tracking-wide text-white hover:bg-[var(--forst-green-soft)] disabled:opacity-60 disabled:cursor-wait transition-colors w-full sm:w-auto"
        >
          {enviando ? "Registrando…" : "Registrar"}
        </button>
      </div>
    </form>
  );
}
