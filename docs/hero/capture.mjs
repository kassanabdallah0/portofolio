import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] ?? 'before';
const url = process.argv[3] ?? 'https://kassanabdallah0.github.io/portofolio/';
if (!['before', 'after'].includes(phase))
  throw new Error('Phase must be before or after.');
await mkdir('docs/hero/screenshots', { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? '/usr/bin/google-chrome',
  headless: true,
  args: [
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-gpu-compositing',
  ],
});
const report = [];
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['mobile', 393, 852],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1300);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const pause = page.getByRole('button', {
      name: 'Mettre l’animation 3D en pause',
      exact: true,
    });
    if ((await pause.isVisible()) && (await pause.isEnabled()))
      await pause.click();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({
      path: `docs/hero/screenshots/${phase}-${name}.jpg`,
      type: 'jpeg',
      quality: 90,
      animations: 'disabled',
    });
    report.push({
      name,
      width,
      height,
      url: page.url(),
      title: await page.title(),
      heading: await page.locator('h1').innerText(),
      errors,
    });
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(
  `docs/hero/screenshots/${phase}-capture.json`,
  JSON.stringify({ capturedAt: new Date().toISOString(), report }, null, 2) +
    '\n',
);
console.log(JSON.stringify(report));
