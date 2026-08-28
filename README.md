# Misk World

Каталог-прайс ароматов по мотивам известных брендов. Данные — из `Price 28.05.26.pdf`.

## Стек
- **Vite 8 + React 19 + TypeScript 7** — SPA без бэкенда
- **Tailwind CSS 4** (`@theme` design-tokens в `src/app/index.css`)
- Светлая/тёмная тема: CSS-токены в `src/app/index.css`, переключатель в `src/features/theme`, выбор сохраняется в `localStorage`
- `vite-plugin-singlefile` — сборка в один самодостаточный `dist/index.html`, который открывается без сервера

## Структура (feature-based)
```
src/
  app/        точка входа, глобальные стили и токены темы
  data/       catalog.json — единственный источник правды (прайс)
  entities/   доменная модель Fragrance/Brand + нормализация и валидация JSON
  features/   catalog — фильтры, поиск, сортировка, drill-down по бренду; theme — переключение темы
  widgets/    крупные UI-блоки страницы (Header, Hero, CatalogToolbar, BrandSection…)
  shared/     переиспользуемые примитивы (Chip, Badge, Container) и утилиты
```

## Команды
```bash
npm install
npm run dev        # dev-сервер с HMR
npm run build      # typecheck + сборка в dist/index.html
npm run typecheck
npm run serve      # раздаёт dist/ по локальной сети: http://<IP-компьютера>:4173
```

## Данные об ароматах (Fragella)
Описания, фото, ноты и аккорды подтянуты один раз из [Fragella API](https://api.fragella.com) скриптом `scripts/fetch-fragella.mjs`
(ключ — в `.env`, переменная `FRAGELLA_API_KEY`; файл в git не попадает). Сырые ответы API кешируются в `data/fragella/raw/`,
поэтому повторный запуск не тратит квоту — запросы уходят только для новых позиций. Итог — `src/data/fragella.json`
(320 из 330 ароматов сопоставлены). Ручные соответствия и уточнённые запросы — в `OVERRIDES` / `QUERY` внутри скрипта.

## Обновление прайса
Отредактируйте `src/data/catalog.json` (`["Название", "female|male|unisex", цена_за_мл]`) и выполните `npm run build`.
