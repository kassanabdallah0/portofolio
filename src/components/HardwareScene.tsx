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

/** Supporting physical endpoints aligned with the 720 × 540 HTML/SVG story.
 * The readable interface and API layers deliberately remain outside WebGL. */
function Hardware({
  time,
  paused,
  activeLayer,
}: {
  time: RefObject<number>;
  paused: boolean;
  activeLayer: HeroLayer;
}) {
  const cloud = useRef<THREE.Group>(null);
  const containers = useRef<THREE.Group[]>([]);
  const fan = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const leds = useRef<THREE.MeshStandardMaterial[]>([]);
  const motionTime = useRef(0);
  const { gl, size } = useThree();
  const production = activeLayer === 'production';
  const resources = useMemo(() => {
    const blade = new THREE.Shape();
    blade.moveTo(4, 0);
    blade.quadraticCurveTo(8, -3, 16, -1);
    blade.quadraticCurveTo(19, 4, 14, 9);
    blade.quadraticCurveTo(10, 4, 5, 3);
    blade.closePath();
    return {
      box: new RoundedBoxGeometry(1, 1, 1, 3, 0.055),
      sphere: new THREE.SphereGeometry(1, 32, 20),
      circle: new THREE.CircleGeometry(1, 48),
      ring: new THREE.TorusGeometry(1, 0.012, 6, 64),
      blade: new THREE.ExtrudeGeometry(blade, {
        depth: 1.3,
        bevelEnabled: true,
        bevelSize: 0.3,
        bevelThickness: 0.25,
        bevelSegments: 1,
        steps: 1,
      }),
    };
  }, []);
  useEffect(
    () => () => {
      resources.box.dispose();
      resources.sphere.dispose();
      resources.circle.dispose();
      resources.ring.dispose();
      resources.blade.dispose();
    },
    [resources],
  );
  useEffect(() => {
    gl.domElement.setAttribute('data-hero-layer', activeLayer);
  }, [activeLayer, gl]);
  useEffect(() => {
    // A paused first frame still renders the current shared story position.
    motionTime.current = time.current;
  }, [paused, time, activeLayer]);
  useFrame(() => {
    if (!paused) motionTime.current = time.current;
    const t = motionTime.current;
    if (cloud.current) {
      cloud.current.position.y = 144 + Math.sin((t * Math.PI) / 9) * 5;
      cloud.current.rotation.z = Math.sin((t * Math.PI) / 9) * 0.018;
    }
    containers.current.forEach((container, index) => {
      if (!container) return;
      const phase = (t * Math.PI) / 9 + index * Math.PI;
      container.position.y = (index === 0 ? 112 : 170) + Math.sin(phase) * 3;
      container.rotation.y =
        (index === 0 ? -0.38 : 0.28) + Math.sin(phase) * 0.12;
    });
    if (fan.current) fan.current.rotation.z = -t * 1.9;
    leds.current.forEach((material, index) => {
      if (!material) return;
      const pulse = (Math.sin(t * 2.6 - index * 0.9) + 1) / 2;
      material.emissiveIntensity =
        (production ? 0.35 : 0.12) + pulse * (production ? 0.65 : 0.18);
    });
    if (ring.current) {
      const pulse = (t % 3) / 3;
      ring.current.scale.setScalar(36 + pulse * 10);
      const material = ring.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.sin(pulse * Math.PI) * (production ? 0.24 : 0.1);
    }
  });

  const box = (
    key: string,
    position: [number, number, number],
    scale: [number, number, number],
    color: string,
    metalness = 0.48,
    roughness = 0.34,
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
        metalness={metalness}
        roughness={roughness}
        emissive={production ? '#507b8e' : '#000000'}
        emissiveIntensity={production ? 0.06 : 0}
      />
    </mesh>
  );

  return (
    <group scale={size.width / 720}>
      {/* SVG (606,126): a sculpted cloud above a small production-service pod. */}
      <mesh
        geometry={resources.circle}
        position={[246, 91, -55]}
        scale={[63, 17, 1]}
        receiveShadow
      >
        <shadowMaterial transparent opacity={0.14} />
      </mesh>
      <group ref={cloud} position={[246, 144, 0]}>
        {[
          { position: [-30, 10, 4] as const, scale: [28, 25, 24] as const },
          { position: [1, 24, 0] as const, scale: [35, 32, 29] as const },
          { position: [32, 10, 4] as const, scale: [27, 25, 23] as const },
        ].map(({ position, scale }, index) => (
          <mesh
            key={index}
            geometry={resources.sphere}
            position={[...position]}
            scale={[...scale]}
            castShadow
          >
            <meshPhysicalMaterial
              color={production ? '#dcecf2' : '#e5ecef'}
              metalness={0.18}
              roughness={0.27}
              clearcoat={0.5}
              clearcoatRoughness={0.26}
            />
          </mesh>
        ))}
        {box('cloud-sill', [1, -8, 2], [91, 16, 39], '#d5e2e9', 0.25, 0.3)}
        {box('cloud-plinth', [0, -39, 2], [103, 7, 39], '#a1b6c4', 0.72, 0.3)}
        {box('cloud-server', [0, -27, 8], [80, 17, 28], '#4d6678', 0.62, 0.36)}
        {box(
          'cloud-server-face',
          [0, -27, 23],
          [71, 11, 2.5],
          '#223b4c',
          0.45,
          0.5,
        )}
        {[-25, -16, -7].map((x, index) =>
          box(
            `server-drive-${index}`,
            [x, -27, 25],
            [6, 7, 2],
            '#839dab',
            0.7,
            0.3,
          ),
        )}
        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            geometry={resources.sphere}
            position={[15 + index * 6, -27, 26]}
            scale={1.4}
          >
            <meshStandardMaterial
              ref={(material) => {
                if (material) leds.current[index] = material;
              }}
              color="#9bc7ba"
              emissive="#7eaa9b"
              emissiveIntensity={0.2}
              roughness={0.35}
            />
          </mesh>
        ))}
        <mesh
          ref={ring}
          geometry={resources.ring}
          position={[0, -17, -18]}
          scale={36}
          rotation={[0.45, 0, 0]}
        >
          <meshBasicMaterial
            color="#88aebf"
            transparent
            opacity={0.1}
            depthWrite={false}
          />
        </mesh>
      </group>
      {[0, 1].map((index) => (
        <group
          key={index}
          ref={(node) => {
            if (node) containers.current[index] = node;
          }}
          position={[index === 0 ? 186 : 300, index === 0 ? 112 : 170, 8]}
          rotation={[0.38, index === 0 ? -0.38 : 0.28, 0.06]}
        >
          {box(
            `container-${index}`,
            [0, 0, 0],
            [15, 16, 16],
            index === 0 ? '#a7beca' : '#8ea9bc',
            0.58,
            0.34,
          )}
          {box(
            `container-lid-${index}`,
            [0, 6, 8.1],
            [10, 2, 0.8],
            '#e0e9ed',
            0.4,
            0.4,
          )}
          {box(
            `container-slot-${index}`,
            [0, -1, 8.2],
            [9, 1.2, 0.8],
            '#36566c',
            0.45,
            0.5,
          )}
        </group>
      ))}

      {/* SVG (604,383): edge board, individual heatsink fins, rotating fan and front I/O. */}
      <mesh
        geometry={resources.circle}
        position={[244, -143, -55]}
        scale={[66, 27, 1]}
        receiveShadow
      >
        <shadowMaterial transparent opacity={0.13} />
      </mesh>
      <group position={[244, -113, 0]} rotation={[-0.58, 0.42, -0.08]}>
        {box('edge-base', [0, 0, -5], [114, 76, 4], '#425c6a', 0.65, 0.4)}
        {box('edge-pcb', [0, 0, 0], [110, 72, 5], '#38665b', 0.15, 0.63)}
        {box(
          'edge-heatsink-base',
          [-7, 4, 7],
          [78, 53, 8],
          '#354852',
          0.78,
          0.32,
        )}
        {Array.from({ length: 14 }, (_, index) =>
          box(
            `edge-fin-${index}`,
            [-42 + index * 5.4, 4, 18],
            [2.4, 48, 16],
            '#a3b5bf',
            0.84,
            0.3,
          ),
        )}
        <mesh position={[8, 4, 28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[20, 20, 4, 32]} />
          <meshStandardMaterial
            color="#253b47"
            metalness={0.48}
            roughness={0.52}
          />
        </mesh>
        <group ref={fan} position={[8, 4, 31]}>
          {Array.from({ length: 6 }, (_, index) => (
            <mesh
              key={index}
              geometry={resources.blade}
              rotation={[0, 0, (index * Math.PI) / 3]}
              castShadow
            >
              <meshStandardMaterial
                color="#728b99"
                metalness={0.7}
                roughness={0.38}
              />
            </mesh>
          ))}
        </group>
        <mesh position={[8, 4, 33]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[5, 5, 3, 16]} />
          <meshStandardMaterial
            color="#c2cfd3"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[8, 4, 33]}>
          <torusGeometry args={[19, 1.05, 8, 40]} />
          <meshStandardMaterial
            color="#acbdc5"
            metalness={0.8}
            roughness={0.28}
          />
        </mesh>
        {[-43, 46].flatMap((x) =>
          [-28, 28].map((y) => (
            <group key={`${x}:${y}`} position={[x, y, 4]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[3, 3, 2.2, 12]} />
                <meshStandardMaterial
                  color="#c4b78b"
                  metalness={0.8}
                  roughness={0.36}
                />
              </mesh>
              <mesh position={[0, 0, 1.4]}>
                <boxGeometry args={[3.2, 0.6, 0.25]} />
                <meshStandardMaterial
                  color="#5d6561"
                  metalness={0.6}
                  roughness={0.4}
                />
              </mesh>
            </group>
          )),
        )}
        {[-35, -13, 13].map((x, index) => (
          <group key={x} position={[x, -31, 7]}>
            {box(
              `edge-port-${index}`,
              [0, 0, 0],
              [index === 2 ? 20 : 17, 13, 13],
              '#bcc9cf',
              0.8,
              0.3,
            )}
            {box(
              `edge-port-hole-${index}`,
              [0, -7, 0],
              [index === 2 ? 15 : 12, 1.4, 8],
              index === 2 ? '#243d36' : '#204e70',
              0.2,
              0.55,
            )}
            {index !== 2 &&
              box(
                `edge-usb-tongue-${index}`,
                [0, -7.8, -1],
                [10, 0.8, 2],
                '#739ab3',
                0.25,
                0.4,
              )}
          </group>
        ))}
        {box('edge-power', [46, -21, 8], [11, 16, 11], '#233d45', 0.25, 0.65)}
        {box('edge-gpio', [46, 11, 6], [9, 30, 7], '#263c42', 0.18, 0.75)}
        {Array.from({ length: 7 }, (_, index) =>
          box(
            `edge-pin-${index}`,
            [46, -1 + index * 4, 11],
            [5, 1.2, 2],
            '#c4ad7b',
            0.82,
            0.33,
          ),
        )}
        <mesh geometry={resources.sphere} position={[36, -30, 6]} scale={1.8}>
          <meshStandardMaterial
            ref={(material) => {
              if (material) leds.current[3] = material;
            }}
            color="#a3cdb0"
            emissive="#7bb493"
            emissiveIntensity={0.2}
            roughness={0.4}
          />
        </mesh>
      </group>
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
      orthographic
      dpr={lowPower ? 1 : [1, 1.5]}
      frameloop={lowPower || paused ? 'demand' : 'always'}
      shadows={!lowPower}
      camera={{ position: [0, 0, 1000], zoom: 1, near: 0.1, far: 2000 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        setSoftwareRenderer(recordSoftwareRenderer(gl.getContext()));
      }}
    >
      {softwareRenderer !== undefined && (
        <>
          <SceneStatus onReady={onReady} onUnavailable={onUnavailable} />
          <Studio lowPower={lowPower} />
          <ambientLight intensity={0.65} />
          <directionalLight
            position={[-240, 400, 800]}
            intensity={2.6}
            castShadow={!lowPower}
            shadow-mapSize={[512, 512]}
            shadow-camera-left={-400}
            shadow-camera-right={500}
            shadow-camera-top={400}
            shadow-camera-bottom={-350}
            shadow-camera-far={2000}
            shadow-normalBias={0.25}
          />
          <directionalLight
            position={[500, 120, -300]}
            intensity={1.6}
            color="#c4d9e8"
          />
          <Hardware paused={paused} time={time} activeLayer={activeLayer} />
          {lowPower && <SoftwareRenderBudget running={!paused} />}
        </>
      )}
    </Canvas>
  );
}
