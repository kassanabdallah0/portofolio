'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Enclosure } from '../models/IndustrialEquipment';

type V3 = [number, number, number];
type Instance = { position: V3; rotation?: V3; scale?: V3 };
const steel = '#526b77';
const pearl = '#c2cece';
const safety = '#c8ab61';

/** Batched repetition keeps fixtures and floor markings cheap to render. */
function RepeatedBoxes({
  items,
  size,
  color,
  metalness = 0.35,
  roughness = 0.65,
  shadows = true,
}: {
  items: Instance[];
  size: V3;
  color: string;
  metalness?: number;
  roughness?: number;
  shadows?: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();
    items.forEach(
      ({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }, index) => {
        dummy.position.set(...position);
        dummy.rotation.set(...rotation);
        dummy.scale.set(...scale);
        dummy.updateMatrix();
        mesh.current!.setMatrixAt(index, dummy.matrix);
      },
    );
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [items]);
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, items.length]}
      castShadow={shadows}
      receiveShadow={shadows}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </instancedMesh>
  );
}

function ConcreteFloor() {
  const texture = useMemo(() => {
    const bytes = new Uint8Array(128 * 128 * 4);
    let seed = 4637;
    for (let i = 0; i < 128 * 128; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const variation = 199 + ((seed >>> 23) % 20);
      bytes.set([variation, variation + 2, variation + 1, 255], i * 4);
    }
    const map = new THREE.DataTexture(bytes, 128, 128);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(9, 6);
    map.magFilter = THREE.LinearFilter;
    map.minFilter = THREE.LinearMipmapLinearFilter;
    map.generateMipmaps = true;
    map.needsUpdate = true;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group>
      <Enclosure
        size={[14, 0.3, 10]}
        position={[0, -0.18, 0]}
        color="#667b83"
        radius={0.13}
        roughness={0.85}
        metalness={0.1}
      />
      <mesh
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[13.82, 9.82]} />
        <meshStandardMaterial
          color="#b4c1c0"
          map={texture}
          bumpMap={texture}
          bumpScale={0.014}
          roughness={0.94}
          metalness={0.02}
        />
      </mesh>
      <RepeatedBoxes
        items={[-4.6, 0, 4.6].map((x) => ({ position: [x, -0.003, 0] }))}
        size={[0.014, 0.006, 9.8]}
        color="#8d9e9f"
        shadows={false}
        metalness={0}
      />
      <RepeatedBoxes
        items={[-2.45, 0, 2.45].map((z) => ({ position: [0, -0.003, z] }))}
        size={[13.8, 0.006, 0.014]}
        color="#8d9e9f"
        shadows={false}
        metalness={0}
      />
    </group>
  );
}

function GroundArrow({
  position,
  rotation = 0,
  color = '#d9ded7',
  scale = 1,
}: {
  position: V3;
  rotation?: number;
  color?: string;
  scale?: number;
}) {
  const shape = useMemo(() => {
    const result = new THREE.Shape();
    result.moveTo(-0.08, -0.4);
    result.lineTo(0.08, -0.4);
    result.lineTo(0.08, 0.04);
    result.lineTo(0.27, 0.04);
    result.lineTo(0, 0.4);
    result.lineTo(-0.27, 0.04);
    result.lineTo(-0.08, 0.04);
    result.closePath();
    return result;
  }, []);
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={color} roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}

