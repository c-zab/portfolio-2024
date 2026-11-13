const NAMES = ["contact_open", "contact_mode", "contact_sent", "mailto", "outbound"] as const;

export type SiteEventName = (typeof NAMES)[number];

const PACKAGES = new Set(["discovery", "launch", "retain", "custom", "general"]);
const MODES = new Set(["email", "phone"]);

export type SiteEvent = {
  name: SiteEventName;
  detail: string | null;
};

/** Drops anything that is not one of the clicks we meant to store. */
export function sanitizeSiteEvent(name: unknown, detail: unknown): SiteEvent | null {
  if (typeof name !== "string" || !NAMES.includes(name as SiteEventName)) return null;
  const value = typeof detail === "string" ? detail.trim().slice(0, 120) : "";

  if (name === "contact_open") {
    return { name, detail: PACKAGES.has(value) ? value : "general" };
  }
  if (name === "contact_mode") {
    return MODES.has(value) ? { name, detail: value } : null;
  }
  if (name === "contact_sent") {
    return PACKAGES.has(value) && value !== "general" ? { name, detail: value } : null;
  }
  if (name === "mailto") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? { name, detail: value.toLowerCase() } : null;
  }
  if (name === "outbound") {
    const host = value.toLowerCase().replace(/^www\./, "");
    return /^[a-z0-9.-]{1,80}$/.test(host) ? { name, detail: host } : null;
  }
  return null;
}
