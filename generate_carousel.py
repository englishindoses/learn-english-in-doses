from PIL import Image, ImageDraw, ImageFont
import cairosvg
import io
import os

W, H = 1080, 1350

# Brand colours
NAVY       = (27, 38, 59)
TEAL       = (38, 166, 154)
TEAL_LIGHT = (224, 245, 240)
ORANGE     = (240, 125, 62)
WHITE      = (255, 255, 255)
OFF_WHITE  = (248, 249, 250)
DARK_TEXT  = (51, 51, 51)
GRAY_TEXT  = (108, 117, 125)
BLUE       = (52, 152, 219)
BLUE_BG    = (232, 244, 253)
GREEN      = (76, 175, 80)

FONTS = {
    'heading':    '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
    'body':       '/usr/share/fonts/truetype/open-sans/OpenSans-Regular.ttf',
    'semibold':   '/usr/share/fonts/truetype/open-sans/OpenSans-Semibold.ttf',
    'bold':       '/usr/share/fonts/truetype/open-sans/OpenSans-Bold.ttf',
    'italic':     '/usr/share/fonts/truetype/open-sans/OpenSans-Italic.ttf',
}

REPO   = '/home/user/learn-english-in-doses'
OUT    = f'{REPO}/instagram-posts'
os.makedirs(OUT, exist_ok=True)

def font(key, size):
    return ImageFont.truetype(FONTS[key], size)

def tw(text, f):
    bb = f.getbbox(text)
    return bb[2] - bb[0]

def th(text, f):
    bb = f.getbbox(text)
    return bb[3] - bb[1]

def wrap(text, f, max_w):
    words = text.split()
    lines, cur = [], []
    for w in words:
        test = ' '.join(cur + [w])
        if f.getbbox(test)[2] <= max_w:
            cur.append(w)
        else:
            if cur:
                lines.append(' '.join(cur))
            cur = [w]
    if cur:
        lines.append(' '.join(cur))
    return lines

def gradient(img, c1, c2):
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

