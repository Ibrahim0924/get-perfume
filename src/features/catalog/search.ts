/**
 * Forgiving catalogue search. A query term matches a fragrance when one of its spellings
 * (as typed, with the keyboard layout switched, or transliterated) is found in the brand/name:
 *   3 — plain substring ("sauv" → Sauvage, "бриз" → Каспийский бриз)
 *   ~2 — same sound: Cyrillic and Latin reduced to a consonant skeleton ("сава", "соваж" → Sauvage)
 *   1 — a typo away, for words of 5+ letters (one or two letters by length: "sauvge", "kilain")
 * Every term has to match; the fragrance scores its weakest term so exact hits rank first.
 */

const RU_KEYS = 'йцукенгшщзхъфывапролджэячсмитьбю.ё';
const EN_KEYS = "qwertyuiop[]asdfghjkl;'zxcvbnm,./`";

const swapLayout = (s: string, from: string, to: string) => [...s].map((ch) => to[from.indexOf(ch)] ?? ch).join('');

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

const CYRILLIC = /[а-яё]/;

/** Lowercase, Latin accents dropped (Lancôme → lancome), ё → е; й keeps its breve. */
export function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/([a-z])[\u0300-\u036f]+/g, '$1').normalize('NFC').replace(/ё/g, 'е');
}

const toLatin = (s: string) => [...s].map((ch) => TRANSLIT[ch] ?? ch).join('');

/**
 * Consonant skeleton of a Latin word, so that French/English spellings and their Russian
 * renderings meet: "sauvage" and "sovazh" → "svzh", "givenchy" and "zhivanshi" → "zhvnsh".
 * A leading vowel is kept as a generic "a" (Amber / Эмбер), the rest are dropped.
 */
export function skeleton(latin: string): string {
  let s = latin
    .replace(/[^a-z0-9]/g, '')
    .replace(/sch/g, 'sh')
    .replace(/dzh|dj/g, 'zh')
    .replace(/ch/g, 'sh')
    .replace(/kh/g, 'h')
    .replace(/ph/g, 'f')
    .replace(/th/g, 't')
    .replace(/ck|qu|q/g, 'k')
    .replace(/x/g, 'ks')
    .replace(/w/g, 'v')
    .replace(/c(?=[eiy])/g, 's')
    .replace(/c/g, 'k')
    .replace(/g(?=[eiy])|j/g, 'zh')
    .replace(/ts|tz/g, 's')
    .replace(/(.)\1+/g, '$1');
  const lead = /^[aeiouy]/.test(s) ? 'a' : '';
  s = s.replace(/[aeiouy]/g, '').replace(/(.)\1+/g, '$1');
  return lead + s;
}

/** Damerau–Levenshtein distance (adjacent swaps count as one typo). */
function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2]![j - 2]! + 1);
      d[i]![j] = v;
    }
  }
  return d[a.length]![b.length]!;
}

export interface SearchIndex {
  /** Normalized text as written (may contain Cyrillic). */
  text: string;
  /** Same text in Latin letters. */
  latin: string;
  latinWords: string[];
  skeletons: string[];
}

export function buildIndex(text: string): SearchIndex {
  const norm = normalize(text);
  const latin = toLatin(norm);
  const latinWords = latin.split(/[^a-z0-9]+/).filter(Boolean);
  return { text: norm, latin, latinWords, skeletons: latinWords.map(skeleton) };
}

/**
 * Readings of a typed term. `exact` are tried as substrings; `sound` (the term itself, or its
 * transliteration) also by skeleton and typo distance. A keyboard-layout switch only counts when
 * it yields a real word (all letters), so "эмбер" does not turn into "'v,th".
 */
function readings(term: string, short: boolean): { exact: string[]; sound: string[] } {
  const latinTerm = CYRILLIC.test(term) ? toLatin(term) : term;
  const exact = new Set([term, latinTerm]);
  const sound = new Set(/^[a-z0-9]+$/.test(latinTerm) ? [latinTerm] : []);
  if (!short) {
    const swapped = CYRILLIC.test(term) ? swapLayout(term, RU_KEYS, EN_KEYS) : swapLayout(term, EN_KEYS, RU_KEYS);
    if (/^[a-z]+$|^[а-яё]+$/.test(swapped)) {
      exact.add(swapped); // "ыфмфпу" → "savage", "rfcgbq" → "каспий"
      if (/^[a-z]+$/.test(swapped)) sound.add(swapped);
    }
  }
  return { exact: [...exact], sound: [...sound] };
}

/**
 * 3 for a substring hit; just under 2 for a sound-alike (closer spellings rank higher);
 * 1 for a typo; 0 for none. In a multi-word query ("ив сен лоран") short words still count by sound.
 */
function termScore(term: string, idx: SearchIndex, multiWord: boolean): number {
  const short = term.length < 3;
  const { exact, sound } = readings(term, short);
  if (exact.some((v) => idx.text.includes(v) || idx.latin.includes(v))) return 3;
  if (short && !multiWord) return 0;

  let best = 0;
  for (const v of sound) {
    const sk = skeleton(v);
    if (sk.length < 2) continue;
    idx.skeletons.forEach((w, i) => {
      if (!w.startsWith(sk)) return;
      const word = idx.latinWords[i]!;
      best = Math.max(best, 2 - editDistance(v, word.slice(0, v.length)) / 100);
    });
  }
  if (best > 0 || term.length < 5) return best;

  const allowed = term.length >= 7 ? 2 : 1;
  for (const v of sound) {
    for (const word of idx.latinWords) {
      // Compare with the word's beginning of about the same length: the visitor may still be typing.
      for (let len = v.length - 1; len <= v.length + 1; len++) {
        if (len > word.length) break;
        if (editDistance(v, word.slice(0, len)) <= allowed) return 1;
      }
    }
  }
  return 0;
}

export function queryTerms(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean);
}

/** 0 = no match; otherwise the weakest term's score (higher is a closer match). */
export function searchScore(terms: string[], idx: SearchIndex): number {
  let score = 3;
  for (const t of terms) {
    score = Math.min(score, termScore(t, idx, terms.length > 1));
    if (score === 0) return 0;
  }
  return score;
}
