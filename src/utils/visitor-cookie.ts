import type { AstroCookies } from "astro";
import {
  createVisitorToken,
  verifyVisitorToken,
  VISITOR_TOKEN_COOKIE,
  VISITOR_TOKEN_MAX_AGE,
} from "./visitor-token";

/** Clears the previous cookie, which was scoped to /api and is not sent on page loads. */
const LEGACY_VISITOR_COOKIE_DELETE = `${VISITOR_TOKEN_COOKIE}=; Path=/api; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`;

export function ensureVisitorCookie(cookies: AstroCookies) {
  const current = verifyVisitorToken(cookies.get(VISITOR_TOKEN_COOKIE)?.value);
  if (current) return current;

  const token = createVisitorToken();
  cookies.set(VISITOR_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: VISITOR_TOKEN_MAX_AGE,
  });
  return verifyVisitorToken(token)!;
}

/**
 * Astro stores outgoing cookies by name, so a delete for Path=/api would replace the Path=/ set.
 * Append the legacy delete as its own Set-Cookie header instead.
 */
export function clearLegacyVisitorCookie(response: Response) {
  response.headers.append("Set-Cookie", LEGACY_VISITOR_COOKIE_DELETE);
  return response;
}
