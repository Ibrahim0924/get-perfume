import { catalog, getDetails, type Fragrance, type FragranceDetails } from '@/entities/fragrance';

/**
 * Content-based similarity, the standard approach for fragrance recommenders:
 * cosine similarity over the accord profile (weighted by accord strength) combined with
 * a weighted note-overlap (heart/base notes define the DNA more than volatile top notes),
 * plus a small gender-compatibility term. Computed locally over our own catalog.
 */

const STRENGTH: Record<string, number> = { Dominant: 1, Prominent: 0.8, Moderate: 0.55, Subtle: 0.3 };
const TIER_WEIGHT = { top: 0.6, middle: 1, base: 1 } as const;
const GENERAL_WEIGHT = 0.8;

const normNote = (n: string) => n.trim().toLowerCase().replace(/\.$/, '');

function accordVector(d: FragranceDetails): Map<string, number> {
  const v = new Map<string, number>();
  for (const a of d.accords) v.set(a.name, STRENGTH[a.strength ?? ''] ?? 0.4);
  return v;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let dot = 0, na = 0, nb = 0;
  for (const [k, x] of a) { na += x * x; const y = b.get(k); if (y) dot += x * y; }
  for (const [, y] of b) nb += y * y;
  return dot / Math.sqrt(na * nb);
}

function noteWeights(d: FragranceDetails): Map<string, number> {
  const v = new Map<string, number>();
  for (const tier of ['top', 'middle', 'base'] as const)
    for (const n of d.notes[tier]) {
      const k = normNote(n.name);
      v.set(k, Math.max(v.get(k) ?? 0, TIER_WEIGHT[tier]));
    }
  if (v.size === 0) for (const n of d.generalNotes) v.set(normNote(n), GENERAL_WEIGHT);
  return v;
}

/** Weighted Jaccard: shared weight over union weight. */
function noteOverlap(a: Map<string, number>, b: Map<string, number>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0, union = 0;
  for (const [k, x] of a) { const y = b.get(k); shared += y ? Math.min(x, y) : 0; union += Math.max(x, y ?? 0); }
  for (const [k, y] of b) if (!a.has(k)) union += y;
  return union === 0 ? 0 : shared / union;
}

function genderAffinity(a: Fragrance, b: Fragrance): number {
  if (a.gender === b.gender) return 1;
  if (a.gender === 'unisex' || b.gender === 'unisex') return 0.6;
  return 0;
}

export interface SimilarItem {
  fragrance: Fragrance;
  score: number;
  sharedAccords: string[];
  sharedNotes: string[];
}

interface Profile { f: Fragrance; d: FragranceDetails; accords: Map<string, number>; notes: Map<string, number> }

let profiles: Profile[] | null = null;
function allProfiles(): Profile[] {
  profiles ??= catalog.fragrances.flatMap((f) => {
    const d = getDetails(f.id);
    return d ? [{ f, d, accords: accordVector(d), notes: noteWeights(d) }] : [];
  });
  return profiles;
}

const cache = new Map<string, SimilarItem[]>();

export function findSimilar(fragrance: Fragrance, limit = 6): SimilarItem[] {
  const hit = cache.get(fragrance.id);
  if (hit) return hit.slice(0, limit);

  const d = getDetails(fragrance.id);
  if (!d) return [];
  const self: Profile = { f: fragrance, d, accords: accordVector(d), notes: noteWeights(d) };

  const scored = allProfiles()
    .filter((p) => p.f.id !== fragrance.id)
    .map((p) => {
      const accordSim = cosine(self.accords, p.accords);
      const noteSim = noteOverlap(self.notes, p.notes);
      const score = 0.55 * accordSim + 0.35 * noteSim + 0.1 * genderAffinity(fragrance, p.f);
      const sharedAccords = [...self.accords.keys()].filter((k) => p.accords.has(k));
      const sharedNotes = [...self.notes.keys()].filter((k) => p.notes.has(k));
      return { fragrance: p.f, score, sharedAccords, sharedNotes };
    })
    .filter((s) => s.score >= 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  cache.set(fragrance.id, scored);
  return scored.slice(0, limit);
}
