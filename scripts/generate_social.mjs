// Reuse the actual hardware illustration; run the static preview first.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const font = readFileSync(
  'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
).toString('base64');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {}),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  await page.goto('http://127.0.0.1:4173/portofolio/');
  const hardware = await page
    .locator('.hardware-fallback')
    .evaluate((el) => el.outerHTML);
  await page.setContent(`<!doctype html><html lang="fr"><meta charset="utf-8"><style>
  @font-face{font-family:Inter;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;font-family:Inter,sans-serif;background:radial-gradient(ellipse at 84% 50%,#dfeaf2,transparent 55%),#f6f7f8;color:#16191d}main{padding:60px}.name{font-size:22px;display:flex;gap:22px;align-items:center;letter-spacing:-.5px}.mark{font-size:38px;letter-spacing:-5px;font-weight:600;color:#527e96}h1{font-size:57px;line-height:1.12;letter-spacing:-3.7px;font-weight:570;margin:70px 0 27px;position:relative;z-index:1}h1 span{display:block}h1 span:nth-child(2){color:#7b848d}h1 span:last-child{color:#52768c}.label{font-size:14px;color:#536b7c}.bottom{position:absolute;bottom:44px;left:60px;right:60px;border-top:1px solid #cdd9e2;padding-top:22px;display:flex;justify-content:space-between;color:#536b7c;font-size:12px}svg{position:absolute;right:-15px;top:135px;width:580px;height:400px}.eyebrow{position:absolute;right:71px;top:113px;font-size:12px;color:#5b7487}</style><main><div class="name"><span class="mark">ak</span>Abdallah Kassan</div><h1><span>Ingénieur logiciel.</span><span>Systèmes intelligents.</span><span>IA embarquée.</span></h1><p class="label">Full Stack &nbsp; / &nbsp; Cloud &nbsp; / &nbsp; Vision embarquée</p><p class="eyebrow">Du monde physique à la décision.</p>${hardware}<div class="bottom"><span>Ingénieur UTT · Caen, France</span><span>kassanabdallah0.github.io/portofolio</span></div></main></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/social-preview.png' });
  console.log('Created public/social-preview.png');
} finally {
  await browser.close();
}
