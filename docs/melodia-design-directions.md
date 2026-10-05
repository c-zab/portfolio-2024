# Melodía de Bolivia — Design Directions for Cursor

**Prototype override (Tejido):** the vote-ready Tejido shell follows the later Aguayo woven mock (“Bolivia en cada paso”, textile bands, Morenada / Caporales cards), not the numbered-pill / irregular-grid Tejido described in Direction 2 below. Header, page, and footer stay locked per direction; reviewers toggle complete art directions only.

Live review: `/melodia/page` (iframe) → `/melodia/directions-playground.html`. Archive mixer: `/melodia/navbar-theme-playground.html`.

---

A design and implementation brief for four distinct visual directions for Melodía de Bolivia’s website. Use this document to build reviewable prototypes in Cursor. It describes the experience, layout, responsive behavior, and visual system; it is not a request to generate or publish a website from this document.

## Project context

Melodía de Bolivia is a Bolivian folk dance and music group based in Toronto, with a 35-year history. The site should communicate Bolivian culture, community, movement, and the group’s life between Toronto and Bolivia. Spanish is the primary cultural voice, with an English version available throughout.

The goal of this exploration is to let group members compare four clearly different art directions. Each direction should feel like its own design concept, rather than a recolored copy of a shared template.

### Directions included

1. **Entrada** — cinematic, image-led, with a full-screen menu takeover.
2. **Tejido** — a modular layout inspired by the rhythm and color of Bolivian aguayos.
3. **Toronto ↔ Bolivia** — a split identity that brings the two places together as the visitor scrolls.
4. **Escenario** — a performance-stage experience with navigation anchored at the bottom.

The light editorial Archive concept is intentionally omitted.

## Shared content and prototype assumptions

Keep the information architecture consistent across the four prototypes so voters compare the art direction rather than different content. Use these sections and labels as a starting point:

- Inicio
- Nosotros
- Danzas
- Eventos
- Galería
- Contrátanos / Book Us
- Contacto

Use **“35 años de música, danza y comunidad”** as supporting copy where a short statement is needed. Suggested hero messages include **“Toronto, pero bailamos Bolivia.”**, **“Bolivia en cada paso.”**, and **“Dos lugares. Una identidad.”** Keep the copy short enough to let the design and photography lead.

Use the group’s real logo and photography when available. If assets are not ready, use clearly replaceable placeholders with descriptive labels such as “Entrada performance photo” or “Toronto community photo”; do not invent specific events, awards, venues, or member names. Avoid generic AI-looking imagery in the final vote. Prioritize real performance, costume, rehearsal, community, and archival images.

Each concept should include at least a home-page view, a menu-open state, and a mobile home/menu state. Keep the main CTA clear: **Contrátanos / Book Us**. The language control should show **ES / EN** and switch the visible prototype copy, not just change its appearance.

## Direction 1 — Entrada

### Intent

Make the site feel like the moment just before a dance performance begins. Photography, motion, soundless video, and dramatic typography create the atmosphere. Navigation stays quiet until a visitor asks for it.

### Desktop composition

- Use a full-viewport opening image or muted looping video of a real performance, with a strong dark overlay for readable text.
- Place the logo or wordmark at the top-left and a **MENÚ +** control at the top-right. Keep **ES / EN** nearby but visually secondary.
- Set the hero message large and compact, for example: **TORONTO, / PERO BAILAMOS / BOLIVIA.** Add a small line such as “Folklore boliviano desde 1991.”
- Include one prominent **Ver las danzas** or **Conócenos** action and one quieter **Contrátanos** link. Keep the hero uncluttered.
- When the visitor opens the menu, cover the viewport with a dark menu panel. Show large numbered links: 01 Nosotros, 02 Danzas, 03 Eventos, 04 Galería, 05 Contrátanos, 06 Contacto.
- If suitable imagery exists, changing focus or hover can swap the panel background to a relevant group photo. The text must remain readable and the link state must be visible without relying on color alone.
- Close the menu with a clear **Cerrar ×** control and Escape. Selecting a link closes it and moves to the destination.
- Continue below the hero with a concise group introduction, a featured dance or event, a photo strip, and a clear booking/contact section.

### Color and typography

Use near-black, charcoal, and warm white as the interface base. Let performance photography carry most of the color. Use Bolivian red, yellow, and green sparingly as small lighting-like accents, menu focus details, or a thin rule. Avoid placing large flag stripes behind the whole page.

Use the existing display serif (Fraunces) for expressive hero words if it suits the chosen photography; use the existing sans serif (Manrope) for navigation and body copy. Large type should feel theatrical without sacrificing legibility.

### Mobile behavior

- Keep a compact top row with logo, **ES / EN**, and a menu button. Use a clear menu icon before opening and an X after opening.
- The hero fills most of the first screen; crop the image around the dancers, not the text. Place the title near the lower third with a dark gradient behind it.
- The open menu becomes a full-screen stacked list with generous tap targets. Use 01–06 numbering and retain the image or a darkened image as atmosphere, never as the sole way to distinguish items.
- Put the primary CTA in the hero and repeat a booking link near the end of the page. Avoid autoplay audio. If using video, respect reduced-motion settings and provide a static image fallback.

