# Melodía de Bolivia — Page design system

Documentation for designers reviewing **navbar**, **footer**, and **theme** options for the Melodía de Bolivia site preview.

**Live playground:** `/melodia/page` (iframe) or `/melodia/navbar-theme-playground.html`  
**Source of truth (CSS + markup):** `public/melodia/navbar-theme-playground.html`

---

## 1. What this system is

The page is a **combinatorial preview**: any **menu** × **footer** × **theme** can be mixed. Themes only recolor shared CSS variables; layouts (menu/footer) change structure, not the token names.

| Layer | Options | Role |
| --- | --- | --- |
| **Menú** | Barra · Escena · Cartel | Header architecture + hero treatment |
| **Footer** | Gigante · Columnas · Tarjeta | Closing page architecture |
| **Tema** | 7 Bolivian-inspired palettes | Color tokens only (`body[data-theme]`) |

Default combination: **Barra + Gigante · Altiplano**.

---

## 2. Design principles

1. **Brand first** — “Melodía de Bolivia” is a hero-level signal, not just nav chrome.
2. **One composition per viewport** — hero is edge-to-edge atmosphere (gradients / glow), not a card collage.
3. **Shared tokens, distinct layouts** — menus and footers look different in structure; themes never invent parallel CSS trees.
4. **Flag as cultural punctuation** — red / yellow / green strips appear as thin rules (hero top, footers), not as decoration noise.
5. **Dark by default** — all themes are night-forward; Melodía pages force dark site chrome.
6. **Bilingual** — ES / EN toggles rewrite UI copy in-nav; label short forms (`ES` / `EN`) on narrow screens.

---

## 3. Typography

| Role | Family | Usage |
| --- | --- | --- |
| **Display** | **Fraunces** (variable opsz/wght) | Hero titles, giant footer display, mastheads |
| **UI / body** | **Manrope** | Nav links, buttons, body, meta, locale |

CSS variables:

```css
--font-display: "Fraunces", Georgia, "Times New Roman", serif;
--font-ui: "Manrope", ui-sans-serif, system-ui, sans-serif;
--font-body: "Manrope", ui-sans-serif, system-ui, sans-serif;
```

Display type tends toward: large clamp sizes, tight negative letter-spacing (`-.04em` → `-.065em`), light/regular weights (400–600), short line-height (`.81`–`.92`).

---

## 4. CSS architecture

### 4.1 Token model

Everything theme-sensitive reads from CSS custom properties on `body` (or `:root` for the default).

```
:root / body[data-theme="…"]
  └── semantic tokens (--page, --primary, --gold, …)
        └── components (.bar-header, .cta-join, .giant-title, …)
```

**Switching theme** = set `body[data-theme="heritage|titicaca|cholita|oruro|uyuni|festival|anniversary"]`.  
Default (no attribute / heritage) uses `:root` Altiplano tokens.

### 4.2 Semantic token map

| Token | Purpose |
| --- | --- |
| `--page` | Page / hero background |
| `--surface` | Panels, cards, mobile drawer |
| `--surface-soft` | Soft surfaces / theme info |
| `--surface-hover` | Hover fills (grid cells) |
| `--text` | Primary text |
| `--text-soft` | Secondary hero text |
| `--muted` | Meta, inactive links |
| `--line` | Borders / hairlines |
| `--primary` | CTAs, accents, title accents |
| `--primary-hover` | CTA hover |
| `--secondary` | Supporting accent (numbers, accents) |
| `--gold` | Kickers, gold rules, cultural highlight |
| `--green` | Flag / cultural note |
| `--accent-text` | Active nav / locale on tinted chips |
| `--accent-muted` | Soft primary wash (locale active bg) |
| `--focus` | Focus ring tint |
| `--flag-red` / `--flag-yellow` / `--flag-green` | Tricolor bars (usually match brand flag) |

Layouts should **never hard-code theme hex** except for rare contrast fixes (e.g. dark text on light `cta-join` under Titicaca / Uyuni / 35 Años).

### 4.3 Layout vs theme

