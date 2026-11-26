import { test, expect, type Locator } from '@playwright/test';

const CV_PATH = '/portofolio/bucket/CV_Reference_Abdallah_Kassan_2026.pdf';
const CV_NAME = 'CV_Reference_Abdallah_Kassan_2026.pdf';

async function expectLayer(overview: Locator, layer: string) {
  await expect(overview).toHaveAttribute('data-layer', layer);
  // Both products stay present while their common presentation stage changes.
  await expect(overview.locator('.showcase-window')).toHaveCount(2);
  await expect(overview.locator('.showcase-service')).toHaveCount(2);
  await expect(overview.locator('.showcase-endpoint')).toHaveCount(2);
}

async function svgGeometry(overview: Locator) {
  return readGeometry(overview.locator('[data-zone], [data-hero-cursor]'));
}

async function readGeometry(elements: Locator) {
  return elements.evaluateAll((elements) =>
    elements.map((element) =>
      Object.fromEntries(
        ['x', 'y', 'width', 'height', 'cx', 'cy', 'transform', 'd'].map(
          (name) => [name, element.getAttribute(name)],
        ),
      ),
    ),
  );
}

test('hero shows two illustrated products with their own backend and deployment target', async ({
  page,
}) => {
  await page.goto('./');
  const overview = page.locator(
    '.core-visual.software-overview.cinematic-overview',
  );
  const manager = overview.locator(
    '.showcase-window[data-project="securispot"]',
  );
  const media = overview.locator('.showcase-window[data-project="mediaspot"]');
  await expect(manager).toBeVisible();
  await expect(media).toBeVisible();
  await expect(overview.locator('.showcase-window')).toHaveCount(2);
  await expect(
    manager.getByRole('button', { name: 'SecuriSPOT Manager', exact: true }),
  ).toBeVisible();
  await expect(
    media.getByRole('button', { name: 'MediaSpot', exact: true }),
  ).toBeVisible();
  await expect(manager.locator('[data-zone]').first()).toBeVisible();
  await expect(overview.locator('[data-hero-cursor]').first()).toBeVisible();
  for (const [project, backend, destination] of [
    ['securispot', 'Flask', 'Jetson'],
    ['mediaspot', 'Node.js', 'AWS'],
  ] as const) {
    const service = overview.locator(
      `.showcase-service[data-project="${project}"]`,
    );
    const endpoint = overview.locator(
      `.showcase-endpoint[data-project="${project}"]`,
    );
    await expect(service).toBeVisible();
    await expect(service).toHaveAttribute('data-layer', 'backend');
    await expect(service).toContainText(backend);
    await expect(endpoint).toBeVisible();
    await expect(endpoint).toContainText(destination);
    await expect(service).not.toContainText(
      project === 'securispot' ? 'Node.js' : 'Flask',
    );
    await expect(endpoint).not.toContainText(
      project === 'securispot' ? 'AWS' : 'Jetson',
    );
  }
});

