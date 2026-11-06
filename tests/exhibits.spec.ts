import { test, expect } from '@playwright/test';
test('3D exhibits represent different systems and label FPS scopes correctly', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The mobile experience deliberately uses the lightweight 2D alternative');
  await page.goto('./#projet/colas-scan-epi');
  const scan = page.getByRole('dialog').locator('[data-demo="scan"]');
  await expect(scan.locator('[data-three-scene="scan"]')).toBeVisible();
  await expect(scan.locator('canvas')).toBeVisible();
  await expect(scan).toContainText('AFFICHAGE · TV');
  await expect(scan).toContainText('≈ 2–3 → 10 FPS');
  await expect(scan).toContainText('pas FPS d’inférence');

  await page.goto('./#projet/mediaspot');
  const cloud = page.getByRole('dialog').locator('[data-demo="cloud"]');
  await expect(cloud.locator('[data-three-scene="cloud"]')).toBeVisible();
  await expect(cloud).toContainText('Wi-Fi local');
  await expect(cloud).toContainText('RUTX11 + cellulaire');
  await expect(cloud).toContainText('OpenVPN sur EC2');

  await page.goto('./#projet/jetson-vision');
  const vision = page.getByRole('dialog').locator('[data-demo="vision"]');
  await expect(vision.locator('[data-three-scene="vision"]')).toBeVisible();
  await expect(vision).toContainText('TRAITEMENT SUR JETSON');
  await expect(vision).toContainText('≈ 5 → 30 FPS');
  await expect(vision).toContainText('pas cadence d’affichage');
});

test('six genuine engineering exhibits render without invisible legacy SVGs', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#projets');
  for (const name of [
    'vision',
    'interface',
    'cloud',
    'delivery',
    'scan',
    'observability',
  ]) {
    await expect(page.locator(`[data-demo="${name}"] [data-lab="${name}"]`)).toHaveCount(1);
  }
  await expect(page.locator('.lab-compatibility-scene')).toHaveCount(0);
  await expect(page.locator('.lab-blueprint')).toHaveCount(6);
});

test('manager visual follows the edited value and the last applied configuration', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#projet/securispot');
  const dialog = page.getByRole('dialog');
  const demo = dialog.locator('[data-demo="interface"]');
  const slider = demo.getByRole('slider', { name: 'Taille de la zone' });
  await slider.fill('80');
  await expect(demo.locator('.lab-manager-feed')).toContainText('ROI 01 · 80%');
  await expect(demo.locator('.lab-config-state')).toContainText(
    'Modification non appliquée',
  );
  await demo.getByRole('button', { name: 'Appliquer', exact: true }).click();
  await expect(demo.locator('.lab-config-state')).toContainText(
    'Configuration active : 80%',
  );
});

test('simulation, active diagram and pause share one persistent clock', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('./#projet/jetson-vision');
  const demo = page.getByRole('dialog').locator('[data-demo="vision"]');
  await expect(demo).toHaveAttribute('data-running', 'true');
  const initial = Number(await demo.getAttribute('data-simulation-ms'));
  await page.clock.runFor(1100);
  const advanced = Number(await demo.getAttribute('data-simulation-ms'));
  expect(advanced).toBeGreaterThan(initial);
  await demo.getByRole('button', { name: /Mettre en pause/ }).click();
  await expect(demo).toHaveAttribute('data-running', 'false');
  const frozen = await demo.getAttribute('data-simulation-ms');
  await page.clock.runFor(1400);
  expect(await demo.getAttribute('data-simulation-ms')).toBe(frozen);
  await demo.getByRole('button', { name: /Reprendre/ }).click();
  await page.clock.runFor(4000);
  expect(Number(await demo.getAttribute('data-simulation-ms'))).toBeGreaterThan(Number(frozen));
  const index = Number(await demo.getAttribute('data-stage'));
  await expect(
    demo.locator('.architecture-stages button').nth(index),
  ).toHaveClass(/is-active/);
  await expect(demo.locator('.stage-explanation>span')).toHaveText(
    ['Acquisition', 'Détection', 'Suivi', 'Règle temporelle', 'Événement'][
      index
    ],
  );
});

test('zone configuration completes locally and confirms the submitted value', async ({
  page,
}) => {
  await page.clock.install();
  const writes: string[] = [];
  page.on('request', (r) => {
    if (!['GET', 'HEAD'].includes(r.method())) writes.push(r.url());
  });
  await page.goto('./#projet/securispot');
  const demo = page.getByRole('dialog').locator('[data-demo="interface"]');
  const range = demo.getByRole('slider', { name: 'Taille de la zone' });
  await range.fill('80');
  await demo.getByRole('button', { name: 'Appliquer', exact: true }).click();
  await expect(
    demo.getByRole('status', { name: 'État de la configuration' }),
  ).toHaveText('Configuration en cours');
  // Editing the next value while a request is pending must not alter this request.
  await range.fill('40');
  await page.clock.runFor(4000);
  await expect(
    demo.getByRole('status', { name: 'État de la configuration' }),
  ).toHaveText('Configuration active : 80%', { timeout: 12000 });
  expect(writes).toEqual([]);
});

