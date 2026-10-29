import type { APIRoute } from "astro";
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
    if (verifyVisitorToken(cookies.get(VISITOR_TOKEN_COOKIE)?.value)) {
      return json({ ok: true });
    }

    cookies.set(VISITOR_TOKEN_COOKIE, createVisitorToken(), {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      path: "/api",
      maxAge: VISITOR_TOKEN_MAX_AGE,
    });
  } catch (err) {
    console.error("[token] failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "server" }, 500);
  }

  return json({ ok: true });
};

export const ALL: APIRoute = () => json({ ok: false, error: "method", hint: "Use POST." }, 405, { Allow: "POST" });

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}
