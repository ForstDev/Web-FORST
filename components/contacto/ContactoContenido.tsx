"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import WordReveal from "@/components/animations/WordReveal";
import DiamondField from "@/components/animations/DiamondField";
import Resaltado from "@/components/ui/Resaltado";
import { fadeUp, EASE } from "@/lib/motion-variants";

const SERVICIOS_OPCIONES = [
  "Presencia: mi primera web",
  "Operación: ordenar lo que ya vendo",
  "Estructura: rediseñar toda la operación",
  "El Diagnóstico FORST",
  "Aún no lo tengo claro",
];

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "¿Cuál plan me conviene?",
    a: "Depende de dónde está tu negocio hoy. Si todavía no tienes presencia digital, empiezas por Presencia. Si ya vendes pero operas a mano, es Operación. Si ya operas y quieres escalar toda la empresa, es Estructura. Si no estás seguro, el Diagnóstico FORST existe justo para eso: lo resolvemos juntos antes de cotizar cualquier plan.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Depende del alcance de cada plan, y cotizamos por proyecto después de entender tu caso, sin costos ocultos ni sorpresas. Lo único fijo es la propuesta, que te llega con precio y calendario claros antes de empezar.",
  },
  {
    q: "¿En cuánto tiempo está listo?",
    a: "El plan Presencia se mide en semanas, no meses. Operación y Estructura dependen del alcance, y te damos un calendario por fases (nuestra metodología tiene 5) para que sepas qué recibes y cuándo.",
  },
  {
    q: "¿Qué pasa después de la entrega?",
    a: (
      <>
        Ahí empieza la parte que nos diferencia. Ajustes con datos reales,
        seguimiento de marca y respuesta directa por WhatsApp. La entrega no
        es el final del servicio, <Resaltado>es la semana cero.</Resaltado>
      </>
    ),
  },
];

function FaqItem({ faq, i }: { faq: (typeof FAQS)[number]; i: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
      className="border-b border-[var(--forst-line)]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="font-display text-[15px] md:text-lg text-black group-hover:text-[var(--forst-green)] transition-colors">
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 135 : 45 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="shrink-0 w-2.5 h-2.5 border border-[var(--forst-green)] bg-transparent"
          style={{ backgroundColor: open ? "var(--forst-green)" : "transparent" }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm text-black/60 leading-relaxed max-w-2xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ContactoContenido() {
  const [form, setForm] = useState({
    nombre: "",
    negocio: "",
    servicio: SERVICIOS_OPCIONES[SERVICIOS_OPCIONES.length - 1],
    mensaje: "",
  });

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = [
      `Hola FORST, soy ${form.nombre.trim() || "—"}`,
      `Negocio: ${form.negocio.trim() || "—"}`,
      `Me interesa: ${form.servicio}`,
      form.mensaje.trim() ? `Mensaje: ${form.mensaje.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `https://wa.me/51962316856?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // 16px y no 15: por debajo de ese tamaño, Safari en iOS hace zoom solo
  // al enfocar un campo y deja la página descuadrada. El resto del sitio
  // no lo sufre porque solo pasa en campos de formulario.
  const inputCls =
    "w-full bg-transparent border-b border-[var(--forst-line)] py-3 text-[16px] text-black placeholder:text-black/35 focus:border-[var(--forst-green)] focus:outline-none transition-colors";

  return (
    <>
      <section className="max-w-[104rem] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-16 md:pb-20">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.07em] uppercase text-black/50 mb-7"
        >
          <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
          Contacto
        </motion.p>

        <h1 className="font-display font-medium uppercase text-[clamp(2rem,5vw,4.2rem)] leading-[1.08] text-black max-w-4xl text-pretty">
          <WordReveal text="Cuéntanos qué" />
          <span className="text-[var(--forst-green)]">
            <WordReveal text="necesitas." />
          </span>
        </h1>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Canal directo */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
            className="md:col-span-5"
          >
            <a
              href="https://wa.me/51962316856?text=Hola%20FORST%2C%20quiero%20conversar%20sobre%20mi%20negocio."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-xl bg-[var(--forst-green)] text-white p-8 md:p-10 overflow-hidden"
            >
              <DiamondField
                color="255,255,255"
                spacing={36}
                baseAlpha={0.1}
                maxAlpha={0.65}
                baseSize={2.4}
                influence={140}
              />
              <div className="relative z-10">
                <p className="text-[11px] tracking-[0.07em] uppercase text-white/65">
                  El camino corto
                </p>
                <p className="mt-4 font-display font-medium text-2xl md:text-3xl leading-snug break-words">
                  Escríbenos por WhatsApp
                </p>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  Sin formularios ni esperas. Nos cuentas tu caso y te
                  respondemos el mismo día.
                </p>
                <span className="mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:translate-x-1 transition-transform" />
                  Abrir conversación
                </span>
              </div>
            </a>

            <div className="mt-8 flex flex-col gap-1 text-sm text-black/60">
              {/* `py-1.5` para que el área tocable del correo llegue al
                  mínimo de 24px; con solo el alto de la línea quedaba en 20. */}
              <a
                href="mailto:forst.pe@outlook.com"
                className="py-1.5 hover:text-[var(--forst-green)] transition-colors w-fit"
              >
                forst.pe@outlook.com
              </a>
              <span className="py-1.5">Lima, Perú. Atendemos a todo el país.</span>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.form
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.85 }}
            onSubmit={enviar}
            className="md:col-span-7 flex flex-col gap-7"
          >
            <div className="grid md:grid-cols-2 gap-7">
              <label className="block">
                <span className="text-[11px] tracking-[0.07em] uppercase text-black/65">
                  Tu nombre
                </span>
                <input
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="¿Cómo te llamas?"
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="text-[11px] tracking-[0.07em] uppercase text-black/65">
                  Tu negocio
                </span>
                <input
                  required
                  value={form.negocio}
                  onChange={(e) => setForm({ ...form, negocio: e.target.value })}
                  placeholder="Nombre y rubro"
                  className={inputCls}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-[11px] tracking-[0.07em] uppercase text-black/65">
                Qué te interesa
              </span>
              <select
                value={form.servicio}
                onChange={(e) => setForm({ ...form, servicio: e.target.value })}
                className={`${inputCls} cursor-pointer`}
              >
                {SERVICIOS_OPCIONES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[11px] tracking-[0.07em] uppercase text-black/65">
                Cuéntanos tu caso
              </span>
              <textarea
                rows={4}
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                placeholder="Qué vendes, qué te está costando, qué quisieras lograr…"
                className={`${inputCls} resize-none`}
              />
            </label>

            <div>
              <button
                type="submit"
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--forst-green)] text-white px-8 py-4 text-sm uppercase tracking-wide hover:bg-[var(--forst-green-soft)] transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:translate-x-1 transition-transform" />
                Enviar por WhatsApp
              </button>
              <p className="mt-3 text-xs text-black/65">
                Tu mensaje se abre en WhatsApp listo para enviar. Nada se
                guarda en ningún servidor.
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[104rem] mx-auto px-6 md:px-10 pb-20 md:pb-24">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.07em] uppercase text-black/50 mb-4"
        >
          <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
          Preguntas honestas
        </motion.p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="font-display font-medium text-2xl md:text-4xl text-black mb-10"
        >
          Lo que todos preguntan{" "}
          <span className="text-[var(--forst-green)]">antes de escribir.</span>
        </motion.h2>
        <div className="border-t border-[var(--forst-line)]">
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} faq={f} i={i} />
          ))}
        </div>
      </section>
    </>
  );
}
