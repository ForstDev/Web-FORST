import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, CircleCheck, Clock, TriangleAlert, MessageCircle, BookOpenText, FileText } from "lucide-react";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import BotonPagar from "@/components/portal/BotonPagar";
import EtiquetaEstado from "@/components/portal/EstadoPago";
import { formatoFecha, formatoFechaLarga, formatoMesCorto, formatoPeriodo, formatoSoles } from "@/components/portal/formato";
import { cerrarSesion } from "@/app/clientes/acciones";
import { leerSesion } from "@/lib/portal/sesion";
import { clienteDemo, type EstadoPago, type Pago } from "@/lib/portal/datos-demo";

/** Un pago pendiente cuya fecha ya pasó se muestra como vencido. */
function estadoEfectivo(p: Pago, hoy: string): EstadoPago {
  return p.estado === "pendiente" && p.vence < hoy ? "vencido" : p.estado;
}

/** Los doce meses de mantenimiento desde el primero, para ver de un
 * vistazo cuáles están pagados y cuáles faltan. */
function mesesDeMantenimiento(pagos: Pago[]) {
  const primero = pagos.filter((p) => p.concepto === "Mantenimiento mensual").map((p) => p.periodo).sort()[0];
  const [a, m] = primero.split("-").map(Number);
  return Array.from({ length: 12 }, (_, i) => {
    const fecha = new Date(Date.UTC(a, m - 1 + i, 1));
    const periodo = `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, "0")}`;
    return { periodo, pago: pagos.find((p) => p.periodo === periodo && p.concepto === "Mantenimiento mensual") };
  });
}

