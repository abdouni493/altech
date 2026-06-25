import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "to .env.local, then restart the dev server."
  );
}

/**
 * Single shared Supabase client.
 * Admin auth uses Supabase Auth (auth.users); the session is persisted so the
 * admin stays logged in across reloads.
 */
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** Public storage buckets created by supabase/schema.sql. */
export const BUCKETS = {
  /** Program & promotion images. */
  media: "media",
  /** Showroom logo / branding. */
  logos: "logos",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];
