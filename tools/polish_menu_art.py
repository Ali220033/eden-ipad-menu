from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
FONT_DIR = Path("C:/Windows/Fonts")

DETAIL_BACK_TARGETS = (
    "coffees-page.png",
    "hot_teas_page.png",
    "iced_teas_page.png",
    "milkshakes_page.png",
    "lemonades_page.png",
    "soft_drinks_page.png",
    "desserts-page.png",
)

HOOKAH_NAME_BLOCKS = (
    ("HEAVY\nBLEND", (286, 546, 486, 646), 34),
    ("BALANCED\nBLEND", (710, 546, 966, 646), 32),
    ("LIGHT &\nSMOOTH\nBLEND", (270, 1016, 500, 1142), 30),
    ("SIGNATURE\nMIX", (700, 1032, 964, 1138), 32),
)


def font(name, size):
    path = FONT_DIR / name
    if path.exists():
        return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


BACK_FONT = font("georgia.ttf", 24)


def fill_corner(img):
    veil = Image.new("RGBA", (img.width, 150), (0, 0, 0, 0))
    veil_draw = ImageDraw.Draw(veil, "RGBA")
    for y in range(150):
        alpha = int(118 * (1 - y / 150) ** 1.7)
        veil_draw.line((0, y, img.width, y), fill=(0, 0, 0, alpha))
    img.alpha_composite(veil, (0, 0))


def draw_back_button(img):
    draw = ImageDraw.Draw(img, "RGBA")
    fill_corner(img)
    x, y, w, h = 18, 20, 132, 46
    draw.rounded_rectangle((x + 3, y + 4, x + w + 3, y + h + 4), radius=23, fill=(0, 0, 0, 92))
    draw.rounded_rectangle(
        (x, y, x + w, y + h),
        radius=23,
        fill=(4, 4, 3, 136),
        outline=(239, 189, 67, 235),
        width=2,
    )
    draw.line((x + 28, y + 14, x + 18, y + 23, x + 28, y + 32), fill=(255, 219, 91, 255), width=3, joint="curve")
    draw.text((x + 48, y + 10), "BACK", font=BACK_FONT, fill=(255, 218, 102, 255))


def text_size(draw, text, draw_font):
    box = draw.textbbox((0, 0), text, font=draw_font)
    return box[2] - box[0], box[3] - box[1]


def draw_tracked_line(draw, text, x, y, draw_font, fill, tracking=4):
    cursor = x
    for char in text:
        draw.text((cursor, y), char, font=draw_font, fill=fill)
        cursor += text_size(draw, char, draw_font)[0] + tracking


def tracked_width(draw, text, draw_font, tracking=4):
    return sum(text_size(draw, char, draw_font)[0] for char in text) + max(0, len(text) - 1) * tracking


def draw_luxury_name(draw, text, box, size):
    local_font = font("cambria.ttf", size)
    lines = text.split("\n")
    line_height = size + 7
    total_h = line_height * len(lines) - 7
    y = box[1] + ((box[3] - box[1] - total_h) / 2)
    for line in lines:
        w = tracked_width(draw, line, local_font)
        x = box[0] + ((box[2] - box[0] - w) / 2)
        draw_tracked_line(draw, line, x + 1, y + 2, local_font, (0, 0, 0, 210))
        draw_tracked_line(draw, line, x, y, local_font, (255, 226, 116, 255))
        y += line_height


def polish_hookah():
    source = ASSETS / "hookah-menu-page.png"
    path = ASSETS / "hookah-menu-page-clean.png"
    img = Image.open(source).convert("RGBA")
    draw = ImageDraw.Draw(img, "RGBA")

    cover_boxes = (
        (320, 642, 464, 768),
        (722, 642, 944, 777),
        (282, 1150, 485, 1265),
        (718, 1132, 956, 1245),
        (214, 832, 384, 908),
        (652, 832, 822, 908),
        (214, 1361, 384, 1436),
        (652, 1361, 822, 1436),
    )
    for box in cover_boxes:
        crop = img.crop(box).filter(ImageFilter.GaussianBlur(12))
        img.paste(crop, box)

    img.convert("RGB").save(path, "PNG", optimize=True)
    print("polished hookah-menu-page-clean.png")


def polish_back_buttons():
    for name in DETAIL_BACK_TARGETS:
        path = ASSETS / name
        if not path.exists():
            print(f"missing {name}")
            continue
        img = Image.open(path).convert("RGBA")
        draw_back_button(img)
        img.convert("RGB").save(path, "PNG", optimize=True)
        print(f"polished {name}")


def main():
    polish_back_buttons()
    polish_hookah()


if __name__ == "__main__":
    main()
