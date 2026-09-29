import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');
const routes = [
  '',
  'projects',
  'experience',
  'skills',
  'about',
  'contact',
  'cv',
  'privacy',
];
const projects = [
  'securispot',
  'mediaspot',
  'jetson-vision',
  'wifi-observability',
  'edge-delivery',
];

async function checkLayout(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
  await expect(page.locator('h1')).toHaveCount(1);
}

test('every page and case study supports direct visits, reload and keyboard navigation', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of [
    ...routes,
    ...projects.map((slug) => `projects/${slug}`),
  ]) {
    await page.goto(`#/${route}`);
    await expect(page.locator('main h1')).toBeVisible();
    await checkLayout(page);
    await expect(page).not.toHaveTitle(/^404/);
  }
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Livraison applicative');
  await page.getByRole('link', { name: 'Tous les projets' }).click();
  await expect(page.locator('main')).toBeFocused();
  await page.goBack();
  await expect(page.locator('h1')).toHaveText('Livraison applicative');
  expect(errors).toEqual([]);
});

test('project filters, accent-insensitive search and empty state work together', async ({
  page,
}) => {
  await page.goto('#/projects');
  await expect(page.locator('.project-card')).toHaveCount(5);
  await page
    .getByRole('button', { name: 'Vision & edge', exact: true })
    .click();
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.locator('.project-card')).toContainText(
    'Vision sur Jetson',
  );
  await page.getByRole('searchbox').fill('not-a-project');
  await expect(
    page.getByRole('heading', { name: 'Aucun projet trouvé' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Réinitialiser' }).click();
  await page.getByRole('searchbox').fill('securispot');
  await expect(page.locator('.project-card')).toHaveCount(1);
  await page.getByRole('searchbox').fill('TensorRT');
  await expect(page.locator('.project-card')).toHaveCount(1);
});

test('language and theme persist and all English pages are usable', async ({
  page,
}) => {
  await page.goto('#/');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const initial = await page.locator('html').getAttribute('data-theme');
  await page
    .getByRole('button', { name: /Switch to (dark|light) mode/ })
    .click();
  const changed = initial === 'light' ? 'dark' : 'light';
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', changed);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  for (const route of [
    ...routes,
    ...projects.map((slug) => `projects/${slug}`),
  ]) {
    await page.goto(`#/${route}`);
    await checkLayout(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  }
});

test('CV downloads are real files and the old URL is preserved', async ({
  page,
  request,
}) => {
  await page.goto('#/cv');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Télécharger mon CV' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('CV_Abdallah_Kassan.pdf');
  const pdf = await request.get('bucket/abdallah.kassan.pdf');
  expect(pdf.ok()).toBe(true);
  expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');
  const docx = await request.get('bucket/CV_Abdallah_Kassan_ATS.docx');
  expect((await docx.body()).subarray(0, 2).toString()).toBe('PK');
  const text = await request.get('bucket/CV_Abdallah_Kassan_ATS.txt');
  expect(await text.text()).toContain('Juil. – déc. 2023');
});

test('contact validates fields, prepares a draft and handles clipboard failure honestly', async ({
  page,
}) => {
  await page.goto('#/contact');
  await page.getByRole('button', { name: 'Ouvrir ma messagerie' }).click();
  await expect(page.locator('input[name="name"]')).toBeFocused();
  await expect(page.locator('.form-status')).toHaveCount(0);
  await page.getByLabel('Nom *', { exact: true }).fill('Test recrutement');
  await page.getByLabel('Email *', { exact: true }).fill('test@example.org');
  await page
    .getByLabel('Message *', { exact: true })
    .fill('Présentation d’un poste Full Stack à Lyon.');
  await page.getByRole('button', { name: 'Ouvrir ma messagerie' }).click();
  await expect(page.locator('.form-status')).toContainText(
    'Aucun message n’a été envoyé',
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    }),
  );
  await page.getByRole('button', { name: 'Copier l’adresse' }).click();
  await expect(page.locator('.copy-status')).toContainText(
    'Copie indisponible',
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.resolve() },
    }),
  );
  await page.getByRole('button', { name: 'Copier l’adresse' }).click();
  await expect(page.locator('.copy-status')).toHaveText('Adresse copiée.');
});

test('unknown routes and unavailable local storage do not break the site', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('Storage blocked');
    };
    Storage.prototype.setItem = () => {
      throw new Error('Storage blocked');
    };
  });
  await page.goto('#/projects/unknown');
  await expect(
    page.getByRole('heading', { name: 'Cette page n’existe pas.' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Retour à l’accueil' }).click();
  await expect(page.locator('h1')).toContainText('Full Stack');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('mobile menu supports navigation and Escape', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.goto('#/');
  const menu = page.getByRole('button', { name: 'Ouvrir le menu' });
  await menu.click();
  await expect(
    page.getByRole('button', { name: 'Fermer le menu' }),
  ).toHaveAttribute('aria-expanded', 'true');
  await page
    .locator('#mobile-navigation')
    .getByRole('link', { name: 'Compétences' })
    .click();
  await expect(page.locator('h1')).toContainText('technologies');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.locator('#mobile-navigation a').first().focus();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
});

test('core pages pass automated WCAG AA checks in both themes', async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const theme of ['light', 'dark']) {
    for (const route of [...routes, 'projects/jetson-vision']) {
      await page.goto(`#/${route}`);
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async () => {
        const axe = (window as unknown as { axe: typeof import('axe-core') })
          .axe;
        const results = await axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        });
        return results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        }));
      });
      expect(violations, `${theme} /${route}`).toEqual([]);
    }
  }
});
