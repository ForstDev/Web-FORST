"use client";

import { motion } from "motion/react";
import WordReveal from "@/components/animations/WordReveal";
import RevealImage from "@/components/animations/RevealImage";
import IsotipoWatermark from "@/components/animations/IsotipoWatermark";
import Resaltado from "@/components/ui/Resaltado";
import MetodologiaPersianas from "@/components/nosotros/MetodologiaPersianas";
import { fadeUp, staggerChildren, EASE } from "@/lib/motion-variants";

const VALORES = [
  { nombre: "Innovación", texto: "Soluciones preparadas para nuevos mercados." },
  { nombre: "Evolución", texto: "Crecimiento constante y capacidad de adaptación." },
  { nombre: "Confianza", texto: "Relaciones claras, profesionales y responsables." },
  { nombre: "Propósito", texto: "Proyectos con sentido, dirección y valor." },
];

export default function NosotrosContenido() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-[104rem] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-16 md:pb-24">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.07em] uppercase text-black/50 mb-7"
        >
          <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
          Nosotros
        </motion.p>

        <h1 className="font-display font-medium uppercase text-[clamp(2rem,5vw,4.2rem)] leading-[1.08] text-black max-w-4xl text-pretty">
          <span className="uppercase">
            <WordReveal text="Plataforma empresarial" />
          </span>
          <br />
          <span className="text-[var(--forst-green)]">
            <WordReveal text="que se queda." />
          </span>
        </h1>

        <div className="mt-10 grid md:grid-cols-12 gap-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
            className="md:col-span-7 flex flex-col gap-5 text-[15px] md:text-base text-black/70 leading-relaxed"
          >
            <p>
              FORST es el punto de partida de una plataforma empresarial que
              desarrolla negocios, marcas y soluciones digitales con
              estructura y visión de futuro. Trabajamos con empresas que ya
              operan pero necesitan ordenar procesos, y con negocios que
              recién arrancan su transformación digital.
            </p>
            <p>
              Antes de construir una solución, analizamos el mercado y el
              rubro de cada cliente. Y seguimos ahí{" "}
              <Resaltado>después</Resaltado> del lanzamiento, midiendo
              resultados y ajustando lo que haga falta, con el mismo equipo
              que construyó el proyecto.
            </p>

            {/* Los dos perfiles de cliente que ya nombra el primer
                párrafo, reformulados en formato tarjeta — la columna de
                texto quedaba mucho más corta que la foto y el resto se
                veía vacío; esto no es relleno decorativo, es la misma
                idea del negocio con más espacio para respirar. */}
            <div className="mt-4 grid sm:grid-cols-2 gap-6 pt-6 border-t border-[var(--forst-line)]">
              <div>
                <span className="flex items-center gap-2 text-[11px] tracking-[0.07em] uppercase text-black/50 mb-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[var(--forst-green)] inline-block" />
                  Empresas en marcha
                </span>
                <p className="text-sm leading-relaxed">
                  Ya operan, pero necesitan ordenar procesos y ganar
                  estructura.
                </p>
              </div>
              <div>
                <span className="flex items-center gap-2 text-[11px] tracking-[0.07em] uppercase text-black/50 mb-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[var(--forst-tan)] inline-block" />
                  Negocios que arrancan
                </span>
                <p className="text-sm leading-relaxed">
                  Recién empiezan su transformación digital, desde cero.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.7, ease: EASE }}
            className="md:col-span-5"
          >
            <RevealImage
              src="https://ijmygnxkuutgbcdgkjqj.supabase.co/storage/v1/object/public/forst-assets/img/nosotros-estudio.webp"
              alt="Laptop con un dashboard de crecimiento sobre un escritorio de madera, luz natural de día"
              priority
              className="w-full max-w-[460px] aspect-[4/3] mx-auto md:ml-auto md:mr-0 ring-1 ring-[var(--forst-line)]"
            />
          </motion.div>
        </div>
      </section>

      {/* Misión y visión: un solo bloque partido en dos, como el isotipo
          (pétalo + cojín) — mismo peso visual para los dos colores de
          marca, no uno dominando al otro. */}
      <section className="border-t border-[var(--forst-line)]">
        <div className="max-w-[104rem] mx-auto px-6 md:px-10 pt-14 md:pt-20">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.07em] uppercase text-black/50 mb-7"
          >
            <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
            Lo que nos mueve
          </motion.p>
        </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative w-full overflow-hidden grid md:grid-cols-2 mt-8 md:mt-10"
          >
            {/* Canela como fondo de una tarjeta (no de una sección
                completa) sí está dentro de lo que la marca permite —
                confirmado. Vuelve el canela acá; el texto vuelve a
                verde/negro porque sobre este tono claro es lo que se
                lee bien, no el blanco. */}
            <motion.div
              whileHover="hover"
              initial="rest"
              transition={{ duration: 0.3, ease: EASE }}
              className="group relative flex flex-col p-8 md:pt-14 md:pl-14 md:pb-14 md:pr-40 lg:pr-52 overflow-hidden"
              style={{ background: "var(--forst-tan)" }}
            >
              <motion.div
                variants={{ rest: { y: 0 }, hover: { y: -4 } }}
                transition={{ duration: 0.3, ease: EASE }}
                className="relative"
              >
                <span className="font-display font-medium text-3xl md:text-5xl text-black uppercase">
                  <WordReveal text="Misión" inView />
                </span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                className="relative mt-8 font-display text-xl md:text-2xl text-black leading-snug max-w-md"
              >
                Crear, desarrollar e impulsar negocios a través de
                soluciones tecnológicas, comerciales y estratégicas que
                aporten estructura, eficiencia y visión de crecimiento.
              </motion.p>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
                className="relative mt-6 h-px w-10 bg-black/25 origin-left"
              />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
                className="relative mt-6 text-[13px] md:text-sm text-black/60 leading-relaxed max-w-sm"
              >
                En FORST construimos proyectos con propósito, diseñados
                para responder a las necesidades actuales del mercado y
                preparados para evolucionar hacia nuevas oportunidades de
                negocio.
              </motion.p>
            </motion.div>

            <motion.div
              whileHover="hover"
              initial="rest"
              transition={{ duration: 0.3, ease: EASE }}
              className="group relative flex flex-col p-8 md:pt-14 md:pr-14 md:pb-14 md:pl-40 lg:pl-52 md:items-end text-white overflow-hidden"
              style={{ background: "var(--forst-green)" }}
            >
              <motion.div
                variants={{ rest: { y: 0 }, hover: { y: -4 } }}
                transition={{ duration: 0.3, ease: EASE }}
                className="relative md:text-right"
              >
                <span className="font-display font-medium text-3xl md:text-5xl text-white uppercase">
                  <WordReveal text="Visión" inView />
                </span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                className="relative mt-8 font-display text-xl md:text-2xl leading-snug md:text-right max-w-sm"
              >
                Convertirnos en una plataforma empresarial referente en el
                desarrollo de marcas, soluciones digitales y modelos de
                negocio innovadores.
              </motion.p>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
                className="relative mt-6 h-px w-10 bg-white/25 origin-left md:origin-right"
              />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
                className="relative mt-6 text-[13px] md:text-sm text-white/60 leading-relaxed max-w-sm md:text-right"
              >
                FORST busca construir un ecosistema sólido, moderno y
                confiable, capaz de crear, gestionar e impulsar empresas en
                distintos sectores, generando valor, crecimiento y visión
                de futuro.
              </motion.p>
            </motion.div>

            {/* Un solo isotipo, centrado sobre la costura entre Misión y
                Visión, en el blanco hueso de la paleta — antes eran dos
                copias recortadas a la mitad cada una para que cada lado
                tuviera contraste, pero al girar las líneas cruzaban el
                borde del recorte y desaparecían un instante ahí. Una sola
                instancia, sin ningún corte, no tiene ese borde para
                romperse. */}
            <div
              aria-hidden
              className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 lg:w-96 lg:h-96 pointer-events-none z-10"
            >
              <IsotipoWatermark color="var(--forst-white)" strokeWidth={1.4} direction={1} duration={70} className="w-full h-full opacity-[0.55]" />
            </div>
          </motion.div>

        <div className="max-w-[104rem] mx-auto px-6 md:px-10 pb-14 md:pb-20">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-12 md:mt-16 border-t border-[var(--forst-line)]"
          >
            {VALORES.map((v, i) => (
              <motion.div
                key={v.nombre}
                variants={fadeUp}
                className="group grid md:grid-cols-12 items-center gap-2 md:gap-8 py-6 md:py-8 px-2 -mx-2 md:px-4 md:-mx-4 border-b border-[var(--forst-line)] hover:bg-[var(--forst-tint)] transition-colors"
              >
                <span className="md:col-span-1 font-display text-sm text-black/65 group-hover:text-[var(--forst-green)] transition-colors">
                  0{i + 1}
                </span>
                <span className="md:col-span-4 font-display font-medium text-3xl md:text-5xl text-black group-hover:text-[var(--forst-green)] transition-colors">
                  {v.nombre}
                </span>
                <p className="md:col-span-7 text-black/65 text-sm md:text-base leading-relaxed">
                  {v.texto}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Metodología: las letras del nombre */}
      <section className="border-t border-[var(--forst-line)]">
        <div className="max-w-[104rem] mx-auto px-6 md:px-10 py-14 md:py-20">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="flex items-center gap-3 text-[11px] md:text-xs tracking-[0.07em] uppercase text-black/50 mb-4"
          >
            <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
            Cómo trabajamos
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="font-display font-medium text-3xl md:text-5xl text-black leading-tight max-w-3xl text-pretty"
          >
            LA METODOLOGÍA{" "}
            <span className="text-[var(--forst-green)]">FORST.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.15 }}
            className="mt-5 max-w-xl text-black/60 text-[15px] leading-relaxed"
          >
            Cinco fases, siempre en el mismo orden, una por cada letra de
            nuestro nombre.{" "}
            <Resaltado>No la inventamos para sonar bien.</Resaltado> Es cómo
            evitamos que un proyecto se quede a medio camino. Pasa el cursor
            sobre cada fase para verla completa.
          </motion.p>

          <div className="mt-10">
            <MetodologiaPersianas />
          </div>
        </div>
      </section>

      {/* Post-venta a fondo */}
      <section className="bg-[var(--forst-green)] text-white border-t border-[var(--forst-green-soft)]">
        <div className="max-w-[104rem] mx-auto px-6 md:px-10 pt-14 pb-20 md:pt-20 md:pb-20">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="font-display font-medium text-3xl md:text-5xl leading-tight max-w-3xl text-pretty"
          >
            El post-venta no es un extra.
            <br />
            <span className="text-white/55">Es la mitad del servicio.</span>
          </motion.h2>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-10 grid md:grid-cols-3 gap-10 md:gap-8"
          >
            {[
              {
                titulo: "Ajustes con datos",
                texto:
                  "Lo que se entrega se observa. Si algo no está convirtiendo o no se usa, se corrige, con datos reales, no supuestos.",
              },
              {
                titulo: "Seguimiento de marca",
                texto:
                  "Tu presencia digital no se congela el día del lanzamiento. Crece contigo, campaña a campaña, colección a colección.",
              },
              {
                titulo: "Respuesta directa",
                texto:
                  "Sin mesa de ayuda ni tickets. Escribes por WhatsApp y te responde la misma gente que construyó tu proyecto.",
              },
            ].map((b, i) => (
              <motion.div key={b.titulo} variants={fadeUp}>
                <p className="flex items-center gap-2.5 text-[11px] tracking-[0.07em] uppercase text-white font-semibold mb-4">
                  <span className="font-display text-white">0{i + 1}</span>
                  {b.titulo}
                </p>
                <p className="text-sm text-white/70 leading-relaxed border-t border-white/15 pt-4">
                  {b.texto}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
