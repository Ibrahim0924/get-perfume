// Assigns stable short numeric ids to fragrances (used in URLs like #/217).
// Existing numbers are never changed; new catalog items get the next free number.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = resolve(ROOT, 'src/data/ids.json');

// Mirrors slugify + id construction in src/entities/fragrance (keep in sync).
const CYR = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[а-яё]/g,(c)=>CYR[c]??'').replace(/&/g,' and ').replace(/№/g,' no ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

const catalog = JSON.parse(readFileSync(resolve(ROOT, 'src/data/catalog.json'), 'utf8'));
const brandIds = new Set(catalog.brands.map((b) => slug(b.name)));
const ids = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
let next = Math.max(0, ...Object.values(ids)) + 1;
const bump = () => { do next++; while (brandIds.has(String(next))); return next - 0; };

let added = 0;
for (const brand of catalog.brands) {
  const b = slug(brand.name);
  for (const [name, gender] of brand.items) {
    const id = `${b}--${slug(name)}--${gender}`;
    if (!(id in ids)) {
      while (brandIds.has(String(next))) next++;
      ids[id] = next++; added++;
    }
  }
}
writeFileSync(OUT, JSON.stringify(ids, null, 0));
console.log(`total ${Object.keys(ids).length}, added ${added}`);
