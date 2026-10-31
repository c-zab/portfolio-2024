import type { APIRoute, AstroCookies } from "astro";
import {
  createVisitorToken,
  verifyVisitorToken,
  VISITOR_TOKEN_COOKIE,
  VISITOR_TOKEN_MAX_AGE,
} from "../../utils/visitor-token";

export const prerender = false;

// Issues a signed visitor token as an httpOnly cookie; keeps the current one while it is still valid.
export const POST: APIRoute = async ({ cookies }) => {
  try {
    ensureToken(cookies);
  } catch (err) {
    console.error("[token] failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "server" }, 500);
  }

  return json({ ok: true });
};

// Same as POST, but answers with the token and how long it stays valid, so it can be checked from the browser.
export const GET: APIRoute = async ({ cookies }) => {
  try {
    const { id, issuedAt } = ensureToken(cookies);
    const expiresAt = issuedAt + VISITOR_TOKEN_MAX_AGE;
    return json({
      ok: true,
      token: id,
      validUntil: new Date(expiresAt * 1000).toISOString(),
      expiresIn: formatDuration(expiresAt - Math.floor(Date.now() / 1000)),
    });
  } catch (err) {
    console.error("[token] failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "server" }, 500);
  }
};

export const ALL: APIRoute = () =>
  json({ ok: false, error: "method", hint: "Use GET or POST." }, 405, { Allow: "GET, POST" });

function ensureToken(cookies: AstroCookies) {
  const current = verifyVisitorToken(cookies.get(VISITOR_TOKEN_COOKIE)?.value);
  if (current) {
    return current;
  }

  const token = createVisitorToken();
  cookies.set(VISITOR_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/api",
    maxAge: VISITOR_TOKEN_MAX_AGE,
  });
  return verifyVisitorToken(token)!;
}

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
