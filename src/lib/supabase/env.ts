/**
 * Public Supabase settings. The anon/publishable key is safe in the browser:
 * Row Level Security (supabase/schema.sql) decides what it can read or write.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False until the env vars are set: the site then falls back to its static content. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
