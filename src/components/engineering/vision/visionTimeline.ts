/** SecuriSPOT's illustrative operating story. Geometry, observation and events
 * share one source of truth; durations are slowed for explanation, not telemetry.
 */
import type { WorkerPose } from '../animations/timelines';
export type VisionScenario = 'normal' | 'brief';
export type Point3 = { x: number; y: number; z: number };
const TAU = Math.PI * 2;
export const VISION_DURATION = 30;
export const FORKLIFT_DURATION = 36;
export const WORKER_DURATIONS = [30, 44, 12] as const;
export const VISION_CAMERA = {
  position: { x: -4.3, y: 3.2, z: -2.5 },
  target: { x: 1.4, y: 0.9, z: 1.2 },
  horizontalFov: 58,
  aspect: 16 / 9,
  near: 0.1,
  far: 30,
} as const;
export const SAFETY_ZONE = { xMin: -0.9, xMax: 2.7, zMin: 0.2, zMax: 2.1 };
export const BRIEF_ZONE = { xMin: -0.3, xMax: 0.45, zMin: 1.1, zMax: 1.8 };
export const OBSERVATION_INTERVAL = 0.4;
export const CONFIRMATION_OBSERVATIONS = 10;
const mod = (v: number, n: number) => ((v % n) + n) % n;
const dot = (a: Point3, b: Point3) => a.x * b.x + a.y * b.y + a.z * b.z;
const norm = (p: Point3) => {
  const l = Math.hypot(p.x, p.y, p.z);
  return { x: p.x / l, y: p.y / l, z: p.z / l };
};
const direction = norm({
  x: VISION_CAMERA.target.x - VISION_CAMERA.position.x,
  y: VISION_CAMERA.target.y - VISION_CAMERA.position.y,
  z: VISION_CAMERA.target.z - VISION_CAMERA.position.z,
});
const right = norm({ x: -direction.z, y: 0, z: direction.x });
const up = {
  x: right.y * direction.z - right.z * direction.y,
  y: right.z * direction.x - right.x * direction.z,
  z: right.x * direction.y - right.y * direction.x,
};
const tanHalfHorizontal = Math.tan(
  (VISION_CAMERA.horizontalFov * Math.PI) / 360,
);
const tanHalfVertical = tanHalfHorizontal / VISION_CAMERA.aspect;
export function cameraProjection(point: Point3) {
  const v = {
    x: point.x - VISION_CAMERA.position.x,
    y: point.y - VISION_CAMERA.position.y,
    z: point.z - VISION_CAMERA.position.z,
  };
  const depth = dot(v, direction),
    x = dot(v, right) / (depth * tanHalfHorizontal),
    y = dot(v, up) / (depth * tanHalfVertical);
  return {
    x,
    y,
    depth,
    visible:
      depth > VISION_CAMERA.near &&
      depth < VISION_CAMERA.far &&
      Math.abs(x) <= 1 &&
      Math.abs(y) <= 1,
  };
}
/** Actual perspective rays intersect the ground; used to draw the camera footprint. */
export function cameraGroundFootprint(): Point3[] {
  let polygon: Point3[] = [
    { x: -7, y: 0.025, z: -5 },
    { x: 7, y: 0.025, z: -5 },
    { x: 7, y: 0.025, z: 5 },
    { x: -7, y: 0.025, z: 5 },
  ];
  const relative = (p: Point3) => ({
    x: p.x - VISION_CAMERA.position.x,
    y: p.y - VISION_CAMERA.position.y,
    z: p.z - VISION_CAMERA.position.z,
  });
  const planes = [
    (p: Point3) =>
      dot(relative(p), direction) * tanHalfHorizontal - dot(relative(p), right),
    (p: Point3) =>
      dot(relative(p), direction) * tanHalfHorizontal + dot(relative(p), right),
    (p: Point3) =>
      dot(relative(p), direction) * tanHalfVertical - dot(relative(p), up),
    (p: Point3) =>
      dot(relative(p), direction) * tanHalfVertical + dot(relative(p), up),
    (p: Point3) => dot(relative(p), direction) - VISION_CAMERA.near,
    (p: Point3) => VISION_CAMERA.far - dot(relative(p), direction),
  ];
  for (const plane of planes) {
    const next: Point3[] = [];
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i],
        b = polygon[(i + 1) % polygon.length],
        da = plane(a),
        db = plane(b);
      if (da >= 0) next.push(a);
      if (da >= 0 !== db >= 0) {
        const u = da / (da - db);
        next.push({
          x: a.x + (b.x - a.x) * u,
          y: 0.025,
          z: a.z + (b.z - a.z) * u,
        });
      }
    }
    polygon = next;
  }
  return polygon;
}
function ellipseArc(rx: number, rz: number) {
  const distances = [0];
  for (let i = 1; i <= 1024; i++) {
    const a = ((i - 0.5) / 1024) * TAU;
    distances.push(
      distances[i - 1] +
        (Math.hypot(rx * Math.sin(a), rz * Math.cos(a)) * TAU) / 1024,
    );
  }
  return {
    length: distances[1024],
    at: (u: number) => {
      const i = Math.min(1023, Math.floor(u * 1024));
      return distances[i] + (distances[i + 1] - distances[i]) * (u * 1024 - i);
    },
  };
}
const primaryArc = ellipseArc(3.1, 1.45),
  safeArc = ellipseArc(4, 0.4);
