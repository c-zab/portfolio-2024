# Carlos Zabaleta — Portfolio

Personal portfolio and services site for [czabalet.com](https://czabalet.com). Built with Astro, TypeScript, and Tailwind CSS, deployed on Vercel.

## Features

- **Bilingual (EN / ES)** — locale routes at `/en/` and `/es/`, with client-side language switching and persisted preference
- **Home** — animated hero, social links, and scrolling tech marquee
- **Services** — packages (Discovery, Launch, Retain), process, and contact CTAs
- **Contact modal** — email or phone, package selection (including a custom / “not sure yet” option), and a dynamic human-verification quick check
- **Design system** — CSS tokens for light/dark mode, teal primary accent, glass surfaces, and ambient background
- **Responsive nav** — compact mobile menu with language and theme controls in the top bar

## Tech stack

- [Astro 5](https://astro.build) (SSR via `@astrojs/vercel`)
- TypeScript
- Tailwind CSS
- [anime.js](https://animejs.com) for hero and nav motion
- [simple-icons](https://simpleicons.org) for the tech marquee

## Requirements

- **Node.js 22+** (matches Vercel runtime)
- **Yarn 1.22** (recommended — enable with `corepack enable`)

## Getting started

```bash
# Install dependencies
yarn install

# Start dev server → http://localhost:4321
yarn dev

# Typecheck + production build
yarn build

# Preview production build locally
yarn preview
```

## Project structure

```text
src/
├── components/       # Page UI (home, services, nav, contact modal, …)
├── content/          # Blog collection (`blog/` + config.ts schema)
├── content.config.ts # Astro 5 content collections entry
├── i18n/             # en.json, es.json — UI chrome only
├── layouts/          # Layout.astro (nav, theme, contact, ambient)
├── pages/
│   ├── en/           # English routes
│   ├── es/           # Spanish routes
│   └── api/          # Server endpoints (e.g. contact)
├── styles/           # tokens.css — colors, surfaces, buttons
└── utils/            # i18n, theme, blog topics, icons, …
public/
└── images/           # Static assets (e.g. profile photo)
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirects to `/en/` |
| `/en/`, `/es/` | Home |
| `/en/services`, `/es/services` | Services page |
| `/api/contact` | Contact form POST (server) |

## i18n

Copy lives in `src/i18n/en.json` and `src/i18n/es.json`. Highlight marketing phrases with pipe markers:

```json
"tagline": "Digital solutions that solve |real problems|"
```

Rendered as teal accent spans via `accentize()` in `src/utils/accent-text.ts`.

## Deployment

Production deploys to **Vercel** (`output: "server"`, Node 22). The build command is:

```bash
yarn vercel-build
```

Push to `main` to deploy, or run `vercel --prod` from the project root.

## Scripts

| Command | Action |
|---------|--------|
| `yarn dev` | Dev server at `localhost:4321` |
| `yarn build` | `astro check` + production build |
| `yarn preview` | Preview `./dist/` locally |
| `yarn format` | Prettier write |
| `yarn format:check` | Prettier check |

## Documentation

Additional docs live in [`docs/`](docs/README.md) (layout, components, pages).

## License

Private — © Carlos Zabaleta
