from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

GOLD = (239, 189, 67)
GOLD_BRIGHT = (255, 238, 165)
GOLD_DEEP = (126, 80, 19)
TEXT = (255, 245, 205)
MUTED = (214, 184, 115)
BLACK = (5, 4, 3)


def font(name, size):
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


SERIF = "georgia.ttf"
SERIF_BOLD = "georgiab.ttf"
SANS = "bahnschrift.ttf"


def cover_image(path, size, blur=0, darken=0.55, saturation=0.85):
    img = Image.open(path).convert("RGB")
    img = ImageOps.fit(img, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    if blur:
        img = img.filter(ImageFilter.GaussianBlur(blur))
    img = ImageEnhance.Color(img).enhance(saturation)
    overlay = Image.new("RGB", size, BLACK)
    return Image.blend(img, overlay, darken)


def fit_image(path, size, blur=0, darken=0.0):
    img = Image.open(path).convert("RGB")
    img = ImageOps.fit(img, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    if blur:
        img = img.filter(ImageFilter.GaussianBlur(blur))
    if darken:
        img = Image.blend(img, Image.new("RGB", size, BLACK), darken)
    return img


def gradient_overlay(size):
    w, h = size
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    px = layer.load()
    for y in range(h):
        for x in range(w):
            edge = max(abs(x - w / 2) / (w / 2), abs(y - h / 2) / (h / 2))
            bottom = max(0, (y / h - 0.54) * 1.7)
            alpha = int(min(210, edge * 96 + bottom * 92))
            px[x, y] = (0, 0, 0, alpha)
    return layer


def text_center(draw, box, value, font_obj, fill, spacing=0):
    lines = value.split("\n")
    widths = [draw.textbbox((0, 0), line, font=font_obj)[2] for line in lines]
    heights = [draw.textbbox((0, 0), line, font=font_obj)[3] - draw.textbbox((0, 0), line, font=font_obj)[1] for line in lines]
    total_h = sum(heights) + spacing * (len(lines) - 1)
    y = box[1] + (box[3] - box[1] - total_h) / 2
    for line, width, height in zip(lines, widths, heights):
        draw.text((box[0] + (box[2] - box[0] - width) / 2, y), line, font=font_obj, fill=fill)
        y += height + spacing


def draw_text_with_tracking(draw, xy, text, font_obj, fill, tracking, anchor="la"):
    x, y = xy
    total = 0
    widths = []
    for char in text:
        width = draw.textlength(char, font=font_obj)
        widths.append(width)
        total += width + tracking
    total -= tracking if text else 0
    if anchor.startswith("m"):
        x -= total / 2
    char_anchor = "l" + anchor[1]
    for char, width in zip(text, widths):
        draw.text((x, y), char, font=font_obj, fill=fill, anchor=char_anchor)
        x += width + tracking


def line_ornament(draw, cx, y, length, color=GOLD, alpha=210):
    rgba = (*color, alpha)
    draw.line((cx - length / 2, y, cx - 48, y), fill=rgba, width=3)
    draw.line((cx + 48, y, cx + length / 2, y), fill=rgba, width=3)
    draw.polygon([(cx, y - 18), (cx + 18, y), (cx, y + 18), (cx - 18, y)], outline=rgba)
    draw.polygon([(cx, y - 7), (cx + 7, y), (cx, y + 7), (cx - 7, y)], fill=rgba)


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def paste_card_image(canvas, img, box, radius=42):
    x1, y1, x2, y2 = [int(v) for v in box]
    img = ImageOps.fit(img, (x2 - x1, y2 - y1), method=Image.Resampling.LANCZOS)
    canvas.paste(img, (x1, y1), rounded_mask(img.size, radius))


def card(draw, box, radius=42, width=4):
    x1, y1, x2, y2 = [int(v) for v in box]
    for offset, alpha in [(0, 210), (10, 90), (20, 38)]:
        draw.rounded_rectangle(
            (x1 + offset, y1 + offset, x2 - offset, y2 - offset),
            radius=max(8, radius - offset // 2),
            outline=(*GOLD, alpha),
            width=width if offset == 0 else 2,
        )


def gold_text(draw, xy, value, font_obj, fill=GOLD_BRIGHT, stroke=GOLD_DEEP, anchor="la"):
    draw.text(xy, value, font=font_obj, fill=fill, stroke_width=2, stroke_fill=stroke, anchor=anchor)


def add_back(draw, scale=1.0):
    box = (130 * scale, 130 * scale, 760 * scale, 310 * scale)
    draw.rounded_rectangle(box, radius=int(42 * scale), outline=(*GOLD, 210), width=max(3, int(4 * scale)), fill=(0, 0, 0, 94))
    x = 230 * scale
    y = 220 * scale
    draw.line((x + 60 * scale, y - 54 * scale, x, y, x + 60 * scale, y + 54 * scale), fill=GOLD_BRIGHT, width=max(7, int(10 * scale)))
    draw_text_with_tracking(draw, (360 * scale, 220 * scale), "BACK", font(SERIF, int(62 * scale)), GOLD_BRIGHT, int(10 * scale), anchor="lm")


def add_header(draw, width, y, title, subtitle):
    draw_text_with_tracking(draw, (width / 2, y), "EDEN", font(SERIF, 330), GOLD_BRIGHT, 28, anchor="mm")
    draw_text_with_tracking(draw, (width / 2, y + 260), "RESTAURANT & LOUNGE", font(SERIF, 58), GOLD, 17, anchor="mm")
    line_ornament(draw, width / 2, y + 390, width * 0.48)
    draw_text_with_tracking(draw, (width / 2, y + 600), title, font(SERIF, 148), GOLD_BRIGHT, 16, anchor="mm")
    draw_text_with_tracking(draw, (width / 2, y + 750), subtitle, font(SANS, 38), MUTED, 8, anchor="mm")


def build_hookah():
    size = (4096, 6144)
    canvas = cover_image(ASSETS / "eden-opening-clean-4k-hq.webp", size, blur=24, darken=0.48, saturation=0.8).convert("RGBA")
    canvas.alpha_composite(gradient_overlay(size))
    draw = ImageDraw.Draw(canvas, "RGBA")

    add_back(draw)
    add_header(draw, size[0], 660, "HOOKAH MENU", "SIGNATURE BLENDS")

    old = Image.open(ASSETS / "hookah-page-4k.webp").convert("RGB")
    center = old.crop((1260, 1700, 2850, 5060))
    center = ImageOps.contain(center, (1420, 2720), method=Image.Resampling.LANCZOS)
    center = ImageEnhance.Color(center).enhance(0.55)
    center = ImageEnhance.Contrast(center).enhance(1.08).convert("RGBA")
    alpha = Image.new("L", center.size, 180)
    center.putalpha(alpha)
    canvas.alpha_composite(center, ((size[0] - center.width) // 2, 2850))

    cards = [
        ((290, 1720, 1540, 3350), "HEAVY\nBLEND", "INTENSE / RICH / BOLD", (560, 2750, 1410, 3930)),
        ((2556, 1720, 3806, 3350), "BALANCED\nBLEND", "SMOOTH / PURE / CLASSIC", (2660, 2660, 3900, 3940)),
        ((290, 3440, 1540, 5160), "LIGHT &\nSMOOTH\nBLEND", "MILD / CLEAN / RELAXING", (520, 3600, 1540, 5280)),
        ((2556, 3440, 3806, 5160), "SIGNATURE\nMIX", "UNIQUE / EXCLUSIVE / LUXURY", (2590, 3520, 3980, 5310)),
    ]

    for box, title, caption, crop in cards:
        x1, y1, x2, y2 = box
        draw.rounded_rectangle(box, radius=42, fill=(0, 0, 0, 150))
        crop_img = old.crop(crop)
        crop_img = ImageEnhance.Color(crop_img).enhance(0.25)
        crop_img = ImageEnhance.Brightness(crop_img).enhance(0.58)
        crop_img = ImageEnhance.Contrast(crop_img).enhance(1.22)
        paste_card_image(canvas, crop_img, box)
        draw.rounded_rectangle(box, radius=42, fill=(0, 0, 0, 102))
        card(draw, box, radius=42)
        icon_y = y1 + 260
        draw.ellipse((x1 + 515, icon_y - 95, x1 + 735, icon_y + 125), outline=(*GOLD, 190), width=4)
        draw.line((x1 + 625, icon_y - 40, x1 + 625, icon_y + 70), fill=(*GOLD_BRIGHT, 210), width=6)
        draw.arc((x1 + 555, icon_y + 10, x1 + 695, icon_y + 120), 200, 340, fill=(*GOLD_BRIGHT, 210), width=5)
        text_center(draw, (x1 + 60, y1 + 520, x2 - 60, y1 + 1000), title, font(SERIF, 116), GOLD_BRIGHT, 16)
        line_ornament(draw, (x1 + x2) / 2, y1 + 1105, 410)
        text_center(draw, (x1 + 80, y1 + 1200, x2 - 80, y1 + 1320), caption, font(SANS, 38), TEXT, 0)
        draw.rounded_rectangle((x1 + 445, y2 - 250, x2 - 445, y2 - 108), radius=48, outline=(*GOLD, 195), width=3, fill=(0, 0, 0, 104))
        draw.line((x1 + 570, y2 - 180, x2 - 570, y2 - 180), fill=(*GOLD_BRIGHT, 220), width=6)
        draw.line((x2 - 630, y2 - 230, x2 - 570, y2 - 180, x2 - 630, y2 - 130), fill=(*GOLD_BRIGHT, 220), width=6)

    line_ornament(draw, size[0] / 2, 5560, size[0] * 0.52)
    draw_text_with_tracking(draw, (size[0] / 2, 5740), "A SMOOTHER LOUNGE RITUAL", font(SERIF, 54), GOLD, 13, anchor="mm")
    canvas.convert("RGB").save(ASSETS / "hookah-page-eden-4k.webp", "WEBP", quality=92, method=6)


def build_desserts():
    size = (4344, 5792)
    canvas = cover_image(ASSETS / "eden-opening-clean-4k-hq.webp", size, blur=22, darken=0.54, saturation=0.82).convert("RGBA")
    canvas.alpha_composite(gradient_overlay(size))
    draw = ImageDraw.Draw(canvas, "RGBA")

    add_back(draw, scale=1.06)
    draw_text_with_tracking(draw, (size[0] / 2, 590), "EDEN", font(SERIF, 300), GOLD_BRIGHT, 28, anchor="mm")
    draw_text_with_tracking(draw, (size[0] / 2, 830), "RESTAURANT & LOUNGE", font(SERIF, 56), GOLD, 16, anchor="mm")
    line_ornament(draw, size[0] / 2, 980, size[0] * 0.42)
    draw_text_with_tracking(draw, (size[0] / 2, 1245), "DESSERTS", font(SERIF, 156), GOLD_BRIGHT, 18, anchor="mm")
    draw_text_with_tracking(draw, (size[0] / 2, 1390), "SWEET CREATIONS", font(SANS, 40), MUTED, 9, anchor="mm")

    desserts = [
        ((1570, 1580, 4150, 3190), "01", "FROZEN\nBREW TREATS", "Frozen coffee-infused dessert treats", "$7.99", ASSETS / "frozen fruit.png"),
        ((160, 3200, 2110, 5280), "02", "CHEESE CAKE", "Classic creamy cheesecake", "$8.99", ASSETS / "cheesecake.png"),
        ((2230, 3200, 4180, 5280), "03", "LAVA CAKE", "Warm chocolate lava cake with molten center", "$10.99", ASSETS / "lava cake.png"),
    ]

    for box, number, title, desc, price, path in desserts:
        x1, y1, x2, y2 = box
        draw.rounded_rectangle(box, radius=48, fill=(0, 0, 0, 128))
        img_h = int((y2 - y1) * 0.58)
        image_box = (x1 + 42, y1 + 42, x2 - 42, y1 + img_h)
        img = fit_image(path, (image_box[2] - image_box[0], image_box[3] - image_box[1]), darken=0.04)
        paste_card_image(canvas, img, image_box, radius=34)
        draw.rounded_rectangle((x1, y1 + img_h - 30, x2, y2), radius=48, fill=(0, 0, 0, 142))
        card(draw, box, radius=48)
        draw.rounded_rectangle((x1 + 76, y1 + img_h - 20, x1 + 250, y1 + img_h + 82), radius=18, fill=(*GOLD, 218))
        draw.text((x1 + 163, y1 + img_h + 30), number, font=font(SERIF_BOLD, 58), fill=(10, 7, 2), anchor="mm")
        title_font = font(SERIF, 74 if "\n" not in title else 64)
        text_center(draw, (x1 + 76, y1 + img_h + 120, x2 - 76, y1 + img_h + 360), title, title_font, GOLD_BRIGHT, 10)
        line_ornament(draw, (x1 + x2) / 2, y1 + img_h + 405, min(720, (x2 - x1) * 0.55))
        text_center(draw, (x1 + 110, y1 + img_h + 470, x2 - 110, y1 + img_h + 670), desc, font(SANS, 42), TEXT, 0)
        gold_text(draw, (x1 + 110, y2 - 160), price, font(SERIF, 94))

    line_ornament(draw, size[0] / 2, 5490, size[0] * 0.5)
    draw_text_with_tracking(draw, (size[0] / 2, 5635), "EXPERIENCE LUXURY. SAVOUR PERFECTION.", font(SERIF, 46), GOLD, 11, anchor="mm")
    canvas.convert("RGB").save(ASSETS / "desserts-page-eden-4k.webp", "WEBP", quality=92, method=6)


if __name__ == "__main__":
    build_hookah()
    build_desserts()
