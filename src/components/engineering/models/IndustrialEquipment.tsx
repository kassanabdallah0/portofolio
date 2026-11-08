'use client';

import { useEffect, useMemo, type ReactNode } from 'react';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import * as THREE from 'three';

type V3 = [number, number, number];
/** Original technical models; dimensions convey form, not manufacturer CAD. */
export function Enclosure({
  size,
  position = [0, 0, 0],
  color = '#d5dde0',
  radius = 0.04,
  metalness = 0.45,
  roughness = 0.36,
  children,
}: {
  size: V3;
  position?: V3;
  color?: string;
  radius?: number;
  metalness?: number;
  roughness?: number;
  children?: ReactNode;
}) {
  const [width, height, depth] = size;
  const geometry = useMemo(
    () => new RoundedBoxGeometry(width, height, depth, 3, radius),
    [width, height, depth, radius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh position={position} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
      {children}
    </mesh>
  );
}

export function Jetson({
  position = [0, 0, 0],
  scale = 1,
  active = true,
}: {
  position?: V3;
  scale?: number;
  active?: boolean;
}) {
  return (
    <group position={position} scale={scale}>
      <Enclosure
        size={[0.68, 0.09, 0.48]}
        position={[0, 0.055, 0]}
        color="#234c3f"
        radius={0.012}
      />
      <Enclosure
        size={[0.53, 0.14, 0.4]}
        position={[0, 0.16, -0.018]}
        color="#344149"
        radius={0.015}
        metalness={0.85}
      />
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[-0.24 + i * 0.044, 0.29, -0.018]} castShadow>
          <boxGeometry args={[0.018, 0.18, 0.38]} />
          <meshStandardMaterial
            color="#68777e"
            metalness={0.85}
            roughness={0.32}
          />
        </mesh>
      ))}
      {[-0.22, -0.075, 0.105].map((x, i) => (
        <group key={x} position={[x, 0.12, 0.25]}>
          <Enclosure
            size={[i === 2 ? 0.14 : 0.115, 0.095, 0.07]}
            radius={0.006}
            color="#b9c3c5"
          />
          <mesh position={[0, 0, 0.038]}>
            <planeGeometry args={[i === 2 ? 0.105 : 0.075, 0.055]} />
            <meshStandardMaterial color={i === 2 ? '#182f28' : '#174d74'} />
          </mesh>
        </group>
      ))}
      {[-0.26, 0.26].flatMap((x) =>
        [-0.18, 0.18].map((z) => (
          <mesh
            key={x + ':' + z}
            position={[x, 0.11, z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.024, 0.024, 0.025, 10]} />
            <meshStandardMaterial color="#d7d9cd" metalness={0.8} />
          </mesh>
        )),
      )}
      <mesh position={[0.29, 0.116, 0.17]}>
        <sphereGeometry args={[0.014, 8, 6]} />
        <meshBasicMaterial color={active ? '#7bdfa6' : '#6a776e'} />
      </mesh>
      <mesh position={[0.29, 0.11, -0.08]}>
        <boxGeometry args={[0.025, 0.045, 0.16]} />
        <meshStandardMaterial color="#d2ad63" metalness={0.7} />
      </mesh>
    </group>
  );
}
export function DepthCamera({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position?: V3;
  rotation?: V3;
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Enclosure
        size={[0.62, 0.14, 0.1]}
        color="#bac8cb"
        radius={0.035}
        metalness={0.8}
      />
      <Enclosure
        size={[0.54, 0.1, 0.018]}
        position={[0, 0, 0.055]}
        color="#162731"
        radius={0.022}
      />
      {[-0.215, -0.06, 0.21].map((x, i) => (
        <group key={x} position={[x, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry
              args={[
                i === 1 ? 0.024 : 0.039,
                i === 1 ? 0.024 : 0.039,
                0.012,
                20,
              ]}
            />
            <meshStandardMaterial color="#66757b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.009, 0]}>
            <cylinderGeometry
              args={[
                i === 1 ? 0.017 : 0.029,
                i === 1 ? 0.017 : 0.029,
                0.012,
                20,
              ]}
            />
            <meshPhysicalMaterial
              color="#113f58"
              metalness={0.45}
              roughness={0.14}
              clearcoat={1}
            />
          </mesh>
        </group>
      ))}
      <Enclosure
        size={[0.12, 0.12, 0.08]}
        position={[0, -0.1, -0.015]}
        color="#899ba3"
        radius={0.012}
      />
    </group>
  );
}
export function Cable({
  points,
  color = '#233640',
  radius = 0.013,
}: {
  points: V3[];
  color?: string;
  radius?: number;
}) {
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        24,
        radius,
        6,
        false,
      ),
    [points, radius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}
export function FloorMark({
  position = [0, 0, 0],
  size = [1.1, 1.1],
  color = '#e4b550',
}: {
  position?: V3;
  size?: [number, number];
  color?: string;
}) {
  return (
    <group position={position}>
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <group
            key={x + ':' + z}
            position={[(x * size[0]) / 2, 0.012, (z * size[1]) / 2]}
          >
            <mesh position={[-x * 0.12, 0, 0]}>
              <boxGeometry args={[0.28, 0.008, 0.035]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, -z * 0.12]}>
              <boxGeometry args={[0.035, 0.008, 0.28]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}
export function IndustrialFloor({
  dark = false,
  width = 8,
  depth = 6,
}: {
  dark?: boolean;
  width?: number;
  depth?: number;
}) {
  return (
    <group>
      <Enclosure
        size={[width, 0.22, depth]}
        position={[0, -0.13, 0]}
        color={dark ? '#62737a' : '#bdc7c7'}
        radius={0.12}
        roughness={0.88}
        metalness={0.04}
      />
      {[-2, 0, 2].map((x) => (
        <mesh key={x} position={[x, -0.012, 0]}>
          <boxGeometry args={[0.008, 0.006, depth - 0.2]} />
          <meshStandardMaterial
            color={dark ? '#485e68' : '#9caeaf'}
            roughness={1}
          />
        </mesh>
      ))}
      {[-2, 0, 2].map((z) => (
        <mesh key={z} position={[0, -0.012, z]}>
          <boxGeometry args={[width - 0.2, 0.006, 0.008]} />
          <meshStandardMaterial
            color={dark ? '#485e68' : '#9caeaf'}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}
