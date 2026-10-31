import type { APIContext, APIRoute } from "astro";
import { normalizePhone, validateContact } from "../../utils/contact-validation";
import { isHumanAnswer } from "../../utils/human-check";
import { hashClientIp, VISITOR_TOKEN_COOKIE, verifyVisitorToken } from "../../utils/visitor-token";

export const prerender = false;

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

// clientAddress throws when the adapter can't tell; the per-token limit still applies then.
function clientIpHash(context: APIContext) {
  try {
    return context.clientAddress ? hashClientIp(context.clientAddress) : null;
  } catch {
    return null;
  }
}

export const POST: APIRoute = async (context) => {
  const { request, cookies } = context;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  // Honeypot: pretend success so bots think it worked
  if (asString(body.website)) {
    return json({ ok: true });
  }

  const input = {
    name: asString(body.name),
    email: asString(body.email).toLowerCase(),
    phone: asString(body.phone),
    package: asString(body.package),
    message: asString(body.message),
    phoneCountry: asString(body.phoneCountry).toUpperCase(),
  };

  const invalid = validateContact(input);
  if (invalid) {
    return json({ ok: false, error: invalid }, 400);
  }
  if (!isHumanAnswer(asString(body.humanQuestion), asString(body.human))) {
    return json({ ok: false, error: "human" }, 400);
  }

  // Missing env vars (secret, Supabase keys) throw here; answer with JSON instead of a blank 500.
  try {
    const token = verifyVisitorToken(cookies.get(VISITOR_TOKEN_COOKIE)?.value);
    if (!token) {
      return json({ ok: false, error: "token" }, 401);
    }

    const { supabase } = await import("../../db/supabase.js");
    const { error } = await supabase.from("contact_messages").insert({
      name: input.name,
      email: input.email || null,
      phone: normalizePhone(input.phone, input.phoneCountry),
      package: input.package,
      message: input.message,
      token_id: token.id,
      ip_hash: clientIpHash(context),
    });

    // Limits live in a trigger on contact_messages (supabase/contact_messages.sql).
    if (error?.message === "rate_limited") {
      return json({ ok: false, error: "rate" }, 429);
    }
    if (error) {
      console.error("[contact] supabase insert failed:", error.message);
      return json({ ok: false, error: "server" }, 500);
    }
  } catch (err) {
    console.error("[contact] failed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "server" }, 500);
  }

  return json({ ok: true });
};

// Any other method (e.g. opening the URL in a browser) gets a JSON hint instead of Astro's 404 page.
export const ALL: APIRoute = () =>
  json({ ok: false, error: "method", hint: "Use POST with a JSON body." }, 405, { Allow: "POST" });

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
