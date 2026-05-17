from PIL import Image, ImageDraw, ImageFont
import cairosvg
import io
import os

W, H = 1080, 1350

NAVY       = (27, 38, 59)
TEAL       = (38, 166, 154)
TEAL_DARK  = (28, 126, 116)
ORANGE     = (240, 125, 62)
WHITE      = (255, 255, 255)
OFF_WHITE  = (250, 250, 252)
DARK_TEXT  = (30, 30, 40)
GRAY_TEXT  = (130, 130, 145)
GREEN      = (76, 175, 80)
LIGHT_GRAY = (230, 230, 235)

FONTS = {
    'heading': '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
    'body':    '/usr/share/fonts/truetype/open-sans/OpenSans-Regular.ttf',
    'semi':    '/usr/share/fonts/truetype/open-sans/OpenSans-Semibold.ttf',
    'bold':    '/usr/share/fonts/truetype/open-sans/OpenSans-Bold.ttf',
    'italic':  '/usr/share/fonts/truetype/open-sans/OpenSans-Italic.ttf',
}

REPO = '/home/user/learn-english-in-doses'
OUT  = f'{REPO}/instagram-posts'
os.makedirs(OUT, exist_ok=True)

def f(key, size):
    return ImageFont.truetype(FONTS[key], size)

def twidth(text, font):
    bb = font.getbbox(text)
    return bb[2] - bb[0]

def theight(text, font):
    bb = font.getbbox(text)
    return bb[3] - bb[1]

def wrap(text, font, max_w):
    words = text.split()
    lines, cur = [], []
    for word in words:
        test = ' '.join(cur + [word])
        if font.getbbox(test)[2] <= max_w:
            cur.append(word)
        else:
            if cur:
                lines.append(' '.join(cur))
            cur = [word]
    if cur:
        lines.append(' '.join(cur))
    return lines

def load_logo(size=56):
    try:
        data = cairosvg.svg2png(url=f'{REPO}/images/my-logo-transp.svg',
                                output_width=size, output_height=size)
        return Image.open(io.BytesIO(data)).convert('RGBA')
    except:
        return None

def stamp_logo(img, logo, x, y):
    if not logo:
        return
    lc = logo.copy()
    img.paste(lc, (x, y), lc)

