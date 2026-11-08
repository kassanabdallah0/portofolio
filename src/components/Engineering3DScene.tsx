'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { Studio, CameraDirector } from './engineering/core/Studio';
import type { PhysicalScene, SceneProps } from './engineering/core/types';
import ScanScene from './engineering/scenes/ScanScene';
import VisionScene from './engineering/scenes/VisionScene';
import FleetScene from './engineering/scenes/FleetScene';
import { Enclosure, Jetson } from './engineering/models/IndustrialEquipment';
export type { PhysicalScene } from './engineering/core/types';

function RenderStatus({ time }: Pick<SceneProps, 'time'>) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = () => {
      canvas.setAttribute('data-context', 'lost');
    };
    canvas.setAttribute('data-context', 'ready');
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl]);
  useFrame(() => {
    gl.domElement.setAttribute('data-scene-time', time.current.toFixed(2));
  });
  return null;
}
export default function Engineering3DScene({
  mode,
  ...props
}: SceneProps & { mode: PhysicalScene }) {
  return (
    <Canvas
      className="lab-physical-canvas"
      orthographic
      camera={{
        position: mode === 'cloud' ? [8.4, 10.7, 13.7] : [7.8, 5.8, 10.6],
        zoom: 55,
        near: 0.1,
        far: 100,
      }}
      shadows="soft"
      dpr={[1, 1.5]}
      frameloop={props.running ? 'always' : 'demand'}
      gl={{ alpha: false, antialias: true, powerPreference: 'low-power' }}
      role="img"
      aria-label={
        mode === 'scan'
          ? 'Reconstitution tridimensionnelle du scan EPI'
          : mode === 'cloud'
            ? 'Flotte de bus 3D et serveur OpenVPN sur AWS'
            : mode === 'delivery'
              ? 'Calculateur Jetson, ports et dissipateur en trois dimensions'
              : 'Atelier industriel et détection par caméra'
      }
    >
      <Studio mode={mode} />
      <CameraDirector mode={mode} view={props.view} />
      <Suspense fallback={null}>
        {mode === 'scan' && <ScanScene {...props} />}
        {mode === 'vision' && <VisionScene {...props} />}
        {mode === 'cloud' && (
          <FleetScene
            {...props}
            view={props.view === 'comparison' ? 'physical' : props.view}
          />
        )}
        {mode === 'delivery' && (
          <group>
            <Enclosure
              size={[2, 0.12, 1.65]}
              position={[0, -0.1, 0]}
              color="#526d7a"
              radius={0.1}
            />
            <Jetson scale={2.2} active={props.stage !== 2} />
          </group>
        )}
        <RenderStatus time={props.time} />
      </Suspense>
    </Canvas>
  );
}
