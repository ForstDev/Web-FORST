import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Utilidad SOLO de desarrollo: recibe una imagen en base64 desde el
 * navegador y la guarda en disco. Dos destinos permitidos:
 *  - dir "snaps" (default): .snaps/ para inspección visual
 *  - dir "img": public/assets/img/ para assets optimizados vía canvas
 * No debe llegar a producción.
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const { name, data, ext = "png", dir = "snaps" } = await req.json();
  const safeName = String(name).replace(/[^a-z0-9-_]/gi, "");
  const safeExt = ["png", "webp", "jpg"].includes(ext) ? ext : "png";
  const base =
    dir === "img"
      ? path.join(process.cwd(), "public", "assets", "img")
      : path.join(process.cwd(), ".snaps");
  await mkdir(base, { recursive: true });
  const file = path.join(base, `${safeName}.${safeExt}`);
  await writeFile(file, Buffer.from(data, "base64"));
  return NextResponse.json({ ok: true, file });
}
