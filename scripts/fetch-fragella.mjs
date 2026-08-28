// One-off enrichment: pulls fragrance details from Fragella for every item in src/data/catalog.json.
// Raw API responses are cached in data/fragella/raw/ so re-runs never spend quota on the same request.
// Usage: node scripts/fetch-fragella.mjs [--dry]   (reads FRAGELLA_API_KEY from .env)
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const RAW = resolve(ROOT, 'data/fragella/raw');
const OUT = resolve(ROOT, 'src/data/fragella.json');
const API = 'https://api.fragella.com/api/v1';
const DRY = process.argv.includes('--dry');
mkdirSync(RAW, { recursive: true });

const env = Object.fromEntries(readFileSync(resolve(ROOT, '.env'), 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => l.split('=').map((s) => s.trim())));
const KEY = env.FRAGELLA_API_KEY;
if (!KEY) throw new Error('FRAGELLA_API_KEY missing in .env');

/** Our brand name -> name Fragella knows (only where they differ). */
const BRAND_ALIAS = {
  'Christian Dior': 'Dior', 'Chloé': 'Chloe', 'Hermès': 'Hermes', 'Lancôme': 'Lancome', 'Kilian': 'By Kilian',
  'Alexandre.J': 'Alexandre.J', 'Escentric Molecules': 'Escentric Molecules', 'Mercedes-Benz': 'Mercedes-Benz',
  'Marc-Antoine Barrois': 'Marc-Antoine Barrois', 'Alfred Dunhill': 'Dunhill', 'Paco Rabanne': 'Rabanne',
};
const SKIP_BRANDS = new Set(['Авторские']);

/** Manual picks: our id -> exact Fragella Name (resolved from the local raw cache, costs no requests). */
const OVERRIDES = {
  'carolina-herrera--chic-for-men--male': 'Chic', 'chanel--allure-femme--female': 'Allure', 'chanel--chanel-no-5--female': 'Chanel No 5 Eau de Toilette for women',
  'creed--aqva-fiorentina--female': 'Creed Acqua Fiorentina', 'giorgio-armani--black-code--male': 'Armani Code', 'hormone-paris--this-is-not-gaba--unisex': 'Hormone Paris Gaba',
  'kilian--kissing-wanna-workout--unisex': 'Kissing Burns 6.4 Calories A Minute. Wanna Workout? unisex', 'kilian--kilian-to-be-a-princess--unisex': "I Don't Need A Prince By My Side To Be A Princess unisex",
  'moschino--moschino-funny--female': 'Moschino Funny!', 'paco-rabanne--one-million--male': '1 Million Paco for men', 'paco-rabanne--invictus--male': 'Invictus Paco for men',
  'surrati-perfumes--hajar-al-aswad--unisex': 'Hajar Aswad unisex', 'yves-saint-laurent--libre--female': 'Libre Yves Saint Laurent', 'nina-ricci--luna--female': 'Luna Nina Ricci',
  'kenzo--kenzo-pour-homme--male': 'Kenzo Homme', 'sospiro-perfumes--accento--unisex': 'Sospiro Accento', 'roja-dove--enigma--female': 'Roja Enigma Aoud',
  'shaik--shaik-77--male': 'Opulent Shaik No. 77', 'lacoste--white--male': 'Lacoste L.12.12 Blanc', 'lacoste--blue--male': 'Lacoste Eau De Lacoste L.12.12 Bleu', 'lacoste--rose-for-her--female': 'Lacoste L.12.12 Rose', 'hugo-boss--the-scent--female': 'Boss The Scent Elixir',
};
/** Better search queries for items the brand pool did not contain. */
const QUERY = {
  'christian-dior--fahrenheit--male': 'Dior Fahrenheit', 'clinique--clinique-happy--male': 'Clinique Happy for men', 'mercedes-benz--mercedes-club--male': 'Mercedes-Benz Club',
  'mercedes-benz--mercedes-sign--male': 'Mercedes-Benz Sign', 'lanvin--lanvin-l-homme--male': "Lanvin L'Homme", 'montblanc--signature--female': 'Montblanc Signature',
  'escentric-molecules--molecule-09--unisex': 'Escentric Molecules Molecule 09', 'gucci--gucci-oud--unisex': 'Gucci Oud', 'dolce-and-gabbana--q-by-dolce--female': 'Q by Dolce & Gabbana',
  'chanel--paris-deauville--unisex': 'Chanel Paris Deauville', 'jil-sander--jil-sander-pure--female': 'Jil Sander Pure', 'issey-miyake--d-issey-man--male': "L'Eau d'Issey Pour Homme",
  'lacoste--white--male': 'Lacoste L.12.12 Blanc', 'lacoste--blue--male': 'Lacoste L.12.12 Bleu', 'lacoste--lacoste-pour-femme--female': 'Lacoste Pour Femme', 'lacoste--rose-for-her--female': 'Lacoste L.12.12 Rose',
  'trussardi--trussardi-for-him--male': 'Trussardi For Him', 'versace--eros-woman--female': 'Versace Eros Pour Femme', 'shaik--shaik-70--male': 'Shaik No 70',
  'stefano-ricci--royal-eagle-gold--male': 'Stefano Ricci Royal Eagle Gold', 'parle-moi-de-parfum--gardens-of-india--unisex': 'Parle Moi de Parfum Gardens of India',
  'paris-world-luxury--24k-supreme-rouge--female': '24K Supreme Rouge', 'tom-ford--tom-ford-for-men--male': 'Tom Ford for Men', 'dynasty-of-monaco--mister--male': 'Dynasty of Monaco Mister',
  'ex-nihilo--yasmin-al-mulla--unisex': 'Ex Nihilo Yasmin', 'genyum--painter--unisex': 'Genyum Painter', '--zam-zam--unisex': 'Zam Zam', '--zam-zam-cool--unisex': 'Zam Zam Cool', '--musk-pomegranate--unisex': 'Musk Pomegranate',
};
const RECOMPUTE = new Set([...Object.keys(OVERRIDES), ...Object.keys(QUERY)]);
function fromCache(name) {
  for (const f of readdirSync(RAW)) for (const c of list(JSON.parse(readFileSync(resolve(RAW, f), 'utf8')))) if (c.Name === name) return c;
  return null;
} // custom in-house blends — nothing to look up
const cyr = /[а-яё]/i;

