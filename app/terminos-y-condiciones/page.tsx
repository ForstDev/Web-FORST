import type { Metadata } from "next";
import Link from "next/link";
import DocumentoLegal, { type SeccionLegal } from "@/components/legal/DocumentoLegal";
import { empresa } from "@/data/empresa";

export const metadata: Metadata = {
  title: "Términos y condiciones | FORST",
  description:
    "Condiciones de uso del sitio de FORST E.I.R.L.: información de servicios, contratación, propiedad intelectual, responsabilidad y ley aplicable.",
  alternates: { canonical: "/terminos-y-condiciones" },
};

const secciones: SeccionLegal[] = [
  {
    id: "titular",
    titulo: "Titular del sitio",
    contenido: (
      <p>
        Este sitio pertenece a <strong>{empresa.razonSocial}</strong>, con
        nombre comercial FORST, RUC {empresa.ruc} y domicilio en{" "}
        {empresa.domicilio}. Puedes escribirnos a{" "}
        <a href={`mailto:${empresa.correo}`}>{empresa.correo}</a> o por
        WhatsApp al {empresa.whatsapp}.
      </p>
    ),
  },
  {
    id: "aceptacion",
    titulo: "Aceptación de estos términos",
    contenido: (
      <p>
        Al navegar por este sitio aceptas estos términos. Si no estás de
        acuerdo con alguno, te pedimos no usar el sitio. Para los servicios
        que contrates con nosotros rige además lo que diga la propuesta o el
        contrato de cada proyecto.
      </p>
    ),
  },
  {
    id: "servicios",
    titulo: "Información sobre los servicios",
    contenido: (
      <>
        <p>
          El sitio describe los servicios de FORST: productos web, sistemas
          de gestión, automatización y datos, aplicaciones móviles y
          posicionamiento. Esa información es referencial y sirve para que
          conozcas lo que hacemos.
        </p>
        <p>
          En este sitio no se compra ni se paga nada. Cada proyecto se cotiza
          por escrito después de entender tu caso. El alcance, el precio, los
          plazos, la forma de pago y el soporte posterior quedan definidos en
          la propuesta o el contrato, y lo que digan esos documentos prevalece
          sobre lo publicado aquí.
        </p>
      </>
    ),
  },
  {
    id: "contratacion",
    titulo: "Cómo se contrata un servicio",
    contenido: (
      <ul>
        <li>Nos cuentas tu caso por WhatsApp, correo o el formulario de contacto.</li>
        <li>Te enviamos una propuesta con alcance, precio y calendario.</li>
        <li>
          El servicio queda contratado cuando aceptas la propuesta o firmas el
          contrato, en la forma que ese documento indique.
        </li>
        <li>
          Los comprobantes de pago se emiten a nombre de {empresa.razonSocial}{" "}
          con el RUC {empresa.ruc}.
        </li>
      </ul>
    ),
  },
  {
    id: "uso",
    titulo: "Uso correcto del sitio",
    contenido: (
      <>
        <p>Al usar el sitio te comprometes a no:</p>
        <ul>
          <li>Usarlo para fines ilegales o que afecten a terceros.</li>
          <li>
            Intentar acceder a zonas, cuentas o datos para los que no tienes
            autorización.
          </li>
          <li>
            Enviar programas maliciosos o hacer pedidos automáticos que
            sobrecarguen el sitio.
          </li>
          <li>Copiar el sitio o partes de él para hacerlas pasar como propias.</li>
        </ul>
      </>
    ),
  },
  {
    id: "propiedad",
    titulo: "Propiedad intelectual",
    contenido: (
      <>
        <p>
          La marca FORST, el logo, el isotipo, los textos, el diseño, las
          imágenes propias y el código de este sitio pertenecen a{" "}
          {empresa.razonSocial}. No puedes usarlos sin nuestra autorización
          por escrito.
        </p>
        <p>
          Las marcas y los sitios de nuestros clientes que aparecen en la
          sección de casos pertenecen a sus respectivos titulares. Los
          mostramos como referencia del trabajo realizado.
        </p>
      </>
    ),
  },
  {
    id: "enlaces",
    titulo: "Enlaces a otros sitios",
    contenido: (
      <p>
        El sitio tiene enlaces a servicios de terceros, como WhatsApp, y a los
        sitios de nuestros clientes. No controlamos su contenido ni sus
        políticas, así que te recomendamos revisarlas cuando entres a ellos.
      </p>
    ),
  },
  {
    id: "responsabilidad",
    titulo: "Responsabilidad",
    contenido: (
      <p>
        Cuidamos que la información del sitio sea correcta y que el sitio esté
        disponible, pero puede haber interrupciones por mantenimiento o por
        causas ajenas a nosotros, como fallas de los proveedores de
        alojamiento. FORST no responde por daños derivados de esas
        interrupciones ni del uso indebido del sitio por parte de terceros.
        Esto no limita los derechos que te reconoce el Código de Protección y
        Defensa del Consumidor.
      </p>
    ),
  },
  {
    id: "datos",
    titulo: "Datos personales y cookies",
    contenido: (
      <p>
        El uso de tus datos se rige por nuestra{" "}
        <Link href="/politica-de-privacidad">política de privacidad</Link> y
        el de las cookies por nuestra{" "}
        <Link href="/politica-de-cookies">política de cookies</Link>.
      </p>
    ),
  },
  {
    id: "reclamos",
    titulo: "Reclamos y quejas",
    contenido: (
      <p>
        Si no estás conforme con un servicio o con la atención recibida, puedes
        registrar un reclamo o una queja en nuestro{" "}
        <Link href="/libro-de-reclamaciones">libro de reclamaciones</Link>.
        Te responderemos por escrito en un plazo máximo de 15 días hábiles.
      </p>
    ),
  },
  {
    id: "cambios",
    titulo: "Cambios en estos términos",
    contenido: (
      <p>
        Podemos actualizar estos términos. La versión vigente es siempre la
        publicada en esta página, con su fecha de actualización.
      </p>
    ),
  },
  {
    id: "ley",
    titulo: "Ley aplicable y jurisdicción",
    contenido: (
      <p>
        Estos términos se rigen por las leyes de la República del Perú.
        Cualquier controversia se someterá a los jueces y tribunales de Lima,
        sin perjuicio de tu derecho a acudir al INDECOPI como consumidor.
      </p>
    ),
  },
];

export default function TerminosPage() {
  return (
    <DocumentoLegal
      etiqueta="Legal"
      titulo="Términos y condiciones"
      intro={
        <p>
          Estas son las reglas para usar este sitio y la forma en que
          trabajamos cuando contratas un servicio con FORST.
        </p>
      }
      secciones={secciones}
    />
  );
}
