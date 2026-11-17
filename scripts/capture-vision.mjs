import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const dir = 'docs/vision/screenshots';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/google-chrome',
  args: process.argv.includes('--software')
    ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
    : [
        '--enable-gpu',
        '--use-angle=vulkan',
        '--enable-features=Vulkan',
        '--disable-vulkan-surface',
      ],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } }),
  errors = [],
  captures = [];
page.on('pageerror', (e) => errors.push(e.message));
const base = 'http://127.0.0.1:4173/portofolio/';
async function shot(locator, name) {
  await locator.screenshot({
    path: dir + '/' + name + '.jpg',
    type: 'jpeg',
    quality: 90,
    style: '.dialog-top,.site-header,.skip-link{visibility:hidden!important}',
  });
  console.log('captured', name);
  captures.push({
    name,
    time: await page
      .locator('dialog [data-demo="vision"]')
      .getAttribute('data-simulation-ms')
      .catch(() => null),
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
  });
}
await page.goto(base + '#projet/jetson-vision');
const demo = page.locator('dialog [data-demo="vision"]'),
  scene = demo.locator('.vision-experience');
await demo.locator('canvas[data-context="ready"]').waitFor({ timeout: 30000 });
for (const [stage, name] of [
  [0, 'normal'],
  [1, 'entry'],
  [2, 'tracking'],
  [3, 'confirmation'],
  [4, 'alert'],
]) {
  await demo.locator('.architecture-stages button').nth(stage).click();
  await page.waitForTimeout(250);
  await shot(scene, 'desktop-' + name);
}
await demo.getByRole('button', { name: 'Caméra', exact: true }).click();
await shot(scene, 'desktop-camera');
await demo.getByRole('button', { name: 'Pipeline', exact: true }).click();
await shot(scene, 'desktop-pipeline');
await demo.locator('.architecture-stages button').nth(3).click();
await demo.getByRole('button', { name: '5 → 30 FPS', exact: true }).click();
await shot(scene, 'desktop-throughput');
await demo.getByRole('button', { name: 'Atelier', exact: true }).click();
await demo
  .getByRole('button', { name: 'Explorer un passage bref', exact: true })
  .click();
await demo.locator('.architecture-stages button').nth(2).click();
await shot(scene, 'desktop-brief-passage');
await demo
  .getByRole('button', { name: 'Passage bref · sans alarme', exact: true })
  .click();
// Watch one complete real rendered cycle. No fake browser clock or hidden seek.
await demo.getByRole('button', { name: 'Rejouer le scénario' }).click();
let sampled = 0,
  previous = -1;
const sequence = [];
const targets = [3, 6.3, 8.5, 11, 14, 18, 24, 29.85, 30.15, 33];
const started = Date.now();
while (sampled < targets.length && Date.now() - started < 240000) {
  const t = Number(await demo.getAttribute('data-simulation-ms')) / 1000;
  if (t >= targets[sampled]) {
    const phase = await scene.getAttribute('data-vision-phase');
    console.log('cycle', t, phase);
    sequence.push({ target: targets[sampled], actual: t, phase });
    if ([14, 29.85, 30.15].includes(targets[sampled]))
      await shot(scene, 'cycle-' + String(targets[sampled]).replace('.', '-'));
    sampled++;
  }
  if (t < previous)
    throw new Error('Simulation time reset during passive observation');
  previous = t;
  await page.waitForTimeout(150);
}
await demo.getByRole('button', { name: /Mettre en pause/ }).click();
await shot(demo, 'desktop-dialog');
// Compact project card: same scene with adaptive framing.
await page.keyboard.press('Escape');
const card = page.locator('.project-vision');
await card.locator('[data-demo="vision"]').scrollIntoViewIfNeeded();
await card.locator('canvas[data-context="ready"]').waitFor({ timeout: 30000 });
await card.locator('.architecture-stages button').nth(4).click();
await page.waitForTimeout(350);
await shot(card, 'desktop-card');
for (const width of [320, 360, 393, 768, 1024]) {
  await page.setViewportSize({ width, height: 1100 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base + '#projet/jetson-vision');
  const d = page.locator('dialog [data-demo="vision"]');
  await d.waitFor();
  await d.locator('.architecture-stages button').nth(3).click();
  await shot(d, 'fallback-' + width);
}
const renderer = await page.evaluate(() => {
  const gl = document.createElement('canvas').getContext('webgl2');
  const info = gl?.getExtension('WEBGL_debug_renderer_info');
  const name =
    gl && info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : 'unavailable';
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  return name;
});
const report = {
  renderer,
  errors,
  captures,
  cycle: {
    complete: sampled === targets.length,
    reviewWorkflowElapsedMs: Date.now() - started,
    sequence,
  },
};
await writeFile(
  'docs/vision/screenshots/review-report.json',
  JSON.stringify(report, null, 2),
);
await browser.close();
console.log(
  JSON.stringify({
    errors,
    captures: captures.length,
    cycleComplete: report.cycle.complete,
    overflow: captures.filter((c) => c.overflow),
  }),
);
