import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

export type TipoDocumento = "DNI" | "CE" | "PASAPORTE" | "RUC";

export type DatosReclamo = {
  tipo: "reclamo" | "queja";
  nombres: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  domicilio: string;
  telefono: string;
  correo: string;
  menorDeEdad: boolean;
  apoderado: string | null;
  bienTipo: "producto" | "servicio";
  monto: number | null;
  bienDescripcion: string;
  detalle: string;
  pedido: string;
};

export type ReclamoRegistrado = { numero: string; fecha: string };

export class ErrorValidacion extends Error {
  constructor(public campo: string, mensaje: string) {
    super(mensaje);
  }
}

export class ErrorConfiguracion extends Error {}

const DOCUMENTO: Record<TipoDocumento, RegExp> = {
  DNI: /^\d{8}$/,
  RUC: /^(10|15|17|20)\d{9}$/,
  CE: /^[A-Za-z0-9]{8,12}$/,
  PASAPORTE: /^[A-Za-z0-9]{6,12}$/,
};

/** Quita caracteres de control y recorta. El texto se guarda tal cual lo
 * escribe la persona: se escapa al mostrarlo (React lo hace solo), no al
 * guardarlo. */
function texto(v: unknown, campo: string, min: number, max: number, etiqueta: string): string {
  if (typeof v !== "string") throw new ErrorValidacion(campo, `Completa ${etiqueta}.`);
  const limpio = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (limpio.length < min) throw new ErrorValidacion(campo, `Completa ${etiqueta}.`);
  if (limpio.length > max)
    throw new ErrorValidacion(campo, `${etiqueta[0].toUpperCase()}${etiqueta.slice(1)} admite hasta ${max} caracteres.`);
  return limpio;
}

/** Valida el cuerpo recibido y devuelve datos limpios, o lanza un
 * ErrorValidacion con el campo exacto para marcarlo en el formulario. */
export function validarReclamo(b: Record<string, unknown>): DatosReclamo {
  if (b.aceptaDatos !== true)
    throw new ErrorValidacion("aceptaDatos", "Necesitamos tu autorización para registrar el reclamo.");

  const tipo = b.tipo;
  if (tipo !== "reclamo" && tipo !== "queja")
    throw new ErrorValidacion("tipo", "Elige si es un reclamo o una queja.");

  const tipoDocumento = b.tipoDocumento as TipoDocumento;
  if (!(tipoDocumento in DOCUMENTO))
    throw new ErrorValidacion("tipoDocumento", "Elige el tipo de documento.");
  const numeroDocumento = texto(b.numeroDocumento, "numeroDocumento", 1, 12, "el número de documento");
  if (!DOCUMENTO[tipoDocumento].test(numeroDocumento))
    throw new ErrorValidacion("numeroDocumento", "Revisa el número de documento.");

  const telefono = texto(b.telefono, "telefono", 6, 20, "el teléfono");
  if (!/^\+?[\d\s()-]{6,20}$/.test(telefono))
    throw new ErrorValidacion("telefono", "Revisa el teléfono: solo números, espacios y +.");

  const correo = texto(b.correo, "correo", 5, 120, "el correo");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo))
    throw new ErrorValidacion("correo", "Revisa el correo electrónico.");

  const menorDeEdad = b.menorDeEdad === true;
  const apoderado = menorDeEdad
    ? texto(b.apoderado, "apoderado", 3, 120, "el nombre de tu madre, padre o apoderado")
    : null;

  const bienTipo = b.bienTipo;
  if (bienTipo !== "producto" && bienTipo !== "servicio")
    throw new ErrorValidacion("bienTipo", "Elige si se trata de un producto o un servicio.");

  let monto: number | null = null;
  if (b.monto !== "" && b.monto != null) {
    const n = Number(b.monto);
    if (!Number.isFinite(n) || n < 0 || n > 10_000_000)
      throw new ErrorValidacion("monto", "Revisa el monto reclamado.");
    monto = Math.round(n * 100) / 100;
  }

  return {
    tipo,
    nombres: texto(b.nombres, "nombres", 3, 120, "tus nombres y apellidos"),
    tipoDocumento,
    numeroDocumento,
    domicilio: texto(b.domicilio, "domicilio", 5, 200, "tu domicilio"),
    telefono,
    correo,
    menorDeEdad,
    apoderado,
    bienTipo,
    monto,
    bienDescripcion: texto(b.bienDescripcion, "bienDescripcion", 3, 500, "la descripción del producto o servicio"),
    detalle: texto(b.detalle, "detalle", 10, 3000, "el detalle"),
    pedido: texto(b.pedido, "pedido", 5, 1500, "tu pedido"),
  };
}

