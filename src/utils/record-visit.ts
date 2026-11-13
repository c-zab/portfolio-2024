import { isIP } from "node:net";
import { sessionLabel } from "./visitor-token";

/**
 * Upserts one site_sessions row for this visitor token.
 * Server-only — the service-role client must not be pulled into browser code.
 */

export type SiteSessionInput = {
  tokenId: string;
  ip: string | null;
  path: string;
  referrer: string | null;
  userAgent: string | null;
  country: string | null;
};

let missingKeyWarned = false;

export async function recordSiteSession(input: SiteSessionInput) {
  if (!input.ip || isIP(input.ip) === 0) return;

  try {
    const { supabaseAdmin } = await import("../db/supabase-admin");
    const { error } = await supabaseAdmin.rpc("record_site_session", {
      p_token_id: input.tokenId,
      p_ip: input.ip,
      p_path: clip(input.path, 512),
      p_referrer: clip(input.referrer, 512),
      p_user_agent: clip(input.userAgent, 512),
      p_country: input.country,
      p_label: sessionLabel(input.tokenId),
    });
    if (error) {
      console.error("[visit] supabase failed:", error.message);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      if (!missingKeyWarned) {
        missingKeyWarned = true;
        console.error("[visit] skipped:", message);
      }
      return;
    }
    console.error("[visit] failed:", message);
  }
}

function clip(value: string | null, max: number) {
  if (!value) return null;
  return value.length > max ? value.slice(0, max) : value;
}
