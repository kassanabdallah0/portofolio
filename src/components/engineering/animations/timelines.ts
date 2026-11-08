/** Pure domain timelines shared by the controller, physical actors and screens.
 * Times are illustrative; none of these durations is a production benchmark.
 */
export type WorkerPose = {
  x: number;
  z: number;
  yaw: number;
  speed: number;
  distance: number;
  walking: boolean;
  interaction: boolean;
};
export const SCAN_DURATION = 32;
export const VISION_DURATION = 30;
const TAU = Math.PI * 2;
const clamp = (v: number) => Math.max(0, Math.min(1, v));

// Integral of a smooth acceleration / cruise / deceleration profile. The route
// is closed and the velocity is zero at the standing mark, including each join.
function travel(t: number, duration: number) {
  const ramp = 2,
    cruise = duration - 2 * ramp,
    norm = duration - ramp;
  if (t < ramp)
    return { u: (t * t) / (2 * ramp) / norm, velocity: t / ramp / norm };
  if (t < ramp + cruise)
    return { u: (ramp / 2 + t - ramp) / norm, velocity: 1 / norm };
  const remaining = duration - t;
  return {
    u: 1 - (remaining * remaining) / (2 * ramp * norm),
    velocity: remaining / ramp / norm,
  };
}
// Arc-length lookup keeps authored foot travel matched to curved-world motion.
function ellipseDistance(rx: number, rz: number) {
  const samples = [0];
  for (let i = 1; i <= 512; i++) {
    const a = ((i - 0.5) / 512) * TAU;
    samples.push(
      samples[i - 1] +
        (Math.hypot(rx * Math.sin(a), rz * Math.cos(a)) * TAU) / 512,
    );
  }
  return {
    length: samples[512],
    at: (u: number) => {
      const value = clamp(u) * 512,
        index = Math.min(511, Math.floor(value));
      return (
        samples[index] + (samples[index + 1] - samples[index]) * (value - index)
      );
    },
  };
}
const scanArc = ellipseDistance(1.45, 1.5),
  visionArc = ellipseDistance(3.1, 1.45);
export function scanState(seconds: number) {
  const t = ((seconds % SCAN_DURATION) + SCAN_DURATION) % SCAN_DURATION;
  const phase =
    t < 7
      ? 'approach'
      : t < 10
        ? 'stabilize'
        : t < 14
          ? 'acquire'
          : t < 17
            ? 'validate'
            : t < 21
              ? 'result'
              : 'depart';
  const stage = t < 10 ? 0 : t < 14 ? 1 : t < 17 ? 2 : t < 23 ? 3 : 0;
  const moving = t < 7 || t >= 21;
  const tr = travel(t < 7 ? t + 11 : t - 21, 18);
  const angle = moving ? tr.u * TAU : 0;
  const x = -2 + 1.45 * Math.cos(angle),
    z = 0.45 + 1.5 * Math.sin(angle);
  const dx = -1.45 * Math.sin(angle),
    dz = 1.5 * Math.cos(angle);
  const speed = moving ? Math.hypot(dx, dz) * TAU * tr.velocity : 0;
  const completed = Math.floor(seconds / SCAN_DURATION);
  const distance =
    completed * scanArc.length +
    (t < 7
      ? scanArc.at(tr.u) - scanArc.length
      : t >= 21
        ? scanArc.at(tr.u)
        : 0);
  const pose: WorkerPose = {
    x,
    z,
    yaw: moving ? Math.atan2(dx, dz) : Math.PI / 2,
    speed,
    distance,
    walking: speed > 0.025,
    interaction: phase === 'result',
  };
  return {
    t,
    phase,
    stage,
    pose,
    progress:
      phase === 'stabilize'
        ? clamp((t - 7) / 3)
        : phase === 'acquire'
          ? clamp((t - 10) / 4)
          : phase === 'validate'
            ? clamp((t - 14) / 3)
            : phase === 'result'
              ? 1
              : 0,
  };
}
export function visionState(seconds: number) {
  const t = ((seconds % VISION_DURATION) + VISION_DURATION) % VISION_DURATION;
  const angle = (t / VISION_DURATION) * TAU;
  const x = -3.1 * Math.cos(angle),
    z = 1.45 * Math.sin(angle);
  const dx = 3.1 * Math.sin(angle),
    dz = 1.45 * Math.cos(angle);
  const inside = x > -0.9 && z > 0.05;
  const enteredAt = (Math.acos(0.9 / 3.1) / TAU) * VISION_DURATION;
  const dwell = inside ? Math.max(0, t - enteredAt) : 0;
  const stage = !inside
    ? 0
    : dwell < 1
      ? 1
      : dwell < 2.3
        ? 2
        : dwell < 4
          ? 3
          : 4;
  const pose: WorkerPose = {
    x,
    z,
    yaw: Math.atan2(dx, dz),
    speed: (Math.hypot(dx, dz) * TAU) / VISION_DURATION,
    distance:
      Math.floor(seconds / VISION_DURATION) * visionArc.length +
      visionArc.at(t / VISION_DURATION),
    walking: true,
    interaction: false,
  };
  return {
    t,
    stage,
    inside,
    dwell,
    confirmed: inside && dwell >= 4,
    observations: inside ? Math.min(10, Math.floor(dwell * 2.5)) : 0,
    pose,
  };
}
export const stageTimes: Record<string, number[]> = {
  scan: [8, 11, 15, 18],
  vision: [1, 6.3, 7.3, 8.5, 11],
  cloud: [1, 7, 13, 19],
  delivery: [1, 5, 10, 14, 18],
  interface: [0, 1, 2, 3, 4],
  observability: [1, 5, 9, 13],
};

export function deliveryState(seconds: number, rollback: boolean) {
  const t = ((seconds % 26) + 26) % 26;
  const stage = t < 4 ? 0 : t < 8 ? 1 : t < 13 ? 2 : t < 17 ? 3 : 4;
  return {
    t,
    stage,
    failure: rollback && t >= 17 && t < 23,
    restored: rollback && t >= 23,
  };
}