/** Número correlativo con el formato de la hoja: 000001-2026. */
function formatearNumero(id: number, fecha: Date) {
  return `${String(id).padStart(6, "0")}-${fecha.getFullYear()}`;
}

async function guardarEnSupabase(d: DatosReclamo, url: string, clave: string): Promise<ReclamoRegistrado> {
  // Las claves nuevas de Supabase (sb_secret_...) no son JWT y van solo
  // en `apikey`; las antiguas (service_role, un JWT) van en ambas
  // cabeceras. Se soportan las dos para no depender de cuál esté activa.
  const headers: Record<string, string> = {
    apikey: clave,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
  if (clave.startsWith("eyJ")) headers.Authorization = `Bearer ${clave}`;

  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/reclamos?select=id,creado_en`, {
    method: "POST",
    headers,
    cache: "no-store",
    body: JSON.stringify({
      tipo: d.tipo,
      nombres: d.nombres,
      tipo_documento: d.tipoDocumento,
      numero_documento: d.numeroDocumento,
      domicilio: d.domicilio,
      telefono: d.telefono,
      correo: d.correo,
      menor_de_edad: d.menorDeEdad,
      apoderado: d.apoderado,
      bien_tipo: d.bienTipo,
      monto: d.monto,
      bien_descripcion: d.bienDescripcion,
      detalle: d.detalle,
      pedido: d.pedido,
      acepta_tratamiento_datos: true,
    }),
  });
  if (!res.ok) {
    // El detalle va al log del servidor, nunca a la respuesta: puede
    // incluir nombres de tablas o columnas.
    console.error("reclamos: Supabase respondió", res.status, await res.text());
    throw new Error("No se pudo guardar el reclamo");
  }
  const [fila] = (await res.json()) as { id: number; creado_en: string }[];
  const fecha = new Date(fila.creado_en);
  return { numero: formatearNumero(fila.id, fecha), fecha: fila.creado_en };
}

/** Solo en desarrollo: guarda en un archivo local ignorado por git, para
 * poder probar el flujo completo sin la clave de Supabase. */
async function guardarEnArchivoLocal(d: DatosReclamo): Promise<ReclamoRegistrado> {
  const archivo = path.join(process.cwd(), ".data", "reclamos-dev.json");
  await fs.mkdir(path.dirname(archivo), { recursive: true });
  let filas: (DatosReclamo & { id: number; creado_en: string })[] = [];
  try {
    filas = JSON.parse(await fs.readFile(archivo, "utf8"));
  } catch {
    filas = [];
  }
  const id = (filas.at(-1)?.id ?? 0) + 1;
  const ahora = new Date();
  filas.push({ ...d, id, creado_en: ahora.toISOString() });
  await fs.writeFile(archivo, JSON.stringify(filas, null, 2));
  return { numero: formatearNumero(id, ahora), fecha: ahora.toISOString() };
}

export async function registrarReclamo(d: DatosReclamo): Promise<ReclamoRegistrado> {
  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && clave) return guardarEnSupabase(d, url, clave);
  if (process.env.NODE_ENV !== "production") return guardarEnArchivoLocal(d);
  throw new ErrorConfiguracion("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
}
