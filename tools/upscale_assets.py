from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"


def upscale(source_name, output_name, scale):
    source = ASSETS / source_name
    output = ASSETS / output_name
    img = Image.open(source).convert("RGB")
    size = (img.width * scale, img.height * scale)
    upscaled = img.resize(size, Image.Resampling.LANCZOS)
    upscaled = ImageEnhance.Contrast(upscaled).enhance(1.03)
    upscaled = ImageEnhance.Sharpness(upscaled).enhance(1.18)
    upscaled = upscaled.filter(ImageFilter.UnsharpMask(radius=1.1, percent=95, threshold=3))
    upscaled.save(output, "PNG", optimize=True)
    print(f"{output} {upscaled.width}x{upscaled.height}")


upscale("eden-opening-clean.png", "eden-opening-clean-4k.png", 4)
if (ASSETS / "food-menu-page-clean.png").exists():
    upscale("food-menu-page-clean.png", "food-menu-page-clean-4k.png", 4)
else:
    upscale("food-menu-page.png", "food-menu-page-4k.png", 4)
if (ASSETS / "drinks-menu-page-clean.png").exists():
    # Drinks page is already provided at 4096x6144, so keep its native size.
    img = Image.open(ASSETS / "drinks-menu-page-clean.png").convert("RGB")
    img.save(ASSETS / "drinks-menu-page-clean-4k.png", "PNG", optimize=True)
    print(f"{ASSETS / 'drinks-menu-page-clean-4k.png'} {img.width}x{img.height}")
if (ASSETS / "hookah-menu-page.png").exists():
    upscale("hookah-menu-page.png", "hookah-menu-page-4k.png", 4)
if (ASSETS / "hookah_page.png").exists():
    upscale("hookah_page.png", "hookah-page-4k.png", 4)
if (ASSETS / "hookah-menu-page-clean.png").exists():
    upscale("hookah-menu-page-clean.png", "hookah-menu-page-clean-4k.png", 4)
if (ASSETS / "salads-page.png").exists():
    upscale("salads-page.png", "salads-page-4k.png", 4)
if (ASSETS / "burgers-page.png").exists():
    upscale("burgers-page.png", "burgers-page-4k.png", 4)
if (ASSETS / "main-course-page.png").exists():
    upscale("main-course-page.png", "main-course-page-4k.png", 4)
if (ASSETS / "sides-page.png").exists():
    upscale("sides-page.png", "sides-page-4k.png", 4)
if (ASSETS / "appetizers-page.png").exists():
    upscale("appetizers-page.png", "appetizers-page-4k.png", 4)
if (ASSETS / "desserts-page.png").exists():
    upscale("desserts-page.png", "desserts-page-4k.png", 4)
if (ASSETS / "coffees-page.png").exists():
    upscale("coffees-page.png", "coffees-page-4k.png", 4)
if (ASSETS / "hot_teas_page.png").exists():
    upscale("hot_teas_page.png", "hot-teas-page-4k.png", 4)
if (ASSETS / "iced_teas_page.png").exists():
    upscale("iced_teas_page.png", "iced-teas-page-4k.png", 4)
if (ASSETS / "milkshakes_page.png").exists():
    upscale("milkshakes_page.png", "milkshakes-page-4k.png", 4)
if (ASSETS / "lemonades_page.png").exists():
    upscale("lemonades_page.png", "lemonades-page-4k.png", 4)
if (ASSETS / "soft_drinks_page.png").exists():
    upscale("soft_drinks_page.png", "soft-drinks-page-4k.png", 4)
