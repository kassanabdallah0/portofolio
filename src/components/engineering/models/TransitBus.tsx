'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const TRANSIT_BUS = {
  length: 12,
  width: 2.66,
  height: 2.954,
  wheelRadius: 0.448,
} as const;

type Props = {
  /** Cumulative native-model metres. Divide scene distance by model scale. */
  distance: RefObject<number>;
  selected?: boolean;
  color?: string;
};

/** CC0 Blender-authored 12 m coach, +Z forward, tyre contact at y=0.
 * The parent owns the path; this model owns wheel rotation and selection material.
 */
export function TransitBus({
  distance,
  selected = false,
  color = '#417b92',
}: Props) {
  const source = useLoader(
    GLTFLoader,
    '/portofolio/engineering/assets/transit-bus.glb',
  );
  const root = useRef<THREE.Group>(null);
  const instance = useMemo(() => {
    const scene = source.scene.clone(true);
    const ownMaterials: THREE.MeshStandardMaterial[] = [];
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      if (
        object.material instanceof THREE.MeshStandardMaterial &&
        object.material.name === 'blue'
      ) {
        const livery = object.material.clone();
        livery.color.set(color);
        ownMaterials.push(livery);
        object.material = livery;
      }
    });
    return { scene, ownMaterials };
  }, [source.scene, color]);

  useEffect(
    () => () => {
      instance.ownMaterials.forEach((material) => material.dispose());
    },
    [instance],
  );
  useFrame(() => {
    if (!root.current) return;
    const rotation = distance.current / TRANSIT_BUS.wheelRadius;
    root.current.traverse((object) => {
      if (/^wheel-\d$/.test(object.name)) object.rotation.x = rotation;
      if (
        object instanceof THREE.Mesh &&
        object.material instanceof THREE.MeshStandardMaterial &&
        object.material.name === 'blue'
      ) {
        object.material.emissive.set(selected ? '#2b6b82' : '#000000');
        object.material.emissiveIntensity = selected ? 0.24 : 0;
      }
    });
  });
  return (
    <group ref={root} dispose={null}>
      <primitive object={instance.scene} />
    </group>
  );
}