| Concern | Mechanism |
| --- | --- |
| Which navbar | `.model#model1|2|3` + `.active` |
| Which footer | `.footer-model#footer1|2|3` + `.active` |
| Which colors | `body[data-theme="…"]` overrides tokens |
| Mobile preview width | `.preview-shell.mobile` (phone frame) |
| Real narrow viewport | `@media (max-width: 820px)` |

### 4.4 Shared UI atoms

- **Brand** — logo + wordmark (`.brand`)
- **Links** — horizontal nav (`.links`) → cloned into `.mobile-panel` when hamburger opens
- **Locale** — ES / EN (`.locale`)
- **CTA pair** — `.cta-join` (filled primary) + `.cta-book` (text / underline)
- **Flag rule** — `linear-gradient(90deg, red 0 33%, yellow 33% 66%, green 66%)`
- **Signature** — “Site by CZ ↗” strip under every footer

---

## 5. Themes (Tema)

All themes are **dark**. Names are cultural references for Melodía (Toronto troupe / Bolivian folklore), not literal photography modes.

### 5.1 Palette matrix

| ID (`data-theme`) | Label | Mood | `--page` | `--primary` | `--secondary` | `--gold` | `--green` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| *(default)* / `heritage` | **Altiplano** | Highland night; closest to live site | `#0b0a0c` | `#d52b1e` | `#d4956a` | `#f4c51e` | `#007a33` |
| `titicaca` | **Titicaca** | Lake night; cold silver-blue | `#060d18` | `#38bdf8` | `#f0a0b8` | `#f0d78c` | `#2a9d8f` |
| `cholita` | **Cholita** | Pollera / feria — fuchsia + turquoise | `#12010f` | `#e11d8a` | `#2dd4bf` | `#fbbf24` | `#14b8a6` |
| `oruro` | **Oruro** | Carnival / Diablada — devil red + gold | `#090505` | `#c41010` | `#f5c518` | `#ffd54a` | `#168a3a` |
| `uyuni` | **Uyuni** | Salar — white-silver + sky | `#0b1016` | `#e8eef5` | `#7dd3fc` | `#fde68a` | `#5eead4` |
| `festival` | **Entrada** | Parade street — full flag energy | `#090b08` | `#d52b1e` | `#f4c51e` | `#f4c51e` | `#1f8a3b` |
| `anniversary` | **35 Años** | Anniversary flyer — violet night + neon magenta + Melodía gold | `#0d0216` | `#f0a020` | `#d946ef` | `#f9a825` | `#45c400` |

### 5.2 Theme copy (for review)

| Theme | Description (ES, from product copy) |
| --- | --- |
| Altiplano | Noche altiplánica — rojo de la bandera, oro y verde como notas culturales. |
| Titicaca | Noche en el lago — azul profundo, plata andina y destello frío. |
| Cholita | Pollera viva — fucsia, turquesa y oro de feria paceña. |
| Oruro | Carnaval — rojo diablo, negro de noche y oro de la Diablada. |
| Uyuni | Salar — blanco plata, cielo claro y reflejo frío del salar. |
| Entrada | Calle de entrada — rojo, amarillo y verde de bandera en la noche. |
| 35 Años | Flyer aniversario — noche violeta, oro Melodía y magenta neón. |

### 5.3 Contrast notes for designers

- On **Titicaca**, **Uyuni**, and **35 Años**, primary CTAs can become very light → join button text forces near-black (`#061018`) for readability.
- **Uyuni** primary is near-white (`#e8eef5`): treat it as “salt plane,” not a loud red brand.
- Flag tokens can diverge slightly on **35 Años** (`--flag-yellow` / `--flag-green` tuned for flyer feel).

### 5.4 Swatch chips (playground)

Theme picker dots (not product UI) approximate each palette:

| Theme | Chip idea |
| --- | --- |
| Altiplano | Solid `#d52b1e` |
| Titicaca | Blue split gradient |
| Cholita | Fuchsia / teal diagonal |
| Oruro | Red / gold / black |
| Uyuni | Silver / sky |
| Entrada | Horizontal flag stripes |
| 35 Años | Gold / magenta / violet |

---

## 6. Menus (Menú)

Three **architectures**. Same content goals (brand, nav, locale, CTAs); different visual systems.

### 6.1 Barra (`#model1`) — live-site bar

**Intent:** Closest to a conventional sticky marketing header + atmospheric hero.

**Structure**

