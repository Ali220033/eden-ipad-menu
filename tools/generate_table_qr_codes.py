from __future__ import annotations

from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont
from qrcode.constants import ERROR_CORRECT_H
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "qr-codes"
BASE_URL = "https://eden-ipad-menu.vercel.app/"
TABLE_COUNT = 8

CARD_W = 1800
CARD_H = 2400
QR_SIZE = 1100

BLACK = (4, 3, 2)
DEEP = (11, 8, 4)
GOLD = (220, 168, 55)
GOLD_BRIGHT = (255, 229, 150)
GOLD_SOFT = (177, 121, 32)
IVORY = (255, 244, 206)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "C:/Windows/Fonts/georgiab.ttf" if bold else "C:/Windows/Fonts/georgia.ttf",
        "C:/Windows/Fonts/timesbd.ttf" if bold else "C:/Windows/Fonts/times.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


FONT_BRAND = font(118)
FONT_SMALL = font(36)
FONT_LABEL = font(48)
FONT_TABLE = font(132)
FONT_HINT = font(44)
FONT_URL = font(27)


def text_size(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=face)
    return box[2] - box[0], box[3] - box[1]


def center_text(draw: ImageDraw.ImageDraw, y: int, text: str, face: ImageFont.ImageFont, fill: tuple[int, int, int], spacing: int = 0) -> int:
    if spacing <= 0:
        w, h = text_size(draw, text, face)
        draw.text(((CARD_W - w) / 2, y), text, font=face, fill=fill)
        return y + h

    total_w = sum(text_size(draw, char, face)[0] for char in text) + spacing * (len(text) - 1)
    x = (CARD_W - total_w) / 2
    max_h = 0
    for char in text:
        cw, ch = text_size(draw, char, face)
        draw.text((x, y), char, font=face, fill=fill)
        x += cw + spacing
        max_h = max(max_h, ch)
    return y + max_h


def make_qr(url: str) -> Image.Image:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=22,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color=BLACK, back_color=IVORY).convert("RGB")
    return img.resize((QR_SIZE, QR_SIZE), Image.Resampling.NEAREST)


def draw_gradient_background() -> Image.Image:
    img = Image.new("RGB", (CARD_W, CARD_H), BLACK)
    px = img.load()
    for y in range(CARD_H):
        for x in range(CARD_W):
            cx = (x - CARD_W * 0.52) / CARD_W
            cy = (y - CARD_H * 0.5) / CARD_H
            glow = max(0, 1 - (cx * cx * 7.2 + cy * cy * 4.6))
            edge = y / CARD_H
            r = int(BLACK[0] + glow * 34 + edge * 8)
            g = int(BLACK[1] + glow * 25 + edge * 5)
            b = int(BLACK[2] + glow * 10)
            px[x, y] = (r, g, b)
    return img


def draw_border(draw: ImageDraw.ImageDraw) -> None:
    draw.rounded_rectangle((76, 76, CARD_W - 76, CARD_H - 76), radius=34, outline=GOLD_SOFT, width=4)
    draw.rounded_rectangle((112, 112, CARD_W - 112, CARD_H - 112), radius=24, outline=(88, 58, 16), width=2)
    draw.line((360, 388, CARD_W - 360, 388), fill=(131, 88, 22), width=2)
    draw.line((360, 1982, CARD_W - 360, 1982), fill=(131, 88, 22), width=2)
    for sx in (1, -1):
        x = 150 if sx == 1 else CARD_W - 150
        draw.arc((x - 42, 150, x + 42, 234), 190 if sx == 1 else -10, 350 if sx == 1 else 170, fill=GOLD, width=3)
        draw.arc((x - 42, CARD_H - 234, x + 42, CARD_H - 150), 10 if sx == 1 else 190, 170 if sx == 1 else 350, fill=GOLD, width=3)


def create_card(table: int) -> Image.Image:
    url = f"{BASE_URL}?table={table}"
    card = draw_gradient_background()
    draw = ImageDraw.Draw(card)
    draw_border(draw)

    y = 184
    y = center_text(draw, y, "EDEN", FONT_BRAND, GOLD_BRIGHT, spacing=12) + 24
    y = center_text(draw, y, "RESTAURANT & LOUNGE", FONT_SMALL, GOLD, spacing=8) + 82
    y = center_text(draw, y, f"TABLE {table}", FONT_TABLE, IVORY, spacing=8) + 46
    center_text(draw, y, "SCAN TO VIEW MENU", FONT_LABEL, GOLD_BRIGHT, spacing=4)

    qr = make_qr(url)
    qr_x = (CARD_W - QR_SIZE) // 2
    qr_y = 796
    shadow = Image.new("RGBA", (QR_SIZE + 90, QR_SIZE + 90), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((20, 20, QR_SIZE + 70, QR_SIZE + 70), radius=46, fill=(0, 0, 0, 170))
    card.paste(shadow.convert("RGB"), (qr_x - 45, qr_y - 35), shadow)
    draw.rounded_rectangle((qr_x - 32, qr_y - 32, qr_x + QR_SIZE + 32, qr_y + QR_SIZE + 32), radius=34, fill=IVORY, outline=GOLD_BRIGHT, width=7)
    card.paste(qr, (qr_x, qr_y))

    y = 2010
    center_text(draw, y, "ENJOY YOUR EDEN EXPERIENCE", FONT_HINT, GOLD_BRIGHT, spacing=3)
    y += 92
    center_text(draw, y, "FRESHLY PREPARED FOR YOUR TABLE", FONT_SMALL, GOLD, spacing=4)
    return card


def make_print_sheet(cards: list[Image.Image]) -> None:
    page_w, page_h = 8.5 * 72, 11 * 72
    card_w, card_h = 3.5 * 72, 4.666 * 72
    positions = [(0.6 * 72, 5.95 * 72), (4.4 * 72, 5.95 * 72), (0.6 * 72, 0.75 * 72), (4.4 * 72, 0.75 * 72)]
    pdf = canvas.Canvas(str(OUTPUT / "eden-table-qr-codes-print-sheet.pdf"), pagesize=(page_w, page_h))

    for start in range(0, len(cards), 4):
        for index, card in enumerate(cards[start : start + 4]):
            x, y = positions[index]
            pdf.drawImage(ImageReader(card), x, y, width=card_w, height=card_h, preserveAspectRatio=True, anchor="c")
            pdf.setStrokeColorRGB(0.72, 0.72, 0.72)
            pdf.setLineWidth(0.5)
            pdf.rect(x, y, card_w, card_h, stroke=1, fill=0)
        pdf.showPage()

    pdf.save()


def make_contact_sheet(cards: list[Image.Image]) -> None:
    thumb_w, thumb_h = 450, 600
    sheet = Image.new("RGB", (thumb_w * 4 + 120, thumb_h * 2 + 90), BLACK)
    for idx, card in enumerate(cards):
        x = 24 + (idx % 4) * (thumb_w + 24)
        y = 30 + (idx // 4) * (thumb_h + 30)
        sheet.paste(card.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS), (x, y))
    sheet.save(OUTPUT / "eden-table-qr-codes-preview.png", quality=95)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    cards = []
    links = []
    for table in range(1, TABLE_COUNT + 1):
        card = create_card(table)
        cards.append(card)
        card.save(OUTPUT / f"eden-table-{table:02d}-qr.png", quality=95)
        links.append(f"Table {table}: {BASE_URL}?table={table}")

    make_print_sheet(cards)
    make_contact_sheet(cards)
    (OUTPUT / "eden-table-qr-links.txt").write_text("\n".join(links) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
