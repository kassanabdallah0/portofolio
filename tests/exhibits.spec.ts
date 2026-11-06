import { test, expect } from '@playwright/test';
import { orbit } from '../src/data/simulations';

test('vehicle paths remain continuous across their period boundary', () => {
  const period = (Math.PI * 2) / 0.23;
  for (const offset of [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]) {
    const before = orbit(period - 0.001, offset),
      after = orbit(period + 0.001, offset);
    expect(Math.hypot(before.x - after.x, before.y - after.y)).toBeLessThan(
      0.1,
    );
  }
});

test('simulation, active diagram and pause share one persistent clock', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('./#projet/jetson-vision');
  const demo = page.getByRole('dialog').locator('[data-demo="vision"]');
  await demo.evaluate((el) =>
    el.scrollIntoView({ behavior: 'instant', block: 'center' }),
  );
  await expect(demo).toHaveAttribute('data-running', 'true');
  const person = demo.locator('[data-person]');
  const initial = await person.getAttribute('transform');
  await page.clock.runFor(1100);
  expect(await person.getAttribute('transform')).not.toBe(initial);
  await demo.getByRole('button', { name: /Mettre en pause/ }).click();
  await expect(demo).toHaveAttribute('data-running', 'false');
  const frozen = await person.getAttribute('transform');
  await page.clock.runFor(1400);
  expect(await person.getAttribute('transform')).toBe(frozen);
  await demo.getByRole('button', { name: /Reprendre/ }).click();
  await page.clock.runFor(4000);
  expect(await person.getAttribute('transform')).not.toBe(frozen);
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
  const position = await background
    .locator('[data-person]')
    .getAttribute('transform');
  await page.waitForTimeout(250);
  expect(
    await background.locator('[data-person]').getAttribute('transform'),
  ).toBe(position);
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
