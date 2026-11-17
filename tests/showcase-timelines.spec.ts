import { test, expect } from '@playwright/test';
import {
  scanState,
  visionState,
} from '../src/components/engineering/animations/timelines';

test('PPE validation follows a stationary acquisition and precedes the result', () => {
  const approach = scanState(3),
    position = scanState(8),
    acquisition = scanState(12),
    validation = scanState(15),
    result = scanState(18),
    departure = scanState(25);
  expect(approach.pose.walking).toBe(true);
  expect(position.phase).toBe('stabilize');
  expect(acquisition.phase).toBe('acquire');
  expect(validation.phase).toBe('validate');
  expect(result.phase).toBe('result');
  for (const frame of [position, acquisition, validation, result]) {
    expect(frame.pose.walking).toBe(false);
    expect(frame.pose.x).toBeCloseTo(position.pose.x, 8);
    expect(frame.pose.z).toBeCloseTo(position.pose.z, 8);
  }
  expect(departure.pose.walking).toBe(true);
});

test('scan path remains continuous at every stop, departure and loop seam', () => {
  for (const boundary of [7, 21, 32, 39, 53, 64]) {
    const before = scanState(boundary - 0.001).pose,
      after = scanState(boundary + 0.001).pose;
    expect(Math.hypot(after.x - before.x, after.z - before.z)).toBeLessThan(
      0.003,
    );
    expect(Math.abs(after.distance - before.distance)).toBeLessThan(0.003);
    expect(Math.abs(after.speed - before.speed)).toBeLessThan(0.003);
  }
});

test('vision tracking follows physical entry and temporal evidence precedes an alert', () => {
  const before = visionState(3),
    detection = visionState(6.3),
    confirmation = visionState(8.5),
    alert = visionState(11),
    departed = visionState(17);
  expect(before.inside).toBe(false);
  expect(detection.inside).toBe(true);
  expect(detection.confirmed).toBe(false);
  expect(confirmation.stage).toBe(3);
  expect(confirmation.confirmed).toBe(false);
  expect(alert.confirmed).toBe(true);
  expect(alert.observations).toBe(10);
  expect(departed.inside).toBe(false);
  expect(departed.confirmed).toBe(false);
  const seam = [visionState(29.999).pose, visionState(30.001).pose];
  expect(Math.hypot(seam[0].x - seam[1].x, seam[0].z - seam[1].z)).toBeLessThan(
    0.002,
  );
});

test('real 3D animation clock freezes while paused and advances after resuming', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'The mobile exhibit intentionally uses a lightweight 2D scene.');
  await page.goto('./#projet/colas-scan-epi');
  const demo = page.getByRole('dialog').locator('[data-demo="scan"]');
  const canvas = demo.locator('canvas[data-context="ready"]');
  await expect(canvas).toBeVisible({ timeout: 20000 });
  await expect(demo).toHaveAttribute('data-running', 'true');
  const original = Number(await canvas.getAttribute('data-scene-time'));
  await expect.poll(async () => Number(await canvas.getAttribute('data-scene-time'))).toBeGreaterThan(original);

  await demo.getByRole('button', { name: /Mettre en pause/ }).click();
  await expect(demo).toHaveAttribute('data-running', 'false');
  const stopped = await canvas.getAttribute('data-scene-time');
  await page.waitForTimeout(250);
  expect(await canvas.getAttribute('data-scene-time')).toBe(stopped);

  await demo.getByRole('button', { name: /Reprendre/ }).click();
  await expect(demo).toHaveAttribute('data-running', 'true');
  await expect.poll(async () => Number(await canvas.getAttribute('data-scene-time'))).toBeGreaterThan(Number(stopped));
});

test('physical scan controls seek coherently, preserve pause and show comparison scope', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Mobile deliberately uses the lightweight alternative.');
  await page.goto('./#projet/colas-scan-epi');
  const demo = page.getByRole('dialog').locator('[data-demo="scan"]');
  await expect(demo.locator('canvas[data-context="ready"]')).toBeVisible();
  await demo
    .getByRole('button', { name: '03 Validation', exact: true })
    .click();
  await expect(demo).toHaveAttribute('data-running', 'false');
  await expect(demo).toHaveAttribute('data-simulation-ms', '15000');
  await expect(demo.locator('canvas')).toHaveAttribute(
    'data-scene-time',
    '15.00',
  );
  await demo.getByRole('button', { name: 'Comparer', exact: true }).click();
  await expect(demo.locator('.eng-comparison')).toContainText('≈ 2–3 FPS');
  await expect(demo.locator('.eng-comparison')).toContainText('≈ 10 FPS');
  await expect(demo).toContainText('pas FPS d’inférence');
  await demo.getByRole('button', { name: 'Rejouer le scénario' }).click();
  await expect(demo).toHaveAttribute('data-running', 'true');
  await expect
    .poll(async () => Number(await demo.getAttribute('data-simulation-ms')))
    .toBeLessThan(3000);
});
