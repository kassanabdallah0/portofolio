'use client';

import { useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

/** Reuse the licensed human's actual skeleton for a fixed driving pose.
 * This is a locally authored seated pose, not an invented source animation clip.
 */
export function ForkliftDriver() {
  const source = useLoader(
    GLTFLoader,
    '/portofolio/engineering/assets/worker-rigged.glb',
  );
  const scene = useMemo(() => {
    const model = clone(source.scene);
    const idle = source.animations.find((clip) => clip.name === 'idle');
    if (idle) {
      const mixer = new THREE.AnimationMixer(model);
      mixer.clipAction(idle).play();
      mixer.setTime(0.1);
      // Bake the sample before releasing its temporary mixer bindings.
      const pose: {
        object: THREE.Object3D;
        position: THREE.Vector3;
        quaternion: THREE.Quaternion;
        scale: THREE.Vector3;
      }[] = [];
      model.traverse((object) => {
        if (object instanceof THREE.Bone)
          pose.push({
            object,
            position: object.position.clone(),
            quaternion: object.quaternion.clone(),
            scale: object.scale.clone(),
          });
      });
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      pose.forEach(({ object, position, quaternion, scale }) => {
        object.position.copy(position);
        object.quaternion.copy(quaternion);
        object.scale.copy(scale);
      });
    }
    model.updateMatrixWorld(true);
    const origin = new THREE.Vector3(),
      endpoint = new THREE.Vector3();
    const aim = (
      name: string,
      childName: string,
      direction: [number, number, number],
    ) => {
      const bone = model.getObjectByName(name),
        child = model.getObjectByName(childName);
      if (!bone?.parent || !child) return;
      model.updateMatrixWorld(true);
      bone.getWorldPosition(origin);
      child.getWorldPosition(endpoint);
      const from = endpoint.sub(origin).normalize();
      const delta = new THREE.Quaternion().setFromUnitVectors(
        from,
        new THREE.Vector3(...direction).normalize(),
      );
      const target = delta.multiply(
        bone.getWorldQuaternion(new THREE.Quaternion()),
      );
      bone.quaternion.copy(
        bone.parent
          .getWorldQuaternion(new THREE.Quaternion())
          .invert()
          .multiply(target),
      );
      model.updateMatrixWorld(true);
    };
    for (const side of ['L', 'R']) {
      const sign = side === 'L' ? 1 : -1;
      aim(`UpperLeg${side}`, `LowerLeg${side}`, [sign * 0.03, -0.12, 1]);
      aim(`LowerLeg${side}`, `LowerLeg${side}_end`, [0, -1, 0.12]);
      // The source rig's feet are independent root controls, so position them
      // on the foot platform rather than expecting the knee hierarchy to move them.
      const foot = model.getObjectByName(`Foot${side}`);
      if (foot?.parent)
        foot.position.copy(
          foot.parent.worldToLocal(new THREE.Vector3(sign * 0.13, 0.45, 0.57)),
        );
      aim(`UpperArm${side}`, `LowerArm${side}`, [sign * 0.18, -1, 0.35]);
      aim(`LowerArm${side}`, `Wrist${side}`, [0, -0.35, 1]);
    }
    model.position.set(0, 0.16, -0.25);
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.frustumCulled = false;
      }
    });
    return model;
  }, [source]);
  useEffect(
    () => () => {
      const skeletons = new Set<THREE.Skeleton>();
      scene.traverse((object) => {
        if (object instanceof THREE.SkinnedMesh) skeletons.add(object.skeleton);
      });
      skeletons.forEach((skeleton) => skeleton.dispose());
    },
    [scene],
  );
  return <primitive object={scene} dispose={null} />;
}
