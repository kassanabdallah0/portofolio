import { test, expect } from '@playwright/test';

test('recruiter overview prioritizes work and offers quiet previews with a direct CV link', async ({
  page,
}) => {
  await page.goto('./');
  expect(
    await page
      .locator('main > section[id]')
      .evaluateAll((nodes) => nodes.map((node) => node.id)),
  ).toEqual([
    'accueil',
    'projets',
    'parcours',
    'a-propos',
    'expertise',
    'technologies',
    'contact',
  ]);
  const names = await page.locator('.project-card h3').allTextContents();
  expect(names.slice(0, 3).map((name) => name.trim())).toEqual([
    'SecuriSPOT Manager · Application métier',
    'SecuriSPOT · Vision industrielle',
    'MediaSpot · Mobilité connectée',
  ]);
  await expect(page.locator('[data-presentation="preview"]')).toHaveCount(6);
  await expect(page.locator('.project-card .demo-pause')).toHaveCount(6);
  await expect(
    page.locator(
      '.project-card .architecture, .project-card .demo-interaction',
    ),
  ).toHaveCount(0);
  for (const tags of await page
    .locator('.project-card .tag-list')
    .evaluateAll((nodes) => nodes.map((node) => node.children.length)))
    expect(tags).toBeLessThanOrEqual(4);
  await expect(
    page.locator('#accueil').getByRole('link', { name: 'Télécharger mon CV' }),
  ).toHaveAttribute('download', 'CV_Reference_Abdallah_Kassan_2026.pdf');
});

test('every case study keeps its full demo and a reachable close button after scrolling', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const slug of [
    'securispot',
    'jetson-vision',
    'mediaspot',
    'edge-delivery',
    'colas-scan-epi',
    'elk-exploitation',
  ]) {
    await page.goto(`./#projet/${slug}`);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.locator('[data-presentation="full"] .architecture'),
    ).toHaveCount(1);
    const order = await dialog.locator('.dialog-content').evaluate((el) =>
      Array.from(el.children)
        .filter((node) =>
          [
            'project-role',
            'result-block',
            'scope-note',
            'engineering-demo',
            'decision-block',
            'contribution-list',
          ].some((name) => node.classList.contains(name)),
        )
        .map((node) => node.classList[0]),
    );
    expect(order).toEqual([
      'project-role',
      'result-block',
      'scope-note',
      'engineering-demo',
      'decision-block',
      'contribution-list',
    ]);
    await dialog
      .locator('.contribution-list')
      .evaluate((el) => el.scrollIntoView({ behavior: 'instant' }));
    const close = dialog.getByRole('button', { name: 'Fermer l’étude de cas' });
    await expect(close).toBeInViewport();
    await close.click();
    await expect(dialog).not.toBeVisible();
  }
});
