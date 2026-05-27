import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicKey, getSupabaseUrl } from "./env";

export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabasePublicKey();

  if (!url || !key) {
    throw new Error(
      "Mancano NEXT_PUBLIC_SUPABASE_URL e una chiave (ANON_KEY o PUBLISHABLE_KEY) in .env.local",
    );
  }

  return createBrowserClient(url, key);
}
