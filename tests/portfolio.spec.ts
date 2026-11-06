import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const axe = readFileSync(resolve('node_modules/axe-core/axe.min.js'), 'utf8');

test('French content, metadata and navigation targets are present', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page).toHaveTitle(/Abdallah Kassan.*IA embarquée/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Ingénieur logiciel',
  );
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'IA embarquée',
  );
  const ids = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')!.slice(1)).filter(Boolean),
    );
  for (const id of new Set(ids))
    expect(await page.locator(`[id="${id}"]`).count(), `Anchor #${id}`).toBe(1);
  expect(errors).toEqual([]);
});

test('project filters change the visible selection and can reset', async ({
  page,
}) => {
  await page.goto('./#projets');
  await expect(
    page.getByRole('button', { name: /Voir le projet/ }),
  ).toHaveCount(6);
  await page.getByRole('button', { name: 'Vision & IA', exact: true }).click();
  await expect(
    page.getByRole('button', { name: /Voir le projet/ }),
  ).toHaveCount(1);
  await expect(
    page.getByRole('heading', {
      name: 'Voir le projet : SecuriSPOT · Vision industrielle',
    }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Cloud & systèmes', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: /Voir le projet/ }),
  ).toHaveCount(2);
  await page
    .getByRole('button', { name: 'Tous les projets', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: /Voir le projet/ }),
  ).toHaveCount(6);
});

test('case study dialog supports keyboard, focus restoration and browser history', async ({
  page,
}) => {
  await page.goto('./#projets');
  const trigger = page.getByRole('button', {
    name: 'Explorer l’étude de cas : SecuriSPOT · Vision industrielle',
  });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('sans benchmark instrumenté');
  await expect(
    dialog.getByRole('link', { name: 'Mon profil GitHub' }),
  ).toHaveAttribute('href', 'https://github.com/kassanabdallah0');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.goBack();
  await expect(dialog).not.toBeVisible();
  await page.goForward();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Fermer l’étude de cas' }).click();
  await expect(dialog).not.toBeVisible();
});

test('deep links and old portfolio links open the correct content', async ({
  page,
}) => {
  await page.goto('./#projet/mediaspot');
  await expect(page.getByRole('dialog')).toContainText(
    '70 PC embarqués supprimés',
  );
  await page.reload();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.goto('./#/projects/edge-delivery');
  await expect(page.getByRole('dialog')).toContainText('Mise à jour du code');
  await page.goto('./#/contact');
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('mobile menu closes on navigation and Escape', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Mobile navigation only');
  await page.goto('./');
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Navigation principale' });
  await expect(nav).toBeVisible();
  await nav.getByRole('link', { name: 'Projets', exact: true }).click();
  await expect(page).toHaveURL(/#projets$/);
  await expect(nav).not.toBeVisible();
  await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Ouvrir le menu' }),
  ).toBeFocused();
});

test('email, social links and clipboard feedback work', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./#contact');
  await expect(
    page.getByRole('link', { name: 'abdallah.kassan.job@outlook.fr' }),
  ).toHaveAttribute('href', 'mailto:abdallah.kassan.job@outlook.fr');
  await expect(
    page.getByRole('link', { name: 'LinkedIn', exact: true }),
  ).toHaveAttribute('href', 'https://www.linkedin.com/in/kassan-abdallah');
  await page.getByRole('button', { name: 'Copier l’adresse email' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Adresse copiée' }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'abdallah.kassan.job@outlook.fr',
  );
});

test('clipboard restrictions give an honest fallback', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('Blocked')) },
    }),
  );
  await page.goto('./#contact');
  await page.getByRole('button', { name: 'Copier l’adresse email' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Copie indisponible' }),
  ).toBeVisible();
});

test('CV download is a real PDF with current content', async ({
  page,
  request,
}) => {
  await page.goto('./#contact');
  const link = page.locator('#accueil').getByRole('link', {
    name: 'Télécharger mon CV',
    exact: true,
  });
  await expect(link).toHaveAttribute(
    'download',
    'CV_Reference_Abdallah_Kassan_2026.pdf',
  );
  const response = await request.get((await link.getAttribute('href'))!);
  expect(response.ok()).toBeTruthy();
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  expect(await response.body()).toEqual(
    readFileSync('public/bucket/abdallah.kassan.pdf'),
  );
  const cv = execFileSync(
    'pdftotext',
    ['public/bucket/abdallah.kassan.pdf', '-'],
    { encoding: 'utf8' },
  );
  expect(cv).toContain('ABDALLAH KASSAN');
  expect(cv).toContain('COLAS');
  expect(cv).toContain('644 Go');
  expect(
    createHash('sha256')
      .update(await response.body())
      .digest('hex'),
  ).toBe('7851b83eba479b97baf2261e6f085a27cda8ce12199de4dd1882b000e404d8b5');
  const legacy = await request.get('/portofolio/bucket/abdallah.kassan.pdf');
  expect(await legacy.body()).toEqual(await response.body());
  expect(
    execFileSync(
      'pdfinfo',
      ['public/bucket/CV_Reference_Abdallah_Kassan_2026.pdf'],
      { encoding: 'utf8' },
    ),
  ).toMatch(/Pages:\s+4/);
  expect(cv).toContain('TensorRT');
  expect(cv).toContain('estimations');
});

