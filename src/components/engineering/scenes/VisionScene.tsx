'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneProps } from '../core/types';
import { visionState } from '../animations/timelines';
import { RiggedWorker } from '../models/RiggedWorker';
import {
  Cable,
  DepthCamera,
  Enclosure,
  IndustrialFloor,
  Jetson,
} from '../models/IndustrialEquipment';

function FieldOfView() {
  const geometry = useMemo(() => {
    const points = [
      [-0.6, 2.45, -1.65],
      [-1, 0.02, 0.1],
      [3, 0.02, 0.1],
      [3, 0.02, 1.9],
      [-1, 0.02, 1.9],
    ];
    const vertices = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1].flatMap(
      (i) => points[i],
    );
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color="#a9d5dd"
        transparent
        opacity={0.035}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
export default function VisionScene({ time, view }: SceneProps) {
  const worker = useRef<THREE.Group>(null),
    beacon = useRef<THREE.MeshStandardMaterial>(null);
  const motion = useRef({
    walking: true,
    speed: 0.6,
    distance: 0,
    interaction: false,
  });
  const box = useRef<HTMLElement | null>(null);
  const { gl, camera, size } = useThree();
  const corners = useMemo(
    () => Array.from({ length: 8 }, () => new THREE.Vector3()),
    [],
  );
  useEffect(() => {
    box.current =
      gl.domElement
        .closest('.lab-three-stage')
        ?.querySelector('[data-tracking-box]') ?? null;
    return () => {
      box.current = null;
    };
  }, [gl]);
  useFrame(() => {
    const s = visionState(time.current),
      p = s.pose;
    if (worker.current) {
      worker.current.position.set(p.x, 0, p.z);
      worker.current.rotation.y = p.yaw;
    }
    motion.current = {
      walking: true,
      speed: p.speed,
      distance: p.distance,
      interaction: false,
    };
    if (beacon.current) {
      beacon.current.color.set(s.confirmed ? '#d39949' : '#5c777f');
      beacon.current.emissive.set(s.confirmed ? '#b8772d' : '#000000');
      beacon.current.emissiveIntensity = s.confirmed ? 0.7 : 0;
    }
    if (box.current) {
      box.current.style.opacity = s.inside && view !== 'detail' ? '1' : '0';
      let left = Infinity,
        top = Infinity,
        right = -Infinity,
        bottom = -Infinity;
      let i = 0;
      for (const dx of [-0.3, 0.3])
        for (const y of [0.03, 1.84])
          for (const dz of [-0.22, 0.22]) {
            const q = corners[i++].set(p.x + dx, y, p.z + dz).project(camera),
              x = (q.x * 0.5 + 0.5) * size.width,
              sy = (-q.y * 0.5 + 0.5) * size.height;
            left = Math.min(left, x);
            right = Math.max(right, x);
            top = Math.min(top, sy);
            bottom = Math.max(bottom, sy);
          }
      box.current.style.transform = `translate(${left}px,${top}px)`;
      box.current.style.width = `${right - left}px`;
      box.current.style.height = `${bottom - top}px`;
      box.current.dataset.confirmed = String(s.confirmed);
    }
  }, -1);
  return (
    <group>
      <IndustrialFloor dark width={8.6} depth={6} />
      <Enclosure
        size={[8.6, 0.24, 0.25]}
        position={[0, 3, -2.85]}
        color="#8197a0"
        radius={0.025}
      />
      {[-4, 4].map((x) => (
        <Enclosure
          key={x}
          size={[0.18, 3.1, 0.18]}
          position={[x, 1.5, -2.85]}
          color="#7a8d96"
          radius={0.02}
        />
      ))}
      {/* CNC workcell: enclosure, inset window, machine bed, operator panel. */}
      <Enclosure
        size={[2.5, 1.55, 0.75]}
        position={[-1.15, 0.78, -2.35]}
        color="#b1bdbe"
        radius={0.075}
      />
      <Enclosure
        size={[1.48, 0.91, 0.045]}
        position={[-1.4, 0.92, -1.95]}
        color="#203e4d"
        radius={0.035}
        metalness={0.25}
        roughness={0.24}
      />
      <mesh position={[-1.4, 0.85, -1.918]}>
        <boxGeometry args={[1.25, 0.025, 0.01]} />
        <meshStandardMaterial color="#708d9b" />
      </mesh>
      <Enclosure
        size={[0.42, 0.48, 0.08]}
        position={[-0.14, 1.05, -1.92]}
        color="#314c5b"
        radius={0.025}
      />
      <Enclosure
        size={[0.3, 0.2, 0.01]}
        position={[-0.14, 1.13, -1.87]}
        color="#86b3bc"
        radius={0.008}
      />
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[-0.26 + i * 0.12, 0.93, -1.86]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
          <meshStandardMaterial color={i === 2 ? '#b96859' : '#c9d3d2'} />
        </mesh>
      ))}
      <Enclosure
        size={[1.5, 0.13, 0.78]}
        position={[2.55, 0.14, -2.28]}
        color="#8b7c5d"
        radius={0.02}
        roughness={0.9}
      />
      {[0, 1].map((i) => (
        <Enclosure
          key={i}
          size={[0.64, 0.57, 0.66]}
          position={[2.18 + i * 0.73, 0.5, -2.3]}
          color="#7a8f95"
          radius={0.03}
          roughness={0.7}
        />
      ))}
      <mesh position={[1.02, 0.004, 1]}>
        <boxGeometry args={[4, 0.008, 1.9]} />
        <meshStandardMaterial
          color="#779999"
          transparent
          opacity={0.28}
          roughness={1}
        />
      </mesh>
      {[-0.98, 3.02].map((x) => (
        <mesh key={x} position={[x, 0.01, 1]}>
          <boxGeometry args={[0.045, 0.012, 1.9]} />
          <meshStandardMaterial color="#dfbc6a" />
        </mesh>
      ))}
      {[0.05, 1.95].map((z) => (
        <mesh key={z} position={[1.02, 0.01, z]}>
          <boxGeometry args={[4, 0.012, 0.045]} />
          <meshStandardMaterial color="#dfbc6a" />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[-0.8 + i * 0.33, 0.018, 2.08]}
          rotation={[0, -0.65, 0]}
        >
          <boxGeometry args={[0.12, 0.009, 0.2]} />
          <meshStandardMaterial color="#d8b664" roughness={0.9} />
        </mesh>
      ))}
      <Enclosure
        size={[0.09, 2.5, 0.09]}
        position={[-0.6, 1.23, -1.8]}
        color="#8a9da7"
        radius={0.012}
      />
      <DepthCamera
        position={[-0.6, 2.45, -1.65]}
        rotation={[-0.5, 0.34, 0]}
        scale={1.15}
      />
      <Enclosure
        size={[0.8, 0.05, 0.6]}
        position={[3.6, 0.85, -0.95]}
        color="#8a9da7"
        radius={0.018}
      />
      <Enclosure
        size={[0.06, 0.9, 0.06]}
        position={[3.6, 0.42, -0.95]}
        color="#708993"
        radius={0.008}
      />
      <Jetson position={[3.6, 0.88, -0.95]} scale={0.85} />
      <Cable
        points={[
          [-0.6, 2.4, -1.8],
          [-0.6, 0.05, -1.8],
          [2, 0.03, -1.8],
          [3.6, 0.1, -1.3],
          [3.6, 0.95, -1],
        ]}
      />
      <mesh position={[3.6, 1.55, -0.95]}>
        <cylinderGeometry args={[0.07, 0.085, 0.22, 20]} />
        <meshStandardMaterial
          ref={beacon}
          color="#5c777f"
          roughness={0.25}
          metalness={0.25}
        />
      </mesh>
      <FieldOfView />
      <group ref={worker}>
        <RiggedWorker time={time} motion={motion} />
      </group>
    </group>
  );
}
