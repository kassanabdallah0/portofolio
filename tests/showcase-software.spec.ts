import { test, expect } from '@playwright/test';

test('Manager zone can be resized with pointer and keyboard and applied independently', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#projet/securispot');
  const demo = page.getByRole('dialog').locator('[data-demo="interface"]');
  const handle = demo.getByRole('button', { name: /Redimensionner la zone/ });
  const slider = demo.getByRole('slider', { name: 'Taille de la zone' });
  await handle.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('65');
  await expect(demo.locator('.lab-config-state')).toHaveText(
    'Modification non appliquée',
  );
  const bounds = await handle.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(
    bounds!.x + bounds!.width / 2,
    bounds!.y + bounds!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds!.x + bounds!.width / 2 + 12,
    bounds!.y + bounds!.height / 2,
    { steps: 4 },
  );
  await page.mouse.up();
  const edited = Number(await slider.inputValue());
  expect(edited).toBeGreaterThan(65);
  await expect(demo.locator('.lab-manager-feed')).toContainText(
    `ROI 01 · ${edited}%`,
  );
  await demo.getByRole('button', { name: 'Appliquer', exact: true }).click();
  await expect(demo.locator('.lab-config-state')).toHaveText(
    `Configuration active : ${edited}%`,
  );
  await demo
    .getByRole('button', { name: 'Historique des alarmes', exact: true })
    .click();
  await expect(demo.locator('.eng-alarm-history')).toBeVisible();
  await expect(demo.locator('.eng-alarm-history')).toContainText(
    'aucun équipement connecté',
  );
  await demo
    .getByRole('button', { name: 'Configuration caméra', exact: true })
    .click();
  await expect(demo.locator('.lab-manager-feed')).toContainText(
    `ROI 01 · ${edited}%`,
  );
});

test('rollback is an optional later event, not an immediate or already completed failure', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#projet/edge-delivery');
  const demo = page.getByRole('dialog').locator('[data-demo="delivery"]');
  const scene = demo.locator('.eng-delivery');
  await demo
    .getByRole('button', { name: '01 Version Git', exact: true })
    .click();
  await demo
    .getByRole('button', { name: 'Explorer le rollback', exact: true })
    .click();
  await expect(scene).toHaveAttribute('data-release-state', 'preparation');
  await expect(scene).not.toContainText('Health check en échec');
  await expect(scene).not.toContainText('Service restauré');
  await expect(scene.locator('.eng-release-slots>div').first()).toContainText(
    'v1.2.3',
  );
  await demo
    .getByRole('button', { name: '04 Activation', exact: true })
    .click();
  await expect(scene).toHaveAttribute('data-release-state', 'activation');
  await expect(scene).not.toContainText('Health check en échec');
  await expect(scene.locator('.eng-release-slots>div').first()).toContainText(
    'v1.2.4',
  );
  await demo
    .getByRole('button', { name: '05 État · Retour', exact: true })
    .click();
  await expect(scene).toHaveAttribute('data-release-state', 'rollback');
  await expect(scene).toContainText('Health check en échec');
  await expect(scene).not.toContainText('Service restauré');
  await expect(scene.locator('.eng-release-slots>div').first()).toContainText(
    'v1.2.4',
  );
  await expect(scene).toContainText('commande locale');
});

test('ELK distinguishes retention and historical scale from synthetic operational activity', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#projet/elk-exploitation');
  const demo = page.getByRole('dialog').locator('[data-demo="observability"]');
  const scene = demo.locator('.eng-observability');
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await expect(
    scene.getByRole('img', { name: /Trois nœuds Elasticsearch/ }),
  ).toBeVisible();
  await expect(scene.locator('.eng-cluster-drawing')).toContainText('ES-01');
  await expect(scene.locator('.eng-cluster-drawing')).toContainText('ES-02');
  await expect(scene.locator('.eng-cluster-drawing')).toContainText('ES-03');
  await expect(scene).toContainText('TLS');
  await expect(scene.locator('.eng-ilm-panel')).toContainText('180 jours');
  await expect(scene.locator('.eng-historical-scale')).toContainText(
    'VOLUMES HISTORIQUES',
  );
  await expect(scene.locator('.eng-historical-scale')).toContainText('306 M');
  await expect(scene.locator('.eng-historical-scale')).toContainText('644 Go');
  await expect(scene.locator('.eng-historical-scale')).toContainText(
    'aucune télémétrie en direct',
  );
});

test('a failed Jetson release restores its previous version only after rollback completes', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('./#projet/edge-delivery');
  const demo = page.getByRole('dialog').locator('[data-demo="delivery"]');
  const scene = demo.locator('.eng-delivery');
  await demo
    .getByRole('button', { name: '01 Version Git', exact: true })
    .click();
  await demo
    .getByRole('button', { name: 'Explorer le rollback', exact: true })
    .click();
  const health = demo.getByRole('button', {
    name: '05 État · Retour',
    exact: true,
  });
  await health.click();
  await expect(scene).toHaveAttribute('data-release-state', 'rollback');
  await expect(scene.locator('.eng-release-slots>div').first()).toContainText(
    'v1.2.4',
  );
  await health.click();
  await expect(demo).toHaveAttribute('data-running', 'true');
  await page.clock.runFor(4300);
  await expect(scene).toHaveAttribute('data-release-state', 'rollback');
  await expect(scene.locator('.eng-release-slots>div').first()).toContainText(
    'v1.2.4',
  );
  await page.clock.runFor(1600);
  await expect(scene).toHaveAttribute('data-release-state', 'restored');
  await expect(scene).toContainText('Service restauré');
  await expect(scene.locator('.eng-release-slots>div').first()).toContainText(
    'v1.2.3',
  );
  await page.clock.runFor(3500);
  await expect(scene).toHaveAttribute('data-release-state', 'preparation');
  await expect(scene).not.toContainText('Health check en échec');
  await expect(scene).not.toContainText('Service restauré');
});
