'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

export type WorkerMotion = {
  walking: boolean;
  speed: number;
  /** Cumulative distance in world metres, including previous laps. */
  distance: number;
  interaction?: boolean;
};

type Props = {
  time: RefObject<number>;
  motion: RefObject<WorkerMotion>;
  height?: number;
  vestColor?: string;
};

const SOURCE_HEIGHT = 1.83403;
/** Distance covered by the planted foot over a full authored walk cycle. */
const SOURCE_STRIDE = 1.72;

/** CC0 Quaternius skin/rig/clips. Shared GPU geometry, independent skeletons.
 * Feet at y=0; forward +Z. The parent owns path, heading and the simulation clock.
 */
export function RiggedWorker({
  time,
  motion,
  height = 1.8,
  vestColor = '#e59739',
}: Props) {
  const source = useLoader(
    GLTFLoader,
    '/portofolio/engineering/assets/worker-rigged.glb',
  );
  const root = useRef<THREE.Group>(null);
  const animation = useRef<{
    mixer: THREE.AnimationMixer;
    idle: THREE.AnimationAction;
    walk: THREE.AnimationAction;
    interact: THREE.AnimationAction;
    previousTime: number;
    walkWeight: number;
    interactionWeight: number;
  } | null>(null);
  const instance = useMemo(() => {
    const scene = clone(source.scene);
    const materials: THREE.Material[] = [];
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      object.frustumCulled = false; // authored limb bounds change under skinning
      const customize = (material: THREE.Material) => {
        if (
          !(material instanceof THREE.MeshStandardMaterial) ||
          !/Worker_Vest/.test(material.name)
        )
          return material;
        const vest = material.clone();
        vest.color.set(vestColor);
        vest.roughness = 0.84;
        materials.push(vest);
        return vest;
      };
      object.material = Array.isArray(object.material)
        ? object.material.map(customize)
        : customize(object.material);
    });
    return { scene, materials };
  }, [source.scene, vestColor]);

  useEffect(() => {
    const mixer = new THREE.AnimationMixer(instance.scene);
    const action = (name: string) => {
      const clip = source.animations.find(
        (candidate) => candidate.name === name,
      );
      if (!clip)
        throw new Error(`The worker asset is missing its ${name} clip.`);
      const result = mixer.clipAction(clip);
      result.play();
      result.paused = true; // all phases derive from the shared simulation clock
      return result;
    };
    animation.current = {
      mixer,
      idle: action('idle'),
      walk: action('walk'),
      interact: action('interact'),
      previousTime: time.current,
      walkWeight: motion.current.walking ? 1 : 0,
      interactionWeight: 0,
    };
    return () => {
      animation.current = null;
      mixer.stopAllAction();
      mixer.uncacheRoot(instance.scene);
      instance.materials.forEach((material) => material.dispose());
      const skeletons = new Set<THREE.Skeleton>();
      instance.scene.traverse((object) => {
        if (object instanceof THREE.SkinnedMesh) skeletons.add(object.skeleton);
      });
      skeletons.forEach((skeleton) => skeleton.dispose());
      // Geometry and original materials belong to useLoader's shared asset cache.
    };
  }, [instance, source.animations, time, motion]);

  useFrame(() => {
    const state = animation.current;
    if (!state) return;
    const currentTime = time.current;
    const jump = Math.abs(currentTime - state.previousTime) > 0.2;
    const dt = THREE.MathUtils.clamp(currentTime - state.previousTime, 0, 0.1);
    state.previousTime = currentTime;
    const desiredWalk = motion.current.walking
      ? THREE.MathUtils.clamp(motion.current.speed / 0.35, 0, 1)
      : 0;
    const blend = jump ? 1 : 1 - Math.exp(-dt * 10);
    state.walkWeight = THREE.MathUtils.lerp(
      state.walkWeight,
      desiredWalk,
      blend,
    );
    state.interactionWeight = THREE.MathUtils.lerp(
      state.interactionWeight,
      motion.current.interaction ? 1 : 0,
      blend,
    );
    state.walk.setEffectiveWeight(
      state.walkWeight * (1 - state.interactionWeight),
    );
    state.interact.setEffectiveWeight(state.interactionWeight);
    state.idle.setEffectiveWeight(
      (1 - state.walkWeight) * (1 - state.interactionWeight),
    );
    state.walk.time =
      ((((motion.current.distance /
        ((SOURCE_STRIDE * height) / SOURCE_HEIGHT)) %
        1) +
        1) %
        1) *
      state.walk.getClip().duration;
    state.idle.time = currentTime % state.idle.getClip().duration;
    state.interact.time = currentTime % state.interact.getClip().duration;
    state.mixer.update(0);
  });

  return (
    <group
      ref={root}
      scale={height / SOURCE_HEIGHT}
      position={[0, 0.004, 0]}
      dispose={null}
    >
      <primitive object={instance.scene} />
    </group>
  );
}
