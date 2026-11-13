# Contorno sutil + recorte + export webp. Uso: post.py <dir_png> <dir_salida> <hoja.png>
import sys, glob, os, json
from PIL import Image, ImageFilter, ImageDraw, ImageFont
src, out, sheet_path = sys.argv[1:4]
os.makedirs(out, exist_ok=True)
SIZE = 400
names = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else {}
files = sorted(glob.glob(f"{src}/*.png"))
tiles = []
for f in files:
    im = Image.open(f).convert("RGBA").resize((400, 400), Image.LANCZOS)
    a = im.split()[3]
    obj = a.point(lambda v: 255 if v > 110 else 0).filter(ImageFilter.MedianFilter(3))
    ring = obj.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(0.8))
    edge = Image.new("RGBA", im.size, (88, 95, 92, 0)); edge.putalpha(ring.point(lambda v: int(v * 0.6)))
    comp = Image.new("RGBA", im.size, (0, 0, 0, 0)); comp.alpha_composite(edge); comp.alpha_composite(im)
    bbox = comp.split()[3].point(lambda v: 255 if v > 8 else 0).getbbox()
    comp = comp.crop(bbox); w, h = comp.size; side = int(max(w, h) * 1.08)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0)); sq.alpha_composite(comp, ((side - w) // 2, (side - h) // 2))
    sq = sq.resize((SIZE, SIZE), Image.LANCZOS)
    code = os.path.basename(f)[:-4]
    sq.save(f"{out}/{code}.webp", "WEBP", quality=86, method=6)
    tiles.append((code, sq))
cols = 10; T = 170
sheet = Image.new("RGB", (cols * T, ((len(tiles) + cols - 1) // cols) * (T + 18)), (250, 250, 248)); d = ImageDraw.Draw(sheet)
font = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Regular.otf", 11)
for i, (code, t) in enumerate(tiles):
    x, y = (i % cols) * T, (i // cols) * (T + 18)
    sheet.paste(t.resize((T - 6, T - 6)), (x + 3, y + 3), t.resize((T - 6, T - 6)))
    d.text((x + 4, y + T - 2), (names.get(code, code))[:26], fill=(60, 60, 60), font=font)
sheet.save(sheet_path)
print(len(tiles))
