'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneProps } from '../core/types';
import { RiggedWorker, type WorkerMotion } from '../models/RiggedWorker';
import {
  Cable,
  DepthCamera,
  Enclosure,
  Jetson,
} from '../models/IndustrialEquipment';
import WorkshopEnvironment from '../vision/WorkshopEnvironment';
import { useSoftwareMaterials } from '../vision/SoftwareMaterials';
import { ForkliftModel, type ForkliftMotion } from '../vision/ForkliftModel';
import {
  cameraGroundFootprint,
  forkliftPose,
  VISION_CAMERA,
  visionState,
  workerPose,
} from '../vision/visionTimeline';

function ObservationVolume() {
  const resources = useMemo(() => {
    const footprint = cameraGroundFootprint(),
      apex = new THREE.Vector3(
        ...(Object.values(VISION_CAMERA.position) as [number, number, number]),
      );
    const positions: number[] = [],
      rays: number[] = [];
    for (let i = 1; i < footprint.length - 1; i++)
      for (const p of [footprint[0], footprint[i], footprint[i + 1]])
        positions.push(p.x, p.y, p.z);
    for (let i = 0; i < footprint.length; i++) {
      const a = footprint[i],
        b = footprint[(i + 1) % footprint.length];
      rays.push(a.x, a.y, a.z, b.x, b.y, b.z);
      if (i % 2 === 0) rays.push(apex.x, apex.y, apex.z, a.x, a.y, a.z);
    }
    const floor = new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    const edges = new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.Float32BufferAttribute(rays, 3),
    );
    return { floor, edges };
  }, []);
  useEffect(
    () => () => {
      resources.floor.dispose();
      resources.edges.dispose();
    },
    [resources],
  );
  return (
    <group>
      <mesh geometry={resources.floor}>
        <meshBasicMaterial
          color="#8db1c4"
          transparent
          opacity={0.055}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <lineSegments geometry={resources.edges}>
        <lineBasicMaterial
          color="#759bb1"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
function Actor({
  index,
  time,
  root,
  motion,
}: {
  index: number;
  time: SceneProps['time'];
  root: React.RefObject<THREE.Group | null>;
  motion: React.RefObject<WorkerMotion>;
}) {
  return (
    <group ref={root} name={'vision-worker-' + index}>
      <RiggedWorker
        time={time}
        motion={motion}
        vestColor={
          index === 1 ? '#d6c35f' : index === 2 ? '#b8c4af' : '#dca44c'
        }
      />
    </group>
  );
}
function EdgeStation() {
  return (
    <group position={[3, 0, -1.7]}>
      <Enclosure
        size={[1.05, 0.075, 0.7]}
        position={[0, 0.9, 0]}
        color="#8e9fa5"
        radius={0.025}
        metalness={0.75}
      />
      {[-0.4, 0.4].map((x) => (
        <Enclosure
          key={x}
          size={[0.06, 0.85, 0.48]}
          position={[x, 0.43, 0]}
          color="#687c85"
          radius={0.01}
        />
      ))}
      <Jetson position={[0, 0.95, 0]} scale={0.8} />
      <Enclosure
        size={[0.08, 0.5, 0.08]}
        position={[0.38, 1.17, -0.2]}
        color="#6e8692"
        radius={0.01}
      />
    </group>
  );
}
export default function VisionScene({
  time,
  view,
  visionScenario = 'normal',
  stage,
  running,
  lowPower,
}: SceneProps) {
  const world = useRef<THREE.Group>(null);
  useSoftwareMaterials(world, lowPower);
  const load = useRef<THREE.Group>(null);
  const primary = useRef<THREE.Group>(null),
    safe = useRef<THREE.Group>(null),
    operator = useRef<THREE.Group>(null),
    forklift = useRef<THREE.Group>(null);
  const primaryMotion = useRef<WorkerMotion>({
      walking: true,
      speed: 0.4,
      distance: 0,
    }),
    safeMotion = useRef<WorkerMotion>({
      walking: true,
      speed: 0.4,
      distance: 0,
    }),
    operatorMotion = useRef<WorkerMotion>({
      walking: false,
      speed: 0,
      distance: 0,
    });
  const forkliftMotion = useRef<ForkliftMotion>({
    distance: 0,
    lift: 0,
    steering: 0,
  });
  const beacon = useRef<THREE.MeshStandardMaterial>(null),
    zone = useRef<THREE.Mesh>(null),
    zoneMaterial = useRef<THREE.MeshStandardMaterial>(null),
    zoneBorder = useRef<THREE.LineBasicMaterial>(null),
    processor = useRef<THREE.MeshBasicMaterial>(null);
  const box = useRef<HTMLElement | null>(null),
    host = useRef<HTMLElement | null>(null);
  const { gl, camera, size, invalidate } = useThree();
  const corners = useMemo(
    () => Array.from({ length: 8 }, () => new THREE.Vector3()),
    [],
  );
  const zoneGeometry = useMemo(() => new THREE.BufferGeometry(), []),
    edgeGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  const cameraRotation = useMemo(() => {
    const v = VISION_CAMERA,
      d = new THREE.Vector3(
        v.target.x - v.position.x,
        v.target.y - v.position.y,
        v.target.z - v.position.z,
      ).normalize();
    return new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      d,
    );
  }, []);
  const cablePoints = useMemo<[number, number, number][]>(
    () => [
      [-4.3, 3.15, -2.5],
      [-4.3, 0.055, -2.5],
      [-2, 0.035, -2],
      [2.8, 0.035, -2],
      [3, 1.02, -1.7],
    ],
    [],
  );
  const path = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        cablePoints.map((p) => new THREE.Vector3(...p)),
      ),
    [cablePoints],
  );
  const packets = useRef<THREE.Mesh[]>([]);
  useEffect(() => {
    invalidate();
  }, [stage, running, view, visionScenario, invalidate]);
  useEffect(() => {
    host.current = gl.domElement.closest('.vision-experience');
    box.current = host.current?.querySelector('[data-tracking-box]') ?? null;
    return () => {
      host.current = null;
      box.current = null;
    };
  }, [gl]);
  useEffect(
    () => () => {
      zoneGeometry.dispose();
      edgeGeometry.dispose();
    },
    [zoneGeometry, edgeGeometry],
  );
  useEffect(() => {
    const { zone: z } = visionState(time.current, visionScenario);
    zoneGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [
          z.xMin,
          0.035,
          z.zMin,
          z.xMax,
          0.035,
          z.zMin,
          z.xMax,
          0.035,
          z.zMax,
          z.xMin,
          0.035,
          z.zMin,
          z.xMax,
          0.035,
          z.zMax,
          z.xMin,
          0.035,
          z.zMax,
        ],
        3,
      ),
    );
    edgeGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        [
          z.xMin,
          0.04,
          z.zMin,
          z.xMax,
          0.04,
          z.zMin,
          z.xMax,
          0.04,
          z.zMax,
          z.xMin,
          0.04,
          z.zMax,
          z.xMin,
          0.04,
          z.zMin,
        ],
        3,
      ),
    );
    invalidate();
  }, [visionScenario, time, zoneGeometry, edgeGeometry, invalidate]);
  useFrame(() => {
    const s = visionState(time.current, visionScenario);
    for (const [index, ref, motion] of [
      [0, primary, primaryMotion],
      [1, safe, safeMotion],
      [2, operator, operatorMotion],
    ] as const) {
      const p = workerPose(time.current, index);
      ref.current?.position.set(p.x, 0, p.z);
      if (ref.current) ref.current.rotation.y = p.yaw;
      motion.current = {
        walking: p.walking,
        speed: p.speed,
        distance: p.distance,
        interaction: p.interaction,
      };
    }
    const f = forkliftPose(time.current);
    forklift.current?.position.set(f.x, 0, f.z);
    if (load.current) load.current.position.y = f.lift;
    forkliftMotion.current = {
      distance: f.distance,
      lift: f.lift,
      steering: f.steering,
    };
    if (beacon.current) {
      const pulse = s.confirmed
        ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time.current * TAU * 1.2))
        : 0;
      beacon.current.color.set(s.confirmed ? '#c7953c' : '#83988e');
      beacon.current.emissive.set('#e6a63e');
      beacon.current.emissiveIntensity = pulse;
    }
    zoneMaterial.current?.color.set(
      s.confirmed ? '#d4a955' : s.inside ? '#72a8b6' : '#81a7b8',
    );
    zoneBorder.current?.color.set(s.confirmed ? '#e4ba63' : '#4d7f9a');
    if (processor.current)
      processor.current.color.set(s.observed ? '#b3e0c6' : '#768d90');
    packets.current.forEach((mesh, i) => {
      mesh.visible = s.observed;
      mesh.position.copy(
        path.getPoint((((time.current * 0.24 + i * 0.5) % 1) + 1) % 1),
      );
    });
    gl.domElement.setAttribute('data-vision-phase', s.phase);
    gl.domElement.setAttribute('data-vision-confirmed', String(s.confirmed));
    if (host.current) {
      host.current.dataset.visionPhase = s.phase;
      host.current.dataset.visionConfirmed = String(s.confirmed);
      host.current.dataset.visionObserved = String(s.observed);
    }
  }, -2);
  useFrame(() => {
    if (!box.current) return;
    const s = visionState(time.current, visionScenario),
      p = s.pose;
    box.current.style.opacity =
      s.observed && (s.inside || view === 'camera') ? '1' : '0';
    let left = Infinity,
      top = Infinity,
      right = -Infinity,
      bottom = -Infinity,
      i = 0;
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
    box.current.style.transform = `translate(${left.toFixed(2)}px,${top.toFixed(2)}px)`;
    box.current.style.width = `${(right - left).toFixed(2)}px`;
    box.current.style.height = `${(bottom - top).toFixed(2)}px`;
    box.current.dataset.confirmed = String(s.confirmed);
    box.current.dataset.trackId = s.trackId;
  }, -0.5);
  return (
    <group ref={world}>
      <WorkshopEnvironment time={time} />
      {lowPower && <ContactShadows time={time} />}
      <group visible={view !== 'camera'}>
        <ObservationVolume />
      </group>
      <mesh ref={zone} geometry={zoneGeometry}>
        <meshStandardMaterial
          ref={zoneMaterial}
          color="#81a7b8"
          transparent
          opacity={0.25}
          roughness={0.95}
          metalness={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <lineLoop geometry={edgeGeometry}>
        <lineBasicMaterial ref={zoneBorder} color="#4d7f9a" />
      </lineLoop>
      <group
        visible={view !== 'camera'}
        position={[VISION_CAMERA.position.x, 0, VISION_CAMERA.position.z]}
      >
        <Enclosure
          size={[0.42, 0.09, 0.42]}
          position={[0, 0.05, 0]}
          color="#657c88"
          radius={0.035}
        />
        <Enclosure
          size={[0.075, 3.15, 0.075]}
          position={[0, 1.6, 0]}
          color="#8d9fa7"
          radius={0.012}
          metalness={0.8}
        />
        <group position={[0, 3.2, 0]} quaternion={cameraRotation}>
          <DepthCamera scale={0.65} />
        </group>
      </group>
      <Cable points={cablePoints} radius={0.016} />
      <EdgeStation />
      {[0, 1].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) packets.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.043, 8, 6]} />
          <meshBasicMaterial color="#acc9dc" />
        </mesh>
      ))}
      <mesh position={[3.3, 1.18, -1.31]}>
        <sphereGeometry args={[0.027, 8, 6]} />
        <meshBasicMaterial ref={processor} color="#b3e0c6" />
      </mesh>
      <group position={[3.45, 0, 0.85]}>
        <Enclosure
          size={[0.32, 0.07, 0.32]}
          position={[0, 0.05, 0]}
          color="#6a7e87"
          radius={0.02}
        />
        <Enclosure
          size={[0.055, 1.55, 0.055]}
          position={[0, 0.8, 0]}
          color="#7d929b"
          radius={0.01}
        />
        <mesh position={[0, 1.66, 0]}>
          <cylinderGeometry args={[0.09, 0.105, 0.25, 20]} />
          <meshStandardMaterial
            ref={beacon}
            color="#83988e"
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>
      </group>
      <Actor index={0} root={primary} motion={primaryMotion} time={time} />
      <Actor index={1} root={safe} motion={safeMotion} time={time} />
      <Actor index={2} root={operator} motion={operatorMotion} time={time} />
      <group ref={forklift}>
        <ForkliftModel motion={forkliftMotion} />
        <group ref={load} position={[0, 0, 1.76]}>
          {[-0.42, 0, 0.42].map((x) => (
            <mesh key={x} position={[x, 0.17, 0]} castShadow>
              <boxGeometry args={[0.2, 0.05, 1.05]} />
              <meshStandardMaterial color="#a8946b" roughness={0.9} />
            </mesh>
          ))}
          {[-0.46, 0.46].map((x) => (
            <mesh key={x} position={[x, 0.07, 0]} castShadow>
              <boxGeometry args={[0.12, 0.14, 0.95]} />
              <meshStandardMaterial color="#8c7955" roughness={0.95} />
            </mesh>
          ))}
          <Enclosure
            size={[0.75, 0.61, 0.78]}
            position={[0, 0.5, 0]}
            color="#8a9c98"
            radius={0.025}
            roughness={0.87}
            metalness={0.02}
          />
          {[-0.21, 0.21].map((x) => (
            <mesh key={x} position={[x, 0.81, 0]}>
              <boxGeometry args={[0.028, 0.008, 0.79]} />
              <meshStandardMaterial color="#b7b49c" roughness={0.9} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
const TAU = Math.PI * 2;

function ContactShadows({ time }: Pick<SceneProps, 'time'>) {
  const refs = useRef<THREE.Mesh[]>([]);
  const texture = useMemo(() => {
    const data = new Uint8Array(32 * 32 * 4);
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 32; x++) {
        const radius = Math.hypot((x - 15.5) / 15.5, (y - 15.5) / 15.5),
          offset = (y * 32 + x) * 4;
        data.set(
          [38, 56, 62, Math.round(Math.max(0, 1 - radius) ** 2 * 80)],
          offset,
        );
      }
    const map = new THREE.DataTexture(data, 32, 32);
    map.needsUpdate = true;
    map.magFilter = THREE.LinearFilter;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(() => {
    refs.current.forEach((mesh, i) => {
      const p =
        i === 3 ? forkliftPose(time.current) : workerPose(time.current, i);
      mesh.position.set(p.x, 0.018, p.z + (i === 3 ? 0.35 : 0));
    });
  }, -1);
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(e) => {
            if (e) refs.current[i] = e;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={i === 3 ? [1.7, 3.2, 1] : [0.8, 0.55, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
