import {
  getLocaleFromPath,
  getLocalizedPath,
  getPathWithoutLocale,
  getTranslation,
  getTranslationList,
  isContentPath,
  type Locale,
} from "./i18n";
import { accentize, stripAccentMarkers } from "./accent-text";

function setMeta(name: string, content: string) {
  document.querySelector(`meta[name="${name}"]`)?.setAttribute("content", content);
  document.querySelector(`meta[property="og:${name}"]`)?.setAttribute("content", content);
  document.querySelector(`meta[property="twitter:${name}"]`)?.setAttribute("content", content);
}

function documentTitle(locale: Locale): string | null {
  const t = (key: string) => getTranslation(locale, key);
  const page = document.body.dataset.i18nPage;

  if (page === "home") {
    return `${t("common.name")} - ${t("common.title")} | ${t("common.location")}`;
  }
  if (page === "services") {
    return t("services.seoTitle");
  }
  return null;
}

function syncLanguageSwitcher(locale: Locale) {
  document.querySelectorAll("[data-language-switcher]").forEach((root) => {
    root.querySelectorAll<HTMLAnchorElement>("[data-locale]").forEach((link) => {
      const active = link.dataset.locale === locale;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  });
}

export function applyLocale(locale: Locale, { updateHistory = true } = {}) {
  const nextPath = getLocalizedPath(getPathWithoutLocale(window.location.pathname), locale);

  if (isContentPath(window.location.pathname)) {
    localStorage.setItem("preferred-language", locale);
    if (nextPath !== window.location.pathname) {
      window.location.assign(nextPath);
    }
    return;
  }

  const t = (key: string) => getTranslation(locale, key);

  document.documentElement.lang = locale;
  localStorage.setItem("preferred-language", locale);

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    if (el.closest(".ml11")) return;
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-accent]").forEach((el) => {
    const key = el.dataset.i18nAccent;
    if (key) el.innerHTML = accentize(t(key));
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-list]").forEach((el) => {
    const key = el.dataset.i18nList;
    if (!key) return;
    const items = getTranslationList(locale, key);
    Array.from(el.children).forEach((child, index) => {
      if (items[index] != null) child.textContent = items[index];
    });
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key) el.setAttribute("placeholder", t(key));
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria;
    if (key) el.setAttribute("aria-label", t(key));
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (key) el.setAttribute("title", t(key));
  });

  document.querySelectorAll<HTMLAnchorElement>("[data-localized-href]").forEach((el) => {
    const path = el.dataset.localizedHref;
    if (path) el.setAttribute("href", getLocalizedPath(path, locale));
  });

  const title = documentTitle(locale);
  if (title) {
    document.title = title;
    setMeta("title", title);
  }

  const page = document.body.dataset.i18nPage;
  if (page === "home") {
    setMeta("description", stripAccentMarkers(t("header.description")));
  } else if (page === "services") {
    setMeta("description", stripAccentMarkers(t("services.seoDescription")));
  }

  const ogLocale = locale === "es" ? "es_CA" : "en_CA";
  document.querySelector('meta[property="og:locale"]')?.setAttribute("content", ogLocale);
  setMeta("language", locale === "es" ? "Spanish" : "English");

  syncLanguageSwitcher(locale);

  if (updateHistory) {
    if (nextPath !== window.location.pathname) {
      history.pushState({ locale }, "", nextPath);
    }
  }

  document.querySelector('link[rel="canonical"]')?.setAttribute("href", window.location.href);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.href);
  document.querySelector('meta[property="twitter:url"]')?.setAttribute("content", window.location.href);
}

let localeSwitcherReady = false;

export function initLocaleSwitcher() {
  if (localeSwitcherReady) return;
  localeSwitcherReady = true;

  document.querySelectorAll("[data-language-switcher] a[data-locale]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const mouseEvent = event as MouseEvent;
      if (mouseEvent.metaKey || mouseEvent.ctrlKey || mouseEvent.shiftKey || mouseEvent.altKey) return;
      event.preventDefault();
      const locale = (link as HTMLElement).dataset.locale as Locale | undefined;
      if (!locale || locale === getLocaleFromPath(window.location.pathname)) return;
      applyLocale(locale);
    });
  });

  window.addEventListener("popstate", () => {
    if (isContentPath(window.location.pathname)) return;
    applyLocale(getLocaleFromPath(window.location.pathname), { updateHistory: false });
  });
}