def pill(draw, text, x, y, bg, fg, size=22):
    f = font('semibold', size)
    bb = f.getbbox(text)
    pw, ph = bb[2] - bb[0], bb[3] - bb[1]
    ph_pad, pv_pad = 16, 9
    bw, bh = pw + ph_pad * 2, ph + pv_pad * 2
    draw.rounded_rectangle([x, y, x + bw, y + bh], radius=bh // 2, fill=bg)
    draw.text((x + ph_pad, y + pv_pad - bb[1]), text, font=f, fill=fg)
    return bw, bh

def load_logo():
    try:
        data = cairosvg.svg2png(url=f'{REPO}/images/my-logo-transp.svg',
                                output_width=70, output_height=70)
        return Image.open(io.BytesIO(data)).convert('RGBA')
    except Exception as e:
        print(f'Logo: {e}')
        return None

def header(img, draw, logo, slide_num=None, total=None, bg=TEAL):
    H_H = 95
    draw.rectangle([0, 0, W, H_H], fill=bg)
    x = 24
    if logo:
        lc = logo.copy()
        lc.thumbnail((62, 62), Image.LANCZOS)
        img.paste(lc, (x, 17), lc)
        x += 74
    f = font('semibold', 22)
    draw.text((x, 35), 'English in Doses', font=f, fill=WHITE)
    if slide_num and total:
        fc = font('body', 20)
        txt = f'{slide_num} / {total}'
        draw.text((W - 24 - tw(txt, fc), 37), txt, font=fc, fill=(220, 220, 220))

def footer(draw, bg=NAVY):
    F_H = 68
    draw.rectangle([0, H - F_H, W, H], fill=bg)
    f = font('body', 22)
    url = 'englishindoses.com'
    uw = tw(url, f)
    draw.text(((W - uw) // 2, H - F_H + 22), url, font=f, fill=WHITE)

def accent_box(draw, x, y, w, h, label, label_color, box_bg, border_color, radius=12):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=box_bg)
    draw.rectangle([x, y, x + 5, y + h], fill=border_color)
    lf = font('semibold', 18)
    draw.text((x + 20, y + 12), label, font=lf, fill=label_color)

# ── SLIDE 1: COVER ──────────────────────────────────────────────────────────

def slide_cover(logo):
    img = Image.new('RGB', (W, H))
    gradient(img, NAVY, TEAL)
    draw = ImageDraw.Draw(img)
    header(img, draw, logo, bg=NAVY)
    footer(draw, bg=(20, 25, 40))

    # Travel badge
    pill(draw, '✈  TRAVEL ENGLISH', 50, 155, ORANGE, WHITE, 22)

    # Title
    tf = font('heading', 76)
    for i, line in enumerate(['Essential Airport', 'Vocabulary']):
        lw = tw(line, tf)
        draw.text(((W - lw) // 2, 230 + i * 90), line, font=tf, fill=WHITE)

    # Subtitle
    sf = font('body', 32)
    sub = '5 words every traveller needs to know'
    draw.text(((W - tw(sub, sf)) // 2, 418), sub, font=sf, fill=(230, 230, 230))

    # Beginner pill
    bw, bh = pill(draw, '● BEGINNER', (W - 160) // 2, 476, GREEN, WHITE, 24)

    # Passport image
    try:
        pi = Image.open(f'{REPO}/images/travel-beginner/unit1/lesson1/passport.png').convert('RGBA')
        pi.thumbnail((360, 360), Image.LANCZOS)
        pw, ph = pi.size
        px = (W - pw) // 2
        py = 560
        # Soft white circle behind image
        circle = Image.new('RGBA', (pw + 60, ph + 60), (0, 0, 0, 0))
        cd = ImageDraw.Draw(circle)
        cd.ellipse([0, 0, pw + 59, ph + 59], fill=(255, 255, 255, 30))
        img.paste(circle, (px - 30, py - 30), circle)
        img.paste(pi, (px, py), pi)
    except Exception as e:
        print(f'Cover image: {e}')

    # Bottom tagline above footer
    tf2 = font('italic', 26)
    tag = 'Swipe to learn each word →'
    draw.text(((W - tw(tag, tf2)) // 2, H - 110), tag, font=tf2, fill=(200, 200, 200))

    return img

# ── SLIDES 2–5: VOCAB ────────────────────────────────────────────────────────

VOCAB = [
    {
        'word': 'Boarding Pass',
        'phonetic': '/ˈbɔːrdɪŋ pæs/',
        'pos': 'NOUN',
        'definition': 'The document (paper or digital) that confirms your seat and lets you board your flight.',
        'example': '"Please have your boarding pass ready to scan at the gate."',
        'image': f'{REPO}/images/travel-beginner/unit1/lesson1/boarding-pass.png',
    },
    {
        'word': 'Check-in Counter',
        'phonetic': '/ˈtʃɛk ɪn ˈkaʊntər/',
        'pos': 'NOUN',
        'definition': 'The desk at the airport where you register for your flight, drop off luggage, and get your boarding pass.',
        'example': '"Go to the check-in counter at least 2 hours before your flight."',
        'image': f'{REPO}/images/travel-beginner/unit1/lesson1/check-in-counter.png',
    },
    {
        'word': 'Departure Gate',
        'phonetic': '/dɪˈpɑːrtʃər ɡeɪt/',
        'pos': 'NOUN',
        'definition': 'The specific door in the airport terminal from which passengers board their flight.',
        'example': '"Your flight departs from gate B12 — please arrive 30 minutes early."',
        'image': f'{REPO}/images/travel-beginner/unit1/lesson1/gate.png',
    },
    {
        'word': 'Passport Control',
        'phonetic': '/ˈpæspɔːrt kənˈtroʊl/',
        'pos': 'NOUN',
        'definition': 'The area where an officer checks your passport and visa when you enter or leave a country.',
        'example': '"You must pass through passport control before collecting your luggage."',
        'image': f'{REPO}/images/travel-beginner/unit1/lesson3/passport-control.png',
    },
]

def slide_vocab(data, slide_num, total, logo):
    img = Image.new('RGB', (W, H), OFF_WHITE)
    draw = ImageDraw.Draw(img)
    header(img, draw, logo, slide_num=slide_num, total=total, bg=TEAL)
    footer(draw)

    PAD = 50
    y = 115

    # Word number badge + POS badge on same row
    bw1, bh1 = pill(draw, f'WORD {slide_num - 1} OF 4', PAD, y, TEAL, WHITE, 20)
    pill(draw, data['pos'], PAD + bw1 + 14, y, TEAL_LIGHT, TEAL, 20)
    y += bh1 + 18

    # Word
    wf = font('heading', 60)
    draw.text((PAD, y), data['word'], font=wf, fill=NAVY)
    y += 72

    # Phonetic
    pf = font('italic', 26)
    draw.text((PAD, y), data['phonetic'], font=pf, fill=GRAY_TEXT)
    y += 40

    # Divider
    draw.line([(PAD, y), (W - PAD, y)], fill=(210, 210, 210), width=2)
    y += 20

    # Definition box
    df = font('body', 27)
    d_lines = wrap(data['definition'], df, W - PAD * 2 - 30)
    d_box_h = len(d_lines) * 36 + 50
    accent_box(draw, PAD, y, W - PAD * 2, d_box_h, 'DEFINITION', TEAL, WHITE, TEAL)
    ty = y + 38
    for line in d_lines:
        draw.text((PAD + 20, ty), line, font=df, fill=DARK_TEXT)
        ty += 36
    y += d_box_h + 16

    # Example box
    ef = font('italic', 26)
    e_lines = wrap(data['example'], ef, W - PAD * 2 - 30)
    e_box_h = len(e_lines) * 34 + 50
    accent_box(draw, PAD, y, W - PAD * 2, e_box_h, 'EXAMPLE', BLUE, BLUE_BG, BLUE)
    ty = y + 38
    for line in e_lines:
        draw.text((PAD + 20, ty), line, font=ef, fill=DARK_TEXT)
        ty += 34
    y += e_box_h + 20

    # Vocab image — centred in remaining space
    remaining = (H - 68) - y
    try:
        vi = Image.open(data['image']).convert('RGBA')
        max_size = min(remaining - 20, 320)
        vi.thumbnail((max_size, max_size), Image.LANCZOS)
        vw, vh = vi.size
        vx = (W - vw) // 2
        vy = y + max(10, (remaining - vh) // 2)
        img.paste(vi, (vx, vy), vi)
    except Exception as e:
        print(f'Vocab image: {e}')

    return img

# ── SLIDE 6: CTA ─────────────────────────────────────────────────────────────

def slide_cta(logo):
    img = Image.new('RGB', (W, H), ORANGE)
    draw = ImageDraw.Draw(img)

    # Soft circle accent
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    od.ellipse([-150, 400, W + 150, H + 150], fill=(255, 255, 255, 18))
    img.paste(ov, (0, 0), ov)

    # Logo + brand name
    x = 30
    if logo:
        lc = logo.copy()
        lc.thumbnail((70, 70), Image.LANCZOS)
        img.paste(lc, (x, 30), lc)
        x += 82
    draw.text((x, 48), 'English in Doses', font=font('semibold', 24), fill=WHITE)

    # Headline
    hf = font('heading', 66)
    for i, line in enumerate(['Follow us for', 'more Travel', 'English tips! ✈']):
        lw = tw(line, hf)
        draw.text(((W - lw) // 2, 260 + i * 82), line, font=hf, fill=WHITE)

    # Sub-copy
    y = 530
    sf = font('body', 30)
    for line in ['Save this post to study later 📌',
                 'Share it with a friend learning English 🌍']:
        lw = tw(line, sf)
        draw.text(((W - lw) // 2, y), line, font=sf, fill=(255, 255, 255))
        y += 44

    # White pill CTA button
    y += 36
    bf = font('semibold', 30)
    btn = 'englishindoses.com'
    btw = tw(btn, bf) + 64
    bx = (W - btw) // 2
    draw.rounded_rectangle([bx, y, bx + btw, y + 60], radius=30, fill=WHITE)
    draw.text((bx + 32, y + 14), btn, font=bf, fill=ORANGE)

    # Hashtag footer strip
    draw.rectangle([0, H - 68, W, H], fill=(200, 88, 28))
    tags = '#TravelEnglish  #LearnEnglish  #EnglishInDoses'
    tf = font('body', 22)
    draw.text(((W - tw(tags, tf)) // 2, H - 47), tags, font=tf, fill=WHITE)

    return img

# ── GENERATE ─────────────────────────────────────────────────────────────────

logo = load_logo()
total = len(VOCAB) + 1   # content slides (cover counts as 1 of the numbered set)

paths = []

print('Generating slide 1 (cover)...')
s = slide_cover(logo)
p = f'{OUT}/slide_01_cover.png'
s.save(p)
paths.append(p)

for i, data in enumerate(VOCAB):
    sn = i + 2
    print(f'Generating slide {sn} ({data["word"]})...')
    s = slide_vocab(data, sn, total + 1, logo)
    p = f'{OUT}/slide_0{sn}.png'
    s.save(p)
    paths.append(p)

print('Generating CTA slide...')
s = slide_cta(logo)
p = f'{OUT}/slide_06_cta.png'
s.save(p)
paths.append(p)

print('\nDone! Files saved:')
for p in paths:
    print(f'  {p}')
