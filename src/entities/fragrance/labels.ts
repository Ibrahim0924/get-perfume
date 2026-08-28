import type { Gender } from './types';

export const GENDER_LABEL: Record<Gender, string> = {
  female: 'Женский',
  male: 'Мужской',
  unisex: 'Универсальный',
};

export const GENDER_SHORT_LABEL: Record<Gender, string> = {
  female: 'Ж',
  male: 'М',
  unisex: 'U',
};