let requests = 0;
async function api(path) {
  const file = resolve(RAW, encodeURIComponent(path).replace(/%/g, '_') + '.json');
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  if (DRY) return null;
  let res;
  for (let attempt = 0; ; attempt++) {
    requests++;
    res = await fetch(`${API}${path}`, { headers: { 'x-api-key': KEY } });
    if (res.status !== 429) break;
    if (attempt >= 5) throw new Error('Rate limit persisted (429)');
    process.stdout.write('  429 — per-minute limit, waiting 65s…\n');
    await new Promise((r) => setTimeout(r, 65_000));
  }
  if (res.status === 404) { writeFileSync(file, '[]'); return []; }
  if (!res.ok) throw new Error(`${res.status} ${path}: ${await res.text()}`);
  const json = await res.json();
  writeFileSync(file, JSON.stringify(json));
  await new Promise((r) => setTimeout(r, 1100));
  return json;
}
const list = (x) => (Array.isArray(x) ? x : x?.data ?? []);

// ---------- matching ----------
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/№/g, ' no ').replace(/[^a-z0-9]+/g, ' ').trim();
const tokens = (s) => new Set(norm(s).split(' ').filter(Boolean));
const STOP = new Set(['eau', 'de', 'parfum', 'toilette', 'edp', 'edt', 'pour', 'for', 'the', 'by', 'le', 'la', 'di']);
function stripBrand(name, brand, alias) {
  let n = norm(name);
  for (const b of [alias, brand].filter(Boolean).map(norm)) if (n.startsWith(b + ' ')) n = n.slice(b.length + 1);
  return n;
}
const GENDER = { women: 'female', female: 'female', men: 'male', male: 'male', unisex: 'unisex' };
function score(ourName, ourGender, cand, brand, alias) {
  const a = norm(ourName), b = stripBrand(cand.Name ?? '', brand, alias);
  if (!b) return 0;
  let s;
  if (a === b) s = 1;
  else {
    const ta = new Set([...tokens(a)].filter((t) => !STOP.has(t))), tb = new Set([...tokens(b)].filter((t) => !STOP.has(t)));
    const inter = [...ta].filter((t) => tb.has(t)).length;
    if (!inter) return 0;
    const jacc = inter / new Set([...ta, ...tb]).size;
    const contained = (b.startsWith(a) || b.endsWith(a) || b.includes(' ' + a + ' ')) ? 0.15 : 0;
    s = 0.55 * jacc + 0.3 * (inter / ta.size) + contained;
  }
  const g = GENDER[String(cand.Gender ?? '').toLowerCase()];
  if (g && g !== ourGender) s -= 0.12;
  return Math.min(s, 1);
}
function best(ourName, ourGender, cands, brand, alias) {
  let top = null;
  for (const c of cands) { const s = score(ourName, ourGender, c, brand, alias); if (!top || s > top.s) top = { s, c }; }
  return top;
}