test('the interface visibly animates, inspection freezes geometry, and repeat selection respects manual pause', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('./');
  const overview = page.locator('.core-visual.software-overview');
  await overview.scrollIntoViewIfNeeded();
  await expect(overview).toHaveAttribute('data-running', 'true');
  await expectLayer(overview, 'interface');
  const zone = overview
    .locator('.showcase-window[data-project="securispot"] [data-zone]')
    .first();
  const cursor = overview.locator('[data-hero-cursor]').first();
  await expect(zone).toBeVisible();
  await expect(cursor).toBeVisible();
  const before = await svgGeometry(overview);
  const zoneBefore = await readGeometry(zone);
  const cursorBefore = await readGeometry(cursor);
  await page.clock.runFor(1400);
  expect(await svgGeometry(overview)).not.toEqual(before);
  expect(await readGeometry(zone)).not.toEqual(zoneBefore);
  expect(await readGeometry(cursor)).not.toEqual(cursorBefore);

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
  const inspectedGeometry = await svgGeometry(overview);
  const inspectedTime = await overview.getAttribute('data-simulation-ms');
  await page.clock.runFor(6500);
  await expectLayer(overview, 'backend');
  expect(await svgGeometry(overview)).toEqual(inspectedGeometry);
  await expect(overview).toHaveAttribute('data-simulation-ms', inspectedTime!);
  await backend.click();
  await expect(backend).toHaveAttribute('aria-pressed', 'false');
  await expect(overview).toHaveAttribute('data-running', 'true');
  await page.clock.runFor(6100);
  await expectLayer(overview, 'production');
  expect(
    Number(await overview.getAttribute('data-simulation-ms')),
  ).toBeGreaterThan(Number(inspectedTime));
  await expect(overview.locator('[data-layer-explanation]')).toContainText(
    /AWS.*Jetson/,
  );

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
  const pausedGeometry = await svgGeometry(overview);
  await production.click();
  await expect(production).toHaveAttribute('aria-pressed', 'false');
  await expect(overview).toHaveAttribute('data-running', 'false');
  await page.clock.runFor(1200);
  expect(await svgGeometry(overview)).toEqual(pausedGeometry);
  await overview
    .getByRole('button', { name: 'Reprendre l’animation 3D', exact: true })
    .click();
  await expect(overview).toHaveAttribute('data-running', 'true');
});

test('reduced-motion visitors inspect every layer while actual illustration geometry remains frozen', async ({
  page,
}) => {
  await page.clock.install();
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
    const frozen = await svgGeometry(overview);
    expect(frozen.length).toBeGreaterThanOrEqual(2);
    await page.clock.runFor(1200);
    expect(await svgGeometry(overview)).toEqual(frozen);
    await control.click();
    await expect(control).toHaveAttribute('aria-pressed', 'false');
    await expect(overview).toHaveAttribute('data-running', 'false');
    await page.clock.runFor(1200);
    expect(await svgGeometry(overview)).toEqual(frozen);
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

test('hero actions stay above the fold and the desktop artboard fits the first screen', async ({
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
    name: 'Voir mes projets',
    exact: true,
  });
  const cv = hero.getByRole('link', {
    name: 'Télécharger mon CV',
    exact: true,
  });
  await expect(heading).toContainText('Ingénieur logiciel');
  await expect(heading).toContainText('Full Stack & Backend');
  await expect(projects).toHaveText('Projets');
  await expect(cv).toHaveText('CV');
  await expect(projects).toHaveAttribute('href', '#projets');
  await expect(cv).toHaveAttribute('href', CV_PATH);
  await expect(cv).toHaveAttribute('download', CV_NAME);
  const firstScreen = [heading, projects, cv];
  // The complete visual artboard fits alongside or below the compact copy.
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

test('both illustrated products and their technical paths remain readable without JavaScript', async ({
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
    const lanes = hero.locator('.showcase-window');
    await expect(lanes).toHaveCount(2);
    for (const lane of await lanes.all()) {
      await expect(lane).toBeVisible();
      await expect(
        lane.locator('svg.showcase-screen > rect').first(),
      ).toBeVisible();
      const bounds = await lane.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      if (!isMobile)
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(901);
    }
    await expect(
      hero.locator('.showcase-service[data-project="securispot"]'),
    ).toContainText('Flask');
    await expect(
      hero.locator('.showcase-service[data-project="mediaspot"]'),
    ).toContainText('Node.js');
    await expect(
      hero.locator('.showcase-endpoint[data-project="securispot"]'),
    ).toContainText('Jetson');
    await expect(
      hero.locator('.showcase-endpoint[data-project="mediaspot"]'),
    ).toContainText('AWS');
    await expect(
      hero.getByRole('link', { name: 'Voir mes projets', exact: true }),
    ).toHaveAttribute('href', '#projets');
    await expect(
      hero.getByRole('link', { name: 'Télécharger mon CV', exact: true }),
    ).toHaveAttribute('href', CV_PATH);
  } finally {
    await context.close();
  }
});
