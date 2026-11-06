# Abdallah Kassan — Interactive engineering portfolio

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

- Pearl-white and graphite editorial design. A lazy-loaded React Three Fiber hero models a conceptual industrial camera, edge computer and perception display, with physical metal/glass materials and restrained pointer parallax.
- Lightweight animated 2D hardware on phones and without WebGL; still scenes for reduced motion. Core content is prerendered and readable without JavaScript. Each exhibit pauses offscreen, in hidden tabs, and behind an open case-study dialog.
- French about, expertise, project, technology, career and contact sections with restrained Motion reveals and pointer interactions.
- Six filterable case studies: Jetson vision, SecuriSPOT Manager, MediaSpot, Jetson delivery, the COLAS interactive PPE scan, and ELK operations. Each includes the engineer’s role, an architectural decision, contributions and scoped outcomes. Native dialogs support focus containment, Escape, deep links and browser history.
- Six distinct animated SVG exhibits with synchronized architecture stages, French explanations, stage inspection and individual pause controls. Manager has a local zone-size configuration interaction; MediaSpot allows selecting an illustrative bus; delivery offers an explicitly illustrative rollback scenario. No demonstration calls an equipment or production API.
- Continuous accumulated clocks, closed vehicle paths and fading packet endpoints avoid scene resets. React state updates on stage changes; frame movement updates SVG attributes and Three objects directly. Observers, animation frames and GPU resources are cleaned up.
- Responsive navigation with section tracking, skip link, focus styles and reduced-motion support.
- Real email/social links, clipboard feedback and the exact original four-page reference CV, with a real first-page preview and explicit PDF download.
- Self-hosted fonts; no analytics, tracking cookies, external font requests or contact backend. Email links open the visitor’s mail application.
- Static metadata, canonical URL, social preview, sitemap, robots file and a custom 404 page.

## Editing

| File                                 | Purpose                                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| `src/data/portfolio.ts`              | Public profile, project studies, expertise, stack and career                            |
| `src/components/Portfolio.tsx`       | Navigation, sections, filtering, project dialogs and contact                            |
| `src/components/CoreVisual.tsx`      | Progressive 3D loading, fallbacks and animation controls                                |
| `src/components/HardwareScene.tsx`   | Physical camera/edge hardware, optics, perception texture and data paths                |
| `src/components/EngineeringDemo.tsx` | Six animated exhibits, local interactions and synchronized diagrams                     |
| `src/app/globals.css`                | Complete responsive pearl-white / graphite visual system                                |
| `src/app/layout.tsx`                 | French metadata and locally hosted fonts                                                |
| `scripts/sync_reference_cv.py`       | Copies the original reference PDF unchanged, refreshes legacy exports and its thumbnail |
| `scripts/generate_social.mjs`        | Reproducible social preview reusing the hardware SVG; requires the local preview        |
| `tests/portfolio.spec.ts`            | Desktop/mobile functionality, exact CV integrity and accessibility checks               |

The October 2026 reference CV is published unchanged at the owner’s explicit request. It also informs the public project studies and impact figures. Public source files and illustrations contain no private product code, internal screenshots, infrastructure addresses or logs.

Performance improvements are clearly scoped **field estimates/observations**, not independent benchmarks. Case studies distinguish the owner’s contribution from team work and pre-existing systems. C/C++ is described as foundational knowledge; the site does not claim professional firmware or autonomous-robotics experience. Professional source repositories are private, so GitHub links are explicitly profile links rather than invented project repositories.

### CV and social card

The original `CV_Reference_Abdallah_Kassan_2026.pdf` is committed and downloaded without rewriting, shortening or reformatting. Its SHA-256 is `7851b83eba479b97baf2261e6f085a27cda8ce12199de4dd1882b000e404d8b5`. The previous PDF URL returns the same bytes; legacy Word/plain-text URLs contain extracted reference content. The site’s PDF preview is a rasterization of the original first page. Deployment does not regenerate these files.

```bash
# Only when explicitly replacing the original; requires Python 3 and Poppler
python3 scripts/sync_reference_cv.py /path/to/reference.pdf

# Optional; requires the running static preview and a Playwright Chromium installation
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

Checks cover metadata, anchor targets, project filters, modal focus/Escape/history, legacy links, mobile navigation, clipboard success/failure, the original PDF’s SHA-256, four-page count and legacy download, new case-study scopes, impact links, PDF preview, reduced motion, no-WebGL fallback, desktop 3D/pause, overflow at 320–1440 px, no-JavaScript content and axe WCAG A/AA scans of the page and modal. Desktop mobile-menu and mobile WebGL tests are intentionally skipped. `tests/exhibits.spec.ts` also checks closed-path continuity, pause/resume without resetting, synchronized stages, local request snapshots, reduced-motion changes during a request, fleet/rollback controls, background suspension and repeated dialog cleanup. Automated accessibility checks complement visual and keyboard review. Frame rate depends on hardware; the WebGL path is limited to desktop, DPR 1.5, a single canvas and a low-resolution shadow map.

The narrowly scoped `minimatch` override patches a security advisory in TypeScript ESLint’s development-only file matching. Revisit it when the upstream parser updates its dependency.

## GitHub Pages deployment

`next.config.ts` sets `output: 'export'`, `basePath: '/portofolio'` and `trailingSlash: true`. Build artifacts are emitted to **`out/`**. `.github/workflows/deploy.yml` runs lint, production build and browser checks before deployment from `main`. GitHub Pages uses **GitHub Actions** as its source. No Next.js server is required.

The homepage is prerendered; project detail views use hash URLs such as `#projet/jetson-vision`. Prior `#/projects/...`, `#/contact`, `#/cv`, `#/about`, `#/skills` and `#/experience` links remain compatible. Case studies are not separate indexable pages.

For another hosting path, update the Next base path, asset URLs in content/metadata, robots/sitemap, static preview and Playwright base URL together.

### V3 recruiter overview

The home page leads with results, featured projects (Manager, Vision, MediaSpot) and experience before the profile and expertise sections. `featuredProjectSlugs` in the portfolio data defines this order independently of the full project collection. Each project card uses `EngineeringDemo` with `presentation="preview"`: the animated scene and pause control remain, while the full architecture and local controls are available in the case-study dialog (`presentation="full"`, the default). All six studies and existing anchors remain available.

The hero and contact area link directly to the unchanged reference CV. `tests/recruiter.spec.ts` verifies overview order, preview/full separation, featured projects, and the sticky close control across all six studies. Responsive checks include 360, 393, 768 and 1440 px.