## Direction 2 — Tejido

### Intent

Create a visual language that feels recognizably Melodía by borrowing the rhythm of woven aguayos: repetition, interruption, bands, contrast, and varied proportions. Treat the textile as a design influence, not wallpaper. The page should feel vibrant, crafted, and contemporary.

### Desktop composition

- Build a segmented navigation band across the page. Give each navigation cell a slightly different width to create rhythm: a wider logo cell, narrower section cells, and a strong **Contrátanos** cell.
- On hover or keyboard focus, the active cell expands slightly while nearby cells compress. Keep the transition quick and calm; do not make navigation widths jump in a way that shifts page content below it.
- Use a clear active state with a border, underline, or contrasting fill so the menu remains understandable without animation.
- Compose the hero from an irregular but orderly grid: oversized **MELODÍA**, a smaller **DE BOLIVIA**, one strong performance photo, and a few smaller content blocks such as “Toronto” and “Desde 1991.”
- Use numbered section markers, narrow color bands, and aligned edges to create a woven rhythm. Vary block sizes, but preserve a readable grid and consistent spacing.
- Make the footer a continuation of the grid: a large “35 AÑOS” block, links/social block, Toronto/community block, and a final “Bolivia en cada paso” statement.

### Aguayo-inspired palette

Use a deep ink base with warm textile tones and selected saturated colors. The following values are a starting palette; tune them against actual Melodía costumes and aguayo references before finalizing:

| Role | Color | Hex |
|---|---|---|
| Deep ink | Main dark surface | `#171014` |
| Warm textile | Light surface / text | `#F4EBDD` |
| Woven red | Primary accent | `#C8322C` |
| Sun yellow | Highlight | `#E7B83F` |
| Andean green | Supporting accent | `#2F7D4E` |
| Fuchsia | Secondary accent | `#C73579` |
| Turquoise | Secondary accent | `#218E91` |
| Terracotta | Occasional warm block | `#D86B32` |

Use color in deliberate blocks and narrow woven bands. Do not show every accent at equal strength on every screen. A useful rule is one dominant base, one primary accent, and no more than two supporting accents in a single viewport. Keep text contrast strong; use warm textile or near-black text on bright fills as needed. Avoid small text directly over patterned fills.

### Motifs and materials

- Create simple geometric stripe or stepped motifs with CSS or SVG, inspired by the structure of weaving.
- Use motifs as section dividers, nav details, image captions, or footer edges.
- Keep patterns sparse and cropped; do not tile a busy textile texture behind body copy.
- Prefer custom vector shapes over emoji or unrelated stock icons.

### Mobile behavior

- Collapse the segmented desktop navigation into a compact header with the logo and a menu button.
- The open menu should use stacked color bands or numbered rows. Keep each link’s text and focus state obvious; avoid shrinking labels to preserve the pattern.
- Reflow the hero grid into a vertical sequence: title, featured photo, short location/anniversary detail, CTA. Preserve the varied block rhythm through spacing and color panels, not a tiny multi-column grid.
- Let the footer become a vertical sequence of full-width blocks. Keep the strongest “35 AÑOS” block and contact action near the top of the footer.
- Ensure horizontal color bands and decorative motifs do not cause sideways scrolling.

## Direction 3 — Toronto ↔ Bolivia

### Intent

Tell Melodía’s specific story: Toronto is home, Bolivia is a living cultural connection, and dance brings them together. The visual system is based on two places meeting, not on a generic folklore theme.

### Desktop composition

- Build the header around a central seam. Place Toronto-oriented links on the left, the logo at or near the center, and Bolivia/performance-oriented links on the right. If this becomes crowded, use fewer visible links and group the rest under **Más**.
- In the hero, divide the composition into two visual fields: Toronto/community imagery on one side and Bolivian dance/costume imagery on the other.
- Place the message on or near the seam: **Dos lugares. Una identidad.** Another option is **Toronto es nuestra casa. Bolivia, nuestro ritmo.**
- Use a subtle blend, overlap, or shared central color to show the two sides meeting as one group. Keep the seam visible enough that the concept reads immediately.
- Below the hero, transition from paired content to unified full-width sections: the group’s story, dances, events, and gallery.
- End with a two-column footer that resolves into the shared statement “35 años entre Toronto y Bolivia” and a direct contact/booking action.
- Do not use fabricated coordinates or imply a specific connection to a city or place beyond what the group confirms.

### Color and imagery

Give each side a related but distinct mood. The Toronto side can use midnight blue, cool silver, and restrained cyan. The Bolivia/performance side can use deep red, warm gold, and burgundy. Use a shared neutral and a subtle transition color at the center so the page feels like one identity, not two unrelated websites.

Use real images that support the story: Toronto neighborhoods, rehearsals, community gatherings, costumes, and performances. Avoid stock skyline imagery that could represent any city unless it is clearly a temporary placeholder.

