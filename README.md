# Abdallah Kassan — Full Stack Developer

Bilingual French/English portfolio for junior Full Stack / Software Engineer opportunities in France. React/TypeScript, Python and Node.js are the core positioning; AWS and edge computer vision are complementary experience.

**Website:** https://kassanabdallah0.github.io/portofolio/

## Pages and features

- Home: positioning, selected projects, location and CV download.
- Projects: category filters, accent-insensitive search, empty state and five detailed case studies.
- Experience: Fastpoint, KEOS Telecom and HMRexpert, with corrected dates and scoped contributions.
- Skills: technologies linked to examples of their use.
- About: education, languages, junior positioning and nationwide mobility.
- Resume: PDF preview and downloads in PDF, ATS Word and plain text (French).
- Contact: email/phone/profile links, copy-email feedback and a validated email-draft form.
- Privacy information and an unknown-route page.
- Responsive navigation, keyboard focus management, reduced-motion support and persistent language/theme preferences. Storage restrictions do not prevent rendering.

Case studies cover SecuriSPOT, MediaSpot reporting, Jetson vision integration, Wi-Fi statistics migration and application delivery. Diagrams are original, simplified illustrations, not production screenshots.

## Development

Node **20.19.4** is pinned in `.nvmrc`; Vite requires Node 20.19 or later.

```bash
nvm install
nvm use
npm ci
npm run dev
```

Open the repository subpath printed by Vite, normally `http://localhost:5173/portofolio/`.

```bash
npm run lint
npm run build
npm run preview
```

Only React, React DOM and Lucide are runtime dependencies. Styling is plain CSS, with system fonts and no external font request. Unused generated UI components and the inspection plugin were removed.

## Browser checks

```bash
npx playwright install chromium
npm run check
```

For an existing Chrome installation on Linux:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/google-chrome npm run check
```

Playwright checks desktop and mobile navigation, direct case-study URLs, browser history, filters/search, theme/language persistence, real CV file contents, form validation and draft feedback, clipboard failure, blocked storage, unknown routes, and automated WCAG A/AA checks with axe in both themes. The desktop-only skip of the mobile-menu test is intentional. Automated checks do not replace manual accessibility review.

`npm run test:ui` opens the interactive runner. `npm run format` formats the source. Test reports and traces are ignored by Git.

## Editing content

| File                             | Purpose                                                        |
| -------------------------------- | -------------------------------------------------------------- |
| `src/data/portfolio.ts`          | Profile, bilingual project case studies, skills and experience |
| `src/pages/Pages.tsx`            | Page layouts and translated interface copy                     |
| `src/components/Site.tsx`        | Navigation, footer, shared buttons and page headings           |
| `src/components/ProjectCard.tsx` | Project cards and architecture illustrations                   |
| `src/context/preferences.tsx`    | Language and theme state                                       |
| `src/lib/router.ts`              | GitHub Pages compatible hash routes and old section aliases    |
| `src/index.css`                  | Colors, typography, layout, responsive and print styles        |
| `public/bucket/`                 | Published CV files                                             |
| `tests/portfolio.spec.ts`        | Browser regression checks                                      |

The legacy PDF URL `/portofolio/bucket/abdallah.kassan.pdf` is preserved. Its former empty file was replaced with the verified September 2026 CV. The repository-root `bucket/` copy is synchronized for existing source links; Vite publishes the `public/` copy.

## Content accuracy

The content follows the verified CV and project audit dated September 23, 2026. KEOS ends in **December 2023**. Unsupported performance/cost improvements and unsupported expertise/certification claims from the old page were removed.

The Jetson result is **29.3 FPS**, the arithmetic mean of **10,599 reported detector rates** from **August 10–12, 2026**, for the counting pipeline. It is not display throughput, a PPE dual-model benchmark, an accuracy score or a before/after speedup. Do not broaden this claim when editing.

Professional source repositories, internal logs, network addresses, configuration files and private evidence are not included. Case studies describe contributions to team projects, not sole authorship of the products.

## Contact behavior

There is **no email backend**. The form validates the input and opens a percent-encoded `mailto:` draft in the visitor's mail application. The visitor must send the message there. The interface does not report a successful delivery and provides a direct email address if no mail handler is configured. No form data is stored by the portfolio.

The site has no analytics or advertising integration. Language and theme are stored locally when browser policies allow it.

## Deployment

`.github/workflows/deploy.yml` runs lint, build and browser tests on pushes and pull requests. Only a successful **main** build deploys to GitHub Pages. The repository's Pages source must be configured to **GitHub Actions**.

The Vite base is `/portofolio/`. URLs such as `#/projects/jetson-vision` reload without server rewrites. Legacy section links such as `#projects` remain usable. Hash navigation is intentional for GitHub Pages; individual case studies are not separately prerendered/indexable HTML documents. The homepage includes social metadata, a favicon and a useful no-JavaScript fallback.

To host under a different URL, update `vite.config.ts`, the canonical/social URLs in `index.html` and the Playwright base URL.

## Contact

[LinkedIn](https://www.linkedin.com/in/kassan-abdallah) · [GitHub](https://github.com/kassanabdallah0) · [GitLab](https://gitlab.com/abdallah.kassan)
