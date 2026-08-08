"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { portafolio, Caso } from "@/data/portafolio";
import PaginaMockup from "@/components/portafolio/PaginaMockup";
import EtiquetaVertical from "@/components/ui/EtiquetaVertical";
import Star from "@/components/ui/Star";
import Resaltado from "@/components/ui/Resaltado";
import { fadeUp, EASE } from "@/lib/motion-variants";

/**
 * Casos en la home: dos bloques grandes alternados, cada uno mostrando la
 * página real del cliente funcionando en su marco de navegador.
 *
 * Antes esto vivía en filas delgadas y el preview real —el mejor
 * argumento que hay, con video incluido— quedaba escondido detrás de un
 * hover. Nadie descubre una prueba que hay que buscar: ahora se ve de
 * entrada y el video corre solo mientras el bloque está en pantalla.
 *
 * La placa del logo conserva el color de cada cliente, no el verde de
 * FORST: cada marca mantiene su identidad, que es justamente lo que se
 * les vende ("nada de plantillas").
 */

function BloqueCaso({ caso, index }: { caso: Caso; index: number }) {
  const invertido = index % 2 === 1;

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center"
    >
      {/* La página real, funcionando */}
      <div
        className={`lg:col-span-7 ${invertido ? "lg:order-2" : "lg:order-1"}`}
      >
        <Link href={`/portafolio/${caso.slug}`} className="group block">
          {/* Sin `claro`: esa variante pinta el chrome en blanco y existe
              para cuando el marco vive sobre un fondo oscuro. Acá el marco
              se apoya en el hueso de la sección, así que el blanco daba
              contraste 1.00 — el host quedaba literalmente invisible. */}
          <PaginaMockup
            caso={caso}
            className="w-full aspect-[16/10] transition-transform duration-500 group-hover:-translate-y-1.5"
            mediaClassName="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* La lectura del caso */}
      <div
        className={`lg:col-span-5 ${invertido ? "lg:order-1" : "lg:order-2"}`}
      >
        <div className="flex items-center gap-5">
          <span
            aria-hidden
            className="font-display font-medium text-[clamp(3rem,5vw,4.5rem)] leading-none text-stroke-green"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Placa con el logo real, en el color del propio cliente */}
          <span
            className="flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-xl shrink-0 p-5"
            style={{ background: caso.fondo }}
          >
            <img
              src={caso.logo}
              alt={caso.logoAlt}
              className="max-w-full max-h-full object-contain"
            />
          </span>
        </div>

        <p className="t-eyebrow mt-7 text-[var(--forst-green)]">
          {caso.sector}
        </p>
        <h3 className="t-h2 mt-3 text-[var(--forst-green)]">{caso.titulo}</h3>
        <p className="t-lead mt-4 measure text-black/65">{caso.resumen}</p>

        <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
          {caso.entregamos.slice(0, 3).map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 text-[13px] text-black/60"
            >
              <Star className="w-2.5 h-2.5 shrink-0" color="var(--forst-green)" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={`/portafolio/${caso.slug}`}
          className="group inline-flex items-center gap-3 mt-8 text-sm font-medium text-[var(--forst-green)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current group-hover:translate-x-1 transition-transform" />
          <span className="relative">
            Ver el caso completo
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-full bg-current origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            />
          </span>
        </Link>
      </div>
    </motion.article>
  );
}

export default function CasosDestacados() {
  return (
    <section className="relative seccion max-w-[104rem] mx-auto px-6 md:px-10 flex gap-8 lg:gap-14">
      <EtiquetaVertical className="pt-2">Casos</EtiquetaVertical>
      <div className="min-w-0 flex-1">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 md:mb-24">
        <div className="lg:max-w-[38ch]">
          <h2>
            <span className="block t-air text-[var(--forst-green)]">
              Trabajo real
            </span>
            <span className="block t-air-caps t-air-caps-lg mt-4 text-black/70">
              clientes reales
            </span>
          </h2>
        </div>
        <p className="t-lead measure-tight text-black/70 lg:pb-2">
          Dos marcas de rubros distintos, transformadas con la misma
          metodología. Estas son sus páginas,{" "}
          <Resaltado>funcionando ahora mismo.</Resaltado>
        </p>
      </div>

      <div className="flex flex-col gap-20 md:gap-28">
        {portafolio.map((caso, i) => (
          <BloqueCaso key={caso.slug} caso={caso} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-16 md:mt-20 pt-8 border-t border-[var(--forst-line)]"
      >
        <Link
          href="/portafolio"
          className="group inline-flex items-center gap-3 text-sm font-medium text-[var(--forst-green)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current group-hover:translate-x-1 transition-transform" />
          Todo el portafolio
        </Link>
      </motion.div>
      </div>
    </section>
  );
}
