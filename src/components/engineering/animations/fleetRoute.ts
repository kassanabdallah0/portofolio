import * as THREE from 'three';

export const BUS_SCALE = 0.205;
export const ROAD_CENTER = new THREE.Vector3(-2.5, 0, 0);
export const fleetRoute = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-3, 0, -3),
    new THREE.Vector3(3, 0, -3),
    new THREE.Vector3(4.45, 0, -2.42),
    new THREE.Vector3(5, 0, -1),
    new THREE.Vector3(5, 0, 1),
    new THREE.Vector3(4.45, 0, 2.42),
    new THREE.Vector3(3, 0, 3),
    new THREE.Vector3(-3, 0, 3),
    new THREE.Vector3(-4.45, 0, 2.42),
    new THREE.Vector3(-5, 0, 1),
    new THREE.Vector3(-5, 0, -1),
    new THREE.Vector3(-4.45, 0, -2.42),
  ],
  true,
  'centripetal',
);
fleetRoute.arcLengthDivisions = 2048;
fleetRoute.updateArcLengths();
export const fleetRouteLength = fleetRoute.getLength();
// Parameterize each offset lane by its own arc length. Using centerline length
// for both lanes makes wheels slip during turns because outer travel is longer.
const laneRoutes = [-1, 1].map((side) => {
  const lane = new THREE.CatmullRomCurve3(
    Array.from({ length: 192 }, (_, i) => {
      const point = fleetRoute.getPointAt(i / 192),
        tangent = fleetRoute.getTangentAt(i / 192);
      point.x += tangent.z * side * 0.4;
      point.z -= tangent.x * side * 0.4;
      return point;
    }),
    true,
    'centripetal',
  );
  lane.arcLengthDivisions = 4096;
  lane.updateArcLengths();
  return lane;
});
export const fleetLaneLength = (index: number) =>
  laneRoutes[index === 1 ? 0 : 1].getLength();
const modulo = (value: number, maximum: number) =>
  ((value % maximum) + maximum) % maximum;

/** Arc-length motion: body heading, wheel travel and all attached network links agree. */
export function fleetPose(seconds: number, index: number) {
  const direction = index === 1 ? -1 : 1;
  const distance = seconds * 0.65 * direction;
  const lane = laneRoutes[index === 1 ? 0 : 1];
  const u = modulo(distance / lane.getLength() + index / 3, 1);
  const p = lane.getPointAt(u).add(ROAD_CENTER);
  const tangent = lane.getTangentAt(u);
  p.y = 0.065;
  return {
    position: p,
    angle: Math.atan2(tangent.x * direction, tangent.z * direction),
    distance: Math.abs(distance) / BUS_SCALE,
  };
}
