from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
preferred_source = ROOT / "assets" / "eden-opening-no-glow.png"
fallback_source = ROOT / "assets" / "eden-opening.png"
output = ROOT / "assets" / "eden-opening-clean.png"


def feathered_cover(base, box, color, blur=18):
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    mask = Image.new("L", base.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(box, radius=18, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    fill = Image.new("RGBA", base.size, color)
    overlay = Image.composite(fill, overlay, mask)
    return Image.alpha_composite(base, overlay)


source = preferred_source if preferred_source.exists() else fallback_source
img = Image.open(source).convert("RGBA")

# Remove the imported tablet/browser UI inside the artwork.
for region in (
    (0, 0, 92, 58),       # hamburger
    (462, 0, 625, 58),    # time
    (925, 0, 1086, 60),   # wifi/battery
):
    img = feathered_cover(img, region, (4, 3, 2, 255), blur=8)

# Remove the "swipe up to explore" prompt and arrow from the artwork.
img = feathered_cover(img, (504, 1348, 584, 1384), (3, 2, 1, 255), blur=10)
img = feathered_cover(img, (340, 1380, 748, 1448), (3, 2, 1, 255), blur=10)

img.save(output, "PNG", optimize=True)
print(output)
