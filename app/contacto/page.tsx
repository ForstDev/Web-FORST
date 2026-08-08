import type { Metadata } from "next";
import ContactoContenido from "@/components/contacto/ContactoContenido";

export const metadata: Metadata = {
  title: "Contacto — FORST",
  description:
    "Escríbenos por WhatsApp o formulario. Respuesta el mismo día, sin compromiso. Lima, Perú. Atendemos a todo el país.",
};

export default function ContactoPage() {
  return <ContactoContenido />;
}