export function workerPose(seconds: number, index = 0): WorkerPose {
  if (index === 2)
    return {
      x: -4.9,
      z: -1.8,
      yaw: Math.PI,
      speed: 0,
      distance: 0,
      walking: false,
      interaction: mod(seconds, 12) > 3 && mod(seconds, 12) < 9,
    };
  const duration = index === 0 ? 30 : 44,
    u = mod(seconds, duration) / duration,
    a = u * TAU;
  const rx = index === 0 ? 3.1 : 4,
    rz = index === 0 ? 1.45 : 0.4;
  const arc = index === 0 ? primaryArc : safeArc;
  return {
    x: (index === 0 ? 0 : -1.5) - rx * Math.cos(a),
    z: (index === 0 ? 0 : 3.7) + rz * Math.sin(a),
    yaw: Math.atan2(rx * Math.sin(a), rz * Math.cos(a)),
    speed: (Math.hypot(rx * Math.sin(a), rz * Math.cos(a)) * TAU) / duration,
    distance: Math.floor(seconds / duration) * arc.length + arc.at(u),
    walking: true,
    interaction: false,
  };
}
const smooth = (u: number) => u * u * u * (10 + u * (-15 + 6 * u));
const smoothDerivative = (u: number) => 30 * u * u * (1 - u) * (1 - u);
/** Forward/stop/lift/reverse/stop/lower. Signed travel matches wheel direction. */
export function forkliftPose(seconds: number) {
  const t = mod(seconds, FORKLIFT_DURATION);
  const forward = t < 12,
    reverse = t >= 18 && t < 30;
  const u = forward ? t / 12 : reverse ? (t - 18) / 12 : 0;
  const z = forward
    ? -3.5 + 3.5 * smooth(u)
    : reverse
      ? -3.5 * smooth(u)
      : t < 18
        ? 0
        : -3.5;
  const velocity =
    ((forward ? 1 : reverse ? -1 : 0) * 3.5 * smoothDerivative(u)) / 12;
  const lift =
    0.12 +
    (t < 12
      ? 0
      : t < 17
        ? 0.35 * smooth((t - 12) / 5)
        : t < 30
          ? 0.35
          : t < 35
            ? 0.35 * (1 - smooth((t - 30) / 5))
            : 0);
  return {
    x: 5.2,
    z,
    yaw: 0,
    speed: Math.abs(velocity),
    velocity,
    distance: z + 3.5,
    lift,
    steering: 0,
    phase: forward
      ? 'forward'
      : reverse
        ? 'reverse'
        : t < 18
          ? 'loading'
          : 'lowering',
  };
}
export function pointInZone(
  p: { x: number; z: number },
  scenario: VisionScenario = 'normal',
) {
  const zone = scenario === 'brief' ? BRIEF_ZONE : SAFETY_ZONE;
  return (
    p.x >= zone.xMin && p.x <= zone.xMax && p.z >= zone.zMin && p.z <= zone.zMax
  );
}
function observedAt(seconds: number) {
  const p = workerPose(seconds);
  return cameraProjection({ x: p.x, y: 0.95, z: p.z }).visible;
}
// Entry/exit are solved from the same physical route, never a second UI timer.
function interval(scenario: VisionScenario) {
  const relevant = (t: number) =>
    pointInZone(workerPose(t), scenario) && observedAt(t);
  let start = 0,
    end = 0,
    previous = false;
  for (let i = 0; i <= 3000; i++) {
    const t = i / 100,
      current = relevant(t);
    if (current && !previous) {
      let lo = t - 0.01,
        hi = t;
      for (let j = 0; j < 24; j++) {
        const mid = (lo + hi) / 2;
        if (relevant(mid)) hi = mid;
        else lo = mid;
      }
      start = hi;
    }
    if (!current && previous) {
      let lo = t - 0.01,
        hi = t;
      for (let j = 0; j < 24; j++) {
        const mid = (lo + hi) / 2;
        if (relevant(mid)) lo = mid;
        else hi = mid;
      }
      end = hi;
      break;
    }
    previous = current;
  }
  return { start, end };
}
const intervals = { normal: interval('normal'), brief: interval('brief') };
export function visionState(
  seconds: number,
  scenario: VisionScenario = 'normal',
) {
  const t = mod(seconds, VISION_DURATION),
    pose = workerPose(seconds),
    observed = observedAt(seconds),
    inside = pointInZone(pose, scenario);
  const eventInterval = intervals[scenario],
    dwell = inside && observed ? Math.max(0, t - eventInterval.start) : 0;
  const observations =
    inside && observed
      ? Math.min(
          CONFIRMATION_OBSERVATIONS,
          Math.floor((dwell + 1e-7) / OBSERVATION_INTERVAL),
        )
      : 0;
  const confirmed =
    observed && inside && observations >= CONFIRMATION_OBSERVATIONS;
  const stage =
    !inside || !observed
      ? 0
      : dwell < 1
        ? 1
        : dwell < 2.3
          ? 2
          : confirmed
            ? 4
            : 3;
  const leaving = t >= eventInterval.end && t < eventInterval.end + 4;
  const phase = confirmed
    ? 'alert'
    : inside && observed
      ? stage === 1
        ? 'detection'
        : stage === 2
          ? 'tracking'
          : 'confirmation'
      : leaving
        ? 'departure'
        : observed
          ? 'approach'
          : 'normal';
  return {
    t,
    pose,
    inside,
    observed,
    dwell,
    observations,
    confirmed,
    stage,
    phase,
    trackId: '01',
    zone: scenario === 'brief' ? BRIEF_ZONE : SAFETY_ZONE,
    event: { active: confirmed, zone: 'A', trackId: '01' },
    scenario,
  };
}