test('fleet selection and rollback exploration remain usable with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#projet/mediaspot');
  const dialog = page.getByRole('dialog');
  const fleet = dialog.locator('[data-demo="cloud"]');
  await fleet.getByRole('button', { name: 'Bus C', exact: true }).click();
  await expect(fleet).toContainText('Bus C → tunnel VPN → services AWS');
  await expect(fleet).toHaveAttribute('data-running', 'false');
  await fleet.getByRole('button', { name: '03 Services · API' }).click();
  await expect(fleet.locator('.stage-explanation')).toContainText(
    'logique applicative',
  );
  await page.goto('./#projet/edge-delivery');
  await dialog.getByRole('button', { name: 'Explorer le rollback' }).click();
  await expect(
    dialog.getByRole('button', {
      name: 'Retour à la version stable',
      exact: true,
    }),
  ).toHaveAttribute('aria-pressed', 'true');
  await dialog.getByRole('button', { name: '05 État · Retour' }).click();
  await expect(dialog.locator('.stage-explanation')).toContainText(
    'version stable est restaurée',
  );
  await expect(dialog).toContainText('commande locale');
});

test('offscreen and obscured exhibits stop, and repeated dialogs release their scenes', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('./#projets');
  const background = page.locator('.project-vision [data-demo="vision"]');
  await expect(
    background.getByRole('button', { name: /Mettre en pause/ }),
  ).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
  // A native hash scroll can still be settling after fonts/hydration. Establish
  // a foreground, stable viewport before testing the visibility-driven clock.
  await expect
    .poll(async () => {
      await page.bringToFront();
      await background.evaluate((el) =>
        el.scrollIntoView({ behavior: 'instant', block: 'center' }),
      );
      return background.getAttribute('data-running');
    })
    .toBe('true');
  const trigger = page.getByRole('button', {
    name: 'Explorer l’étude de cas : SecuriSPOT · Vision industrielle',
  });
  for (let i = 0; i < 4; i++) {
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(background).toHaveAttribute('data-running', 'false');
    await expect(page.locator('.engineering-demo')).toHaveCount(7);
    await page.keyboard.press('Escape');
    await expect(page.locator('.engineering-demo')).toHaveCount(6);
  }
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(background).toHaveAttribute('data-running', 'false');
  const frozen = await background.getAttribute('data-simulation-ms');
  await page.waitForTimeout(250);
  expect(await background.getAttribute('data-simulation-ms')).toBe(frozen);
  expect(errors).toEqual([]);
});

test('changing reduced-motion preference during a local update leaves controls usable', async ({
  page,
}) => {
  await page.goto('./#projet/securispot');
  const demo = page.getByRole('dialog').locator('[data-demo="interface"]');
  await demo.getByRole('slider').fill('90');
  await demo.getByRole('button', { name: 'Appliquer', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(
    demo.getByRole('status', { name: 'État de la configuration' }),
  ).toHaveText('Configuration active : 90%');
  await expect(
    demo.getByRole('button', { name: 'Appliquer', exact: true }),
  ).toBeEnabled();
  await expect(demo).toHaveAttribute('data-running', 'false');
});

test('batched viewport transitions use the latest visibility state', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeObserver = window.IntersectionObserver;
    window.IntersectionObserver = class extends NativeObserver {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        super((entries, observer) => {
          const entry = entries.find((item) =>
            item.target.matches('[data-demo]'),
          );
          if (!entry) return callback(entries, observer);
          // Model an older queued transition followed by the current native
          // entry. Exercise both entering and leaving without replacing the
          // browser's actual geometry or disabling the simulation clock.
          const previous = new Proxy(entry, {
            get(target, property) {
              return property === 'isIntersecting'
                ? !target.isIntersecting
                : Reflect.get(target, property, target);
            },
          });
          callback([previous, ...entries], observer);
        }, options);
      }
    };
  });
  await page.goto('./#projet/jetson-vision');
  const dialog = page.getByRole('dialog');
  const demo = dialog.locator('[data-demo="vision"]');
  await expect(demo).toHaveAttribute('data-running', 'true');
  const initial = demo.getAttribute('data-simulation-ms');
  await expect.poll(() => demo.getAttribute('data-simulation-ms')).not.toBe(await initial);
  await dialog.locator('.dialog-bottom').scrollIntoViewIfNeeded();
  await expect(demo).not.toBeInViewport();
  await expect(demo).toHaveAttribute('data-running', 'false');
  const frozen = await demo.getAttribute('data-simulation-ms');
  await page.waitForTimeout(200);
  expect(await demo.getAttribute('data-simulation-ms')).toBe(frozen);
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveAttribute('data-running', 'true');
  await expect.poll(() => demo.getAttribute('data-simulation-ms')).not.toBe(frozen);
});
