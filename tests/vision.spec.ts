import { expect, test, type Locator, type Page } from '@playwright/test';
import { PerspectiveCamera, Vector3 } from 'three';
import {
  cameraProjection,
  forkliftPose,
  FORKLIFT_DURATION,
  SAFETY_ZONE,
  VISION_CAMERA,
  visionState,
  workerPose,
  WORKER_DURATIONS,
} from '../src/components/engineering/vision/visionTimeline';

type Pose = {
  x: number;
  z: number;
  yaw: number;
  speed: number;
  distance: number;
};
const moved = (a: Pose, b: Pose) => Math.hypot(b.x - a.x, b.z - a.z);
const turned = (a: Pose, b: Pose) =>
  Math.abs(Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw)));

function referenceCamera() {
  const verticalFov =
    (2 *
      Math.atan(
        Math.tan((VISION_CAMERA.horizontalFov * Math.PI) / 360) /
          VISION_CAMERA.aspect,
      ) *
      180) /
    Math.PI;
  const camera = new PerspectiveCamera(
    verticalFov,
    VISION_CAMERA.aspect,
    0.1,
    30,
  );
  camera.position.set(
    VISION_CAMERA.position.x,
    VISION_CAMERA.position.y,
    VISION_CAMERA.position.z,
  );
  camera.lookAt(
    new Vector3(
      VISION_CAMERA.target.x,
      VISION_CAMERA.target.y,
      VISION_CAMERA.target.z,
    ),
  );
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();
  return camera;
}

function directlyVisible(
  camera: PerspectiveCamera,
  x: number,
  y: number,
  z: number,
) {
  const p = new Vector3(x, y, z).project(camera);
  return Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 && p.z >= -1 && p.z <= 1;
}

test('Vision workers retain continuous position, heading and foot travel across each independent cycle', () => {
  for (const index of [0, 1, 2] as const) {
    const period = WORKER_DURATIONS[index];
    for (const cycle of [1, 2, 4]) {
      const before = workerPose(period * cycle - 0.001, index);
      const after = workerPose(period * cycle + 0.001, index);
      expect(moved(before, after)).toBeLessThan(0.004);
      expect(turned(before, after)).toBeLessThan(0.015);
      expect(Math.abs(after.speed - before.speed)).toBeLessThan(0.01);
      expect(Math.abs(after.distance - before.distance)).toBeLessThan(0.004);
    }
    for (let step = 0; step < 240; step++) {
      const t = (period * step) / 240;
      const before = workerPose(t, index),
        after = workerPose(t + 0.01, index);
      expect(moved(before, after)).toBeLessThan(0.02);
      expect(turned(before, after)).toBeLessThan(0.1);
      // The authored walk's cumulative travel must track world displacement.
      expect(
        Math.abs(after.distance - before.distance - moved(before, after)),
      ).toBeLessThan(0.002);
      if (before.walking) expect(before.speed).toBeGreaterThan(0);
      if (before.speed === 0) expect(before.walking).toBe(false);
    }
  }
  expect(workerPose(5, 0).walking).toBe(true);
  expect(workerPose(5, 1).walking).toBe(true);
  expect(workerPose(5, 2).walking).toBe(false);
  expect(moved(workerPose(1, 2), workerPose(9, 2))).toBe(0);
});

test('forklift reverses through stopped transitions and wheel travel matches physical displacement', () => {
  let movingFrames = 0;
  let stoppedFrames = 0;
  let forwardFrames = 0;
  let reverseFrames = 0;
  for (let step = 0; step <= 1080; step++) {
    const t = (step * FORKLIFT_DURATION) / 360;
    const before = forkliftPose(t),
      after = forkliftPose(t + 0.01);
    expect(moved(before, after)).toBeLessThan(0.025);
    expect(turned(before, after)).toBeLessThan(0.04);
    expect(
      Math.abs(
        Math.abs(after.distance - before.distance) - moved(before, after),
      ),
    ).toBeLessThan(0.002);
    expect(Math.abs(after.speed - before.speed)).toBeLessThan(0.025);
    if (Math.abs(before.speed) > 0.05) movingFrames++;
    if (before.speed === 0) stoppedFrames++;
    if (after.distance > before.distance + 0.0001) forwardFrames++;
    if (after.distance < before.distance - 0.0001) reverseFrames++;
  }
  expect(movingFrames).toBeGreaterThan(100);
  expect(stoppedFrames).toBeGreaterThan(10);
  expect(forwardFrames).toBeGreaterThan(50);
  expect(reverseFrames).toBeGreaterThan(50);
  for (const cycle of [1, 2, 4]) {
    const before = forkliftPose(FORKLIFT_DURATION * cycle - 0.001);
    const after = forkliftPose(FORKLIFT_DURATION * cycle + 0.001);
    expect(moved(before, after)).toBeLessThan(0.004);
    expect(turned(before, after)).toBeLessThan(0.01);
    expect(Math.abs(after.distance - before.distance)).toBeLessThan(0.004);
  }
});

