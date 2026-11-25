import { test, expect, type Locator } from '@playwright/test';

const CV_PATH = '/portofolio/bucket/CV_Reference_Abdallah_Kassan_2026.pdf';
const CV_NAME = 'CV_Reference_Abdallah_Kassan_2026.pdf';

async function expectLayer(overview: Locator, layer: string) {
  await expect(overview).toHaveAttribute('data-layer', layer);
  for (const project of ['securispot', 'mediaspot']) {
    const lane = overview.locator(`[data-project="${project}"]`);
    await expect(
      lane.locator('.overview-node[data-active="true"]'),
    ).toHaveCount(1);
    await expect(
      lane.locator(`.overview-node[data-layer="${layer}"]`),
    ).toHaveAttribute('data-active', 'true');
  }
}

test('hero shows two separate and technically correct software product paths', async ({
  page,
}) => {
  await page.goto('./');
  const overview = page.locator('.core-visual.software-overview');
  const manager = overview.locator(
    '.overview-project[data-project="securispot"]',
  );
  const media = overview.locator('.overview-project[data-project="mediaspot"]');
  await expect(manager).toBeVisible();
  await expect(media).toBeVisible();
  await expect(overview.locator('.overview-project')).toHaveCount(2);
  await expect(manager.locator('.overview-node strong')).toHaveText([
    'React',
    'Python · Flask',
    'NVIDIA Jetson',
  ]);
  await expect(media.locator('.overview-node strong')).toHaveText([
    'React',
    'Node.js · TypeScript',
    'AWS',
  ]);
  await expect(manager).toContainText(/configuration|supervision/i);
  await expect(media).toContainText(/passagers|contenus|services/i);
  await expect(manager).not.toContainText(/Node\.js|AWS/);
  await expect(media).not.toContainText(/Flask|Jetson/);
});

test('layer inspection freezes both paths and selecting it again resumes unless manually paused', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('./');
  const overview = page.locator('.core-visual.software-overview');
  await expect(overview).toHaveAttribute('data-running', 'true');
  const backend = overview.getByRole('button', {
    name: 'API & Backend',
    exact: true,
  });
  await backend.click();
  await expect(backend).toHaveAttribute('aria-pressed', 'true');
  await expectLayer(overview, 'backend');
  await expect(overview).toHaveAttribute('data-running', 'false');
  await expect(overview.locator('[data-layer-explanation]')).toContainText(
    /API.*Python\/Flask.*Node\.js\/TypeScript/,
  );
  await page.clock.runFor(6500);
  await expectLayer(overview, 'backend');
  await expect(backend).toHaveAttribute('aria-pressed', 'true');
  await backend.click();
  await expect(backend).toHaveAttribute('aria-pressed', 'false');
  await expect(overview).toHaveAttribute('data-running', 'true');
  await page.clock.runFor(6100);
  await expectLayer(overview, 'production');
  await expect(overview.locator('.overview-project')).toHaveCount(2);
  await expect(overview.locator('.overview-node')).toHaveCount(6);

  await overview
    .getByRole('button', {
      name: 'Mettre l’animation 3D en pause',
      exact: true,
    })
    .click();
  const production = overview.getByRole('button', {
    name: 'Cloud & Edge',
    exact: true,
  });
  await production.click();
  await expectLayer(overview, 'production');
  await expect(overview.locator('[data-layer-explanation]')).toContainText(
    /AWS.*Jetson/,
  );
  await production.click();
  await expect(production).toHaveAttribute('aria-pressed', 'false');
  await expect(overview).toHaveAttribute('data-running', 'false');
  await overview
    .getByRole('button', { name: 'Reprendre l’animation 3D', exact: true })
    .click();
  await expect(overview).toHaveAttribute('data-running', 'true');
});

test('reduced-motion visitors can inspect every software layer without starting animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const overview = page.locator('.core-visual.software-overview');
  await expect(overview.locator('canvas')).toHaveCount(0);
  await expect(
    overview.getByRole('button', { name: /l’animation 3D/ }),
  ).toBeDisabled();
  for (const [name, layer, explanation] of [
    ['Interfaces', 'interface', /interfaces React/],
    ['API & Backend', 'backend', /API.*logique métier/],
    ['Cloud & Edge', 'production', /déploie.*AWS.*Jetson/],
  ] as const) {
    const control = overview.getByRole('button', { name, exact: true });
    await control.click();
    await expectLayer(overview, layer);
    await expect(overview.locator('[data-layer-explanation]')).toContainText(
      explanation,
    );
    await expect(overview).toHaveAttribute('data-running', 'false');
    await control.click();
    await expect(control).toHaveAttribute('aria-pressed', 'false');
    await expect(overview).toHaveAttribute('data-running', 'false');
  }
});

test('hero project buttons open the correct case study by keyboard and restore focus', async ({
  page,
}) => {
  await page.goto('./');
  const overview = page.locator('.core-visual.software-overview');
  for (const [name, slug, evidence] of [
    ['SecuriSPOT Manager', 'securispot', /Flask/],
    ['MediaSpot', 'mediaspot', /70 PC embarqués supprimés/],
  ] as const) {
    const trigger = overview.getByRole('button', { name, exact: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#projet/${slug}$`));
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText(evidence);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test('the headline, two primary actions and software overview fit the first screen', async ({
  page,
  isMobile,
}) => {
  const viewport = isMobile
    ? { width: 393, height: 852 }
    : { width: 1440, height: 900 };
  await page.setViewportSize(viewport);
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator('#accueil');
  const heading = hero.getByRole('heading', { level: 1 });
  const projects = hero.getByRole('link', {
    name: 'Voir mes réalisations',
    exact: true,
  });
  const cv = hero.getByRole('link', {
    name: 'Télécharger mon CV',
    exact: true,
  });
  await expect(heading).toContainText('Ingénieur logiciel');
  await expect(heading).toContainText('Full Stack & Backend');
  await expect(projects).toHaveAttribute('href', '#projets');
  await expect(cv).toHaveAttribute('href', CV_PATH);
  await expect(cv).toHaveAttribute('download', CV_NAME);
  const firstScreen = [heading, projects, cv];
  // On mobile the complete stacked overview follows the introduction/actions.
  // On desktop the overview shares that same first screen.
  if (!isMobile)
    firstScreen.push(hero.locator('.core-visual.software-overview'));
  for (const element of firstScreen) {
    await expect(element).toBeVisible();
    const bounds = await element.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height + 1);
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width + 1);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await projects.click();
  await expect(page).toHaveURL(/#projets$/);
});

test('the first screen keeps both complete software paths and the original CV without JavaScript', async ({
  browser,
  baseURL,
  isMobile,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: isMobile
      ? { width: 393, height: 852 }
      : { width: 1440, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    const hero = page.locator('#accueil');
    await expect(hero.getByRole('heading', { level: 1 })).toContainText(
      'Full Stack & Backend',
    );
    const lanes = hero.locator('.overview-project');
    await expect(lanes).toHaveCount(2);
    for (const lane of await lanes.all()) {
      await expect(lane).toBeVisible();
      await expect(lane.locator('.overview-node')).toHaveCount(3);
      const bounds = await lane.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      if (!isMobile)
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(901);
    }
    await expect(
      hero.getByRole('link', { name: 'Voir mes réalisations', exact: true }),
    ).toHaveAttribute('href', '#projets');
    await expect(
      hero.getByRole('link', { name: 'Télécharger mon CV', exact: true }),
    ).toHaveAttribute('href', CV_PATH);
  } finally {
    await context.close();
  }
});
