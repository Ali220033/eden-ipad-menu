from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"


def font(size):
    for path in (
        Path("C:/Windows/Fonts/georgiab.ttf"),
        Path("C:/Windows/Fonts/georgia.ttf"),
        Path("C:/Windows/Fonts/timesbd.ttf"),
    ):
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def cover(base, box, color=(4, 3, 2, 242), blur=10, radius=14):
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    mask = Image.new("L", base.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(box, radius=radius, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    fill = Image.new("RGBA", base.size, color)
    return Image.alpha_composite(base, Image.composite(fill, overlay, mask))


def scaled_box(box, sx, sy):
    return tuple(round(v * (sx if i % 2 == 0 else sy)) for i, v in enumerate(box))


def remove_explore(source_name, output_name, boxes_1024):
    source = ASSETS / source_name
    if not source.exists():
        return
    img = Image.open(source).convert("RGBA")
    sx = img.width / 1024
    sy = img.height / 1536
    for box in boxes_1024:
        img = cover(img, scaled_box(box, sx, sy), blur=8 * sx, radius=18)
    img.save(ASSETS / output_name, "PNG", optimize=True)
    print(ASSETS / output_name)


food_explore_boxes = [
    (132, 858, 250, 900),
    (438, 858, 556, 900),
    (744, 858, 862, 900),
    (132, 1292, 250, 1338),
    (438, 1292, 556, 1338),
    (744, 1292, 862, 1338),
]

drinks_explore_boxes = [
    (150, 1030, 304, 1092),
    (438, 1030, 592, 1092),
    (728, 1030, 882, 1092),
    (150, 1498, 304, 1536),
    (438, 1498, 592, 1536),
    (728, 1498, 882, 1536),
]

remove_explore("food-menu-page.png", "food-menu-page-clean.png", food_explore_boxes)
remove_explore("drinks-menu-page.png", "drinks-menu-page-clean.png", drinks_explore_boxes)


hookah_source = ASSETS / "hookah-menu-page.png"
if hookah_source.exists():
    img = Image.open(hookah_source).convert("RGBA")

    # Remove subtitle under the page title.
    img = cover(img, (285, 342, 742, 420), color=(5, 4, 3, 255), blur=10)

    # Remove "Explore" labels and arrows.
    for box in ((198, 832, 386, 908), (647, 832, 835, 908), (198, 1330, 386, 1410), (647, 1330, 835, 1410)):
        img = cover(img, box, color=(4, 3, 2, 255), blur=7, radius=22)

    # Remove original card names plus small descriptive copy inside each Hookah card.
    for box in ((258, 500, 480, 770), (704, 500, 938, 790), (255, 992, 492, 1284), (700, 1010, 940, 1265)):
        img = cover(img, box, color=(7, 5, 3, 252), blur=13, radius=22)

    # Redraw larger Hookah names.
    draw = ImageDraw.Draw(img)
    title_font = font(31)
    gold = (255, 221, 97, 255)
    shadow = (0, 0, 0, 210)
    labels = [
        ("HEAVY\nBLEND", (370, 575)),
        ("BALANCED\nBLEND", (820, 575)),
        ("LIGHT &\nSMOOTH\nBLEND", (372, 1072)),
        ("SIGNATURE\nMIX", (820, 1082)),
    ]
    for text, center in labels:
        lines = text.split("\n")
        line_h = 36
        y = center[1] - (len(lines) * line_h) / 2
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=title_font)
            x = center[0] - (bbox[2] - bbox[0]) / 2
            draw.text((x + 2, y + 2), line, font=title_font, fill=shadow)
            draw.text((x, y), line, font=title_font, fill=gold)
            y += line_h

    img.save(ASSETS / "hookah-menu-page-clean.png", "PNG", optimize=True)
    print(ASSETS / "hookah-menu-page-clean.png")
