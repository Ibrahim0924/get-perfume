import raw from '@/data/fragella.json';
import type { Gender } from './types';

export interface Note { name: string; image: string | null }
export interface Accord { name: string; strength: string | null }
export interface Ranked { name: string; score: number }

/** Enrichment pulled once from Fragella (see scripts/fetch-fragella.mjs). */
export interface FragranceDetails {
  fragellaId: string;
  name: string;
  brand: string;
  gender: Gender | null;
  year: string | null;
  country: string | null;
  oilType: string | null;
  rating: number | null;
  longevity: string | null;
  sillage: string | null;
  popularity: string | null;
  image: string | null;
  imageTransparent: string | null;
  imageFallback: string | null;
  accords: Accord[];
  notes: { top: Note[]; middle: Note[]; base: Note[] };
  generalNotes: string[];
  seasons: Ranked[];
  occasions: Ranked[];
  matchScore: number;
}

const details = raw as Record<string, FragranceDetails>;

export const getDetails = (fragranceId: string): FragranceDetails | undefined => details[fragranceId];
export const detailsCount = Object.keys(details).length;