test('monitoring-camera projection agrees with a perspective camera and differs from safety-zone membership', () => {
  const camera = referenceCamera();
  for (let x = -7; x <= 8; x += 0.75) {
    for (let z = -6; z <= 6; z += 0.75) {
      const p = { x, y: 0.9, z };
      const actual = cameraProjection(p);
      const expected = new Vector3(x, p.y, z).project(camera);
      expect(actual.x).toBeCloseTo(expected.x, 7);
      expect(actual.y).toBeCloseTo(expected.y, 7);
      expect(actual.visible).toBe(directlyVisible(camera, x, p.y, z));
    }
  }
  let seenOutsideZone = 0;
  let notSeen = 0;
  for (let sample = 0; sample < 900; sample++) {
    const state = visionState(sample / 30);
    const p = state.pose;
    const inside =
      p.x >= SAFETY_ZONE.xMin &&
      p.x <= SAFETY_ZONE.xMax &&
      p.z >= SAFETY_ZONE.zMin &&
      p.z <= SAFETY_ZONE.zMax;
    expect(state.inside).toBe(inside);
    if (state.observed) {
      expect(directlyVisible(camera, p.x, 0.95, p.z)).toBe(true);
      if (!inside) seenOutsideZone++;
    } else notSeen++;
  }
  expect(seenOutsideZone).toBeGreaterThan(10);
  expect(notSeen).toBeGreaterThan(10);
});

test('successive zone observations precede confirmation and departure clears the active event', () => {
  const states = Array.from({ length: 1201 }, (_, i) => visionState(i / 40));
  const confirmed = states.filter((state) => state.confirmed);
  expect(confirmed.length).toBeGreaterThan(20);
  const firstEntry = states.findIndex(
    (state) => state.inside && state.observed,
  );
  const firstConfirmed = states.findIndex((state) => state.confirmed);
  expect(firstEntry).toBeGreaterThan(0);
  expect(firstConfirmed).toBeGreaterThan(firstEntry + 40);
  expect(states[firstEntry].confirmed).toBe(false);
  expect(states[firstEntry].observations).toBeLessThan(2);
  const tracks = new Set<string>();
  for (const state of states) {
    if (state.observed) tracks.add(state.trackId);
    if (state.confirmed) {
      expect(state.inside).toBe(true);
      expect(state.observed).toBe(true);
      expect(state.observations).toBeGreaterThanOrEqual(10);
    }
    if (!state.inside || !state.observed) expect(state.confirmed).toBe(false);
    expect(state.event.active).toBe(state.confirmed);
  }
  expect(tracks.size).toBe(1);
  const departed = states.slice(firstConfirmed).find((state) => !state.inside);
  expect(departed).toBeDefined();
  expect(departed!.confirmed).toBe(false);
  expect(departed!.event.active).toBe(false);
});

test('brief presence can be observed without satisfying temporal confirmation or activating a warning', () => {
  let observations = 0;
  let zoneFrames = 0;
  for (let step = 0; step < 1800; step++) {
    const state = visionState(step / 30, 'brief');
    if (state.observed) observations++;
    if (state.inside) zoneFrames++;
    expect(state.confirmed).toBe(false);
    expect(state.event.active).toBe(false);
    expect(state.observations).toBeLessThan(10);
    // A scenario changes the monitored condition, never teleports an actor.
    expect(state.pose).toEqual(visionState(step / 30).pose);
  }
  expect(observations).toBeGreaterThan(100);
  expect(zoneFrames).toBeGreaterThan(10);
});

async function noWebGL(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      kind: string,
      ...args: unknown[]
    ) {
      if (kind.includes('webgl')) return null;
      return original.apply(this, [kind, ...args] as Parameters<
        typeof original
      >);
    } as typeof original;
  });
}

async function retainContext(canvas: Locator) {
  return canvas.evaluate((element) => {
    type Context = { canvas: HTMLCanvasElement; gl: WebGL2RenderingContext };
    const host = window as typeof window & { __visionContexts?: Context[] };
    const canvas = element as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2');
    if (!gl)
      throw new Error('The visible Vision canvas has no real WebGL2 context');
    host.__visionContexts ??= [];
    host.__visionContexts.push({ canvas, gl });
    return host.__visionContexts.length - 1;
  });
}

async function expectReleased(page: Page, index: number) {
  await expect
    .poll(
      () =>
        page.evaluate((index) => {
          type Context = {
            canvas: HTMLCanvasElement;
            gl: WebGL2RenderingContext;
          };
          const host = window as typeof window & {
            __visionContexts?: Context[];
          };
          const context = host.__visionContexts?.[index];
          return Boolean(
            context &&
            !context.canvas.isConnected &&
            context.gl.isContextLost(),
          );
        }, index),
      { timeout: 12000 },
    )
    .toBe(true);
}

