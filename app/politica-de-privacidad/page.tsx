import type { Metadata } from "next";
import Link from "next/link";
import DocumentoLegal, { type SeccionLegal } from "@/components/legal/DocumentoLegal";
import { empresa } from "@/data/empresa";

export const metadata: Metadata = {
  title: "Política de privacidad | FORST",
  description:
    "Cómo FORST E.I.R.L. trata tus datos personales conforme a la Ley 29733: qué datos, para qué, con quién se comparten y cómo ejercer tus derechos.",
  alternates: { canonical: "/politica-de-privacidad" },
};

const secciones: SeccionLegal[] = [
  {
    id: "responsable",
    titulo: "Quién trata tus datos",
    contenido: (
      <>
        <p>
          El responsable del tratamiento de tus datos personales es{" "}
          <strong>{empresa.razonSocial}</strong> (nombre comercial FORST), con
          RUC {empresa.ruc} y domicilio en {empresa.domicilio}.
        </p>
        <p>
          Para cualquier consulta sobre esta política o sobre tus datos,
          escríbenos a{" "}
          <a href={`mailto:${empresa.correo}`}>{empresa.correo}</a>.
        </p>
      </>
    ),
  },
  {
    id: "datos",
    titulo: "Qué datos recogemos y de dónde vienen",
    contenido: (
      <>
        <p>Solo recogemos los datos que necesitamos en cada situación:</p>
        <ul>
          <li>
            <strong>Cuando nos escribes.</strong> Si usas el formulario de
            contacto, el texto se arma en tu propio navegador y se abre en
            WhatsApp para que tú decidas si lo envías. Nuestro sitio no lo
            guarda. Los datos que nos mandes por WhatsApp o por correo
            (nombre, negocio, teléfono, correo y lo que nos cuentes) quedan en
            esas conversaciones.
          </li>
          <li>
            <strong>Cuando presentas un reclamo o una queja.</strong> El libro
            de reclamaciones pide tu nombre, documento de identidad,
            domicilio, teléfono, correo y el detalle del caso. Si eres menor
            de edad, también los datos de tu madre, padre o apoderado.
          </li>
          <li>
            <strong>Cuando navegas, solo si lo aceptas.</strong> Con tu
            permiso usamos Google Analytics para saber qué páginas se visitan,
            cuánto tiempo, desde qué tipo de dispositivo y navegador, y desde
            qué país o ciudad aproximada. El detalle está en nuestra{" "}
            <Link href="/politica-de-cookies">política de cookies</Link>.
          </li>
          <li>
            <strong>Cuando eres cliente.</strong> Los datos de contacto de
            quien representa a tu empresa, los datos de facturación (razón
            social, RUC y dirección) y el registro de pagos del proyecto.
          </li>
        </ul>
        <p>
          No pedimos datos sensibles, como información de salud, origen
          étnico, opiniones políticas o datos biométricos.
        </p>
      </>
    ),
  },
  {
    id: "finalidad",
    titulo: "Para qué los usamos",
    contenido: (
      <>
        <ul>
          <li>Responder tus consultas y preparar una propuesta o cotización.</li>
          <li>
            Ejecutar el servicio que contrataste: coordinar el proyecto,
            darte soporte después de la entrega y emitir comprobantes.
          </li>
          <li>
            Atender reclamos y quejas en el plazo que fija el Código de
            Protección y Defensa del Consumidor.
          </li>
          <li>
            Entender cómo se usa el sitio para mejorarlo, solo si aceptaste
            las cookies de analítica.
          </li>
          <li>Cumplir obligaciones tributarias y legales.</li>
        </ul>
        <p>
          No vendemos ni alquilamos tus datos. Tampoco los usamos para
          publicidad personalizada ni para decisiones automatizadas que te
          afecten.
        </p>
      </>
    ),
  },
  {
    id: "base",
    titulo: "Con qué base legal",
    contenido: (
      <>
        <p>
          Tratamos tus datos de acuerdo con la Ley 29733, Ley de Protección
          de Datos Personales, y su reglamento aprobado por el Decreto
          Supremo 016-2024-JUS. Según el caso, la base es una de estas:
        </p>
        <ul>
          <li>
            Tu consentimiento, cuando nos escribes o aceptas las cookies de
            analítica. Puedes retirarlo cuando quieras.
          </li>
          <li>
            La relación contractual, cuando contratas un servicio con
            nosotros.
          </li>
          <li>
            Una obligación legal, como la atención de reclamos o la
            conservación de comprobantes de pago.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "terceros",
    titulo: "Con quién los compartimos",
    contenido: (
      <>
        <p>
          Para que el sitio y nuestros servicios funcionen trabajamos con
          estos proveedores, que tratan datos por encargo nuestro y solo para
          lo que corresponde a cada uno:
        </p>
        <table>
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Para qué</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vercel Inc.</td>
              <td>Aloja el sitio web.</td>
            </tr>
            <tr>
              <td>Supabase Inc.</td>
              <td>Guarda archivos del sitio y los reclamos registrados.</td>
            </tr>
            <tr>
              <td>Google LLC</td>
              <td>Google Analytics, solo si aceptaste las cookies.</td>
            </tr>
            <tr>
              <td>Meta Platforms, Inc.</td>
              <td>WhatsApp, cuando nos escribes por ese medio.</td>
            </tr>
            <tr>
              <td>Microsoft Corporation</td>
              <td>Nuestro correo electrónico.</td>
            </tr>
          </tbody>
        </table>
        <p>
          También entregamos datos a autoridades, como la SUNAT o el
          INDECOPI, cuando una norma o una orden lo exige.
        </p>
      </>
    ),
  },
  {
    id: "transferencia",
    titulo: "Transferencia fuera del Perú",
    contenido: (
      <p>
        Los proveedores de la sección anterior guardan la información en
        servidores ubicados fuera del Perú, principalmente en Estados
        Unidos. Esto es un flujo transfronterizo de datos. Elegimos
        proveedores que aplican medidas de seguridad reconocidas y les
        entregamos solo lo necesario para cada tarea. Al usar estos canales
        o al aceptar las cookies de analítica, consientes esta transferencia.
      </p>
    ),
  },
  {
    id: "plazo",
    titulo: "Cuánto tiempo los guardamos",
    contenido: (
      <ul>
        <li>
          Consultas que no terminan en un contrato: hasta 12 meses desde el
          último contacto.
        </li>
        <li>
          Datos de clientes: mientras dure la relación y, después, el tiempo
          que exigen las normas tributarias y contables.
        </li>
        <li>
          Reclamos y quejas: al menos 2 años desde su registro, como manda el
          reglamento del libro de reclamaciones.
        </li>
        <li>
          Datos de analítica: el plazo configurado en Google Analytics, que
          no supera los 14 meses.
        </li>
      </ul>
    ),
  },
  {
    id: "derechos",
    titulo: "Tus derechos y cómo ejercerlos",
    contenido: (
      <>
        <p>Sobre tus datos personales puedes pedirnos:</p>
        <ul>
          <li>
            <strong>Acceso:</strong> saber qué datos tuyos tenemos y cómo los
            usamos.
          </li>
          <li>
            <strong>Rectificación:</strong> corregir datos inexactos o
            incompletos.
          </li>
          <li>
            <strong>Cancelación:</strong> que los eliminemos cuando ya no
            sean necesarios o retires tu consentimiento.
          </li>
          <li>
            <strong>Oposición:</strong> que dejemos de usarlos para una
            finalidad concreta.
          </li>
          <li>
            <strong>Portabilidad:</strong> recibirlos en un formato ordenado
            y de uso común.
          </li>
        </ul>
        <p>
          Escríbenos a{" "}
          <a href={`mailto:${empresa.correo}`}>{empresa.correo}</a> con el
          asunto &quot;Datos personales&quot;. Indica tu nombre, el derecho
          que quieres ejercer y adjunta una copia de tu documento de
          identidad para confirmar que eres tú. Respondemos dentro de los
          plazos que fija el reglamento de la Ley 29733.
        </p>
        <p>
          Si no estás conforme con nuestra respuesta, puedes acudir a la
          Autoridad Nacional de Protección de Datos Personales del Ministerio
          de Justicia y Derechos Humanos.
        </p>
      </>
    ),
  },
  {
    id: "seguridad",
    titulo: "Cómo protegemos tus datos",
    contenido: (
      <p>
        Todo el sitio funciona con conexión cifrada (HTTPS). El acceso a los
        datos de reclamos y de clientes está limitado al equipo de FORST, las
        claves de los servicios nunca se exponen en el navegador y aplicamos
        cabeceras de seguridad para reducir riesgos comunes en la web.
        Ningún sistema es infalible, pero si detectamos un incidente que
        afecte tus datos te lo comunicaremos.
      </p>
    ),
  },
  {
    id: "menores",
    titulo: "Menores de edad",
    contenido: (
      <p>
        Nuestros servicios están dirigidos a negocios y a personas mayores
        de edad. Si un menor presenta un reclamo, el libro de reclamaciones
        pide los datos de su madre, padre o apoderado.
      </p>
    ),
  },
  {
    id: "cambios",
    titulo: "Cambios en esta política",
    contenido: (
      <p>
        Si cambiamos esta política, publicaremos la nueva versión en esta
        misma página con su fecha de actualización. Si el cambio es
        importante y tenemos tu correo, también te avisaremos por ese medio.
      </p>
    ),
  },
];

export default function PoliticaPrivacidadPage() {
  return (
    <DocumentoLegal
      etiqueta="Legal"
      titulo="Política de privacidad"
      intro={
        <p>
          Aquí te explicamos qué datos personales tratamos, para qué y cómo
          puedes controlarlos. La escribimos para que se entienda a la
          primera lectura.
        </p>
      }
      secciones={secciones}
    />
  );
}