def pill(draw, text, cx, y, bg, fg, size=22):
    """Draw a centred pill badge, return height."""
    font = f('semi', size)
    bb = font.getbbox(text)
    pw, ph = bb[2] - bb[0], bb[3] - bb[1]
    pad_h, pad_v = 20, 10
    bw, bh = pw + pad_h * 2, ph + pad_v * 2
    x = cx - bw // 2
    draw.rounded_rectangle([x, y, x + bw, y + bh], radius=bh // 2, fill=bg)
    draw.text((x + pad_h, y + pad_v - bb[1]), text, font=font, fill=fg)
    return bh


# ── SLIDE 1: COVER ───────────────────────────────────────────────────────────
#
#  Full deep-navy background.
#  Large ✈ symbol.  Bold white headline. Teal accent bar.
#  Pill badges.  Subtle logo watermark top-left.

def slide_cover(logo):
    img = Image.new('RGB', (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    # Subtle teal glow circle bottom-right
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([600, 800, 1400, 1600], fill=(*TEAL, 35))
    img.paste(glow, (0, 0), glow)

    # Small logo + brand watermark – top left
    if logo:
        stamp_logo(img, logo, 36, 36)
    draw.text((104, 52), 'English in Doses', font=f('semi', 22), fill=(180, 180, 200))

    # Large plane emoji area — use a big Unicode char rendered with DejaVu
    plane_font = ImageFont.truetype(
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 130)
    plane = '✈'
    pw = twidth(plane, plane_font)
    draw.text(((W - pw) // 2, 180), plane, font=plane_font, fill=TEAL)

    # Main headline
    hf = f('heading', 80)
    lines = ['5 Words You NEED', 'at the Airport']
    y = 360
    for line in lines:
        lw = twidth(line, hf)
        draw.text(((W - lw) // 2, y), line, font=hf, fill=WHITE)
        y += 96

    # Teal accent bar under headline
    bar_w, bar_h = 220, 7
    draw.rounded_rectangle(
        [(W - bar_w) // 2, y + 10, (W + bar_w) // 2, y + 10 + bar_h],
        radius=4, fill=TEAL)

    y += 56

    # Pill badges row
    bh1 = pill(draw, '✈  TRAVEL ENGLISH', W // 2 - 140, y, TEAL, WHITE, 22)
    pill(draw, 'BEGINNER', W // 2 + 55, y, GREEN, WHITE, 22)

    y += bh1 + 60

    # Passport hero image
    try:
        pi = Image.open(
            f'{REPO}/images/travel-beginner/unit1/lesson1/passport.png'
        ).convert('RGBA')
        pi.thumbnail((420, 420), Image.LANCZOS)
        pw2, ph2 = pi.size
        img.paste(pi, ((W - pw2) // 2, y), pi)
        y += ph2 + 40
    except Exception as e:
        print(f'Cover image: {e}')

    # Swipe prompt — bottom
    sf = f('italic', 28)
    swipe = 'Swipe to learn each word  →'
    draw.text(((W - twidth(swipe, sf)) // 2, H - 90), swipe,
              font=sf, fill=(160, 160, 180))

    return img


# ── SLIDES 2–5: VOCAB ────────────────────────────────────────────────────────
#
#  Two-tone split:
#    TOP  55% — solid teal, big vocabulary illustration centred
#    BOTTOM 45% — off-white, word in huge navy, definition, example
#
#  No header bar, no footer bar, no labeled boxes.
#  Counter is a tiny subtle label top-left of the teal zone.
#  Logo is a small watermark top-right of the teal zone.

SPLIT = 740   # px where teal ends and white begins

def slide_vocab(data, slide_num, total_words, logo):
    img = Image.new('RGB', (W, H), OFF_WHITE)
    draw = ImageDraw.Draw(img)

    # ── TOP zone: teal ──
    draw.rectangle([0, 0, W, SPLIT], fill=TEAL)

    # Slide counter – top left
    cf = f('semi', 24)
    counter = f'0{slide_num - 1} / 0{total_words}'
    draw.text((36, 36), counter, font=cf, fill=(255, 255, 255))

    # Logo watermark – top right
    if logo:
        lc = logo.copy()
        lc.thumbnail((52, 52), Image.LANCZOS)
        img.paste(lc, (W - 88, 24), lc)

    # Vocabulary illustration — centred in the teal zone
    try:
        vi = Image.open(data['image']).convert('RGBA')
        max_dim = 440
        vi.thumbnail((max_dim, max_dim), Image.LANCZOS)
        vw, vh = vi.size
        vx = (W - vw) // 2
        # centre vertically within teal zone, with a bit more top padding
        vy = 80 + (SPLIT - 80 - vh) // 2
        img.paste(vi, (vx, vy), vi)
    except Exception as e:
        print(f'Vocab image: {e}')

    # ── BOTTOM zone: off-white ──
    # Starts at SPLIT

    PAD = 52
    y = SPLIT + 42

    # WORD — big, bold, navy
    wf = f('heading', 64)
    # If word is long, reduce size
    while twidth(data['word'], wf) > W - PAD * 2 and wf.size > 40:
        wf = f('heading', wf.size - 4)

    draw.text((PAD, y), data['word'], font=wf, fill=NAVY)
    y += theight(data['word'], wf) + 6

    # Teal underline accent
    underline_w = min(twidth(data['word'], wf), 300)
    draw.rounded_rectangle([PAD, y, PAD + underline_w, y + 6], radius=3, fill=TEAL)
    y += 30

    # Definition — clean, no box, no label
    df = f('body', 28)
    d_lines = wrap(data['definition'], df, W - PAD * 2)
    for line in d_lines:
        draw.text((PAD, y), line, font=df, fill=DARK_TEXT)
        y += 36
    y += 12

    # Thin separator
    draw.line([(PAD, y), (W - PAD, y)], fill=LIGHT_GRAY, width=2)
    y += 20

    # Example sentence — teal italic, no box
    ef = f('italic', 26)
    e_lines = wrap(data['example'], ef, W - PAD * 2)
    for line in e_lines:
        draw.text((PAD, y), line, font=ef, fill=TEAL_DARK)
        y += 34
    y += 16

    # Brand URL — very subtle, bottom of white zone
    uf = f('body', 20)
    url = 'englishindoses.com'
    draw.text(((W - twidth(url, uf)) // 2, H - 50), url,
              font=uf, fill=GRAY_TEXT)

    return img


# ── SLIDE 6: CTA ─────────────────────────────────────────────────────────────
#
#  Full orange.  Action list with icons.  White pill button.
#  No header/footer bars.

def slide_cta(logo):
    img = Image.new('RGB', (W, H), ORANGE)
    draw = ImageDraw.Draw(img)

    # Soft white ellipse for depth
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    od.ellipse([-200, H // 2, W + 200, H + 400], fill=(255, 255, 255, 20))
    img.paste(ov, (0, 0), ov)

    # Logo + brand name – subtle top-left
    x = 36
    if logo:
        lc = logo.copy()
        lc.thumbnail((56, 56), Image.LANCZOS)
        img.paste(lc, (x, 34), lc)
        x += 70
    draw.text((x, 50), 'English in Doses', font=f('semi', 22),
              fill=(255, 255, 255))

    y = 180

    # Question hook
    qf = f('italic', 32)
    q = 'Did you find this useful?'
    draw.text(((W - twidth(q, qf)) // 2, y), q, font=qf, fill=(255, 255, 255))
    y += 70

    # Big headline
    hf = f('heading', 70)
    for line in ['Save it.', 'Share it.', 'Follow us.']:
        lw = twidth(line, hf)
        draw.text(((W - lw) // 2, y), line, font=hf, fill=WHITE)
        y += 86

    y += 20

    # Action list
    dj = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 34)
    af = f('body', 30)
    actions = [
        ('💙', 'Like this post'),
        ('🔖', 'Save it to practise later'),
        ('👤', 'Follow for weekly vocabulary'),
    ]
    for icon, text in actions:
        iw = twidth(icon, dj)
        draw.text((120, y), icon, font=dj, fill=WHITE)
        draw.text((120 + iw + 18, y + 4), text, font=af, fill=WHITE)
        y += 50

    y += 30

    # White pill button
    bf = f('semi', 30)
    btn = 'englishindoses.com'
    btw = twidth(btn, bf) + 64
    bx = (W - btw) // 2
    draw.rounded_rectangle([bx, y, bx + btw, y + 62], radius=31, fill=WHITE)
    draw.text((bx + 32, y + 15), btn, font=bf, fill=ORANGE)

    return img


# ── GENERATE ALL SLIDES ──────────────────────────────────────────────────────

VOCAB = [
    {
        'word': 'Boarding Pass',
        'definition': 'The document that confirms your seat and lets you board the plane.',
        'example': '"Please have your boarding pass ready to scan at the gate."',
        'image': f'{REPO}/images/travel-beginner/unit1/lesson1/boarding-pass.png',
    },
    {
        'word': 'Check-in Counter',
        'definition': 'The desk where you register for your flight and drop off your luggage.',
        'example': '"Go to the check-in counter at least 2 hours before your flight."',
        'image': f'{REPO}/images/travel-beginner/unit1/lesson1/check-in-counter.png',
    },
    {
        'word': 'Departure Gate',
        'definition': 'The door in the terminal where passengers board their flight.',
        'example': '"Your flight departs from gate B12 — arrive 30 minutes early."',
        'image': f'{REPO}/images/travel-beginner/unit1/lesson1/gate.png',
    },
    {
        'word': 'Passport Control',
        'definition': 'The area where an officer checks your passport before you enter a country.',
        'example': '"You must pass through passport control before collecting your luggage."',
        'image': f'{REPO}/images/travel-beginner/unit1/lesson3/passport-control.png',
    },
]

logo = load_logo()
paths = []

print('Slide 1 — cover...')
s = slide_cover(logo)
p = f'{OUT}/slide_01_cover.png'
s.save(p)
paths.append(p)

for i, data in enumerate(VOCAB):
    sn = i + 2
    print(f'Slide {sn} — {data["word"]}...')
    s = slide_vocab(data, sn, len(VOCAB), logo)
    p = f'{OUT}/slide_0{sn}.png'
    s.save(p)
    paths.append(p)

print('Slide 6 — CTA...')
s = slide_cta(logo)
p = f'{OUT}/slide_06_cta.png'
s.save(p)
paths.append(p)

print('\nAll done:')
for p in paths:
    print(f'  {p}')