### Mobile behavior

- Replace the split desktop navigation with a standard compact header: logo, **ES / EN**, and menu button. Inside the menu, use a simple vertical list.
- Stack the Toronto and Bolivia hero fields vertically, with the central line **Dos lugares. Una identidad.** between or overlapping the two image sections.
- Use a strong visual transition at the midpoint—such as a shared color band, overlapping image edge, or centered wordmark—so the two panels still feel connected.
- Follow the hero with unified content sections; avoid alternating split columns that make every section hard to scan.
- Stack the footer columns and keep the contact action visible without requiring a long scroll through small print.

## Direction 4 — Escenario

### Intent

Treat the site like a stage with navigation as a persistent set of controls. This is the most unconventional direction: the top stays open and the navigation sits near the bottom of the viewport.

### Desktop composition

- Keep the top header minimal: logo at top-left, **ES / EN** at top-right, and optionally a small **Menú** control for secondary links.
- Let the hero make a strong first impression with a large performance image and a simple split title, for example **MELODÍA** followed by **DE BOLIVIA** as the visitor begins to scroll.
- Place a floating bottom navigation dock above the viewport edge. Use clearly labeled links for Inicio, Nosotros, Danzas, Eventos, Galería, and Contacto/Contrátanos. The active section should be marked with a strong indicator and text, not color alone.
- The dock can subtly respond to section changes, but it should remain stable and predictable. Do not animate it across the screen or cover important content.
- Design the footer like performance credits: next event or booking call, Toronto, social links, and the “35 años” statement.

### Color and typography

Keep the interface mostly near-black and warm white. Let each featured dance or event introduce a single accent color in its own section—for example, gold for the anniversary, green for a Saya feature, or crimson for a Morenada feature—only where the photography and editorial content support it. This is a section accent, not a separate full-site theme.

Use large display type with controlled motion that suggests choreography. Keep navigation and body type steady and easy to scan.

### Mobile behavior

- Keep the top row minimal and put the primary navigation in a bottom dock designed for thumbs.
- On narrow screens, show four primary items in the dock—Inicio, Danzas, Eventos, and Menú. Put Nosotros, Galería, Contacto, and Contrátanos inside the menu panel so labels do not become cramped.
- Include safe-area spacing for devices with a home indicator. Add bottom padding to the page at least equal to the dock height so the last link or footer content is never hidden.
- Use visible text labels alongside simple icons where possible. Do not rely on icons alone.
- Make the dock dismissible or collapse it while a full-screen menu is open. Ensure keyboard focus is not trapped behind it.
- Check that the dock does not obstruct cookie notices, media controls, or the booking CTA.

## Shared interaction and accessibility requirements

- Every direction must work with keyboard navigation. Show a visible focus state on links, buttons, language controls, and menu items.
- Use semantic links for navigation and buttons for actions. Give menu controls accessible names and expose open/closed state.
- Maintain readable contrast across text, accents, image overlays, and hover/focus states. Do not communicate selected state through color alone.
- Respect `prefers-reduced-motion`; remove or greatly reduce background motion, parallax, and scroll-triggered movement when requested.
- Keep motion short and purposeful. Avoid scroll hijacking, flashing, autoplay audio, and animation that delays access to content.
- Provide useful image alternative text when an image communicates content. Mark decorative patterns as decorative.
- Keep the English and Spanish versions structurally equivalent, and verify that longer translated labels fit on mobile.

## Suggested implementation approach in Cursor

1. Build four separate direction previews that share the same content outline and sample copy. Make the selected direction easy to switch during the group review.
2. Keep shared content/data separate from each direction’s layout so improvements to a link or translation carry across all four.
3. Give each direction its own page shell and responsive rules. Share only genuinely common pieces such as the logo asset, language behavior, typography imports, and content data.
4. Use CSS custom properties for each direction’s colors, spacing, and type roles. Tejido’s palette should remain editable in one place.
5. Add the desktop, menu-open, mobile, and mobile-menu states before polishing fine details. Test at a wide desktop size and at approximately 390px and 430px widths.
6. Use real photography as soon as it is available. Make placeholders easy to replace without changing layout.
7. Keep the prototype focused on comparison. Add voting labels or a simple direction selector only if they help the group review; do not let the playground controls become part of the eventual public website design.

## Review checklist

- [ ] The four directions feel visibly different at first glance.
- [ ] Each direction includes a desktop composition, a mobile composition, and an open-menu state.
- [ ] The same core sections and booking action appear in all four prototypes.
- [ ] Tejido uses an aguayo-inspired color rhythm with controlled, readable color blocks.
- [ ] Toronto ↔ Bolivia clearly communicates the group’s two-place identity without invented facts.
- [ ] Entrada remains legible over photography and works with a static-image fallback.
- [ ] Escenario’s bottom dock never hides content or controls.
- [ ] Every direction has working ES / EN copy and keyboard-accessible navigation.
- [ ] The group can vote on the direction that feels most like Melodía before choosing detailed components.
