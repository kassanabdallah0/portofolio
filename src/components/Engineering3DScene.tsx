'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { Studio, CameraDirector } from './engineering/core/Studio';
import { isSoftwareWebGLContext } from './engineering/core/webglSupport';
import type { PhysicalScene, SceneProps } from './engineering/core/types';
import ScanScene from './engineering/scenes/ScanScene';
import VisionScene from './engineering/scenes/VisionScene';
import VisionCamera from './engineering/vision/VisionCamera';
import VisionLighting from './engineering/vision/VisionLighting';
import VisionRenderBudget from './engineering/vision/VisionRenderBudget';
import FleetScene from './engineering/scenes/FleetScene';
import { Enclosure, Jetson } from './engineering/models/IndustrialEquipment';
export type { PhysicalScene } from './engineering/core/types';

function RenderStatus({
  time,
  onUnavailable,
}: Pick<SceneProps, 'time'> & { onUnavailable?: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = () => {
      canvas.setAttribute('data-context', 'lost');
      onUnavailable?.();
    };
    canvas.setAttribute('data-context', 'ready');
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onUnavailable]);
  useFrame(() => {
    gl.domElement.setAttribute('data-scene-time', time.current.toFixed(2));
  });
  return null;
}
export default function Engineering3DScene({
  mode,
  onUnavailable,
  ...props
}: SceneProps & { mode: PhysicalScene; onUnavailable?: () => void }) {
  const [softwareRenderer, setSoftwareRenderer] = useState<boolean | null>(
    null,
  );
  const lowPower =
    mode === 'vision' ? props.lowPower : softwareRenderer === true;
  const classified = mode === 'vision' || softwareRenderer !== null;
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
      shadows={lowPower ? false : 'soft'}
      dpr={
        lowPower
          ? mode === 'vision'
            ? 0.75
            : 1
          : [1, mode === 'vision' ? 1.25 : 1.5]
      }
      frameloop={
        mode === 'vision' && lowPower
          ? 'demand'
          : props.running
            ? 'always'
            : 'demand'
      }
      gl={{
        alpha: false,
        antialias: mode !== 'vision' || !lowPower,
        powerPreference: 'low-power',
      }}
      onCreated={({ gl }) => {
        if (mode !== 'vision')
          setSoftwareRenderer(isSoftwareWebGLContext(gl.getContext()));
      }}
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
      {classified && (
        <>
          {mode === 'vision' ? (
            <>
              <VisionLighting lowPower={props.lowPower} />
              <VisionCamera view={props.view} />
            </>
          ) : (
            <>
              <Studio mode={mode} lowPower={lowPower} />
              <CameraDirector mode={mode} view={props.view} />
            </>
          )}
          {mode === 'vision' && lowPower && (
            <VisionRenderBudget running={props.running} />
          )}
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
            <RenderStatus time={props.time} onUnavailable={onUnavailable} />
          </Suspense>
        </>
      )}
    </Canvas>
  );
}
