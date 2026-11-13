import { isIP } from "node:net";
import { waitUntil } from "@vercel/functions";
import { defineMiddleware } from "astro:middleware";
import { recordSiteSession } from "./utils/record-visit";
import { clearLegacyVisitorCookie, ensureVisitorCookie } from "./utils/visitor-cookie";

const BOT_UA =
  /bot|crawler|spider|crawling|slurp|facebookexternalhit|whatsapp|telegrambot|headless|lighthouse|pagespeed|wget|curl/i;

export const onRequest = defineMiddleware(async (context, next) => {
  if (!shouldTrack(context.request, context.url)) {
    return next();
  }

  let tokenId: string | null = null;
  try {
    tokenId = ensureVisitorCookie(context.cookies).id;
  } catch (err) {
    console.error("[visit] cookie failed:", err instanceof Error ? err.message : err);
    return next();
  }

  const pending = recordSiteSession({
    tokenId,
    ip: readClientIp(context),
    path: context.url.pathname,
    referrer: referrerPath(context.request.headers.get("referer")),
    userAgent: context.request.headers.get("user-agent"),
    country: countryCode(context.request.headers.get("x-vercel-ip-country")),
  });

  // waitUntil is a no-op in `astro dev`; await there so the write actually finishes.
  if (import.meta.env.DEV) {
    await pending;
  } else {
    waitUntil(pending);
  }

  const response = await next();
  clearLegacyVisitorCookie(response);
  return response;
});

function shouldTrack(request: Request, url: URL) {
  if (request.method !== "GET") return false;
  const accept = request.headers.get("accept") ?? "";
  if (!accept.includes("text/html")) return false;

  const path = url.pathname;
  if (path.startsWith("/api/") || path.startsWith("/_")) return false;

  const purpose = `${request.headers.get("purpose") ?? ""} ${request.headers.get("sec-purpose") ?? ""}`;
  if (purpose.toLowerCase().includes("prefetch")) return false;

  const userAgent = request.headers.get("user-agent") ?? "";
  if (BOT_UA.test(userAgent)) return false;

  return true;
}

function readClientIp(context: { readonly clientAddress: string }) {
  try {
    const ip = context.clientAddress;
    return ip && isIP(ip) !== 0 ? ip : null;
  } catch {
    return null;
  }
}

function referrerPath(header: string | null) {
  if (!header) return null;
  try {
    const url = new URL(header);
    return `${url.origin}${url.pathname}`;
  } catch {
    return null;
  }
}

function countryCode(header: string | null) {
  if (!header || !/^[A-Za-z]{2}$/.test(header)) return null;
  return header.toUpperCase();
}
