import { test, expect } from '@playwright/test';
import {
  BUS_SCALE,
  fleetLaneLength,
  fleetPose,
} from '../src/components/engineering/animations/fleetRoute';

test('all fleet routes remain continuous across their loop boundary', () => {
  for (const index of [0, 1, 2]) {
    const period = fleetLaneLength(index) / 0.65;
    // Each bus begins at a different arc position. Find its own wrap crossing.
    const wrap = period * (index === 1 ? index / 3 : 1 - index / 3);
    const before = fleetPose(wrap - 0.001, index);
    const after = fleetPose(wrap + 0.001, index);
    expect(before.position.distanceTo(after.position)).toBeLessThan(0.003);
    const headingChange = Math.atan2(
      Math.sin(after.angle - before.angle),
      Math.cos(after.angle - before.angle),
    );
    expect(Math.abs(headingChange)).toBeLessThan(0.01);
    // Cumulative wheel travel never resets when the route wraps.
    expect(after.distance).toBeGreaterThan(before.distance);
  }
});

test('wheel travel matches actual road travel through straights and turns', () => {
  for (const index of [0, 1, 2]) {
    const period = fleetLaneLength(index) / 0.65;
    for (let step = 0; step < 80; step++) {
      const t = (period * step) / 80;
      const before = fleetPose(t, index),
        after = fleetPose(t + 0.025, index);
      const wheelTravel = (after.distance - before.distance) * BUS_SCALE;
      const roadTravel = before.position.distanceTo(after.position);
      // Arc-length lookup is sampled, so allow sub-millimeter scene error.
      expect(Math.abs(wheelTravel - roadTravel)).toBeLessThan(0.0015);
    }
  }
});

test('bus identities keep their lane and phase over successive fleet cycles', () => {
  for (const index of [0, 1, 2]) {
    const period = fleetLaneLength(index) / 0.65;
    const initial = fleetPose(3, index),
      later = fleetPose(3 + period * 4, index);
    expect(initial.position.distanceTo(later.position)).toBeLessThan(0.00001);
    expect(later.distance).toBeGreaterThan(initial.distance);
  }
  const positions = [0, 1, 2].map((index) => fleetPose(0, index).position);
  expect(positions[0].distanceTo(positions[1])).toBeGreaterThan(3);
  expect(positions[1].distanceTo(positions[2])).toBeGreaterThan(3);
});
