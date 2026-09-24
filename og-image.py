"""Draws static/og.png, the site's share and Article image (1200x630).

Language-neutral on purpose: every page in every language uses it, so the only words are the
brand, the domain and marketplace names. Run after adding a marketplace:  python og-image.py
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
FONTS = 'C:/Windows/Fonts/'
semibold = lambda s: ImageFont.truetype(FONTS + 'seguisb.ttf', s)
regular = lambda s: ImageFont.truetype(FONTS + 'segoeui.ttf', s)

ACCENT = (47, 91, 208)
DEEP = (22, 44, 110)
WHITE = (255, 255, 255)
SOFT = (208, 220, 250)

img = Image.new('RGB', (W, H), DEEP)
d = ImageDraw.Draw(img)

# vertical gradient, deep navy to brand blue
for y in range(H):
    t = y / (H - 1)
    d.line([(0, y), (W, y)], fill=tuple(round(DEEP[i] + (ACCENT[i] - DEEP[i]) * t) for i in range(3)))

# logo mark: the same rounded square and rising line as the site header
x0, y0, s = 80, 92, 96
d.rounded_rectangle([x0, y0, x0 + s, y0 + s], radius=24, fill=WHITE)
k = s / 24
pts = [(7, 15.5), (10.2, 11), (12.8, 13.6), (17, 8)]
d.line([(x0 + px * k, y0 + py * k) for px, py in pts], fill=ACCENT, width=round(2.2 * k), joint='curve')
cx, cy, r = x0 + 17 * k, y0 + 8 * k, 1.9 * k
d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ACCENT)

d.text((x0 + s + 28, y0 - 6), 'MarketFee', font=semibold(84), fill=WHITE)
d.text((x0 + s + 32, y0 + 88), 'marketfee.org', font=regular(32), fill=SOFT)

# the idea in one picture: a sale price bar split into fees, cost and what is left
bx, by, bw, bh = 80, 300, 1040, 78
d.rounded_rectangle([bx, by, bx + bw, by + bh], radius=16, fill=(255, 255, 255, 0), outline=SOFT, width=2)
segments = [(0.14, (242, 104, 96)), (0.46, (148, 170, 230)), (0.40, (66, 201, 140))]
x = bx + 6
for frac, col in segments:
    w = (bw - 12) * frac
    d.rounded_rectangle([x, by + 6, x + w - 6, by + bh - 6], radius=11, fill=col)
    x += w
label = semibold(36)
for (frac, col), text, start in zip(segments, ['−%', '', '+'], [0, 0.14, 0.60]):
    if not text:
        continue
    tx = bx + 6 + (bw - 12) * start + (bw - 12) * frac / 2
    tw = d.textlength(text, font=label)
    d.text((tx - tw / 2, by + bh / 2 - 26), text, font=label, fill=WHITE)

# marketplaces covered, as plain names
names = 'Coupang · Naver SmartStore · 11st · Gmarket · Rakuten · Yahoo! Shopping'
names2 = 'Qoo10 · Kaufland · OTTO · Cdiscount · Fnac · bol · TikTok Shop'
f = regular(30)
for line in (names, names2):
    assert d.textlength(line, font=f) <= W - 160, line  # keep the 80px margin on both sides
d.text((80, 440), names, font=f, fill=WHITE)
d.text((80, 486), names2, font=f, fill=WHITE)

img.save('static/og.png', optimize=True)
print('static/og.png', img.size)
