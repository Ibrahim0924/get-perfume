export const GENDERS = ['female', 'male', 'unisex'] as const;
export type Gender = (typeof GENDERS)[number];

export interface Fragrance {
  id: string;
  brand: string;
  brandId: string;
  name: string;
  gender: Gender;
  /** Price per millilitre, in RUB. */
  pricePerMl: number;
}

export interface Brand {
  id: string;
  name: string;
  fragrances: Fragrance[];
}

export interface Catalog {
  priceDate: string;
  brands: Brand[];
  fragrances: Fragrance[];
  prices: number[];
}
