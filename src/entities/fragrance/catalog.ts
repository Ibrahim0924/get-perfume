import raw from '@/data/catalog.json';
import { slugify } from '@/shared/lib/slugify';
import { GENDERS, type Brand, type Catalog, type Fragrance, type Gender } from './types';

type RawItem = [name: string, gender: string, pricePerMl: number];
interface RawBrand { name: string; items: RawItem[] }
interface RawCatalog { priceDate: string; brands: RawBrand[] }

function isGender(value: string): value is Gender {
  return (GENDERS as readonly string[]).includes(value);
}

function isRawItem(value: unknown): value is RawItem {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    typeof value[0] === 'string' &&
    typeof value[1] === 'string' &&
    typeof value[2] === 'number'
  );
}

/** Narrows the imported JSON to the shape we expect; fails loudly on malformed data. */
function parseRawCatalog(input: unknown): RawCatalog {
  if (typeof input !== 'object' || input === null) throw new Error('catalog.json: root must be an object');
  const { priceDate, brands } = input as Record<string, unknown>;
  if (typeof priceDate !== 'string') throw new Error('catalog.json: priceDate must be a string');
  if (!Array.isArray(brands)) throw new Error('catalog.json: brands must be an array');

  return {
    priceDate,
    brands: brands.map((brand: unknown, i) => {
      const { name, items } = (brand ?? {}) as Record<string, unknown>;
      if (typeof name !== 'string' || !Array.isArray(items) || !items.every(isRawItem)) {
        throw new Error(`catalog.json: malformed brand at index ${i}`);
      }
      return { name, items };
    }),
  };
}

function normalize(source: RawCatalog): Catalog {
  const brands: Brand[] = source.brands.map((brand) => {
    const brandId = slugify(brand.name);
    const fragrances = brand.items.map(([name, gender, pricePerMl]): Fragrance => {
      if (!isGender(gender)) throw new Error(`Unknown gender "${gender}" for ${brand.name} — ${name}`);
      return {
        id: `${brandId}--${slugify(name)}--${gender}`,
        brand: brand.name,
        brandId,
        name,
        gender,
        pricePerMl,
      };
    });
    return { id: brandId, name: brand.name, fragrances };
  });

  const fragrances = brands.flatMap((b) => b.fragrances);
  const prices = [...new Set(fragrances.map((f) => f.pricePerMl))].sort((a, b) => a - b);

  return { priceDate: source.priceDate, brands, fragrances, prices };
}

export const catalog: Catalog = normalize(parseRawCatalog(raw));
