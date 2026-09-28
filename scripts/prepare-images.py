"""One-off: convert the audited printfix.co.in images into web assets under public/.

Source: the WordPress uploads downloaded during the audit (raw/2026_MM_name.ext).
Each project gets <slug>-<n>.webp at full size (max 1400w) and <slug>-<n>-sm.webp (640w).
"""
import os, sys
from PIL import Image

RAW = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "work")
os.makedirs(OUT, exist_ok=True)

P = "2026_04_"
PROJECTS = {
    # rigid boxes
    "glide-red": ["Glide-Red-1.png", "Glide-Red-1-1.png", "Glide-Red-4.png"],
    "birra-attar": ["WhatsApp-Image-2026-04-13-at-15.31.53-e1776243334645.jpeg", "Birra.png", "Birra-2.png"],
    "glide-yellow": ["Glide-Yellow.png", "Glide-Yellow-1.png", "Glide-Yellow-2.png"],
    "glide-pro": ["Glide-Pro-1.png", "Untitled-design-1.png", "Glide-Pro.png", "Untitled-design.png"],
    "vero-forza-magnetic": ["Black-Box.png", "Black-box-2.png", "Black-Box-3.png"],
    "olivia-leigh": ["Olivia-Rigid-Box-2.png", "Olivia-Rigid-Box.png", "Olivia-Rigid-Box-3.png"],
    "aethara": ["AETHARA-Rigid-Box.png", "AETHARA-Rigid-Box-2.png", "AETHARA-Rigid-Box-3.png"],
    "af-abaya": ["Abaya-Rigid-Box.png", "Abaya-Rigid-Box-2.png", "Abaya-Rigid-Box-3.png", "Abaya-Rigid-Box-4.png"],
    "ruixuecui": ["Ruixeicui-Rigid-Box-2.png", "Ruixeicui-Rigid-Box.png", "Ruixeicui-Rigid-Box-3.png", "Ruixeicui-Rigid-Box-4.png"],
    "velina": ["Velina-Rigid-Box.png", "Velina-Rigid-Box-2.png", "Velina-Rigid-Box-3.png", "Velina-Rigid-Box-4.png"],
    # corrugated
    "le-rose": ["Le-Rose-Corrugated-Box.png", "Le-Rose-Corrugated-Box-2.png", "Le-Rose-Corrugated-Box-3.png"],
    "gift-set": ["Corrugtaed-gift.png", "Corrugtaed-gift-2.png", "Corrugtaed-gift-4.png", "Corrugtaed-gift-1.png"],
    "muse-mailer": ["Corrugtaed-new.png", "Crrugated-new-2.png"],
    "rhode": ["Rhode-Corrugated-Box.png", "Rhode-Corrugated-Box-2.png", "Rhode-Corrugated-Box-3.png", "Rhode-Corrugated-Box-4.png"],
    "mavie": ["Marvie.png", "Mavie.png", "Mavie-3.png"],
    "leafcraft": ["Corrugated-Box-Leaf.png", "Corrugated-Box-Leaf2.png", "Corrugated-Box-Leaf-3.png"],
    "cacau-spa": ["Cacau-Corrugated-box.png", "Cacau-Corrugated-box-2.png", "Cacau-Corrugated-box-3.png"],
    "nzuri": ["Nzuri-Corrugated-Box.png", "Nzuri-Corrugated-Box-2.png", "Nzuri-Corrugated-Box-3.png"],
    "kraft-two-piece": ["Corrugated-O1.png", "Corrugated-01-2.png", "Corrugated-O1-3.png"],
    "pastel-gift": ["Corrugated-Pastel.png", "Corrugated-Pastel-2.png", "Corrugated-Pastel-3.png", "Corrugated-Pastel-4.png"],
    "cbd-mailer": ["Corrugated-CBD.png", "Corrugated-CBD-2.png", "Corrugated-CBD-3.png"],
    "mocha-mailer": ["Mocha-Corrugated-Box.png", "Mocha-Corrugated-box-2.png", "Mocha-Corrugated-box-3.png"],
    # product boxes
    "dr-balwi": ["Balwi-Product-Box.png", "Balwi-Product-Box-2.png", "Balwi-Product-Box-3.png"],
    "jane-roe": ["Jane-Product-Box.png", "Jane-Product-Box-3.png", "Jane-Product-box-2.png", "Jane-Product-box-4.png"],
    "vivo-organics": ["Vivo-Product-Box.png", "Vivo-Product-Box-2.png", "Vivo-Product-Box-3.png"],
    "luv-cbd": ["Luv-Product-Box.png", "Luv-Product-Box-2.png", "Luv-Product-Box-3.png"],
    "lavender-soap": ["Soap-Product-Box.png", "Soap-Product-Box-2.png", "Soap-Product-Box-3.png"],
    "colact": ["Colact-Product-Box.png", "Colact-Product-Box-2.png", "Colact-Product-Box-3.png"],
    "sufr-glow": ["Glow-Product-Box-2.png", "Glow-Product-Box.png", "Glow-Product-Box-3.png", "Glow-Product-Box-4.png"],
    "antheara": ["Antheara-Product-Box.png", "Antheara-Product-Box-2.png", "Antheara-Product-Box-3.png", "Antheara-Product-Box-4.png"],
    "hestia": ["Hestia-1.png", "Hestia-6.png", "Hestia-5.png"],
    "arctic": ["Product-Black-box.png", "Product-Black-box-3.png", "Product-Black-Box-4.png", "Product-Black-box-2.png"],
    "sage-bloom": ["Skin-Product-Box-2.png", "Skin-Product-box.png", "Skin-Product-Box-3.png", "Skin-Product-Box-4.png"],
    # paper bags
    "b-boutique": ["B-Paper-Bag.png", "B-paper-bag-2.png", "B-paper-bag-4.png", "B-paper-bag-5.png"],
    "still": ["still-paper-bag.png", "Still-Paper-Bag-3.png", "Still-Paper-bag-4.png"],
    "nuda": ["Nuda-Paper-Bags.png", "Nuda-Paper-Bags-2.png", "Nuda-Paper-Bags-3.png"],
    "lani-bespoke": ["Lani-Paper-Bag.png", "Lani-Paper-Bag-2.png", "Lani-Bag-3.png"],
    "zealot": ["Zeout-paper-bag.png", "Zeout-paper-bag-2.png", "Zeout-paper-bag-3.png"],
    "moda": ["Moda-Paper-bag.png", "Moda-Paper-bag-2.png", "Moda-Paper-bag-3.png"],
    "quynh-nga": ["Jewellery-Paper-Bag.png", "Jewelley-Paper-Bag-2.png", "Jewelley-Paper-Bag-4.png"],
    "paloma": ["Paloma-Paper-bag-2.png", "Paloma-Paper-bag.png", "Paloma-Paper-bag-3.png", "Paloma-Paper-bag-4.png"],
    "origami-kraft": ["Restro-Paper-Bag.png", "Paper-Bag-Restro.png", "Paper-Bag-Restro-1.png"],
    "chilis-kraft": ["Chills-Paper-Bag-2.png", "Chills-Paper-Bag.png", "Chills-Paper-Bag-3.png", "Chills-Paper-Bag-4.png"],
    # books
    "signature-dishes": ["Books-2.png", "Books-3.png"],
    "deeniyat-workbook": ["Books-Deeniyat.png", "Books-Deeniyat-2.png"],
    "deeniyat-amma": ["Deeniyat-Book-3.png", "Deeniyat-Book.png", "Deeniyat-Book-2.png"],
    "corporate-brochure": ["Info-Book.png", "info-book-3.png", "info-book-1.png"],
    "technical-brochure": ["Task-Book.png", "Task-Book-2.png", "Task-Book-3.png", "Task-Book-4.png"],
    "deeniyat-course": ["Diary.png", "Diary-3.png", "Diary-2.png", "Diary-4.png"],
    "deeniyat-daily": ["Notebook.png", "Notebook-3.png", "Notebook-2.png", "Notebook-4.png"],
}

