import { CircleCheck, Clock, TriangleAlert } from "lucide-react";
import type { EstadoPago } from "@/lib/portal/datos-demo";

/** Etiqueta de estado con ícono y texto: el color nunca es la única
 * señal. Mismo vocabulario en todo el portal: Pagado, Pendiente, Vencido. */
const ESTILOS: Record<EstadoPago, { texto: string; clase: string; Icono: typeof Clock }> = {
  pagado: { texto: "Pagado", clase: "bg-[var(--forst-tint)] text-[var(--forst-green)]", Icono: CircleCheck },
  pendiente: { texto: "Pendiente", clase: "bg-[#f3e4d8] text-[#6b4126]", Icono: Clock },
  vencido: { texto: "Vencido", clase: "bg-[#fde7e4] text-[#b42318]", Icono: TriangleAlert },
};

export default function EtiquetaEstado({ estado }: { estado: EstadoPago }) {
  const { texto, clase, Icono } = ESTILOS[estado];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${clase}`}>
      <Icono className="h-3.5 w-3.5" aria-hidden />
      {texto}
    </span>
  );
}
