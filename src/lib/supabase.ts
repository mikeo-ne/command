import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Cloud sync is enabled when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are
 * configured at build time. Without them the hub runs in local-only mode.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;

export const isCloudSyncConfigured = supabase !== null;
