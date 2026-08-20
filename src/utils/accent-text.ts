const ACCENT_PATTERN = /\|([^|]+)\|/g;

/** Strip accent markers for plain-text contexts (meta, aria, etc.). */
export function stripAccentMarkers(text: string): string {
  return text.replace(ACCENT_PATTERN, "$1");
}

/** Wrap |accent| markers in a span for highlighted marketing copy. */
export function accentize(text: string): string {
  return text.replace(ACCENT_PATTERN, '<span class="text-accent">$1</span>');
}
