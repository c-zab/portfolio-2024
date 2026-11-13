import { sanitizeSiteEvent, type SiteEventName } from "./site-event";
import { sessionLabel } from "./visitor-token";

/**
 * Inserts one site_events row. Server-only.
 * Failures are logged and swallowed so a missing table never breaks the page or the contact form.
 */

let missingTableWarned = false;

export async function recordSiteEvent(input: {
  tokenId: string;
  name: SiteEventName;
  detail: string | null;
  path: string | null;
}) {
  const event = sanitizeSiteEvent(input.name, input.detail);
  if (!event) return;

  try {
    const { supabaseAdmin } = await import("../db/supabase-admin");
    const { error } = await supabaseAdmin.from("site_events").insert({
      token_id: input.tokenId,
      label: sessionLabel(input.tokenId),
      name: event.name,
      detail: event.detail,
      path: input.path ? input.path.slice(0, 512) : null,
    });
    if (error) {
      if (error.code === "42P01" || error.message.includes("site_events")) {
        if (!missingTableWarned) {
          missingTableWarned = true;
          console.error("[event] skipped:", error.message);
        }
        return;
      }
      console.error("[event] supabase failed:", error.message);
    }
  } catch (err) {
    console.error("[event] failed:", err instanceof Error ? err.message : err);
  }
}

/** Path of the page that sent this request, when the Referer is this same site. */
export function pathFromReferer(request: Request) {
  const header = request.headers.get("referer");
  if (!header) return null;
  try {
    const referer = new URL(header);
    const self = new URL(request.url);
    if (referer.host !== self.host) return null;
    return referer.pathname;
  } catch {
    return null;
  }
}
