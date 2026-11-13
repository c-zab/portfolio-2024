import type { APIRoute } from "astro";
import { clearLegacyVisitorCookie, ensureVisitorCookie } from "../../utils/visitor-cookie";
import { VISITOR_TOKEN_MAX_AGE } from "../../utils/visitor-token";

export const prerender = false;

// Issues a signed visitor token as an httpOnly cookie; keeps the current one while it is still valid.
export const POST: APIRoute = async ({ cookies }) => {
  try {
    ensureVisitorCookie(cookies);
  } catch (err) {
    console.error("[token] failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "server" }, 500);
  }

  return clearLegacyVisitorCookie(json({ ok: true }));
};

// Same as POST, but answers with the token and how long it stays valid, so it can be checked from the browser.
export const GET: APIRoute = async ({ cookies }) => {
  try {
    const { id, issuedAt } = ensureVisitorCookie(cookies);
    const expiresAt = issuedAt + VISITOR_TOKEN_MAX_AGE;
    return clearLegacyVisitorCookie(
      json({
        ok: true,
        token: id,
        validUntil: new Date(expiresAt * 1000).toISOString(),
        expiresIn: formatDuration(expiresAt - Math.floor(Date.now() / 1000)),
      })
    );
  } catch (err) {
    console.error("[token] failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "server" }, 500);
  }
};

export const ALL: APIRoute = () =>
  json({ ok: false, error: "method", hint: "Use GET or POST." }, 405, { Allow: "GET, POST" });

// 2591999 → "29d 23h 59m"
function formatDuration(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}
