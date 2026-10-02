import type { APIRoute } from "astro";
import { supabase } from "../../db/supabase.js";
import { isHumanAnswer } from "../../utils/human-check";

export const prerender = false;

const PACKAGES = new Set(["discovery", "launch", "retain", "custom"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export const POST: APIRoute = async ({ request }) => {
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

  const name = asString(body.name);
  const email = asString(body.email).toLowerCase();
  const phone = asString(body.phone);
  const pkg = asString(body.package);
  const message = asString(body.message);
  const questionId = asString(body.humanQuestion);
  const human = asString(body.human);

  if (name.length < 2 || name.length > 80) {
    return json({ ok: false, error: "name" }, 400);
  }
  if (!PACKAGES.has(pkg)) {
    return json({ ok: false, error: "package" }, 400);
  }
  if (message.length < 8 || message.length > 2000) {
    return json({ ok: false, error: "message" }, 400);
  }
  if (email && !EMAIL_RE.test(email)) {
    return json({ ok: false, error: "email" }, 400);
  }
  if (!email && !phone) {
    return json({ ok: false, error: "contact" }, 400);
  }
  if (!isHumanAnswer(questionId, human)) {
    return json({ ok: false, error: "human" }, 400);
  }

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email: email || null,
    phone: phone || null,
    package: pkg,
    message,
  });

  if (error) {
    console.error("[contact] supabase insert failed:", error.message);
    return json({ ok: false, error: "server" }, 500);
  }

  return json({ ok: true });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
