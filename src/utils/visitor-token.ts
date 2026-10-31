import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

/**
 * Signed visitor token: `<id>.<issuedAt>.<signature>`.
 * Nothing is stored when a token is issued; the HMAC signature proves we made it.
 * Server-only — never import from client scripts.
 */

export const VISITOR_TOKEN_COOKIE = "visitor_token";
export const VISITOR_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

const ID_RE = /^[0-9a-f-]{36}$/;

function secret() {
  const value = import.meta.env.VISITOR_TOKEN_SECRET;
  if (!value) {
    throw new Error("Missing VISITOR_TOKEN_SECRET");
  }
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createVisitorToken() {
  const payload = `${randomUUID()}.${Math.floor(Date.now() / 1000)}`;
  return `${payload}.${sign(payload)}`;
}

/** Returns the token's id when the signature matches and it has not expired. */
export function verifyVisitorToken(token: string | undefined) {
  if (!token) return null;

  const [id, issuedAtRaw, signature, ...rest] = token.split(".");
  if (rest.length || !id || !issuedAtRaw || !signature || !ID_RE.test(id)) return null;

  const expected = Buffer.from(sign(`${id}.${issuedAtRaw}`));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  const issuedAt = Number(issuedAtRaw);
  const age = Math.floor(Date.now() / 1000) - issuedAt;
  if (!Number.isInteger(issuedAt) || age < 0 || age > VISITOR_TOKEN_MAX_AGE) return null;

  return { id, issuedAt };
}

/** Keyed hash of the client IP for rate limiting, so raw IPs never reach the database. */
export function hashClientIp(ip: string) {
  return createHmac("sha256", secret()).update(`ip:${ip}`).digest("base64url");
}
