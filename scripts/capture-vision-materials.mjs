import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
// Actual native-GPU appearance review; no renderer spoof or performance claim.
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/google-chrome',
  args: [
    '--enable-gpu',
    '--use-angle=vulkan',
    '--enable-features=Vulkan',
    '--disable-vulkan-surface',
  ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } }),
  errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://127.0.0.1:4173/portofolio/#projet/jetson-vision');
const demo = page.locator('dialog [data-demo="vision"]');
await demo.locator('canvas[data-context="ready"]').waitFor({ timeout: 30000 });
for (const [stage, name] of [
  [0, 'normal'],
  [3, 'confirmation'],
  [4, 'alert'],
]) {
  await demo.locator('.architecture-stages button').nth(stage).click();
  await page.waitForTimeout(250);
  await demo
    .locator('.vision-experience')
    .screenshot({
      path: `docs/vision/screenshots/full-material-${name}.jpg`,
      type: 'jpeg',
      quality: 90,
      style: '.dialog-top{visibility:hidden!important}',
    });
  console.log('captured full materials', name);
}
const tier = await demo
  .locator('[data-render-tier]')
  .getAttribute('data-render-tier');
await writeFile(
  'docs/vision/screenshots/material-review.json',
  JSON.stringify({ tier, errors }, null, 2),
);
await browser.close();
