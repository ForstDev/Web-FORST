"""
Quita el fondo blanco de las imágenes de rocas del hero, con transparencia
real (alpha) — ver el historial: una máscara CSS o un flood-fill sin
descontaminar dejan un halo blanco fantasma al superponer sobre texto o
color. Flood-fill desde las esquinas + descontaminación de color en el
borde (alpha matting estándar, fondo blanco conocido) + blur leve del
canal alfa para que el borde quede suave.
"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

BG = np.array([249.0, 247.0, 241.0])  # el hueso/blanco real del fondo original


def quitar_fondo(src, dst, margen_pct=0.06):
    img = Image.open(src).convert("RGBA")
    arr = np.array(img).astype(np.float32)
    rgb = arr[:, :, :3]
    h, w = rgb.shape[:2]

    dist_white = np.sqrt(((rgb - BG) ** 2).sum(axis=2))

    candidate = dist_white < 60
    labeled, _ = ndimage.label(candidate)
    border_labels = set(labeled[0, :]) | set(labeled[-1, :]) | set(labeled[:, 0]) | set(labeled[:, -1])
    border_labels.discard(0)
    background_mask = np.isin(labeled, list(border_labels))

    alpha = np.where(background_mask, 0.0, 255.0)
    edge_band = (~background_mask) & (dist_white < 90)
    alpha[edge_band] = np.clip((dist_white[edge_band] - 60) / 30.0, 0, 1) * 255.0
    alpha = ndimage.gaussian_filter(alpha, sigma=0.6)
    alpha = np.clip(alpha, 0, 255)

    a_norm = (alpha / 255.0)[:, :, None]
    soft = (alpha > 1) & (alpha < 254)
    real_color = (rgb - (1 - a_norm) * BG) / np.clip(a_norm, 0.05, 1)
    rgb_out = np.where(soft[:, :, None], real_color, rgb)
    rgb_out = np.clip(rgb_out, 0, 255)

    out = arr.copy()
    out[:, :, :3] = rgb_out
    out[:, :, 3] = alpha
    out = np.clip(out, 0, 255).astype(np.uint8)

    # Recorta al bounding box real del sujeto (con margen) — así el
    # lienzo no carga aire de sobra que ya no sirve para nada al tener
    # transparencia real.
    ys, xs = np.where(alpha > 2)
    y0, y1 = max(ys.min() - int(h * margen_pct), 0), min(ys.max() + int(h * margen_pct), h)
    x0, x1 = max(xs.min() - int(w * margen_pct), 0), min(xs.max() + int(w * margen_pct), w)
    out = out[y0:y1, x0:x1]

    Image.fromarray(out, mode="RGBA").save(dst)
    print(f"{os.path.basename(dst)}: {w}x{h} -> {out.shape[1]}x{out.shape[0]}, "
          f"fondo eliminado en {background_mask.sum()} pixeles")


if __name__ == "__main__":
    origen = r"C:\Users\Alvaro\Documents\forst_pw1\imagenes"
    destino = r"C:\Users\Alvaro\Documents\forst_pw1\forst-web\public\assets\img"

    quitar_fondo(
        os.path.join(origen, "44a0972a-859e-424f-bd56-7e6d62c7227e.png"),
        os.path.join(destino, "hero-isla.png"),
    )
    quitar_fondo(
        os.path.join(origen, "33edd30b-f193-4661-8c9b-b578c9843a15.png"),
        os.path.join(destino, "hero-roca-2.png"),
    )
    quitar_fondo(
        os.path.join(origen, "c8f08569-6195-41ea-b43a-cf1903b1693a.png"),
        os.path.join(destino, "hero-roca-3.png"),
    )
