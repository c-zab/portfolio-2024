let themeToggleReady = false;

export function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

export function getPreferredTheme(): "light" | "dark" {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return "dark";
}

export function initThemeToggle() {
  if (themeToggleReady) return;
  themeToggleReady = true;

  applyTheme(getPreferredTheme());

  document.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement | null)?.closest("[data-theme-toggle]");
    if (!button) return;
    applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
  });
}
