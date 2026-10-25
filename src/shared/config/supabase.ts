/**
 * Supabase project that stores visitor-uploaded photos (table `photo_overrides`, public bucket
 * `photos`). Both values are public by design: the anon key can do only what the project's
 * row-level policies allow (read, and add new photos — never change or delete existing ones).
 * Left empty, photo uploads are switched off and the site shows only its built-in photos.
 */
export const SUPABASE_URL = 'https://rdgvnpasjsgyntziurwj.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_zb6AFw9_qkpGdsd-M4-6_A_h8N8iYv3';

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Auth headers for the REST and Storage APIs. New-style publishable keys (sb_publishable_…) go in
 * `apikey` only — they are not JWTs and must not be sent as a Bearer token; legacy anon keys (JWTs)
 * are sent both ways.
 */
export const supabaseHeaders: Record<string, string> = SUPABASE_ANON_KEY.startsWith('sb_')
  ? { apikey: SUPABASE_ANON_KEY }
  : { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