test('Vision stage inspection and pause freeze the actual rendered tracking state', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'Mobile deliberately uses the lightweight Vision representation.',
  );
  test.setTimeout(60000);
  await page.goto('./#projet/jetson-vision');
  const demo = page.getByRole('dialog').locator('[data-demo="vision"]');
  const canvas = demo.locator('canvas[data-context="ready"]');
  await expect(canvas).toBeVisible({ timeout: 20000 });
  await demo.getByRole('button', { name: '02 Détection', exact: true }).click();
  await expect(demo).toHaveAttribute('data-running', 'false');
  await expect(canvas).toHaveAttribute('data-scene-time', '6.30');
  const tracked = demo.locator('[data-tracking-box]');
  await expect(tracked).toHaveAttribute('data-confirmed', 'false');
  await expect(tracked).toHaveCSS('opacity', '1');
  await demo
    .getByRole('button', { name: '04 Règle temporelle', exact: true })
    .click();
  await expect(canvas).toHaveAttribute('data-scene-time', '8.50');
  await expect(tracked).toHaveAttribute('data-confirmed', 'false');
  await demo.getByRole('button', { name: '05 Événement', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-scene-time', '11.00');
  await expect(tracked).toHaveAttribute('data-confirmed', 'true');
  const frozenBox = await tracked.getAttribute('style');
  await page.waitForTimeout(350);
  expect(await canvas.getAttribute('data-scene-time')).toBe('11.00');
  expect(await tracked.getAttribute('style')).toBe(frozenBox);
  await demo.getByRole('button', { name: /Reprendre/ }).click();
  await expect(demo).toHaveAttribute('data-running', 'true');
  await expect
    .poll(async () => Number(await canvas.getAttribute('data-scene-time')))
    .toBeGreaterThan(11.05);
  await demo.getByRole('button', { name: /Mettre en pause/ }).click();
  await expect(demo).toHaveAttribute('data-running', 'false');
  // Pause requests one final demand frame so rendering settles on the exact
  // simulation value. Verify that synchronization before checking it stays frozen.
  await expect
    .poll(async () => await canvas.getAttribute('data-scene-time'))
    .toBe(
      (Number(await demo.getAttribute('data-simulation-ms')) / 1000).toFixed(2),
    );
  const stopped = await canvas.getAttribute('data-scene-time');
  await page.waitForTimeout(350);
  expect(await canvas.getAttribute('data-scene-time')).toBe(stopped);
});

test('Vision releases real WebGL contexts when obscured, closed and scrolled offscreen', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'No Vision WebGL contexts are created on the mobile fallback.',
  );
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./#projets');
  await page.evaluate(() => document.fonts.ready);
  const background = page.locator('.project-vision [data-demo="vision"]');
  await expect
    .poll(async () => {
      await page.bringToFront();
      await background.evaluate((element) =>
        element.scrollIntoView({ behavior: 'instant', block: 'center' }),
      );
      return background.getAttribute('data-running');
    })
    .toBe('true');
  const backgroundCanvas = background.locator('canvas[data-context="ready"]');
  await expect(backgroundCanvas).toBeVisible({ timeout: 20000 });
  const first = await retainContext(backgroundCanvas);
  await page
    .getByRole('button', {
      name: 'Explorer l’étude de cas : SecuriSPOT · Vision industrielle',
      exact: true,
    })
    .click();
  const dialog = page.getByRole('dialog');
  const dialogCanvas = dialog.locator(
    '[data-demo="vision"] canvas[data-context="ready"]',
  );
  await expect(dialogCanvas).toBeVisible({ timeout: 20000 });
  await expect(background.locator('canvas')).toHaveCount(0);
  await expectReleased(page, first);
  const second = await retainContext(dialogCanvas);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expectReleased(page, second);
  await background.evaluate((element) =>
    element.scrollIntoView({ behavior: 'instant', block: 'center' }),
  );
  await expect(backgroundCanvas).toBeVisible({ timeout: 20000 });
  const third = await retainContext(backgroundCanvas);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(background).toHaveAttribute('data-running', 'false');
  await expect(background.locator('canvas')).toHaveCount(0);
  await expectReleased(page, third);
  expect(errors).toEqual([]);
});

