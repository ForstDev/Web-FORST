"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { metodologia, Fase } from "@/data/metodologia";
import { EASE } from "@/lib/motion-variants";

/**
 * Las 5 fases como persianas verticales rectas — nada de corte diagonal,
 * la identidad de FORST no usa esa geometría en ningún otro lugar. Cada
 * franja es un rectángulo puro, separadas por una línea fina. En reposo
 * solo se ve la letra. Al pasar el cursor aparece un adelanto breve
 * (nombre + primera idea), y el detalle se abre EN LÍNEA justo debajo de
 * la franja, nunca a pantalla completa — todo con el mouse, sin clic. Al
 * salir de toda la fila se cierra; moverse entre fases vecinas solo
 * cambia cuál está activa.
 */

function Panel({
  fase,
  index,
  activa,
  onToggle,
}: {
  fase: Fase;
  index: number;
  activa: string | null;
  onToggle: (letra: string) => void;
}) {
  const oscuro = index % 2 === 1;
  const on = activa === fase.letra;
  return (
    <button
      onMouseEnter={() => onToggle(fase.letra)}
      onFocus={() => onToggle(fase.letra)}
      className="group relative flex-1 h-full cursor-pointer text-left overflow-hidden"
      style={{
        // El activo pasaba a fondo canela — una superficie grande, justo
        // lo que el manual de marca prohíbe para ese color. Plomo la
        // reemplaza como el tercer tono (con Verde y casi-negro en
        // reposo), y el canela se guarda para la franja superior, que
        // es un gráfico, no un fondo.
        background: on ? "var(--forst-black)" : oscuro ? "#001f1d" : "var(--forst-green)",
        transition: "background 0.35s ease",
      }}
    >
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: on ? "var(--forst-tan)" : "rgba(255,255,255,0.15)",
        }}
      />
      <span
        aria-hidden
        className={`absolute top-0 bottom-0 right-0 w-px ${
          index < metodologia.length - 1 ? "bg-white/10" : ""
        }`}
      />

      {/* Reposo: solo la letra */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 px-8 ${
          on ? "opacity-0" : "opacity-100 group-hover:opacity-0"
        }`}
      >
        <span className="font-display font-bold text-[clamp(2.5rem,5vw,4rem)] leading-none text-white/85">
          {fase.letra}
        </span>
      </div>

      {/* Hover: adelanto breve */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center gap-3 transition-opacity duration-300 delay-75 px-2 sm:px-9 ${
          on ? "opacity-0" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <span className="font-display text-base sm:text-lg md:text-xl text-white min-w-0 max-w-full break-words">
          {fase.nombre}
        </span>
        <span className="hidden sm:block text-[12px] text-white/60 leading-relaxed line-clamp-3">
          {fase.texto.split(".")[0]}.
        </span>
        <span className="mt-1 text-[10px] tracking-[0.08em] uppercase text-white/50 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-white/60" />
          Ver fase
        </span>
      </div>

      {/* Activa: letra + nombre, marcados sobre el plomo */}
      {on && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2 sm:px-8">
          <span className="font-display font-bold text-[clamp(2.5rem,5vw,4rem)] leading-none text-white">
            {fase.letra}
          </span>
          <span className="text-[10px] tracking-[0.08em] uppercase text-white/65 min-w-0 max-w-full text-center break-words">
            {fase.nombre}
          </span>
        </div>
      )}
    </button>
  );
}

export default function MetodologiaPersianas() {
  const [activaLetra, setActivaLetra] = useState<string | null>(null);
  const activa = metodologia.find((f) => f.letra === activaLetra) ?? null;
  const activaIndex = activa ? metodologia.findIndex((f) => f.letra === activa.letra) : -1;

  return (
    <div>
      {/* Con el mouse encima alcanza para ver el adelanto y el detalle
          — no hace falta clickear. Al salir de toda la fila se cierra;
          moverse entre fases vecinas solo cambia cuál está activa, sin
          parpadeo. Alto por aspect-ratio en vez de un px fijo: así no
          se desproporciona si el ancho del contenedor cambia (como
          pasó al unificar los márgenes del sitio a 104rem). */}
      <div
        onMouseLeave={() => setActivaLetra(null)}
        className="flex h-[300px] md:h-auto md:aspect-[14/5] gap-px rounded-xl overflow-hidden"
      >
        {metodologia.map((fase, i) => (
          <Panel
            key={fase.letra}
            fase={fase}
            index={i}
            activa={activaLetra}
            onToggle={setActivaLetra}
          />
        ))}
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: activa ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            {activa && (
              <motion.div
                key={activa.letra}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mt-8 pt-8 border-t border-[var(--forst-line)]"
              >
                <p className="flex items-center gap-2.5 text-[11px] tracking-[0.07em] uppercase text-black/40 mb-4">
                  <span className="w-2 h-2 rotate-45 bg-[var(--forst-green)] inline-block" />
                  Fase {activaIndex + 1} de {metodologia.length}
                </p>
                <h3 className="font-display font-medium uppercase text-2xl md:text-4xl leading-[1.05] text-black">
                  <span className="text-[var(--forst-green)]">{activa.letra}</span>
                  {activa.nombre.slice(1)}
                </h3>
                <p className="mt-5 max-w-xl text-black/70 text-[15px] md:text-lg leading-relaxed">
                  {activa.texto}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