// ---------- compact record ----------
const compact = (c, s) => ({
  fragellaId: c._id, name: c.Name, brand: c.Brand, gender: GENDER[String(c.Gender ?? '').toLowerCase()] ?? null,
  year: c.Year || null, country: c.Country || null, oilType: c.OilType || null, rating: c.rating ? Number(c.rating) : null,
  longevity: c.Longevity || null, sillage: c.Sillage || null, popularity: c.Popularity || null,
  image: c['Image URL'] || null, imageTransparent: c['Image URL Transparent'] || null,
  accords: (c['Main Accords'] ?? []).map((n) => ({ name: n, strength: c['Main Accords Percentage']?.[n] ?? null })),
  notes: Object.fromEntries(['Top', 'Middle', 'Base'].map((k) => [k.toLowerCase(), (c.Notes?.[k] ?? []).map((n) => ({ name: n.name, image: n.imageUrl ?? null }))])),
  generalNotes: c['General Notes'] ?? [],
  seasons: c['Season Ranking'] ?? [], occasions: c['Occasion Ranking'] ?? [],
  matchScore: Number(s.toFixed(2)),
});

// ---------- main ----------
const catalog = JSON.parse(readFileSync(resolve(ROOT, 'src/data/catalog.json'), 'utf8'));
const slug = (s) => norm(s).replace(/ /g, '-');
const out = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const stats = { matched: 0, fallback: 0, unmatched: [] };

for (const brand of catalog.brands) {
  if (SKIP_BRANDS.has(brand.name)) continue;
  const alias = BRAND_ALIAS[brand.name];
  const useBrandEndpoint = brand.name !== 'Разные';
  const pool = useBrandEndpoint ? list(await api(`/brands/${encodeURIComponent(alias ?? brand.name)}?limit=50`)) : [];
  for (const [name, gender] of brand.items) {
    const id = `${slug(brand.name)}--${slug(name)}--${gender}`;
    if (RECOMPUTE.has(id)) delete out[id];
    if (out[id]) { stats.matched++; continue; }
    if (cyr.test(name)) { stats.unmatched.push(`${brand.name} — ${name} (кириллица)`); continue; }
    if (OVERRIDES[id]) {
      const c = fromCache(OVERRIDES[id]);
      if (c) { out[id] = compact(c, 1); stats.matched++; continue; }
      stats.unmatched.push(`${brand.name} — ${name} (override "${OVERRIDES[id]}" not in cache)`); continue;
    }
    let hit = QUERY[id] ? null : best(name, gender, pool, brand.name, alias);
    if (!hit || hit.s < 0.62) {
      const q = QUERY[id] ?? (useBrandEndpoint ? `${alias ?? brand.name} ${name}` : name);
      const found = list(await api(`/fragrances?search=${encodeURIComponent(q)}&limit=10`));
      const h2 = best(name, gender, found, brand.name, alias);
      if (h2 && (!hit || h2.s > hit.s)) { hit = h2; if (hit.s >= 0.5) stats.fallback++; }
    }
    if (hit && hit.s >= (QUERY[id] ? 0.3 : 0.5)) { out[id] = compact(hit.c, hit.s); stats.matched++; }
    else stats.unmatched.push(`${brand.name} — ${name}${hit ? ` (best: ${hit.c.Name} @${hit.s.toFixed(2)})` : ''}`);
  }
  writeFileSync(OUT, JSON.stringify(out));
  process.stdout.write(`${brand.name}: pool ${pool.length}, requests so far ${requests}\n`);
}
writeFileSync(OUT, JSON.stringify(out, null, 0));
console.log(`\nmatched ${stats.matched} (via search: ${stats.fallback}), unmatched ${stats.unmatched.length}, API requests this run: ${requests}`);
console.log(stats.unmatched.join('\n'));
