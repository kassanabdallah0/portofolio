'use client';

import { useMemo, useRef, type RefObject } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ForkliftDriver } from './ForkliftDriver';

export const FORKLIFT_DIMENSIONS = {
  width: 1.22,
  length: 3.4,
  height: 2.305,
  frontWheelRadius: 0.28,
  rearWheelRadius: 0.215,
  wheelbase: 1.2,
  forkCenter: [0, 0.125, 1.76] as const,
} as const;

export type ForkliftMotion = {
  /** Signed cumulative travel in native model metres, never a wrapping phase. */
  distance: number;
  /** Carriage travel above its lowered position, metres. Clamped to 0–1.2 m. */
  lift: number;
  /** Rear wheel steering angle in radians. The parent derives it from the route. */
  steering?: number;
};

/** Licensed CC0 electric forklift. Y up, +Z forks/front, tyre contact at Y=0.
 * The parent owns placement, heading, scale and the single simulation clock.
 * Local transforms respond solely to supplied motion: pause and seek are exact.
 */
export function ForkliftModel({
  motion,
  driver = true,
}: {
  motion: RefObject<ForkliftMotion>;
  driver?: boolean;
}) {
  const gltf = useLoader(
    GLTFLoader,
    '/portofolio/engineering/assets/forklift.glb',
  );
  const root = useRef<THREE.Group>(null);
  const instance = useMemo(() => {
    const scene = gltf.scene.clone(true);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    return scene;
  }, [gltf.scene]);
  useFrame(() => {
    if (!root.current) return;
    const state = motion.current;
    root.current.traverse((object) => {
      if (object.name === 'fork-carriage')
        object.position.y = THREE.MathUtils.clamp(state.lift, 0, 1.2);
      if (object.name.startsWith('fork-wheel-')) {
        const index = Number(object.name.at(-1));
        object.rotation.x =
          state.distance /
          (index < 2
            ? FORKLIFT_DIMENSIONS.frontWheelRadius
            : FORKLIFT_DIMENSIONS.rearWheelRadius);
      }
      if (object.name === 'fork-steer-2' || object.name === 'fork-steer-3') {
        object.rotation.y = THREE.MathUtils.clamp(
          state.steering ?? 0,
          -0.7,
          0.7,
        );
      }
    });
  });
  // This rigid clone owns transforms only. Cached GLB geometry/materials remain
  // shared across remounts; disposing them here would invalidate other viewers.
  return (
    <group ref={root} dispose={null}>
      <primitive object={instance} />
      {driver && <ForkliftDriver />}
    </group>
  );
}
