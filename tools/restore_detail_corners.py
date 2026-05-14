from pathlib import Path
import random

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

TARGETS = (
    "coffees-page.png",
    "hot_teas_page.png",
    "iced_teas_page.png",
    "milkshakes_page.png",
    "lemonades_page.png",
    "soft_drinks_page.png",
    "desserts-page.png",
)


def repair_corner(path):
    img = Image.open(path).convert("RGBA")
    width = min(205, img.width)
    height = min(122, img.height)

    sample_y = min(height, max(0, img.height - height - 1))
    sample = img.crop((0, sample_y, width, sample_y + height))
    sample = sample.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
    sample = sample.filter(ImageFilter.GaussianBlur(13))

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    for y in range(height):
        fade = 1 - y / max(1, height - 1)
        alpha = int(210 * (fade**1.25))
        draw.line((0, y, width, y), fill=(0, 0, 0, alpha))

    for _ in range(450):
        x = random.randrange(width)
        y = random.randrange(height)
        a = random.randrange(3, 13)
        shade = random.randrange(18, 45)
        overlay.putpixel((x, y), (shade, max(10, shade - 10), 4, a))

    restored = Image.alpha_composite(sample, overlay)
    feather = Image.new("L", (width, height), 0)
    mask = ImageDraw.Draw(feather)
    mask.rectangle((0, 0, width - 1, height - 1), fill=255)
    for i in range(28):
        alpha = int(255 * (1 - i / 28))
        mask.line((width - 1 - i, 0, width - 1 - i, height), fill=alpha)
        mask.line((0, height - 1 - i, width, height - 1 - i), fill=alpha)

    img.paste(restored, (0, 0), feather)
    img.convert("RGB").save(path, "PNG", optimize=True)
    print(f"restored {path.name}")


def main():
    for name in TARGETS:
        path = ASSETS / name
        if path.exists():
            repair_corner(path)
        else:
            print(f"missing {name}")


if __name__ == "__main__":
    main()