function PedestrianMark({ position }: { position: V3 }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;
    context.strokeStyle = '#d8e5de';
    context.lineWidth = 16;
    context.lineCap = 'round';
    context.beginPath();
    context.arc(138, 52, 15, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(133, 91);
    context.lineTo(119, 145);
    context.lineTo(87, 205);
    context.moveTo(119, 145);
    context.lineTo(162, 201);
    context.moveTo(132, 93);
    context.lineTo(96, 114);
    context.lineTo(75, 148);
    context.moveTo(134, 94);
    context.lineTo(162, 128);
    context.lineTo(188, 135);
    context.stroke();
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.62, 0.62]} />
      <meshStandardMaterial
        map={texture}
        transparent
        depthWrite={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function FloorMarkings() {
  return (
    <group>
      {/* Pedestrians and the forklift have physically separate lanes. Zone A is owned by the product scene. */}
      <mesh
        position={[-0.25, 0.001, 3.75]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[12.1, 1]} />
        <meshStandardMaterial color="#607f78" roughness={0.94} metalness={0} />
      </mesh>
      <RepeatedBoxes
        items={[3.25, 4.25].map((z) => ({ position: [-0.25, 0.006, z] }))}
        size={[12.1, 0.008, 0.045]}
        color="#cddbd1"
        metalness={0}
        shadows={false}
      />
      {[-4.8, 0, 4.7].map((x) => (
        <PedestrianMark key={x} position={[x, 0.012, 3.73]} />
      ))}
      <GroundArrow
        position={[-2.4, 0.012, 3.75]}
        rotation={-Math.PI / 2}
        scale={0.75}
      />
      <GroundArrow
        position={[2.45, 0.012, 3.75]}
        rotation={-Math.PI / 2}
        scale={0.75}
      />
      <mesh
        position={[5.2, 0.001, -1.1]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[2.75, 6.9]} />
        <meshStandardMaterial color="#8c9c9c" roughness={0.96} metalness={0} />
      </mesh>
      <RepeatedBoxes
        items={[3.825, 6.575].map((x) => ({ position: [x, 0.008, -1.1] }))}
        size={[0.045, 0.008, 6.9]}
        color={safety}
        metalness={0}
        shadows={false}
      />
      <RepeatedBoxes
        items={Array.from({ length: 9 }, (_, i) => ({
          position: [3.96 + i * 0.31, 0.01, 2.48] as V3,
          rotation: [0, -0.55, 0] as V3,
        }))}
        size={[0.11, 0.008, 0.28]}
        color={safety}
        metalness={0}
        shadows={false}
      />
      <GroundArrow
        position={[4.55, 0.012, -1.15]}
        rotation={Math.PI}
        color="#cbd2c9"
      />
      <GroundArrow position={[5.85, 0.012, -1.15]} color="#cbd2c9" />
      <RepeatedBoxes
        items={Array.from({ length: 11 }, (_, i) => ({
          position: [-6.3 + i * 0.25, 0.012, -2.48] as V3,
          rotation: [0, -0.65, 0] as V3,
        }))}
        size={[0.11, 0.009, 0.25]}
        color={safety}
        metalness={0}
        shadows={false}
      />
    </group>
  );
}

function BuildingFrame() {
  const posts = [-6.65, -2.45, 2.45, 6.65].map((x) => ({
    position: [x, 1.88, -4.72] as V3,
  }));
  return (
    <group>
      <RepeatedBoxes
        items={posts}
        size={[0.16, 3.75, 0.18]}
        color={steel}
        metalness={0.7}
        roughness={0.42}
      />
      <RepeatedBoxes
        items={posts.map((p) => ({
          position: [p.position[0], 0.07, -4.72] as V3,
        }))}
        size={[0.42, 0.14, 0.42]}
        color="#899b9f"
        metalness={0.5}
        roughness={0.7}
      />
      <Enclosure
        size={[13.45, 0.22, 0.22]}
        position={[0, 3.7, -4.72]}
        color={steel}
        radius={0.025}
        metalness={0.7}
      />
      <Enclosure
        size={[0.16, 2.9, 0.18]}
        position={[-6.65, 1.45, -1.15]}
        color={steel}
        radius={0.018}
        metalness={0.6}
      />
      <Enclosure
        size={[0.15, 0.18, 3.65]}
        position={[-6.65, 2.92, -2.94]}
        color={steel}
        radius={0.018}
        metalness={0.65}
      />
      <mesh position={[-6.86, 0.42, -2.9]} receiveShadow>
        <boxGeometry args={[0.1, 0.84, 3.9]} />
        <meshStandardMaterial color="#9fadae" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.34, -4.93]} receiveShadow>
        <boxGeometry args={[13.7, 0.68, 0.1]} />
        <meshStandardMaterial color="#a3b1b2" roughness={0.9} />
      </mesh>
      {[-4.55, 0, 4.55].map((x) => (
        <group key={x} position={[x, 3.52, -4.53]}>
          <mesh>
            <boxGeometry args={[2.5, 0.06, 0.26]} />
            <meshStandardMaterial
              color="#344c58"
              metalness={0.55}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0, -0.035, 0]}>
            <boxGeometry args={[2.3, 0.015, 0.16]} />
            <meshStandardMaterial
              color="#e4f0ed"
              emissive="#d4e5df"
              emissiveIntensity={0.8}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CNCWorkcell({ time }: { time?: RefObject<number> }) {
  const spindle = useRef<THREE.Group>(null),
    table = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!time) return;
    if (spindle.current) spindle.current.rotation.y = time.current * 1.5;
    if (table.current)
      table.current.position.x = Math.sin(time.current * 0.2) * 0.16;
  });
  return (
    <group position={[-5.02, 0, -3.36]}>
      <Enclosure
        size={[2.82, 0.25, 1.48]}
        position={[0, 0.19, 0]}
        color="#425d69"
        radius={0.045}
        roughness={0.7}
      />
      <Enclosure
        size={[2.75, 1.78, 1.38]}
        position={[0, 1.16, 0]}
        color={pearl}
        radius={0.1}
        metalness={0.3}
        roughness={0.42}
      />
      <Enclosure
        size={[1.72, 1.26, 0.06]}
        position={[-0.29, 1.24, 0.71]}
        color="#344e59"
        radius={0.035}
        metalness={0.3}
        roughness={0.4}
      />
      <mesh position={[-0.29, 1.25, 0.748]}>
        <planeGeometry args={[1.52, 1.05]} />
        <meshStandardMaterial color="#253c47" roughness={0.65} />
      </mesh>
      <group position={[-0.29, 0.89, 0.79]}>
        <group ref={table}>
          <mesh>
            <boxGeometry args={[1.32, 0.09, 0.22]} />
            <meshStandardMaterial
              color="#8da1a6"
              metalness={0.8}
              roughness={0.32}
            />
          </mesh>
          <mesh position={[0.1, 0.14, 0]}>
            <boxGeometry args={[0.41, 0.19, 0.15]} />
            <meshStandardMaterial
              color="#a9b2ae"
              metalness={0.7}
              roughness={0.36}
            />
          </mesh>
        </group>
        <group ref={spindle} position={[0.03, 0.56, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.075, 0.33, 12]} />
            <meshStandardMaterial
              color="#a8b7b8"
              metalness={0.85}
              roughness={0.27}
            />
          </mesh>
          <mesh position={[0, -0.21, 0]}>
            <cylinderGeometry args={[0.017, 0.012, 0.12, 6]} />
            <meshStandardMaterial
              color="#d1d7d1"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>
      <mesh position={[-0.29, 1.25, 0.84]}>
        <planeGeometry args={[1.52, 1.05]} />
        <meshPhysicalMaterial
          color="#8facb3"
          transparent
          opacity={0.15}
          metalness={0.18}
          roughness={0.24}
          clearcoat={0.45}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[-0.29, 1.25, 0.852]}>
        <boxGeometry args={[0.035, 1.09, 0.02]} />
        <meshStandardMaterial
          color="#a9b9bb"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
      <RepeatedBoxes
        items={[-0.42, -0.16].map((x) => ({ position: [x, 1.26, 0.9] }))}
        size={[0.035, 0.36, 0.035]}
        color="#d2dada"
        metalness={0.75}
        roughness={0.3}
      />
      <Enclosure
        size={[0.49, 0.81, 0.14]}
        position={[1.01, 1.25, 0.78]}
        color="#3c5764"
        radius={0.028}
        metalness={0.4}
      />
      <mesh position={[1.01, 1.42, 0.856]}>
        <planeGeometry args={[0.36, 0.28]} />
        <meshStandardMaterial
          color="#476b79"
          emissive="#304a55"
          emissiveIntensity={0.2}
          roughness={0.6}
        />
      </mesh>
      <RepeatedBoxes
        items={Array.from({ length: 12 }, (_, i) => ({
          position: [
            0.89 + (i % 4) * 0.08,
            1.19 - Math.floor(i / 4) * 0.055,
            0.863,
          ] as V3,
        }))}
        size={[0.045, 0.027, 0.008]}
        color="#adc0c4"
        metalness={0.4}
        shadows={false}
      />
      <mesh position={[1.04, 0.98, 0.87]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.025, 12]} />
        <meshStandardMaterial color="#b56a52" roughness={0.6} />
      </mesh>
      <RepeatedBoxes
        items={Array.from({ length: 9 }, (_, i) => ({
          position: [0.88 + i * 0.045, 1.86, 0.701] as V3,
        }))}
        size={[0.016, 0.13, 0.015]}
        color="#657b80"
        metalness={0.55}
        shadows={false}
      />
      <RepeatedBoxes
        items={[-1.1, 1.1].flatMap((x) =>
          [-0.5, 0.5].map((z) => ({ position: [x, 0.035, z] as V3 })),
        )}
        size={[0.2, 0.07, 0.2]}
        color="#2f4046"
        roughness={0.95}
      />
    </group>
  );
}

