from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

SALADS_BUTTON_BOX = (18, 22, 176, 84)
TARGET_BOX = SALADS_BUTTON_BOX


def restore_corner_without_old_button(img):
    # Covers only the previous approximate button area while leaving the page content intact.
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((14, 18, 184, 92), radius=34, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(8))
    fill = Image.new("RGBA", img.size, (5, 4, 3, 238))
    return Image.alpha_composite(img, Image.composite(fill, overlay, mask))


salads = Image.open(ASSETS / "salads-page.png").convert("RGBA")
button = salads.crop(SALADS_BUTTON_BOX)

for name in ("main-course-page.png", "appetizers-page.png"):
    path = ASSETS / name
    if not path.exists():
        continue

    img = Image.open(path).convert("RGBA")
    img = restore_corner_without_old_button(img)
    img.alpha_composite(button, TARGET_BOX[:2])
    img.save(path, "PNG", optimize=True)
    print(path)
