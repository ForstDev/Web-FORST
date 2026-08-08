"""
Agranda la marca dentro de icon.png / apple-icon.png: el logo blanco
tenía mucho aire alrededor (~60% del lienzo), y a los tamaños chicos de
una pestaña de navegador eso lo hace ver diminuto. Recorta al bounding
box real del isotipo y lo vuelve a centrar ocupando más del lienzo.
"""
from PIL import Image

BG = (0, 46, 44)  # forst-green

def agrandar(path, margen_pct=0.06):
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    px = img.load()

    # bounding box de los pixeles que NO son el fondo verde
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 10 and (abs(r - BG[0]) + abs(g - BG[1]) + abs(b - BG[2]) > 30):
                minx, miny = min(minx, x), min(miny, y)
                maxx, maxy = max(maxx, x), max(maxy, y)

    logo = img.crop((minx, miny, maxx + 1, maxy + 1))
    lw, lh = logo.size

    margen = int(w * margen_pct)
    target = min(w, h) - 2 * margen
    scale = target / max(lw, lh)
    new_w, new_h = round(lw * scale), round(lh * scale)
    logo_resized = logo.resize((new_w, new_h), Image.LANCZOS)

    out = Image.new("RGBA", (w, h), (*BG, 255))
    out.paste(logo_resized, ((w - new_w) // 2, (h - new_h) // 2), logo_resized)
    out.save(path)
    print(f"{path}: bbox original {lw}x{lh} de {w}x{h} ({100*max(lw,lh)/w:.0f}%) "
          f"-> {new_w}x{new_h} ({100*max(new_w,new_h)/w:.0f}%)")

agrandar(r"C:\Users\Alvaro\Documents\forst_pw1\forst-web\app\icon.png")
agrandar(r"C:\Users\Alvaro\Documents\forst_pw1\forst-web\app\apple-icon.png")
