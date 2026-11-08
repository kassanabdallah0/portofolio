'use client';
import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { PhysicalScene, SceneView } from './types';
export function Studio({ mode }: { mode: PhysicalScene }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl),
      room = new RoomEnvironment(),
      target = generator.fromScene(room, 0.045);
    // Imperative mutation of a Three.js-owned scene, not React props or state.
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = target.texture;
    room.dispose();
    generator.dispose();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);
  return (
    <>
      <color
        attach="background"
        args={[
          mode === 'scan'
            ? '#c8d4d8'
            : mode === 'cloud'
              ? '#b9cbd2'
              : '#233b4b',
        ]}
      />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#f0f8ff', '#768385', 0.85]} />
      <directionalLight
        position={[2, 9, 6]}
        color="#fff7e6"
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-normalBias={0.035}
        shadow-bias={-0.00015}
      />
      <directionalLight
        position={[-6, 4, -2]}
        color="#d1e6ff"
        intensity={1.1}
      />
    </>
  );
}
export function CameraDirector({
  mode,
  view,
}: {
  mode: PhysicalScene;
  view: SceneView;
}) {
  const { camera, size, invalidate } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []),
    look = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  useFrame((_, delta) => {
    if (mode === 'cloud') return;
    const detail = view === 'detail';
    const desired =
      mode === 'scan'
        ? detail
          ? [3.2, 2.4, 3.6]
          : [7.8, 5.8, 10.6]
        : mode === 'vision'
          ? detail
            ? [6, 2.8, 2.7]
            : [8.4, 6.8, 10.4]
          : [3.4, 2.8, 4.5];
    target.set(...(desired as [number, number, number]));
    camera.position.lerp(target, 1 - Math.exp(-Math.min(delta, 0.05) * 4));
    const aim =
      mode === 'scan'
        ? detail
          ? new THREE.Vector3(1.1, 1.7, -0.7)
          : new THREE.Vector3(-0.1, 1, 0)
        : mode === 'vision'
          ? detail
            ? new THREE.Vector3(3.5, 0.9, -0.9)
            : new THREE.Vector3(0, 0.7, 0)
          : new THREE.Vector3(0, 0.3, 0);
    look.lerp(aim, 1 - Math.exp(-Math.min(delta, 0.05) * 4));
    camera.lookAt(look);
    if (camera instanceof THREE.OrthographicCamera) {
      const zoom =
        mode === 'delivery'
          ? Math.min(size.width / 3, size.height / 2.2)
          : detail
            ? Math.min(size.width / 3.5, size.height / 2.7)
            : Math.min(
                size.width / (mode === 'vision' ? 10.5 : 9.4),
                size.height / 6.7,
              );
      // R3F camera is an imperative Three object, not React state.
      // eslint-disable-next-line react-hooks/immutability
      camera.zoom = THREE.MathUtils.damp(
        camera.zoom,
        zoom,
        5,
        Math.min(delta, 0.05),
      );
      camera.updateProjectionMatrix();
    }
    if (camera.position.distanceTo(target) > 0.005) invalidate();
  });
  return null;
}
