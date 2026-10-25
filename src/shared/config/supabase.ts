/**
 * Supabase project that stores visitor-uploaded photos (table `photo_overrides`, public bucket
 * `photos`). Both values are public by design: the anon key can do only what the project's
 * row-level policies allow (read, and add new photos — never change or delete existing ones).
 * Left empty, photo uploads are switched off and the site shows only its built-in photos.
 */
export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
