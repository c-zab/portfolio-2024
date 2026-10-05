# Melodía de Bolivia — Page design system

Documentation for designers reviewing **four locked homepage art directions** for Melodía de Bolivia.

**Live playground:** `/melodia/page` (iframe) or `/melodia/directions-playground.html`  
**Source of truth:** `public/melodia/directions-playground.html`  
**Direction brief:** `docs/melodia-design-directions.md`  
**Archive (menu × footer × theme mixer):** `/melodia/navbar-theme-playground.html`

---

## 1. What this system is

Voters compare **complete art directions**, not mix-and-match chrome. Each direction locks header, hero, mid-page, menu-open state, and footer together.

| Layer | Options | Role |
| --- | --- | --- |
| **Dirección** | Entrada · Tejido · Toronto · Escenario | Full homepage composition |
| **Idioma** | ES · EN | Rewrites visible copy |
| **Vista** | Web · Móvil | Preview frame (~430px phone) |

Default: **Tejido** (latest Aguayo woven mock). Shareable URL: `?d=tejido|entrada|toronto|escenario` plus optional `&lang=en` and `&view=mobile`.

---

## 2. Directions

1. **Entrada** — cinematic full-bleed photography, quiet top bar, `Menú +` takeover with numbered links, silhouette closer.
2. **Tejido** — aguayo-inspired woven bands, wine/textile palette, “Bolivia en cada paso,” Morenada / Caporales cards. **Uses the later woven mock**, not the earlier numbered-pill Tejido.
3. **Toronto ↔ Bolivia** — split identity, centered logo, two-place seam, four numbered cards, dual skyline/mountain closer.
4. **Escenario** — stage photography, bottom navigation dock, next-event band (placeholder copy only).

Shared IA: Inicio, Nosotros, Danzas, Eventos, Galería, Contrátanos, Contacto. Shared logo: `public/melodia/logo.png`.

---

## 3. Typography

| Role | Family | Usage |
| --- | --- | --- |
| **Display** | **Fraunces** | Hero titles and closers |
| **UI / body** | **Manrope** | Nav, buttons, body, locale |

---

## 4. Reviewer chrome vs product UI

The light mono top bar (Dirección / ES-EN / Web-Móvil) is **tool chrome**, not Melodía product UI. On small screens it collapses behind **Controles**, same pattern as the archive mixer.

Product ES / EN controls inside each shell also switch copy.

---

## 5. Photography placeholders

Photos live in two reusable folders. They are placeholders, not confirmed Melodía archives.

| Folder | Role |
| --- | --- |
| `public/melodia/media/library/` | Reviewer-provided stills (skyline, Titicaca, caporales, morenada, shawl) |
| `public/melodia/media/generated/` | AI stills generated for this review |

| File | Used for |
| --- | --- |
| `library/shawl-dancer.jpg` | Tejido hero |
| `library/morenada.jpg` / `library/caporales-street.jpg` | Tejido dance cards, Entrada strip, Toronto gallery card |
| `generated/entrada-hero.jpg` | Entrada hero |
| `generated/hat.jpg` / `generated/silhouette.jpg` | Entrada mid and closer |
| `library/toronto-skyline.jpg` / `generated/toronto-dancer.jpg` | Toronto split hero |
| `generated/group-harbour.jpg` / `embroidery.jpg` / `drums.jpg` / `library/caporales-street.jpg` | Toronto cards |
| `library/titicaca.jpg` | Toronto closer (Bolivia) |
| `library/caporales-stage.jpg` | Escenario hero and event |
| `generated/hat.jpg` / `hat-silhouette.jpg` / `sequins.jpg` | Escenario thumbs |

Aguayo borders are CSS stripes and diamonds, not photos. Mock screenshots are not used as page backgrounds. Direction chrome does not show numbers such as “02 · Entrada”.

Invented mock details (e.g. “Gran Presentación 2026”) are labeled as sample events, not facts.

---

## 6. Interaction

- Each direction has a full-screen or stacked **open-menu** state. Escape closes it. `aria-expanded` on menu buttons.
- Escenario keeps a bottom dock; extra page padding so it does not cover the last section. The dock hides while the menu overlay is open.
- `prefers-reduced-motion` disables transitions/animations.
- Keyboard focus uses a visible ring (`:focus-visible`).

---

## 7. File map

| Path | Role |
| --- | --- |
| `public/melodia/directions-playground.html` | Four locked directions + reviewer toggle |
| `public/melodia/media/library/` | Reviewer stills for reuse |
| `public/melodia/media/generated/` | Generated stills for reuse |
| `public/melodia/photos/` | Older mock screenshots (archive, not used as page art) |
| `public/melodia/navbar-theme-playground.html` | Archive combinatorial mixer |
| `src/components/melodia/page-preview-page.astro` | Portfolio wrapper + Expand/Exit |
| `src/components/melodia/melodia-page.astro` | Project hub |
| `docs/melodia-design-directions.md` | Original four-direction brief + Tejido override |
| `docs/melodia-design-system.md` | This document |

---

## 8. Designer checklist

- [ ] The four directions feel different at first glance.
- [ ] Header and footer cannot be mixed across directions.
- [ ] Desktop, mobile preview, and open-menu work for each direction.
- [ ] ES / EN rewrites copy, including headlines with accent words.
- [ ] Tejido reads as woven aguayo, not a recolored Entrada.
- [ ] Escenario dock never hides the last content.
- [ ] Placeholder photos and sample events stay labeled as such.
