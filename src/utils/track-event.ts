/**
 * Fire-and-forget click log. The cookie goes with the request; this file never sees the IP.
 * Safe to import from client scripts.
 */

const recent = new Map<string, number>();

export function trackSiteEvent(name: string, detail?: string | null) {
  const key = `${name}:${detail ?? ""}`;
  const now = Date.now();
  const last = recent.get(key) ?? 0;
  if (now - last < 800) return;
  recent.set(key, now);

  const body = JSON.stringify({ name, detail: detail ?? null });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/event", blob)) return;
    }
  } catch {
    // fetch below
  }

  void fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => {});
}
