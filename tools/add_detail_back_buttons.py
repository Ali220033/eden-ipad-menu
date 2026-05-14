from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

SALADS_BUTTON_BOX = (18, 22, 176, 84)
TARGETS = (
    "coffees-page.png",
    "hot_teas_page.png",
    "iced_teas_page.png",
    "milkshakes_page.png",
    "lemonades_page.png",
    "soft_drinks_page.png",
    "desserts-page.png",
)


def cover_old_button(img, target_box):
    x1, y1, x2, y2 = target_box
    pad = 10
    crop_box = (
        max(0, x1 - pad),
        max(0, y1 - pad),
        min(img.width, x2 + pad),
        min(img.height, y2 + pad),
    )
    patch = img.crop(crop_box).filter(ImageFilter.GaussianBlur(radius=10))
    img.paste(patch, crop_box)


def main():
    source = ASSETS / "salads-page.png"
    if not source.exists():
        raise FileNotFoundError(source)

    with Image.open(source).convert("RGBA") as salads:
        button = salads.crop(SALADS_BUTTON_BOX)

    smaller = button.resize(
        (round(button.width * 0.82), round(button.height * 0.82)),
        Image.Resampling.LANCZOS,
    )
    target_box = (12, 12, 178, 82)
    paste_at = (18, 18)

    for name in TARGETS:
        path = ASSETS / name
        if not path.exists():
            print(f"missing {name}")
            continue

        img = Image.open(path).convert("RGBA")
        cover_old_button(img, target_box)
        img.alpha_composite(smaller, paste_at)
        img.convert("RGB").save(path, "PNG", optimize=True)
        print(f"updated {name}")


if __name__ == "__main__":
    main()