```
[bar-header]
  brand | links (desktop) | locale + Entrar + hamburger (mobile)
[mobile-panel]  ← opens under header
[bar-hero]      ← full-bleed glow + flag rule on top
  kicker · title · tagline · CTAs
[bar-body]      ← short intro
```

**CSS architecture**

| Block | Key ideas |
| --- | --- |
| `.bar-header` | Frosted bar: `color-mix(page 92%, transparent)` + `backdrop-filter: blur(10px)` + bottom `--line` |
| `.bar-header__inner` | Max-width `960px`, flex row |
| `.bar-hero` | Min-height ~`min(420px, 70vh)`; content bottom-aligned |
| `.bar-hero::before` | Animated radial washes using `--primary`, `--gold`, `--green` |
| `.bar-hero::after` | 4px flag gradient strip |
| Locale | Chip tray with inset border; active uses `--accent-muted` / `--accent-text` |

**Desktop:** brand + inline links + locale + “Entrar”.  
**Mobile:** links & Entrar hidden → logo left, locale + hamburger right; panel lists links when open.

---

### 6.2 Escena (`#model2`) — overlay / festival frame

**Intent:** Photography / entrada energy — header floats on a cinematic field; hero copy is the parade invitation.

**Structure**

```
[overlay]
  [overlay-header] brand | centered links (desktop) | locale + hamburger
  [mobile-panel]
  [overlay-hero] kicker · title · body · CTAs
```

**CSS architecture**

| Block | Key ideas |
| --- | --- |
| `.overlay` | Stacked darkening gradients + primary/gold radials on `--page` |
| `.overlay-header` | Transparent flex bar; links `flex:1` centered uppercase tracking |
| Active link | White + gold underline (`box-shadow` inset) |
| `.overlay-hero` | Large Fraunces title, softer white body |

**Desktop:** brand · **centered** nav · tools.  
**Mobile:** nav hidden; **space-between** brand | tools (full-width bar). Hamburger starts **closed** on purpose.

---

### 6.3 Cartel (`#model3`) — playbill / theater masthead

**Intent:** Poster / program cover — vertical brand lockup, centered nav, rail meta.

**Structure**

```
[playbill-rail]  “Toronto · Folklore” | locale + hamburger
[playbill-mast]  logo · Melodía · de Bolivia
[playbill-nav]   centered links (desktop)
[playbill-flag]  4px flag rule
[mobile-panel]
[playbill-body]  centered copy + CTAs
```

**CSS architecture**

| Block | Key ideas |
| --- | --- |
| `.playbill-rail` | Compact uppercase meta row; `space-between`; rail text ellipsizes |
| `.playbill-mast` | Centered logo + huge display “Melodía” + gold sub “de Bolivia” |
| `.playbill-nav` | Centered wrap links; active gets mini flag underline |
| Locale | Short `ES` / `EN` (not “Español/English”) to protect rail width |

**Mobile:** nav hidden; rail keeps meta + locale + hamburger.

---

### 6.4 Shared mobile nav behavior

1. Desktop link row → `display: none`.
2. Hamburger → `display: inline-flex`.
3. Open state (`.is-menu-open`): clone `.links` HTML into `.mobile-panel`.
4. Panel uses `--surface` background and stacked link rows.
5. Closed hamburger is intentional; empty mid-gap on Escena was a layout bug (fixed: tools `margin-left: auto`).

---

## 7. Footers (Footer)

All footers sit under a shared page-body spacer and end with the **Site by CZ** signature strip.

### 7.1 Gigante (`#footer1`)

**Intent:** Emotional closer — oversized “35 AÑOS / BAILANDO.” display.

**Structure**

```
[giant-footer]
  flag rule (::before)
  [giant-top] brand-lockup | “Toronto · Canada”
  [giant-title] 35 AÑOS + accent BAILANDO.
  [giant-bottom] social meta | ©
[signature-strip]
```

**CSS**

- Title: Fraunces, `clamp(56px, 10vw, 140px)`, line-height `.81`
- Accent word uses `--primary`
- Top flag rule 3px
- Some themes add a soft primary/gold wash behind the block

---

### 7.2 Columnas (`#footer2`)

**Intent:** Directory / utility — brand band + 3 equal columns.

