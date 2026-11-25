import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://127.0.0.1:4173/portofolio/';
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: [
    '--enable-gpu',
    '--use-angle=vulkan',
    '--enable-features=Vulkan',
    '--disable-vulkan-surface',
  ],
});
const errors = [],
  results = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(base);
  const overview = page.locator('.software-overview');
  const canvas = overview.locator('canvas');
  await expect(canvas).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.core-static')).toHaveClass(/is-hidden/);
  const renderer = await canvas.evaluate((el) => {
    const gl = el.getContext('webgl2');
    const debug = gl?.getExtension('WEBGL_debug_renderer_info');
    return debug
      ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
      : 'unavailable';
  });
  for (const [label, layer] of [
    ['API & Backend', 'backend'],
    ['Cloud & Edge', 'production'],
  ]) {
    await overview.getByRole('button', { name: label, exact: true }).click();
    await expect(canvas).toHaveAttribute('data-hero-layer', layer);
    await page.screenshot({
      path: `docs/hero/screenshots/desktop-${layer}.jpg`,
      type: 'jpeg',
      quality: 90,
      animations: 'disabled',
    });
  }
  for (const width of [320, 360, 393, 768, 1024, 1440]) {
    const height = width === 393 ? 852 : 900;
    await page.setViewportSize({ width, height });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.locator('#accueil').boundingBox();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    expect(overflow).toBe(false);
    // Connectors intentionally cross node borders; the text must stay inside.
    for (const node of await overview.locator('.overview-node').all()) {
      const readable = await node.evaluate((el) => {
        const bounds = el.getBoundingClientRect();
        return [...el.querySelectorAll('strong, small, .overview-tech')].every(
          (label) => {
            const text = label.getBoundingClientRect();
            return (
              text.left >= bounds.left &&
              text.right <= bounds.right + 1 &&
              label.scrollWidth <= label.clientWidth + 1
            );
          },
        );
      });
      expect(readable).toBe(true);
    }
    const actions = await page.locator('.hero-actions').boundingBox();
    if (width === 1440 || width === 393)
      expect(actions.y + actions.height).toBeLessThanOrEqual(height);
    await page.screenshot({
      path: `docs/hero/screenshots/viewport-${width}.jpg`,
      type: 'jpeg',
      quality: 90,
    });
    if (width === 320 || width === 393)
      await page.screenshot({
        path: `docs/hero/screenshots/overview-${width}.jpg`,
        type: 'jpeg',
        quality: 90,
        fullPage: true,
        clip: {
          x: 0,
          y: 0,
          width,
          height: Math.ceil(bounds.y + bounds.height),
        },
      });
    results.push({
      width,
      height,
      overflow,
      actionsBottom: Math.round(actions.y + actions.height),
    });
  }
  expect(errors).toEqual([]);
  const report = { base, renderer, errors, results };
  await writeFile(
    'docs/hero/screenshots/review.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
