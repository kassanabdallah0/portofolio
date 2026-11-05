// Render the code-native social card; no image generation service or external assets.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const font = readFileSync(
  'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
).toString('base64');
const points = Array.from({ length: 64 }, (_, i) => {
  const z = 1 - (2 * (i + 0.5)) / 64,
    a = i * 2.399963,
    r = Math.sqrt(1 - z * z);
  return {
    x: 300 + r * Math.cos(a) * 181,
    y: 300 + (r * Math.sin(a) * 0.91 + z * 0.28) * 181,
    z,
  };
});
const lines = points
  .flatMap((p, i) =>
    points
      .slice(i + 1)
      .filter((q) => Math.hypot(p.x - q.x, p.y - q.y, (p.z - q.z) * 181) < 103)
      .map((q) => `<path d="M${p.x},${p.y}L${q.x},${q.y}"/>`),
  )
  .join('');
const dots = points
  .map((p) => `<circle cx="${p.x}" cy="${p.y}" r="2" fill="#a9f8ff"/>`)
  .join('');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {}),
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(`<!doctype html><html lang="fr"><meta charset="utf-8"><style>
@font-face{font-family:Space;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:300 700}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;color:#f1f5f9;background:#06090f;font-family:Space,sans-serif;overflow:hidden}body:before{content:'';position:absolute;inset:0;background-image:linear-gradient(#24404f20 1px,transparent 1px),linear-gradient(90deg,#24404f20 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(90deg,transparent,black)}main{position:absolute;inset:0;padding:64px 70px}.name{font-size:25px;letter-spacing:-.6px;display:flex;gap:16px;align-items:center}.mark{font-size:35px;letter-spacing:-3px;color:#00e5ff;border:1px solid #416072;padding:0 10px 3px}h1{font-size:61px;line-height:1.14;letter-spacing:-3px;font-weight:500;margin:65px 0 27px}h1 span{color:#65e5ef}.label{color:#95a8bc;font-size:16px;letter-spacing:.5px}.bottom{position:absolute;left:70px;bottom:48px;color:#95a8bc;font-size:15px}.dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#50d2ad;margin-right:10px}svg{position:absolute;right:-75px;top:78px;width:590px;height:590px}.line{width:50px;height:2px;background:#00e5ff;margin-bottom:20px}</style>
<svg viewBox="0 0 600 600" fill="none" aria-hidden="true"><g stroke="#00b9d0" stroke-opacity=".32" stroke-width=".9">${lines}</g><ellipse cx="300" cy="300" rx="244" ry="95" transform="rotate(-28 300 300)" stroke="#00e5ff" stroke-opacity=".4"/><ellipse cx="300" cy="300" rx="245" ry="124" transform="rotate(48 300 300)" stroke="#8183ef" stroke-opacity=".5"/><path d="M300 212 380 262 350 359 250 359 220 262ZM300 212 300 310 350 359M300 310 250 359M220 262 300 310 380 262" stroke="#56e8f8"/>${dots}</svg>
<main><div class="name"><span class="mark">ak</span>Abdallah Kassan</div><h1>Logiciel.<br>Systèmes intelligents.<br><span>IA embarquée.</span></h1><div class="line"></div><p class="label">DE L’ALGORITHME AU MONDE RÉEL.</p><div class="bottom"><span class="dot"></span>Ingénieur UTT · Caen, France</div></main></html>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/social-preview.png' });
await browser.close();
console.log('Created public/social-preview.png');