**Structure**

```
[grid-footer]
  [grid-brand] lockup | tagline   (full width)
  [grid-cell ×3] 01 Eventos · 02 Redes · 03 Contacto
[signature-strip]
```

**CSS**

- `grid-template-columns: repeat(3, 1fr)` → 1 column on mobile
- Each cell: numbered (`--secondary`), heading, links, mini flag rule (`::before`)
- Hover: `--surface-hover`

---

### 7.3 Tarjeta (`#footer3`)

**Intent:** Contained “card” CTA block — more promotional, rounded surface.

**Structure**

```
[card-wrap]
  [card-footer]
    flag rule (::after)
    [card-head] brand | social
    [card-title] Próxima entrada.
    [footer-cta]
    [card-row] links · Toronto · ©
[signature-strip]
```

**CSS**

- Radius `26px`, border `--line`, soft primary-tinted gradient on `--surface`
- Theme variants deepen the wash (Titicaca / Entrada / 35 Años)
- CTA uses `--primary` fill (same contrast exceptions as join buttons)

---

## 8. How combinations work

```
state = { nav, footer, theme, view }
         │     │        │      └─ web | mobile (preview frame)
         │     │        └─ body[data-theme]
         │     └─ .footer-model.active
         └─ .model.active
```

Design review tip: change **one axis at a time** first (e.g. fix Barra across themes, then try Escena), then stress-test odd mixes (Cartel + Tarjeta + Uyuni).

---

## 9. Responsive rules (product preview)

| Mode | Behavior |
| --- | --- |
| **Web** | Full-width preview; desktop nav visible above ~820px |
| **Móvil** (tool) | `.preview-shell.mobile` → ~430px phone frame, hamburger nav |
| **Real phone** (`max-width: 820px`) | Same hamburger treatment even if tool is on “Web” |

Playground chrome (tool UI, not Melodía product): light mono bar for Menú / Footer / Tema; on small screens Controles collapse, theme becomes a full-width **swatch track** with selected name chip.

Expand mode (parent `/melodia/page`): exit control lives in a **separate top bar** (“Salir” / “Exit”), not over Melodía chrome.

---

## 10. Motion

| Element | Motion |
| --- | --- |
| Barra hero glow | `barGlow` — slow saturate/scale alternate (~7s) |
| Barra hero copy | Staggered `barIn` fade/slide |
| Reduced motion | Hero animations disabled |

Footers are mostly static; hover states only on links / grid cells / signature.

---

## 11. Content & i18n (for copy reviews)

In-nav strings swap via `data-i18n` + `body[data-copy=es|en]`.

Covered: nav labels, CTAs, kickers, hero/playbill body, page-body title.  
**Not yet fully translated:** most footer microcopy (events, © lines, “35 AÑOS BAILANDO”) — still largely Spanish in markup.

---

## 12. File map

| Path | Role |
| --- | --- |
| `public/melodia/navbar-theme-playground.html` | Full interactive page (CSS + HTML + JS) |
| `docs/melodia-navbar-theme-playground.html` | Synced snapshot for docs |
| `src/components/melodia/page-preview-page.astro` | Portfolio wrapper + Expand/Exit |
| `docs/melodia-design-system.md` | This document |

---

## 13. Designer checklist

When reviewing or proposing changes, please note:

- [ ] Does the change belong to **layout** (menu/footer) or **theme** (tokens only)?
- [ ] Do all 7 themes still pass contrast on CTAs and locale chips?
- [ ] Does mobile closed header still read as **logo · tools** full-width (no dead center gap)?
- [ ] Does hamburger **start closed** with a clear open panel?
- [ ] Do flag rules stay thin punctuation, not competing with brand type?
- [ ] Does Fraunces stay on display only (not body/UI)?

---

## 14. Suggested discussion prompts for design sync

1. Which **menu** should ship first for the real site (likely **Barra**)?
2. Is **Gigante** too theatrical for day-to-day pages vs home only?
3. Should **Uyuni** / **35 Años** stay in the public theme set or be campaign-only?
4. Footer i18n: translate “35 AÑOS BAILANDO” or keep Spanish as brand lockup?
5. Any theme that feels too close to another (e.g. Altiplano vs Entrada)?
