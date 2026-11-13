import type { APIRoute } from "astro";
import { pathFromReferer, recordSiteEvent } from "../../utils/record-event";
import { sanitizeSiteEvent } from "../../utils/site-event";
import { VISITOR_TOKEN_COOKIE, verifyVisitorToken } from "../../utils/visitor-token";

export const prerender = false;

const FROM_BROWSER = new Set(["contact_open", "contact_mode", "mailto", "outbound"]);

export const POST: APIRoute = async ({ request, cookies }) => {
  let payload: unknown;
  try {
    const text = await request.text();
    if (text.length > 2000) return json({ ok: false }, 400);
    payload = JSON.parse(text);
  } catch {
    return json({ ok: false }, 400);
  }

  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const event = sanitizeSiteEvent(body.name, body.detail);
  if (!event || !FROM_BROWSER.has(event.name)) return json({ ok: false }, 400);

  const token = verifyVisitorToken(cookies.get(VISITOR_TOKEN_COOKIE)?.value);
  if (!token) return json({ ok: false }, 401);

  await recordSiteEvent({
    tokenId: token.id,
    name: event.name,
    detail: event.detail,
    path: pathFromReferer(request),
  });

  return json({ ok: true });
};

export const ALL: APIRoute = () => json({ ok: false }, 405, { Allow: "POST" });

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}
