'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { VISION_CAMERA } from './visionTimeline';
import type { SceneView } from '../core/types';
/** Explicit surveillance view reuses the existing renderer and context. The
 * workshop camera stays stable, so pause/inspection never drift its projections.
 */
export default function VisionCamera({ view }: { view: SceneView }) {
  const { camera: initialCamera, set, size, invalidate } = useThree();
  const overview = useRef(initialCamera);
  const monitoring = useMemo(() => {
    const v = VISION_CAMERA;
    const camera = new THREE.PerspectiveCamera(
      (2 *
        Math.atan(Math.tan((v.horizontalFov * Math.PI) / 360) / v.aspect) *
        180) /
        Math.PI,
      v.aspect,
      v.near,
      v.far,
    );
    camera.position.set(v.position.x, v.position.y, v.position.z);
    camera.lookAt(v.target.x, v.target.y, v.target.z);
    return camera;
  }, []);
  useEffect(() => {
    const camera = overview.current;
    camera.position.set(11.4, 18.2, 15.8);
    camera.lookAt(0, 0.9, -0.15);
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = Math.min(size.width / 18.2, size.height / 14.7);
      camera.updateProjectionMatrix();
    }
    set({ camera: view === 'camera' ? monitoring : camera });
    invalidate();
    return () => {
      set({ camera });
    };
  }, [view, monitoring, set, size.width, size.height, invalidate]);
  return null;
}
