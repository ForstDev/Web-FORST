import { ReactNode } from "react";

/**
 * Antes inclinaba el elemento hacia el cursor con un spring; se quitó el
 * efecto porque en botones y tarjetas se sentía inestable en vez de
 * premium. Se deja el componente (en vez de tocar cada sitio que lo usa)
 * como un simple wrapper de layout.
 */
export default function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  return <div className={`inline-block ${className}`}>{children}</div>;
}
