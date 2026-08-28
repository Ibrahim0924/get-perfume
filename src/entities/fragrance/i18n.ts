/** Russian labels for Fragella vocabulary; unknown keys fall back to the English value. */
const ACCORDS: Record<string, string> = {
  citrus: 'цитрус', fruity: 'фруктовый', 'fresh spicy': 'свежие специи', 'warm spicy': 'тёплые специи', green: 'зелёный', aromatic: 'ароматический',
  rose: 'роза', 'white floral': 'белые цветы', floral: 'цветочный', woody: 'древесный', fresh: 'свежий', musky: 'мускусный', sweet: 'сладкий',
  vanilla: 'ваниль', amber: 'амбра', powdery: 'пудровый', 'yellow floral': 'жёлтые цветы', ozonic: 'озоновый', aquatic: 'водный', marine: 'морской',
  balsamic: 'бальзамический', oud: 'уд', leather: 'кожа', smoky: 'дымный', tobacco: 'табак', animalic: 'анималистичный', earthy: 'землистый',
  mossy: 'мшистый', herbal: 'травяной', lavender: 'лаванда', iris: 'ирис', violet: 'фиалка', tuberose: 'тубероза', honey: 'мёд', caramel: 'карамель',
  chocolate: 'шоколад', coffee: 'кофе', almond: 'миндаль', coconut: 'кокос', nutty: 'ореховый', cinnamon: 'корица', cacao: 'какао', lactonic: 'молочный',
  soapy: 'мыльный', metallic: 'металлический', mineral: 'минеральный', salty: 'солёный', aldehydic: 'альдегидный', anis: 'анис', patchouli: 'пачули',
  'soft spicy': 'мягкие специи', beeswax: 'пчелиный воск', rum: 'ром', whiskey: 'виски', cherry: 'вишня', tropical: 'тропический', conifer: 'хвойный', camphor: 'камфора',
};
const LEVELS: Record<string, string> = {
  Dominant: 'доминирующий', Prominent: 'выраженный', Moderate: 'умеренный', Subtle: 'лёгкий', Strong: 'сильный', Weak: 'слабый',
  'Very Long Lasting': 'очень стойкий (12+ ч)', 'Long Lasting': 'стойкий (8–12 ч)', Moderate_l: 'умеренный (4–7 ч)', Poor: 'слабый (<2 ч)',
  Enormous: 'огромный', Soft: 'мягкий', Intimate: 'интимный',
  'Very high': 'очень высокая', High: 'высокая', Medium: 'средняя', Low: 'низкая', 'Not popular': 'низкая',
};
const OIL: Record<string, string> = {
  'Eau de Parfum': 'парфюмерная вода', 'Eau de Toilette': 'туалетная вода', 'Eau de Cologne': 'одеколон', Parfum: 'духи', 'Extrait de Parfum': 'экстракт',
  'Eau Fraiche': 'eau fraîche', 'Perfume Oil': 'масляные духи',
};
const RANKED: Record<string, string> = {
  spring: 'весна', summer: 'лето', fall: 'осень', winter: 'зима', day: 'день', night: 'ночь',
  professional: 'офис', casual: 'повседневно', 'night out': 'вечер', 'special occasion': 'особый случай', sport: 'спорт', leisure: 'отдых', evening: 'вечер', daily: 'ежедневно',
};

export const tAccord = (name: string): string => ACCORDS[name.toLowerCase()] ?? name;
export const tLevel = (v: string | null): string | null => (v ? (LEVELS[v] ?? v) : null);
export const tLongevity = (v: string | null): string | null => (v === 'Moderate' ? LEVELS.Moderate_l! : tLevel(v));
export const tOil = (v: string | null): string | null => (v ? (OIL[v] ?? v) : null);
export const tRanked = (name: string): string => RANKED[name.toLowerCase()] ?? name;
