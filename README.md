# Abdallah Kassan — Neural Core

French portfolio for a software engineer working across web applications, cloud services and embedded computer vision. Next.js static export, TypeScript, Tailwind CSS, Motion, React Three Fiber, Three.js and Lucide.

**Website:** https://kassanabdallah0.github.io/portofolio/

## Local development

Node **20.19.4** is pinned in `.nvmrc`.

```bash
nvm use
npm ci
npm run dev
```

Open `http://127.0.0.1:3000/portofolio/`. To verify exactly what GitHub Pages will serve:

```bash
npm run build
npm run preview
```

The static preview is `http://127.0.0.1:4173/portofolio/`.

## Experience

- Cinematic neural-core hero with a lazy-loaded React Three Fiber scene. Mouse movement influences the rotation; a pause control is available. Rendering pauses offscreen and in background tabs.
- Static SVG fallback on phones, reduced-motion settings, missing WebGL and rendering failures. Core content is prerendered and readable without JavaScript.
- French about, expertise, project, technology, career and contact sections with restrained Motion reveals and pointer interactions.
- Four filterable case studies: Jetson vision, SecuriSPOT Manager, MediaSpot and Jetson delivery. Native dialogs support focus containment, Escape, deep links and browser history.
- Responsive navigation with section tracking, skip link, focus styles and reduced-motion support.
- Real email/social links, clipboard feedback and an updated, concise two-page PDF CV.
- Self-hosted fonts; no analytics, tracking cookies, external font requests or contact backend. Email links open the visitor’s mail application.
- Static metadata, canonical URL, social preview, sitemap, robots file and a custom 404 page.

## Editing

| File                               | Purpose                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| `src/data/portfolio.ts`            | Public profile, project studies, expertise, stack and career     |
| `src/components/Portfolio.tsx`     | Navigation, sections, filtering, project dialogs and contact     |
| `src/components/CoreVisual.tsx`    | Progressive 3D loading, fallbacks and animation controls         |
| `src/components/NeuralScene.tsx`   | Lightweight neural geometry and pointer response                 |
| `src/components/ProjectVisual.tsx` | Original illustrative SVG project diagrams                       |
| `src/app/globals.css`              | Design tokens, layouts, responsive and reduced-motion styles     |
| `src/app/layout.tsx`               | French metadata and locally hosted fonts                         |
| `scripts/generate_cv.py`           | Concise public CV source (PDF, plain text and basic Word export) |
| `scripts/generate_social.mjs`      | Reproducible social preview rendered from HTML/SVG               |
| `tests/portfolio.spec.ts`          | Desktop/mobile functional and accessibility checks               |

The exhaustive October 2026 CV supplied by the owner informed the public copy. It is not committed or published. Public source files and illustrations contain no private product code, internal screenshots, infrastructure addresses or logs.

Performance improvements are clearly scoped **field estimates/observations**, not independent benchmarks. Case studies distinguish the owner’s contribution from team work and pre-existing systems. C/C++ is described as foundational knowledge; the site does not claim professional firmware or autonomous-robotics experience. Professional source repositories are private, so GitHub links are explicitly profile links rather than invented project repositories.

### CV and social card

The generated public files are committed; the deployment does not need to regenerate them. The previous PDF, Word and plain-text URLs are preserved with updated content.

```bash
# Optional; requires Python 3 and reportlab
python3 scripts/generate_cv.py

# Optional; requires a Playwright Chromium installation
node scripts/generate_social.mjs
```

For an existing Chrome installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/google-chrome`. The repository-root `bucket/abdallah.kassan.pdf` is kept synchronized with the published PDF.

## Verification

```bash
npx playwright install chromium
npm run check
```

`pdftotext` (Poppler) is required for the CV content assertion. On Linux with Chrome already installed:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/google-chrome npm run check
```

Checks cover metadata, anchor targets, project filters, modal focus/Escape/history, legacy links, mobile navigation, clipboard success/failure, served PDF bytes and contents, reduced motion, no-WebGL fallback, desktop 3D/pause, overflow at 320–1440 px, no-JavaScript content and axe WCAG A/AA scans of the page and modal. Desktop mobile-menu and mobile WebGL tests are intentionally skipped. Automated accessibility checks complement visual and keyboard review.

The narrowly scoped `minimatch` override patches a security advisory in TypeScript ESLint’s development-only file matching. Revisit it when the upstream parser updates its dependency.

## GitHub Pages deployment

`next.config.ts` sets `output: 'export'`, `basePath: '/portofolio'` and `trailingSlash: true`. Build artifacts are emitted to **`out/`**. `.github/workflows/deploy.yml` runs lint, production build and browser checks before deployment from `main`. GitHub Pages uses **GitHub Actions** as its source. No Next.js server is required.

The homepage is prerendered; project detail views use hash URLs such as `#projet/jetson-vision`. Prior `#/projects/...`, `#/contact`, `#/cv`, `#/about`, `#/skills` and `#/experience` links remain compatible. Case studies are not separate indexable pages.

For another hosting path, update the Next base path, asset URLs in content/metadata, robots/sitemap, static preview and Playwright base URL together.
