'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  readSoftwareRenderer,
  recordSoftwareRenderer,
} from './engineering/core/webglSupport';
import SoftwareRenderBudget from './engineering/core/SoftwareRenderBudget';
import type { HeroLayer } from '@/data/hero';

function SceneStatus({
  onReady,
  onUnavailable,
}: {
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onUnavailable);
    onReady();
    // R3F intentionally loses its context during disposal. That is not a rendering failure.
    return () => canvas.removeEventListener('webglcontextlost', onUnavailable);
  }, [gl, onReady, onUnavailable]);
  return null;
}

function Studio({ lowPower }: { lowPower: boolean }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = lowPower
      ? generator.fromScene(room, 0.04, 0.1, 100, { size: 64 })
      : generator.fromScene(room, 0.04);
    // Three owns this mutable scene; it is not React state.
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = target.texture;
    room.dispose();
    generator.dispose();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene, lowPower]);
  return null;
}

function Hardware({
  time,
  paused,
  activeLayer,
}: {
  time: RefObject<number>;
  paused: boolean;
  activeLayer: HeroLayer;
}) {
  const group = useRef<THREE.Group>(null);
  const packets = useRef<THREE.Mesh[]>([]);
  const { gl } = useThree();
  const resources = useMemo(() => {
    // Independent product lanes, matching the two readable HTML paths above.
    const paths = [-0.46, 0.46].flatMap((z) => [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.28, 0.12, z - 0.06),
        new THREE.Vector3(-0.8, 0.12, z - 0.06),
        new THREE.Vector3(0.8, 0.12, z - 0.06),
        new THREE.Vector3(2.28, 0.12, z - 0.06),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.28, 0.1, z + 0.06),
        new THREE.Vector3(0.8, 0.1, z + 0.06),
        new THREE.Vector3(-0.8, 0.1, z + 0.06),
        new THREE.Vector3(-2.28, 0.1, z + 0.06),
      ]),
    ]);
    return {
      box: new RoundedBoxGeometry(1, 1, 1, 2, 0.055),
      sphere: new THREE.SphereGeometry(0.032, 8, 8),
      paths,
      tubes: paths.map(
        (path) => new THREE.TubeGeometry(path, 12, 0.008, 4, false),
      ),
    };
  }, []);
  useEffect(
    () => () => {
      resources.box.dispose();
      resources.sphere.dispose();
      resources.tubes.forEach((tube) => tube.dispose());
    },
    [resources],
  );
  useEffect(() => {
    gl.domElement.setAttribute('data-hero-layer', activeLayer);
  }, [activeLayer, gl]);
  useFrame(({ pointer }, delta) => {
    if (group.current && !paused) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        pointer.x * 0.045,
        3,
        Math.min(delta, 0.05),
      );
    }
    packets.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = (time.current / 3 + Math.floor(i / 2) * 0.2) % 1;
      resources.paths[i].getPoint(phase, mesh.position);
      mesh.scale.setScalar(0.55 + Math.sin(phase * Math.PI) * 0.45);
    });
  });
  const box = (
    key: string,
    position: [number, number, number],
    scale: [number, number, number],
    color: string,
    layer: HeroLayer,
  ) => (
    <mesh
      key={key}
      geometry={resources.box}
      position={position}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        metalness={0.48}
        roughness={0.34}
        emissive={activeLayer === layer ? '#47758b' : '#000000'}
        emissiveIntensity={activeLayer === layer ? 0.12 : 0}
      />
    </mesh>
  );
  return (
    <group ref={group}>
      {[-0.46, 0.46].map((z, i) => (
        <group key={z}>
          <group position={[-2.3, 0.18, z]} rotation={[-0.16, -0.08, 0]}>
            {box(
              `interface-${i}`,
              [0, 0.17, 0],
              [0.85, 0.52, 0.09],
              activeLayer === 'interface' ? '#a9c6d7' : '#c5d2db',
              'interface',
            )}
            {box(
              `screen-${i}`,
              [0, 0.17, 0.055],
              [0.74, 0.39, 0.025],
              '#34546a',
              'interface',
            )}
            {box(
              `toolbar-${i}`,
              [0, 0.31, 0.074],
              [0.64, 0.035, 0.018],
              '#b3cfdd',
              'interface',
            )}
            {[0, 1, 2].map((n) =>
              box(
                `ui-${i}-${n}`,
                [-0.21 + n * 0.21, 0.12, 0.074],
                [0.15, 0.14, 0.018],
                n === 0 ? '#b0c9d7' : '#759aad',
                'interface',
              ),
            )}
          </group>
          <group position={[0, 0.1, z]}>
            {[0, 1, 2].map((n) =>
              box(
                `service-${i}-${n}`,
                [0, n * 0.12, 0],
                [0.72, 0.085, 0.39],
                n === 2 ? '#bccfdc' : '#718fa4',
                'backend',
              ),
            )}
          </group>
        </group>
      ))}
      <group position={[2.3, 0.12, -0.46]}>
        {box(
          'jetson',
          [0, 0.08, 0],
          [0.93, 0.27, 0.58],
          '#516b7d',
          'production',
        )}
        {Array.from({ length: 9 }, (_, i) =>
          box(
            `fin-${i}`,
            [-0.36 + i * 0.09, 0.28, 0],
            [0.035, 0.14, 0.52],
            '#a8b9c5',
            'production',
          ),
        )}
        {[-0.26, -0.04, 0.18].map((x, i) =>
          box(
            `port-${i}`,
            [x, 0.07, 0.3],
            [0.14, 0.1, 0.02],
            '#172e3d',
            'production',
          ),
        )}
      </group>
      <group position={[2.3, 0.25, 0.46]}>
        {box(
          'cloud-base',
          [0, -0.06, 0],
          [1, 0.13, 0.58],
          '#7997ac',
          'production',
        )}
        {[-0.28, 0, 0.28].map((x, i) => (
          <mesh
            key={i}
            position={[x, i === 1 ? 0.19 : 0.1, 0]}
            scale={[0.28, 0.22, 0.24]}
            castShadow
          >
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial
              color={activeLayer === 'production' ? '#bad7e5' : '#d6e2e9'}
              metalness={0.25}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
      {resources.tubes.map((tube, i) => (
        <mesh key={i} geometry={tube}>
          <meshStandardMaterial
            color={i % 2 ? '#a6bbb2' : '#8baabc'}
            roughness={0.7}
          />
        </mesh>
      ))}
      {resources.paths.map((_, i) => (
        <mesh
          key={i}
          geometry={resources.sphere}
          ref={(mesh) => {
            if (mesh) packets.current[i] = mesh;
          }}
        >
          <meshBasicMaterial color={i % 2 ? '#799e8e' : '#3b6c8a'} />
        </mesh>
      ))}
    </group>
  );
}

export default function HardwareScene({
  paused,
  time,
  activeLayer,
  onReady,
  onUnavailable,
}: {
  paused: boolean;
  time: RefObject<number>;
  activeLayer: HeroLayer;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const [softwareRenderer, setSoftwareRenderer] =
    useState(readSoftwareRenderer);
  const lowPower = softwareRenderer === true;
  return (
    <Canvas
      dpr={lowPower ? 1 : [1, 1.5]}
      frameloop={lowPower || paused ? 'demand' : 'always'}
      shadows={!lowPower}
      camera={{ position: [0, 2.4, 5.2], fov: 22 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, 0.15, 0);
        setSoftwareRenderer(recordSoftwareRenderer(gl.getContext()));
      }}
    >
      {softwareRenderer !== undefined && (
        <>
          <SceneStatus onReady={onReady} onUnavailable={onUnavailable} />
          <Studio lowPower={lowPower} />
          <ambientLight intensity={0.65} />
          <directionalLight
            position={[-3, 8, 5]}
            intensity={2.6}
            castShadow={!lowPower}
            shadow-mapSize={[512, 512]}
            shadow-camera-left={-4}
            shadow-camera-right={4}
            shadow-camera-top={2}
            shadow-camera-bottom={-2}
            shadow-normalBias={0.025}
          />
          <directionalLight
            position={[4, 2, -3]}
            intensity={1.6}
            color="#c4d9e8"
          />
          <Hardware paused={paused} time={time} activeLayer={activeLayer} />
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.04, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 20]} />
            <shadowMaterial transparent opacity={0.12} />
          </mesh>
          {lowPower && <SoftwareRenderBudget running={!paused} />}
        </>
      )}
    </Canvas>
  );
}
