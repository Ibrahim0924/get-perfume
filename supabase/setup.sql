-- One-time setup of the Supabase project behind visitor photo uploads
-- (Supabase dashboard → SQL Editor → paste → Run).
--
-- Anyone may read photos and add new ones; nobody can change or delete what is there through the
-- site. The newest row per fragrance is its main photo; a row with path '<fragrance id>/original'
-- (the site's "Вернуть исходное фото" button) means "back to the built-in photo". Deleting the newest
-- row here (Table Editor → photo_overrides) also brings the previous photo back.

create table if not exists public.photo_overrides (
  id bigint generated always as identity primary key,
  fragrance_id text not null check (char_length(fragrance_id) between 1 and 200),
  path text not null check (char_length(path) between 1 and 300),
  created_at timestamptz not null default now()
);
create index if not exists photo_overrides_newest on public.photo_overrides (fragrance_id, created_at desc);

alter table public.photo_overrides enable row level security;
create policy "photos are public" on public.photo_overrides for select to anon using (true);
create policy "anyone can add a photo" on public.photo_overrides for insert to anon
  with check (path like fragrance_id || '/%');

-- Public bucket: files are readable by URL. Only JPEG up to 3 MB (the site sends ~1200px JPEGs).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 3145728, array['image/jpeg'])
on conflict (id) do nothing;

create policy "anyone can upload a photo" on storage.objects for insert to anon
  with check (bucket_id = 'photos');
