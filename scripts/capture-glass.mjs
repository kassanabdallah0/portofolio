// Reproducible visual review against the production static preview (npm run preview).
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] || 'after';
if (!['before', 'after'].includes(phase))
  throw new Error('Use before or after');
const directory = 'docs/liquid-glass/screenshots';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {}),
  // SwiftShader's screenshot tiling corrupts SVGs even on unchanged V2.
  // Functional Playwright checks still exercise WebGL with SwiftShader.
  args: ['--disable-gpu'],
});
const report = [];
try {
  for (const width of phase === 'before'
    ? [1440, 393]
    : [1440, 1024, 768, 393, 360, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: width > 640 ? 1000 : 851 },
      reducedMotion: 'reduce',
    });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(
      process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4173/portofolio/',
      {
        waitUntil: 'networkidle',
      },
    );
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({
      path: `${directory}/${phase}-${width}-hero.jpg`,
      quality: 85,
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const surfaces = {
      impact: '.impact-section',
      about: '.about-section',
      expertise: '.expertise-section',
      vision: '.project-vision',
      manager: '.project-interface',
      fleet: '.project-cloud',
      delivery: '.project-delivery',
      colas: '.project-scan',
      elk: '.project-observability',
      stack: '.technologies-section',
      experience: '.experience-section',
      contact: '.contact-section',
    };
    for (const [name, selector] of Object.entries(surfaces)) {
      const element = page.locator(selector);
      await element.scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width}px ${name} overflow`,
      ).toBe(true);
      if (
        [1440, 393].includes(width) &&
        (phase === 'after' || ['expertise', 'vision', 'contact'].includes(name))
      ) {
        // Fit the entire section inside the raster viewport before cropping.
        // This avoids Chrome's captureBeyondViewport clipping and excludes the
        // fixed header from section crops; hero/menu captures retain the header.
        const height = Math.ceil((await element.boundingBox()).height) + 160;
        await page.setViewportSize({ width, height });
        await element.evaluate((el) =>
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'instant',
          }),
        );
        await element.screenshot({
          path: `${directory}/${phase}-${width}-${name}.jpg`,
          quality: 85,
          style: '.site-header, .skip-link { visibility: hidden !important; }',
        });
        await page.setViewportSize({ width, height: width > 640 ? 1000 : 851 });
      }
    }
    if (phase === 'after' && [1440, 393].includes(width)) {
      await page
        .getByRole('button', {
          name: 'Explorer l’étude de cas : SecuriSPOT · Vision industrielle',
        })
        .click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.screenshot({
        path: `${directory}/${phase}-${width}-dialog.jpg`,
        quality: 85,
      });
      await page.keyboard.press('Escape');
      if (width === 393) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
        await page.screenshot({
          path: `${directory}/${phase}-${width}-navigation.jpg`,
          quality: 85,
        });
      }
    }
    expect(errors).toEqual([]);
    report.push({
      width,
      sections: Object.keys(surfaces),
      overflow: false,
      errors,
    });
    console.log(`${phase}: ${width}px checked`);
    await page.close();
  }
  await writeFile(
    `${directory}/${phase}-report.json`,
    JSON.stringify(report, null, 2) + '\n',
  );
} finally {
  await browser.close();
}