export default async function PanelClientePage() {
  const sesion = await leerSesion();
  if (!sesion) redirect("/clientes");

  const c = clienteDemo;
  const hoy = new Date().toISOString().slice(0, 10);
  const pagos = c.pagos.map((p) => ({ ...p, estado: estadoEfectivo(p, hoy) }));
  const porPagar = pagos.filter((p) => p.estado !== "pagado").sort((x, y) => x.vence.localeCompare(y.vence));
  const proximo = porPagar[0];
  const estadoCuenta: "al-dia" | "pendiente" | "vencido" = porPagar.some((p) => p.estado === "vencido")
    ? "vencido"
    : proximo
      ? "pendiente"
      : "al-dia";
  const meses = mesesDeMantenimiento(pagos);
  const ultimoPago = pagos
    .filter((p) => p.pagadoEl)
    .sort((x, y) => y.pagadoEl!.localeCompare(x.pagadoEl!))[0];
  const anio = hoy.slice(0, 4);
  const pagadoEnAnio = pagos
    .filter((p) => p.pagadoEl?.startsWith(anio))
    .reduce((s, p) => s + p.monto, 0);
  // El mantenimiento siguiente al que está por pagar: mismo día, un mes después.
  const baseVence = proximo?.vence ?? ultimoPago?.vence ?? hoy;
  const [va, vm, vd] = baseVence.split("-").map(Number);
  const siguienteVence = new Date(Date.UTC(va, vm, vd)).toISOString().slice(0, 10);
  const pagadosMant = meses.filter((x) => x.pago?.estado === "pagado").length;

  const resumen = {
    "al-dia": { titulo: "Estás al día", Icono: CircleCheck, tono: "text-[var(--forst-green)]", fondo: "bg-[var(--forst-tint)]" },
    pendiente: { titulo: "Tienes un pago pendiente", Icono: Clock, tono: "text-[#6b4126]", fondo: "bg-[#f3e4d8]" },
    vencido: { titulo: "Tienes un pago vencido", Icono: TriangleAlert, tono: "text-[#b42318]", fondo: "bg-[#fde7e4]" },
  }[estadoCuenta];

  return (
    <div className="min-h-[100svh] bg-[var(--forst-white)]">
      <header className="border-b border-[var(--forst-line)]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <AnimatedLogo size={30} animateOnMount={false} />
            <span className="font-logo text-[15px] tracking-[0.04em] text-black">FORST</span>
            <span className="hidden sm:inline ml-2 pl-3 border-l border-[var(--forst-line)] text-[13px] text-black/55">
              Portal de clientes
            </span>
          </Link>
          <div className="flex items-center gap-4 min-w-0">
            <span className="hidden md:block truncate text-[13px] text-black/65">{c.empresa}</span>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--forst-line)] px-4 py-2 text-[13px] text-black/75 hover:border-[var(--forst-green)] hover:text-[var(--forst-green)] transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#f3e4d8] px-3 py-1 text-[12px] text-[#6b4126]">
          Prototipo con datos de ejemplo
        </p>

        <div className="mt-6">
          <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-tight text-black">
            Hola, {c.nombre}
          </h1>
          <p className="mt-1 text-[14px] text-black/60">
            {c.empresa} · RUC {c.ruc}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Estado de la cuenta: lo primero que se ve y la única acción principal. */}
          <section aria-labelledby="estado-titulo" className="lg:col-span-2 flex flex-col rounded-3xl border border-[var(--forst-line)] bg-white p-6 md:p-8">
            <div className={`self-start inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium ${resumen.fondo} ${resumen.tono}`}>
              <resumen.Icono className="h-4 w-4" aria-hidden />
              <span id="estado-titulo">{resumen.titulo}</span>
            </div>

            {proximo ? (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <p className="text-[13px] text-black/55">
                    {proximo.concepto} de {formatoPeriodo(proximo.periodo)}
                  </p>
                  <p className="mt-1 font-display text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-none tabular-nums text-[var(--forst-green)]">
                    {formatoSoles(proximo.monto)}
                  </p>
                  <p className="mt-3 text-[14px] text-black/70">
                    {proximo.estado === "vencido" ? "Venció el " : "Vence el "}
                    <strong className="font-medium text-black">{formatoFechaLarga(proximo.vence)}</strong>
                  </p>
                </div>
                <BotonPagar
                  concepto={proximo.concepto}
                  periodo={formatoPeriodo(proximo.periodo)}
                  monto={formatoSoles(proximo.monto)}
                  empresa={c.empresa}
                />
              </div>
            ) : (
              <p className="mt-6 text-[15px] text-black/70">No tienes pagos pendientes. Tu próximo mantenimiento aparecerá aquí.</p>
            )}

            {/* Resumen al pie: completa la tarjeta con datos útiles en vez
                de dejar un hueco cuando la del plan es más alta. */}
            <dl className="mt-auto pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="border-t border-[var(--forst-line)] pt-4">
                <dt className="text-[12px] text-black/50">Último pago</dt>
                <dd className="mt-1 text-[14px] text-black">
                  {ultimoPago ? `${formatoFecha(ultimoPago.pagadoEl!)} · ${formatoSoles(ultimoPago.monto)}` : "Sin pagos aún"}
                </dd>
              </div>
              <div className="border-t border-[var(--forst-line)] pt-4">
                <dt className="text-[12px] text-black/50">Pagado en {anio}</dt>
                <dd className="mt-1 text-[14px] tabular-nums text-black">{formatoSoles(pagadoEnAnio)}</dd>
              </div>
              <div className="border-t border-[var(--forst-line)] pt-4">
                <dt className="text-[12px] text-black/50">Siguiente vencimiento</dt>
                <dd className="mt-1 text-[14px] text-black">{formatoFecha(siguienteVence)}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="plan-titulo" className="rounded-3xl bg-[var(--forst-green)] p-6 md:p-8 text-[var(--forst-white)]">
            <p className="t-eyebrow text-white/60">Tu plan</p>
            <h2 id="plan-titulo" className="mt-3 font-display text-2xl font-medium">{c.plan}</h2>
            <p className="mt-1 text-[14px] leading-relaxed text-white/75">{c.servicio}</p>
            <p className="mt-5 text-[13px] text-white/60">
              Mantenimiento: <span className="text-white">{formatoSoles(c.cuotaMensual)} al mes</span>
            </p>
            <ul className="mt-4 space-y-2 border-t border-white/15 pt-4">
              {c.incluye.map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] leading-snug text-white/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--forst-tan)]" />
                  {i}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[12px] text-white/55">Cliente desde el {formatoFechaLarga(c.inicio)}</p>
          </section>
        </div>

        {/* Alineación: los doce meses de mantenimiento en una fila. */}
        <section aria-labelledby="meses-titulo" className="mt-5 rounded-3xl border border-[var(--forst-line)] bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="meses-titulo" className="font-display text-lg font-medium text-black">Tus mantenimientos</h2>
            <p className="text-[13px] text-black/55">
              {pagadosMant} de 12 meses pagados
            </p>
          </div>
          <ol className="mt-6 grid grid-cols-6 md:grid-cols-12 gap-x-2 gap-y-5">
            {meses.map(({ periodo, pago }) => {
              const estado = pago?.estado;
              const nombre = formatoPeriodo(periodo);
              const etiqueta = estado === "pagado" ? "pagado" : estado === "pendiente" ? "pendiente" : estado === "vencido" ? "vencido" : "por venir";
              return (
                <li key={periodo} className="flex flex-col items-center gap-2" aria-label={`${nombre}: ${etiqueta}`}>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      estado === "pagado"
                        ? "bg-[var(--forst-green)] text-white"
                        : estado === "pendiente"
                          ? "border-2 border-[var(--forst-tan)] bg-[#f3e4d8] text-[#6b4126]"
                          : estado === "vencido"
                            ? "bg-[#fde7e4] text-[#b42318] border-2 border-[#b42318]"
                            : "border border-dashed border-black/20 text-black/30"
                    }`}
                  >
                    {estado === "pagado" ? (
                      <CircleCheck className="h-4 w-4" aria-hidden />
                    ) : estado === "pendiente" ? (
                      <Clock className="h-4 w-4" aria-hidden />
                    ) : estado === "vencido" ? (
                      <TriangleAlert className="h-4 w-4" aria-hidden />
                    ) : null}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-black/55" aria-hidden>
                    {formatoMesCorto(periodo)}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-black/55">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[var(--forst-green)]" />Pagado</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-[var(--forst-tan)] bg-[#f3e4d8]" />Pendiente</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-[#b42318] bg-[#fde7e4]" />Vencido</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-dashed border-black/30" />Por venir</span>
          </p>
        </section>

        {/* Historial: tabla en escritorio, fichas en móvil. */}
        <section aria-labelledby="historial-titulo" className="mt-5 rounded-3xl border border-[var(--forst-line)] bg-white p-6 md:p-8">
          <h2 id="historial-titulo" className="font-display text-lg font-medium text-black">Historial de pagos</h2>

          <table className="mt-5 hidden md:table w-full text-[14px]">
            <thead>
              <tr className="border-b border-[var(--forst-line)] text-left text-[12px] uppercase tracking-wide text-black/50">
                <th scope="col" className="py-3 pr-4 font-medium">Concepto</th>
                <th scope="col" className="py-3 pr-4 font-medium">Vence</th>
                <th scope="col" className="py-3 pr-4 font-medium">Pagado el</th>
                <th scope="col" className="py-3 pr-4 font-medium">Comprobante</th>
                <th scope="col" className="py-3 pr-4 font-medium text-right">Monto</th>
                <th scope="col" className="py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((p) => (
                <tr key={p.id} className="border-b border-[var(--forst-line)] last:border-0">
                  <td className="py-3.5 pr-4">
                    <span className="block text-black">{p.concepto}</span>
                    <span className="block text-[12px] text-black/50 first-letter:uppercase">{formatoPeriodo(p.periodo)}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-black/70 tabular-nums">{formatoFecha(p.vence)}</td>
                  <td className="py-3.5 pr-4 text-black/70 tabular-nums">{p.pagadoEl ? formatoFecha(p.pagadoEl) : "Aún no"}</td>
                  <td className="py-3.5 pr-4">
                    {p.comprobante ? (
                      <span className="inline-flex items-center gap-1.5 text-black/75 tabular-nums" title="La descarga del PDF llega en la versión final">
                        <FileText className="h-3.5 w-3.5 text-[var(--forst-green)]" aria-hidden />
                        {p.comprobante}
                      </span>
                    ) : (
                      <span className="text-black/40">Sin emitir</span>
                    )}
                  </td>
                  <td className="py-3.5 pr-4 text-right tabular-nums text-black">{formatoSoles(p.monto)}</td>
                  <td className="py-3.5"><EtiquetaEstado estado={p.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="mt-4 md:hidden divide-y divide-[var(--forst-line)]">
            {pagos.map((p) => (
              <li key={p.id} className="py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[14px] text-black">{p.concepto}</p>
                  <p className="text-[12px] text-black/55 first-letter:uppercase">{formatoPeriodo(p.periodo)}</p>
                  <p className="mt-1 text-[12px] text-black/55">
                    {p.pagadoEl ? `Pagado el ${formatoFecha(p.pagadoEl)}` : `Vence el ${formatoFecha(p.vence)}`}
                    {p.comprobante && <span className="whitespace-nowrap"> · {p.comprobante}</span>}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-[14px] tabular-nums text-black">{formatoSoles(p.monto)}</span>
                  <EtiquetaEstado estado={p.estado} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <a
            href={`https://wa.me/51962316856?text=${encodeURIComponent(`Hola FORST, soy de ${c.empresa} y tengo una consulta sobre mis pagos.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-3xl border border-[var(--forst-line)] bg-white p-6 hover:border-[var(--forst-green)]/50 transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-[var(--forst-green)]" aria-hidden />
            <span>
              <span className="block text-[15px] font-medium text-black">¿Algo no cuadra?</span>
              <span className="block text-[13px] text-black/60">Escríbenos por WhatsApp y lo revisamos.</span>
            </span>
          </a>
          <Link
            href="/libro-de-reclamaciones"
            className="group flex items-center gap-4 rounded-3xl border border-[var(--forst-line)] bg-white p-6 hover:border-[var(--forst-green)]/50 transition-colors"
          >
            <BookOpenText className="h-5 w-5 text-[var(--forst-green)]" aria-hidden />
            <span>
              <span className="block text-[15px] font-medium text-black">Libro de reclamaciones</span>
              <span className="block text-[13px] text-black/60">Registra un reclamo o una queja.</span>
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
