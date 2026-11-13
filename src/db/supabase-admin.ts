import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-only writes that bypass RLS.
 * Never import this from client scripts. SUPABASE_SERVICE_ROLE_KEY must not use a PUBLIC_ prefix.
 */

const supabaseUrl = import.meta.env.SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