def save(im, path, w):
    im = im.copy()
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(path, "WEBP", quality=82, method=6)

n = 0
for slug, files in PROJECTS.items():
    for i, f in enumerate(files, 1):
        src = os.path.join(RAW, P + f)
        im = Image.open(src).convert("RGB")
        save(im, os.path.join(OUT, f"{slug}-{i}.webp"), 1400)
        save(im, os.path.join(OUT, f"{slug}-{i}-sm.webp"), 640)
        n += 1
print("converted", n, "images for", len(PROJECTS), "projects")

# brand
brand = os.path.join(OUT, "..", "brand"); os.makedirs(brand, exist_ok=True)
logo = Image.open(os.path.join(RAW, "2026_03_logo-updated.png")).convert("RGBA")
bbox = logo.getbbox(); logo = logo.crop(bbox)
logo.save(os.path.join(brand, "logo.png"))
# white version for dark surfaces: keep alpha, paint every visible pixel white
white = Image.new("RGBA", logo.size, (255, 255, 255, 0)); white.putalpha(logo.getchannel("A"))
white.save(os.path.join(brand, "logo-white.png"))
print("logo", logo.size, logo.mode)
fav = Image.open(os.path.join(RAW, "2026_03_cropped-favicon-new.png")).convert("RGBA")
fav.resize((180, 180), Image.LANCZOS).save(os.path.join(OUT, "..", "apple-touch-icon.png"))
fav.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT, "..", "icon-512.png"))
fav.save(os.path.join(OUT, "..", "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
# client logos (from the testimonials section of printfix.co.in)
cl = os.path.join(OUT, "..", "clients"); os.makedirs(cl, exist_ok=True)
for name, f in [("vero-forza", "WhatsApp-Image-2026-04-13-at-15.24.47.jpeg"), ("rn-kids", "WhatsApp-Image-2026-04-13-at-15.25.09.jpeg"),
                ("leben", "WhatsApp-Image-2026-04-13-at-15.24.55.jpeg"), ("birra", "WhatsApp-Image-2026-04-13-at-15.25.18.jpeg"),
                ("deeniyat", "WhatsApp-Image-2026-04-13-at-15.24.40.jpeg")]:
    im = Image.open(os.path.join(RAW, P + f)).convert("RGB"); im.save(os.path.join(cl, name + ".png"))
    print(name, im.size)

# trim the client logos to their content (the originals carry large empty margins)
from PIL import ImageChops
for name in ["vero-forza", "rn-kids", "leben", "birra", "deeniyat"]:
    p = os.path.join(cl, name + ".png"); im = Image.open(p).convert("RGB")
    bg = Image.new("RGB", im.size, im.getpixel((2, 2)))
    bb = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 24 else 0).getbbox()
    if bb:
        pad = int(max(bb[2] - bb[0], bb[3] - bb[1]) * 0.06)
        im = im.crop((max(0, bb[0] - pad), max(0, bb[1] - pad), min(im.width, bb[2] + pad), min(im.height, bb[3] + pad)))
    if im.width > 600:
        im = im.resize((600, round(im.height * 600 / im.width)), Image.LANCZOS)
    im.save(p)
