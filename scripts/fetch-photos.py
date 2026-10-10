#!/usr/bin/env python3
"""Download reference photos once and store compressed copies in public/photos/.

Order per fragrance: the main Fragella photo, then the external fallback. The
auto-cut "transparent" version is never used (it drops boxes and light bottles).
Raw downloads are cached in data/photos/raw/ so reruns only fetch what is missing.
Output: public/photos/<numeric id>.webp + src/data/photos.json (fragranceId -> file).
"""
import io, json, os, subprocess, time
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'data/photos/raw')
OUT = os.path.join(ROOT, 'public/photos')
MAX_SIDE, QUALITY = 640, 82
os.makedirs(RAW, exist_ok=True); os.makedirs(OUT, exist_ok=True)

details = json.load(open(os.path.join(ROOT, 'src/data/fragella.json')))
ids = json.load(open(os.path.join(ROOT, 'src/data/ids.json')))
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'

def fetch(url):
    """curl rather than urllib: the system Python's SSL cannot negotiate TLS with CloudFront."""
    for attempt in range(3):
        r = subprocess.run(['curl', '-sSL', '--fail', '--max-time', '40', '-A', UA, '-H', 'Accept: image/*,*/*;q=0.8', url], capture_output=True)
        data = r.stdout
        if r.returncode == 0 and data and data[:1] != b'<':
            return data
        time.sleep(1.5 * (attempt + 1))
    return None

def process(key):
    d = details[key]; num = ids.get(key)
    if num is None: return key, 'no-id', None
    raw_path = os.path.join(RAW, f'{num}.img'); src_path = os.path.join(RAW, f'{num}.src')
    if not os.path.exists(raw_path):
        for label, url in (('main', d.get('image')), ('fallback', d.get('imageFallback'))):
            if not url: continue
            data = fetch(url)
            if data:
                open(raw_path, 'wb').write(data); open(src_path, 'w').write(f'{label} {url}')
                break
        else:
            return key, 'missing', None
    source = open(src_path).read().split(' ', 1)[0] if os.path.exists(src_path) else '?'
    out = os.path.join(OUT, f'{num}.webp')
    if not os.path.exists(out):
        try:
            im = Image.open(io.BytesIO(open(raw_path, 'rb').read()))
            im = ImageOps.exif_transpose(im)
            if im.mode in ('RGBA', 'LA', 'P'):
                bg = Image.new('RGB', im.size, (255, 255, 255)); bg.paste(im.convert('RGBA'), mask=im.convert('RGBA').split()[-1]); im = bg
            else:
                im = im.convert('RGB')
            im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
            im.save(out, 'WEBP', quality=QUALITY, method=6)
        except Exception as e:  # noqa: BLE001
            return key, f'bad-image {e}', None
    return key, source, f'{num}.webp'

keys = [k for k in details if details[k].get('image') or details[k].get('imageFallback')]
mapping, report = {}, {}
with ThreadPoolExecutor(max_workers=6) as ex:
    for key, status, fname in ex.map(process, keys):
        report.setdefault(status.split(' ')[0], []).append(key)
        if fname: mapping[key] = fname
json.dump(dict(sorted(mapping.items())), open(os.path.join(ROOT, 'src/data/photos.json'), 'w'), ensure_ascii=False, indent=0)
total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
print(f'photos: {len(mapping)} files, {total/1e6:.1f} MB in public/photos')
for status, ks in report.items():
    if status != 'main': print(f'{status}: {len(ks)}', *ks, sep='\n  ')
