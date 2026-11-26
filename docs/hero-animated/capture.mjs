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
const report = { base, errors: [], motion: [], layouts: [] };
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  page.on('pageerror', (error) => report.errors.push(error.message));
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  const scene = page.locator('.cinematic-overview');
  await expect(scene.locator('canvas')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.core-static')).toHaveClass(/is-hidden/);
  report.renderer = await scene.locator('canvas').evaluate((el) => {
    const gl = el.getContext('webgl2'),
      debug = gl?.getExtension('WEBGL_debug_renderer_info');
    return debug
      ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
      : 'unavailable';
  });
  const frontend = scene.getByRole('button', {
    name: 'Interfaces',
    exact: true,
  });
  await frontend.click();
  await frontend.click();
  // Observe real elapsed animation rather than replacing it with screenshots.
  for (let i = 0; i < 3; i++) {
    if (i) await page.waitForTimeout(2400);
    const geometry = await scene.evaluate((el) => ({
      time: el.getAttribute('data-simulation-ms'),
      zone: el.querySelector('[data-zone]').getAttribute('width'),
      cursor: el.querySelector('[data-hero-cursor]').getAttribute('transform'),
      cards: el.querySelector('[data-portal-cards]').getAttribute('transform'),
    }));
    report.motion.push(geometry);
    await page.screenshot({
      path: `docs/hero-animated/screenshots/motion-${i}.jpg`,
      type: 'jpeg',
      quality: 90,
    });
  }
  expect(new Set(report.motion.map((x) => x.zone)).size).toBeGreaterThan(1);
  expect(new Set(report.motion.map((x) => x.cards)).size).toBeGreaterThan(1);
  await scene
    .getByRole('button', {
      name: 'Mettre l’animation 3D en pause',
      exact: true,
    })
    .click();
  await page.screenshot({
    path: 'docs/hero-animated/screenshots/after-desktop.jpg',
    type: 'jpeg',
    quality: 90,
    animations: 'disabled',
  });
  for (const width of [320, 360, 393, 768, 1024, 1440]) {
    const height = width === 393 ? 852 : 900;
    await page.setViewportSize({ width, height });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    expect(overflow).toBe(false);
    const frame = await scene.boundingBox(),
      actions = await page.locator('.hero-actions').boundingBox();
    if (width === 393 || width === 1440) {
      expect(actions.y + actions.height).toBeLessThanOrEqual(height);
      expect(frame.y + frame.height).toBeLessThanOrEqual(height);
    }
    for (const target of await scene
      .locator('.showcase-window,.showcase-service,.showcase-endpoint')
      .all()) {
      const bounds = await target.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
    }
    await page.screenshot({
      path: `docs/hero-animated/screenshots/viewport-${width}.jpg`,
      type: 'jpeg',
      quality: 90,
    });
    if (width === 393)
      await page.screenshot({
        path: 'docs/hero-animated/screenshots/after-mobile.jpg',
        type: 'jpeg',
        quality: 90,
      });
    report.layouts.push({
      width,
      height,
      overflow,
      sceneBottom: Math.round(frame.y + frame.height),
      actionsBottom: Math.round(actions.y + actions.height),
    });
  }
  expect(report.errors).toEqual([]);
  await writeFile(
    'docs/hero-animated/screenshots/review.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