function Pallet({ position, boxes = true }: { position: V3; boxes?: boolean }) {
  return (
    <group position={position}>
      <RepeatedBoxes
        items={[-0.42, 0, 0.42].map((x) => ({ position: [x, 0.08, 0] }))}
        size={[0.15, 0.16, 0.75]}
        color="#9c927a"
        metalness={0}
        roughness={0.92}
      />
      <RepeatedBoxes
        items={[-0.31, -0.1, 0.1, 0.31].map((z) => ({
          position: [0, 0.18, z],
        }))}
        size={[1.08, 0.055, 0.14]}
        color="#b5aa8e"
        metalness={0}
        roughness={0.9}
      />
      {boxes && (
        <group>
          <Enclosure
            size={[0.92, 0.6, 0.65]}
            position={[0, 0.51, 0]}
            radius={0.025}
            color="#879ba0"
            roughness={0.85}
            metalness={0.08}
          />
          <RepeatedBoxes
            items={[-0.31, 0, 0.31].map((x) => ({ position: [x, 0.5, 0.336] }))}
            size={[0.035, 0.49, 0.02]}
            color="#718a91"
            roughness={0.8}
            metalness={0.1}
          />
          <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[0.97, 0.05, 0.7]} />
            <meshStandardMaterial
              color="#a5b7b9"
              roughness={0.72}
              metalness={0.12}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Shelving() {
  return (
    <group position={[0.6, 0, -4.4]}>
      <RepeatedBoxes
        items={[-1.75, 0, 1.75].flatMap((x) =>
          [-0.4, 0.4].map((z) => ({ position: [x, 1.34, z] as V3 })),
        )}
        size={[0.085, 2.68, 0.085]}
        color="#55717b"
        metalness={0.6}
        roughness={0.5}
      />
      <RepeatedBoxes
        items={[0.3, 1.25, 2.2].flatMap((y) =>
          [-0.4, 0.4].map((z) => ({ position: [0, y, z] as V3 })),
        )}
        size={[3.55, 0.12, 0.085]}
        color="#ae9763"
        metalness={0.3}
        roughness={0.64}
      />
      <RepeatedBoxes
        items={[0.32, 1.27, 2.22].map((y) => ({ position: [0, y, 0] }))}
        size={[3.5, 0.04, 0.83]}
        color="#788d93"
        metalness={0.45}
        roughness={0.7}
      />
      <RepeatedBoxes
        items={Array.from({ length: 12 }, (_, i) => ({
          position: [-1.68, 0.3 + i * 0.19, 0.45] as V3,
        }))}
        size={[0.025, 0.045, 0.009]}
        color="#263e4a"
        metalness={0.2}
        shadows={false}
      />
      <Pallet position={[-0.86, 0.35, 0]} />
      <Pallet position={[0.89, 0.35, 0]} />
      {[-1.16, -0.42, 0.38, 1.15].map((x, i) => (
        <Enclosure
          key={x}
          size={[0.59, 0.55, 0.61]}
          position={[x, 1.57, 0]}
          radius={0.024}
          color={i % 2 ? '#bdaf91' : '#93a3a3'}
          roughness={0.88}
          metalness={0.02}
        />
      ))}
      {[-1.05, 0.55].map((x) => (
        <Enclosure
          key={x}
          size={[1.03, 0.35, 0.57]}
          position={[x, 2.44, 0]}
          radius={0.035}
          color="#9cacb0"
          roughness={0.72}
          metalness={0.1}
        />
      ))}
    </group>
  );
}

function Workbench() {
  return (
    <group position={[-5.65, 0, 0.65]}>
      <Enclosure
        size={[1.62, 0.09, 0.7]}
        position={[0, 0.94, 0]}
        color="#a6b5b6"
        radius={0.025}
        metalness={0.7}
        roughness={0.4}
      />
      <RepeatedBoxes
        items={[-0.69, 0.69].flatMap((x) =>
          [-0.27, 0.27].map((z) => ({ position: [x, 0.45, z] as V3 })),
        )}
        size={[0.07, 0.9, 0.07]}
        color={steel}
        metalness={0.55}
      />
      <Enclosure
        size={[0.6, 0.65, 0.55]}
        position={[-0.36, 0.52, 0]}
        color="#526e7b"
        radius={0.025}
        roughness={0.6}
      />
      <RepeatedBoxes
        items={[0.36, 0.55, 0.74].map((y) => ({
          position: [-0.36, y, 0.29] as V3,
        }))}
        size={[0.46, 0.014, 0.025]}
        color="#b8c6c6"
        metalness={0.7}
        shadows={false}
      />
      <Enclosure
        size={[0.52, 0.2, 0.32]}
        position={[0.36, 1.09, -0.08]}
        color="#748e97"
        radius={0.025}
        roughness={0.64}
      />
      <mesh position={[-0.36, 1.015, 0.1]}>
        <boxGeometry args={[0.44, 0.025, 0.3]} />
        <meshStandardMaterial color="#d9ddd0" roughness={0.95} />
      </mesh>
    </group>
  );
}

function SafetyFurniture() {
  return (
    <group>
      {/* Short guards protect stationary equipment, without fencing the actor paths. */}
      {[
        [-6.48, 0, -2.52],
        [-3.65, 0, -2.52],
      ].map(([x, y, z]) => (
        <group key={x} position={[x, y, z]}>
          <mesh position={[0, 0.43, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.86, 10]} />
            <meshStandardMaterial
              color={safety}
              roughness={0.58}
              metalness={0.35}
            />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.067, 0.067, 0.18, 10]} />
            <meshStandardMaterial color="#394c55" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <boxGeometry args={[0.24, 0.07, 0.24]} />
            <meshStandardMaterial
              color="#687e86"
              metalness={0.65}
              roughness={0.65}
            />
          </mesh>
        </group>
      ))}
      <group position={[-6.57, 0, -0.5]}>
        <Enclosure
          size={[0.31, 0.7, 0.19]}
          position={[0, 0.65, 0]}
          color="#a86757"
          radius={0.04}
          roughness={0.65}
          metalness={0.2}
        />
        <mesh position={[0, 1.09, 0]}>
          <boxGeometry args={[0.29, 0.22, 0.018]} />
          <meshStandardMaterial color="#e0d9c9" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.09, 0.015]}>
          <boxGeometry args={[0.055, 0.15, 0.009]} />
          <meshStandardMaterial color="#a35b4b" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/** Open workshop bay, in meters. The dynamic product scene owns Zone A,
 * surveillance optics, people, forklift, Jetson and beacon. No extra clock. */
export default function WorkshopEnvironment({
  time,
}: {
  time?: RefObject<number>;
}) {
  return (
    <group name="securispot-workshop">
      <ConcreteFloor />
      <FloorMarkings />
      <BuildingFrame />
      <CNCWorkcell time={time} />
      <Shelving />
      <Workbench />
      <SafetyFurniture />
    </group>
  );
}
