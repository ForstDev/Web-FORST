import type { Metadata } from "next";
import Link from "next/link";
import DocumentoLegal, { type SeccionLegal } from "@/components/legal/DocumentoLegal";
import BotonConfigurarCookies from "@/components/analytics/BotonConfigurarCookies";

export const metadata: Metadata = {
  title: "Política de cookies | FORST",
  description:
    "Qué cookies usa el sitio de FORST, para qué sirven, cuánto duran y cómo aceptarlas, rechazarlas o cambiar tu elección.",
  alternates: { canonical: "/politica-de-cookies" },
};

const secciones: SeccionLegal[] = [
  {
    id: "que-son",
    titulo: "Qué son las cookies",
    contenido: (
      <p>
        Las cookies son archivos pequeños que un sitio web guarda en tu
        navegador para recordar información entre una visita y otra. Algunas
        son necesarias para que el sitio funcione y otras sirven, por
        ejemplo, para medir cómo se usa.
      </p>
    ),
  },
  {
    id: "cuales",
    titulo: "Qué usamos en este sitio",
    contenido: (
      <>
        <p>
          <strong>Necesario, siempre activo.</strong> Cuando eliges aceptar o
          rechazar las cookies, guardamos tu elección en el almacenamiento
          local de tu navegador con el nombre <code>forst-cookies</code>. No
          es una cookie, no se envía a ningún servidor y sirve solo para no
          volver a preguntarte en cada visita.
        </p>
        <p>
          <strong>Seguridad de terceros, siempre activa.</strong> Los videos
          de los casos se cargan desde Supabase, que usa la red de Cloudflare.
          Al cargarlos, Cloudflare crea una cookie técnica en su propio
          dominio. No identifica a la persona ni sigue tu navegación:
        </p>
        <table className="tabla-fichas">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Proveedor</th>
              <th>Para qué sirve</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Nombre">
                <code>__cf_bm</code>
              </td>
              <td data-label="Proveedor">Cloudflare, a través de Supabase</td>
              <td data-label="Para qué sirve">Distingue el tráfico de personas del de programas automáticos.</td>
              <td data-label="Duración">30 minutos</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Analítica, solo si la aceptas.</strong> Usamos Google
          Analytics 4 para saber qué páginas se visitan y cómo se navega el
          sitio. Hasta que aceptes, el código de Google Analytics no se carga
          y no se crea ninguna de estas cookies:
        </p>
        <table className="tabla-fichas">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Proveedor</th>
              <th>Para qué sirve</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Nombre">
                <code>_ga</code>
              </td>
              <td data-label="Proveedor">Google</td>
              <td data-label="Para qué sirve">Distingue a un visitante de otro de forma anónima.</td>
              <td data-label="Duración">2 años</td>
            </tr>
            <tr>
              <td data-label="Nombre">
                <code>_ga_DE1J3QFREE</code>
              </td>
              <td data-label="Proveedor">Google</td>
              <td data-label="Para qué sirve">Mantiene el estado de la visita en curso.</td>
              <td data-label="Duración">2 años</td>
            </tr>
          </tbody>
        </table>
        <p>
          La duración es la que fija Google por defecto. Algunos navegadores
          la acortan por su cuenta; Safari, por ejemplo, borra estas cookies
          a los 7 días si no vuelves al sitio.
        </p>
        <p>
          No usamos cookies de publicidad ni de redes sociales. Los enlaces a
          WhatsApp no crean cookies mientras estás en nuestro sitio; solo se
          aplican las de WhatsApp si decides abrirlo.
        </p>
      </>
    ),
  },
  {
    id: "consentimiento",
    titulo: "Cómo das o retiras tu consentimiento",
    contenido: (
      <>
        <p>
          La primera vez que entras te mostramos un aviso para que aceptes o
          rechaces la analítica. Rechazar no cambia nada en el sitio: todo
          funciona igual, solo que no medimos tu visita.
        </p>
        <p>
          Puedes cambiar de opinión cuando quieras. Si antes aceptaste y
          ahora rechazas, borramos las cookies de Google Analytics de tu
          navegador.
        </p>
        <BotonConfigurarCookies />
      </>
    ),
  },
  {
    id: "navegador",
    titulo: "Cómo borrarlas desde tu navegador",
    contenido: (
      <>
        <p>
          También puedes ver y eliminar las cookies desde la configuración de
          tu navegador:
        </p>
        <ul>
          <li>
            <a href="https://support.google.com/chrome/answer/95647?hl=es" target="_blank" rel="noopener noreferrer">
              Google Chrome
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noopener noreferrer">
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
              Safari
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
              Microsoft Edge
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "mas",
    titulo: "Más información",
    contenido: (
      <p>
        El tratamiento de los datos que se obtienen con estas cookies sigue
        nuestra <Link href="/politica-de-privacidad">política de privacidad</Link>.
      </p>
    ),
  },
];

export default function PoliticaCookiesPage() {
  return (
    <DocumentoLegal
      etiqueta="Legal"
      titulo="Política de cookies"
      intro={
        <p>
          Este sitio usa muy pocas cookies, y las de analítica solo se
          activan si tú las aceptas. Aquí está el detalle de cada una.
        </p>
      }
      secciones={secciones}
    />
  );
}
