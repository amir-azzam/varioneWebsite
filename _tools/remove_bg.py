"""Flood-fill the white background of the device render to transparent.
Only removes white connected to the image border, so the white device body
(separated by its contact shadow) is preserved."""
import sys
from PIL import Image, ImageDraw

src = sys.argv[1]
dst = sys.argv[2]
im = Image.open(src).convert("RGBA")
rgb = im.convert("RGB")
marker = (255, 0, 255)
thresh = 36
w, h = im.size
for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
    ImageDraw.floodfill(rgb, seed, marker, thresh=thresh)
src_px = rgb.load()
dst_px = im.load()
removed = 0
for y in range(h):
    for x in range(w):
        if src_px[x, y] == marker:
            r, g, b, _ = dst_px[x, y]
            dst_px[x, y] = (r, g, b, 0)
            removed += 1
im.save(dst)
print(f"removed {removed} px of {w*h} ({100*removed//(w*h)}%)")
