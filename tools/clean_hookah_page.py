from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
source = ASSETS / "hookah-menu-page.png"
output = ASSETS / "hookah-menu-page-clean.png"


def feathered_cover(base, box, color=(5, 4, 3, 255), blur=10):
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    mask = Image.new("L", base.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(box, radius=18, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    fill = Image.new("RGBA", base.size, color)
    return Image.alpha_composite(base, Image.composite(fill, overlay, mask))


img = Image.open(source).convert("RGBA")

# Remove the subtitle under "HOOKAH MENU" while preserving surrounding gold ornaments.
img = feathered_cover(img, (285, 342, 742, 420), blur=10)

img.save(output, "PNG", optimize=True)
print(output)