test('reduced motion keeps Vision stationary while its stages remain inspectable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./#projet/jetson-vision');
  const demo = page.getByRole('dialog').locator('[data-demo="vision"]');
  await expect(demo.locator('canvas')).toHaveCount(0);
  await expect(demo).toHaveAttribute('data-running', 'false');
  await expect(
    demo.getByRole('button', { name: /Mettre en pause/ }),
  ).toBeDisabled();
  await demo
    .getByRole('button', { name: '04 Règle temporelle', exact: true })
    .click();
  await expect(demo).toHaveAttribute('data-stage', '3');
  await expect(demo).toContainText('observations');
  const fixed = await demo.getAttribute('data-simulation-ms');
  await page.waitForTimeout(250);
  expect(await demo.getAttribute('data-simulation-ms')).toBe(fixed);
  await expect(demo.locator('[data-lab="vision"]')).toBeVisible();
});

test('the no-WebGL fallback preserves the Vision workflow and shared controller timing', async ({
  page,
}) => {
  await noWebGL(page);
  // Only this fallback test uses fake time; real-GPU checks above use real time.
  await page.clock.install();
  await page.goto('./#projet/jetson-vision');
  const demo = page.getByRole('dialog').locator('[data-demo="vision"]');
  await expect(demo).toHaveAttribute('data-running', 'true');
  await expect(demo.locator('canvas')).toHaveCount(0);
  await expect(demo.locator('[data-lab="vision"]')).toBeVisible();
  await demo
    .getByRole('button', { name: '04 Règle temporelle', exact: true })
    .click();
  await expect(demo).toHaveAttribute('data-simulation-ms', '8500');
  await expect(demo).toHaveAttribute('data-stage', '3');
  await expect(demo).toHaveAttribute('data-running', 'false');
  await page.clock.runFor(1000);
  await expect(demo).toHaveAttribute('data-simulation-ms', '8500');
  await demo.getByRole('button', { name: /Reprendre/ }).click();
  await expect(demo).toHaveAttribute('data-running', 'true');
  await page.clock.runFor(2500);
  await expect(demo).toHaveAttribute('data-stage', '4');
  expect(Number(await demo.getAttribute('data-simulation-ms'))).toBeGreaterThan(
    10500,
  );
  await page.clock.runFor(7000);
  await expect(demo).toHaveAttribute('data-stage', '0');
  await expect(demo.locator('canvas')).toHaveCount(0);
});

test('camera inspection reuses its context and projects the tracked worker into the actual image', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Camera inspection uses the desktop renderer.');
  test.setTimeout(60000);
  await page.goto('./#projet/jetson-vision');
  const demo = page.getByRole('dialog').locator('[data-demo="vision"]'),
    canvas = demo.locator('canvas[data-context="ready"]');
  await expect(canvas).toBeVisible({ timeout: 20000 });
  if (
    (await demo
      .locator('[data-render-tier]')
      .getAttribute('data-render-tier')) === 'software'
  ) {
    expect(
      Number(await canvas.getAttribute('data-vertex-lit')),
    ).toBeGreaterThan(0);
  }
  const token = await retainContext(canvas);
  await demo.getByRole('button', { name: '05 Événement', exact: true }).click();
  await demo.getByRole('button', { name: 'Caméra', exact: true }).click();
  await expect(canvas).toHaveAttribute('data-scene-time', '11.00');
  await expect(demo.locator('canvas')).toHaveCount(1);
  expect(
    await page.evaluate((index) => {
      const host = window as typeof window & {
        __visionContexts?: {
          canvas: HTMLCanvasElement;
          gl: WebGL2RenderingContext;
        }[];
      };
      const original = host.__visionContexts?.[index];
      return Boolean(
        original?.canvas.isConnected && !original.gl.isContextLost(),
      );
    }, token),
  ).toBe(true);
  const p = visionState(11).pose,
    expected: { x: number; y: number }[] = [];
  for (const dx of [-0.3, 0.3])
    for (const y of [0.03, 1.84])
      for (const dz of [-0.22, 0.22])
        expected.push(cameraProjection({ x: p.x + dx, y, z: p.z + dz }));
  const bounds = await demo.locator('.vision-stage').boundingBox();
  expect(bounds).not.toBeNull();
  const box = demo.locator('[data-tracking-box]');
  await expect
    .poll(async () => {
      const b = await box.boundingBox();
      return b
        ? Math.abs(
            b.x -
              bounds!.x -
              (Math.min(...expected.map((v) => v.x)) * 0.5 + 0.5) *
                bounds!.width,
          )
        : Infinity;
    })
    .toBeLessThan(2);
  await expect(box).toHaveAttribute('data-track-id', '01');
  await expect(box).toHaveAttribute('data-confirmed', 'true');
  await demo
    .getByRole('button', { name: 'Explorer un passage bref', exact: true })
    .click();
  await expect(demo.locator('.vision-experience')).toHaveAttribute(
    'data-vision-confirmed',
    'false',
  );
  await expect(canvas).toHaveAttribute('data-vision-confirmed', 'false');
});