test('reduced motion uses the static illustration and disables smooth scrolling', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('.hardware-fallback').first()).toBeVisible();
  expect(await page.locator('.core-visual canvas').count()).toBe(0);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
});

test('missing WebGL keeps the visual and content usable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes('webgl')) return null;
      return original.apply(this, [type, ...args] as Parameters<
        typeof original
      >);
    } as typeof original;
  });
  await page.goto('./');
  await expect(page.locator('.core-static')).toBeVisible();
  await expect(page.locator('.core-static')).not.toHaveClass(/is-hidden/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('3D renders on desktop and its pause control works', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Mobile deliberately uses an animated 2D hardware scene');
  await page.goto('./');
  const pause = page.getByRole('button', {
    name: 'Mettre l’animation 3D en pause',
  });
  await expect(pause).toBeVisible({ timeout: 20000 });
  await expect(page.locator('.core-visual canvas')).toBeVisible();
  await pause.click();
  await expect(
    page.getByRole('button', { name: 'Reprendre l’animation 3D' }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.core-visual canvas')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.core-visual canvas')).toBeVisible({
    timeout: 20000,
  });
  await expect(page.locator('.core-static')).toHaveClass(/is-hidden/);
});

test('no horizontal overflow at common viewport sizes', async ({ page }) => {
  for (const width of [320, 360, 393, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Overflow at ${width}px`,
    ).toBeTruthy();
  }
});

test('automated WCAG AA checks pass on the page and modal', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.addScriptTag({ content: axe });
  const scan = () =>
    page.evaluate(async () => {
      const api = (
        window as unknown as {
          axe: {
            run: (
              options: object,
            ) => Promise<{ violations: { id: string; nodes: unknown[] }[] }>;
          };
        }
      ).axe;
      return (
        await api.run({
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        })
      ).violations.map(({ id, nodes }) => ({
        id,
        nodes: nodes.map((node) => (node as { target: string[] }).target),
      }));
    });
  expect(await scan()).toEqual([]);
  await page
    .getByRole('button', { name: /Voir le projet.*SecuriSPOT · Vision/ })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await scan()).toEqual([]);
});

test('server-rendered content remains readable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Voir le projet : SecuriSPOT · Vision industrielle',
    }),
  ).toBeVisible();
  await expect(
    page.locator('#accueil').getByRole('link', { name: 'Télécharger mon CV' }),
  ).toHaveAttribute(
    'href',
    '/portofolio/bucket/CV_Reference_Abdallah_Kassan_2026.pdf',
  );
  await context.close();
});

test('reference CV additions explain ownership and measurement scope', async ({
  page,
}) => {
  await page.goto('./#projets');
  await page.getByRole('button', { name: 'Logiciel', exact: true }).click();
  await expect(
    page.getByRole('button', { name: /Voir le projet/ }),
  ).toHaveCount(2);
  await page.getByRole('button', { name: /Voir le projet : COLAS/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('10 FPS');
  await expect(dialog).toContainText('développée par un collègue');
  await expect(dialog).toContainText('Le choix technique'.toUpperCase());
  await page.keyboard.press('Escape');
  await page
    .getByRole('button', { name: 'Données & exploitation', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: /Voir le projet/ }),
  ).toHaveCount(1);
  await page
    .getByRole('button', { name: /Voir le projet : Cluster ELK/ })
    .click();
  await expect(dialog).toContainText('180 jours');
  await expect(dialog).toContainText('volumes historiques');
});

test('visible impact links to the supporting case study and the PDF preview loads', async ({
  page,
}) => {
  await page.goto('./');
  await page
    .getByRole('button', { name: 'Découvrir : migrés vers AWS' })
    .click();
  await expect(page.getByRole('dialog')).toContainText(
    '70 PC embarqués supprimés',
  );
  await page.keyboard.press('Escape');
  const preview = page.getByRole('img', {
    name: /Première page du CV de référence/,
  });
  await preview.scrollIntoViewIfNeeded();
  await expect(preview).toBeVisible();
  await expect
    .poll(() =>
      preview.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(
    page.getByRole('link', { name: 'Ouvrir le CV de référence en PDF' }),
  ).toHaveAttribute(
    'href',
    '/portofolio/bucket/CV_Reference_Abdallah_Kassan_2026.pdf',
  );
});
