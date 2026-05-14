from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

ITEMS = (
    "detail-salad-eden.png",
    "detail-salad-salmon-splash.png",
    "detail-salad-caesar.png",
    "detail-salad-eggplant.png",
    "detail-burger-cheese.png",
    "detail-burger-chicken.png",
    "detail-burger-eden.png",
    "detail-main-steak.png",
    "detail-main-seabass.png",
    "detail-side-cheese-fries.png",
    "detail-side-fries.png",
    "detail-side-garlic-fries.png",
    "detail-side-grilled-vegetables.png",
    "detail-side-rice.png",
    "detail-app-wings.png",
    "detail-app-seafood-mix.png",
    "detail-app-dynamite-shrimp.png",
    "detail-app-mozzarella.png",
    "detail-app-calamari.png",
    "detail-app-chicken-nuggets.png",
    "heavy_blend_page.png",
    "balanced_blend_page.png",
    "light_page.png",
    "signature mix.png",
)


def upscale(name):
    source = ASSETS / name
    output = ASSETS / name.replace(" ", "-").replace("_", "-").replace(".png", "-4k.png")
    img = Image.open(source).convert("RGB")
    scale = 3
    upscaled = img.resize((img.width * scale, img.height * scale), Image.Resampling.LANCZOS)
    upscaled = ImageEnhance.Contrast(upscaled).enhance(1.035)
    upscaled = ImageEnhance.Sharpness(upscaled).enhance(1.2)
    upscaled = upscaled.filter(ImageFilter.UnsharpMask(radius=1.05, percent=92, threshold=3))
    upscaled.save(output, "PNG", optimize=True)
    print(f"{output.name} {upscaled.width}x{upscaled.height}")


def main():
    for name in ITEMS:
        if (ASSETS / name).exists():
            upscale(name)
        else:
            print(f"missing {name}")


if __name__ == "__main__":
    main()
