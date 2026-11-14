'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TransitBus } from '../models/TransitBus';
import {
  BeveledCase,
  CellularMast,
  EquipmentLabel,
  PassengerPhone,
  RouterModel,
  ServerRack,
} from '../models/FleetHardware';

import type { SceneView } from '../core/types';
import {
  fleetPose,
  fleetRoute as route,
  ROAD_CENTER,
  BUS_SCALE,
} from '../animations/fleetRoute';

type FleetView = SceneView;
export type FleetSceneProps = {
  time: RefObject<number>;
  running: boolean;
  stage: number;
  selectedBus: number;
  view: FleetView;
  onSelectBus?: (index: number) => void;
};
const ROUTER = new THREE.Vector3(-2.5, 1.04, 0);
const MAST = new THREE.Vector3(3.55, 2.95, -3.9);
const EC2 = new THREE.Vector3(6.2, 1.85, -2.1);
const API = new THREE.Vector3(5.2, 0.8, 0.45);
const LAMBDA = new THREE.Vector3(7.2, 0.8, 0.45);
const S3 = new THREE.Vector3(9.15, 0.8, 0.45);
const WATCH = new THREE.Vector3(5.2, 0.8, 2.9);
const EVENT = new THREE.Vector3(7.2, 0.8, 2.9);
const SES = new THREE.Vector3(9.15, 0.8, 2.9);

function RoadSurface() {
  const geometry = useMemo(() => {
    const positions: number[] = [],
      normals: number[] = [],
      indices: number[] = [];
    for (let i = 0; i <= 160; i++) {
      const p = route.getPointAt(i / 160),
        t = route.getTangentAt(i / 160);
      for (const side of [-1, 1]) {
        positions.push(p.x + t.z * side * 0.95, 0.045, p.z - t.x * side * 0.95);
        normals.push(0, 1, 0);
      }
      if (i < 160) {
        const n = i * 2;
        indices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    g.setIndex(indices);
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const marks = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!marks.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 48; i++) {
      const p = route.getPointAt(i / 48),
        t = route.getTangentAt(i / 48);
      dummy.position.set(p.x, 0.056, p.z);
      dummy.rotation.y = Math.atan2(t.x, t.z);
      dummy.updateMatrix();
      marks.current.setMatrixAt(i, dummy.matrix);
    }
    marks.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group position={ROAD_CENTER}>
      <BeveledCase
        size={[13.1, 0.32, 9]}
        color="#5c7179"
        position={[0, -0.19, 0]}
        radius={0.14}
      />
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#2c3b43" roughness={0.92} />
      </mesh>
      <instancedMesh ref={marks} args={[undefined, undefined, 48]}>
        <boxGeometry args={[0.055, 0.008, 0.3]} />
        <meshStandardMaterial color="#d8dcce" roughness={0.85} />
      </instancedMesh>
      {[-1, 1].map((side) => (
        <RoadEdge key={side} side={side} />
      ))}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[6.9, 0.12, 3.15]} />
        <meshStandardMaterial color="#83948f" roughness={0.95} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[-1.1 + i * 0.23, 0.06, 3]}>
          <boxGeometry args={[0.12, 0.009, 1.6]} />
          <meshStandardMaterial color="#cbd1c6" roughness={0.8} />
        </mesh>
      ))}
      <EquipmentLabel
        text="CAP COTENTIN · FLOTTE REPRÉSENTATIVE"
        position={[0, 0.14, 4.31]}
        width={5.6}
      />
    </group>
  );
}

function RoadEdge({ side }: { side: number }) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 161 }, (_, i) => {
      const p = route.getPointAt(i / 160),
        t = route.getTangentAt(i / 160);
      return new THREE.Vector3(
        p.x + t.z * side * 0.97,
        0.075,
        p.z - t.x * side * 0.97,
      );
    });
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points, true),
      160,
      0.035,
      4,
      true,
    );
  }, [side]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#c8d0c7" roughness={0.85} />
    </mesh>
  );
}

function MovingBus({
  index,
  time,
  selected,
  onSelect,
}: {
  index: number;
  time: RefObject<number>;
  selected: boolean;
  onSelect?: () => void;
}) {
  const group = useRef<THREE.Group>(null),
    distance = useRef(0);
  useFrame(() => {
    const pose = fleetPose(time.current, index);
    distance.current = pose.distance;
    if (group.current) {
      group.current.position.copy(pose.position);
      group.current.rotation.y = pose.angle;
    }
  });
  const initial = fleetPose(0, index);
  return (
    <group
      ref={group}
      position={initial.position}
      rotation={[0, initial.angle, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.();
      }}
    >
      <group scale={BUS_SCALE}>
        <TransitBus
          distance={distance}
          selected={selected}
          color={['#aec7d1', '#dfd6c1', '#b9cbc4'][index]}
        />
      </group>
      {selected && (
        <group>
          <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.86, 0.88, 64]} />
            <meshBasicMaterial
              color="#a6d8dc"
              transparent
              opacity={0.6}
              depthWrite={false}
            />
          </mesh>
          <EquipmentLabel
            text={`BUS ${String.fromCharCode(65 + index)}`}
            position={[0, 1.12, 0]}
            width={1.45}
          />
          {[0.18, 0.28, 0.38].map((radius) => (
            <mesh
              key={radius}
              position={[0, 0.84, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[radius, 0.009, 4, 20, Math.PI * 0.72]} />
              <meshBasicMaterial color="#a6d8dc" transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function Tree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.43, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.075, 0.86, 6]} />
        <meshStandardMaterial color="#646c63" roughness={1} />
      </mesh>
      {[
        [-0.16, 0.98, 0],
        [0.16, 1.15, 0.07],
        [0, 1.4, -0.02],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <icosahedronGeometry args={[0.42 - i * 0.025, 1]} />
          <meshStandardMaterial
            color={['#58766b', '#678879', '#769788'][i]}
            roughness={0.95}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

function StreetFurniture() {
  return (
    <group>
      {[
        [-6.9, 0, -3.7],
        [-7.7, 0, -3.3],
        [-6.7, 0, 3.8],
        [1.4, 0, 3.7],
        [1.9, 0, 3.5],
        [-0.5, 0, -0.8],
      ].map((p, i) => (
        <Tree
          key={i}
          position={p as [number, number, number]}
          scale={i === 5 ? 0.8 : 1}
        />
      ))}
      <group position={[-4.4, 0, -1.45]}>
        {[-0.95, 0.95].map((x) => (
          <mesh key={x} position={[x, 0.64, 0]} castShadow>
            <boxGeometry args={[0.045, 1.28, 0.045]} />
            <meshStandardMaterial
              color="#c4cdd0"
              metalness={0.7}
              roughness={0.35}
            />
          </mesh>
        ))}
        <BeveledCase
          size={[2.18, 0.09, 0.88]}
          color="#d1d7d5"
          position={[0, 1.28, 0.25]}
          radius={0.025}
        />
        <mesh position={[0, 0.73, -0.025]}>
          <boxGeometry args={[1.9, 0.95, 0.02]} />
          <meshStandardMaterial
            color="#8fb4b9"
            metalness={0.25}
            roughness={0.25}
            transparent
            opacity={0.35}
          />
        </mesh>
        <mesh position={[0, 0.33, 0.22]} castShadow>
          <boxGeometry args={[1.52, 0.07, 0.26]} />
          <meshStandardMaterial color="#a3ac9d" roughness={0.75} />
        </mesh>
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0.17, 0.22]}>
            <boxGeometry args={[0.035, 0.3, 0.17]} />
            <meshStandardMaterial color="#435761" metalness={0.5} />
          </mesh>
        ))}
        <EquipmentLabel
          text="MEDIASPOT"
          position={[0, 1.43, 0.1]}
          width={1.6}
        />
      </group>
      <group position={[3.55, 0, -3.9]}>
        <CellularMast />
        <EquipmentLabel
          text="RÉSEAU CELLULAIRE"
          position={[0, 3.9, 0]}
          width={2.6}
        />
      </group>
      {[-6.6, 1.5].map((x) => (
        <group key={x} position={[x, 0, 1.65]}>
          <mesh position={[0, 1.03, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.04, 2.06, 8]} />
            <meshStandardMaterial
              color="#9eacb1"
              metalness={0.65}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0.18, 2.04, 0]}>
            <boxGeometry args={[0.42, 0.055, 0.12]} />
            <meshStandardMaterial
              color="#dce4df"
              metalness={0.4}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Geometry persists through narrative stages. Only packets and highlights change. */
function Signal({
  from,
  to,
  time,
  color = '#9ccbd8',
  active = true,
  height = 0.7,
}: {
  from: THREE.Vector3 | (() => THREE.Vector3);
  to: THREE.Vector3;
  time: RefObject<number>;
  color?: string;
  active?: boolean;
  height?: number;
}) {
  const line =
      useRef<THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>>(null),
    packet = useRef<THREE.Mesh>(null);
  const drawn = useRef(false),
    revealed = useRef(false);
  const geometry = useMemo(
    () =>
      new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(65 * 3), 3),
      ),
    [],
  );
  const lineObject = useMemo(
    () =>
      new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.42,
        }),
      ),
    [geometry, color],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      lineObject.material.dispose();
    },
    [geometry, lineObject],
  );
  useFrame(() => {
    const start = typeof from === 'function' ? from() : from;
    const bend = start.clone().lerp(to, 0.5);
    bend.y += height;
    if (!line.current) return;
    const liveGeometry = line.current.geometry;
    const positions = liveGeometry.attributes.position as THREE.BufferAttribute;
    const at = (u: number) =>
      start
        .clone()
        .multiplyScalar((1 - u) ** 2)
        .addScaledVector(bend, 2 * u * (1 - u))
        .addScaledVector(to, u * u);
    if (!drawn.current || typeof from === 'function') {
      for (let i = 0; i <= 64; i++) {
        const p = at(i / 64);
        positions.setXYZ(i, p.x, p.y, p.z);
      }
      positions.needsUpdate = true;
      liveGeometry.computeBoundingSphere();
      drawn.current = true;
    }
    if (packet.current) {
      const phase = (time.current * 0.45) % 1;
      packet.current.position.copy(at(phase));
      packet.current.scale.setScalar(active ? Math.sin(phase * Math.PI) : 0);
    }
    if (active || time.current >= 16) revealed.current = true;
    line.current.visible = revealed.current;
    line.current.material.opacity = active ? 0.48 : 0.12;
  });
  return (
    <group>
      <primitive ref={line} object={lineObject} />
      <mesh ref={packet}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function ServiceIcon({
  kind,
}: {
  kind: 'api' | 'lambda' | 's3' | 'watch' | 'event' | 'ses';
}) {
  const color = '#9bbdc6';
  if (kind === 's3')
    return (
      <group>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.32, 0.25, 0.65, 24]} />
          <meshStandardMaterial
            color="#83aa9a"
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.23, 0.32, 24]} />
          <meshStandardMaterial
            color="#bfd4c3"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>
    );
  if (kind === 'event')
    return (
      <group>
        <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.12, 24]} />
          <meshStandardMaterial
            color="#829ba6"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.47, 0.08]}>
          <boxGeometry args={[0.018, 0.22, 0.015]} />
          <meshBasicMaterial color="#eaf0ec" />
        </mesh>
        <mesh position={[0.1, 0.4, 0.08]}>
          <boxGeometry args={[0.2, 0.018, 0.015]} />
          <meshBasicMaterial color="#eaf0ec" />
        </mesh>
      </group>
    );
  if (kind === 'watch')
    return (
      <group>
        {[0.22, 0.4, 0.65, 0.48].map((h, i) => (
          <mesh key={i} position={[-0.3 + i * 0.2, h / 2 + 0.08, 0]}>
            <boxGeometry args={[0.11, h, 0.2]} />
            <meshStandardMaterial
              color={color}
              metalness={0.4}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>
    );
  if (kind === 'ses')
    return (
      <group>
        <BeveledCase
          size={[0.8, 0.5, 0.1]}
          color="#bacdca"
          position={[0, 0.35, 0]}
          radius={0.025}
        />
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.18, 0.42, 0.063]}
            rotation={[0, 0, side * 0.55]}
          >
            <boxGeometry args={[0.42, 0.012, 0.008]} />
            <meshBasicMaterial color="#2d5467" />
          </mesh>
        ))}
      </group>
    );
  if (kind === 'lambda')
    return (
      <group>
        {[
          [-0.08, 0.4, -0.42],
          [0.15, 0.33, 0.45],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, z]}>
            <boxGeometry args={[0.11, 0.72, 0.16]} />
            <meshStandardMaterial
              color="#dbc89a"
              metalness={0.4}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
    );
  return (
    <group>
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.4, 0]}>
          <boxGeometry args={[0.12, 0.7, 0.15]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[0.76, 0.12, 0.15]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Service({
  kind,
  position,
  label,
  reveal,
  time,
  stage,
}: {
  kind: 'api' | 'lambda' | 's3' | 'watch' | 'event' | 'ses';
  position: THREE.Vector3;
  label: string;
  reveal: number;
  time: RefObject<number>;
  stage: number;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const root = useRef<THREE.Group>(null),
    shown = useRef(false);
  useFrame((_, dt) => {
    if (stage >= reveal || time.current >= 16) shown.current = true;
    if (root.current) {
      const k = THREE.MathUtils.damp(
        root.current.scale.x,
        shown.current ? 1 : 0.001,
        5,
        Math.min(dt, 0.05),
      );
      root.current.scale.setScalar(k);
      if (shown.current && k < 0.999) invalidate();
    }
  });
  return (
    <group ref={root} position={[position.x, 0.2, position.z]} scale={0.001}>
      <BeveledCase
        size={[1.55, 0.14, 1.45]}
        color="#3c5766"
        position={[0, 0, 0]}
        radius={0.045}
      />
      <ServiceIcon kind={kind} />
      <EquipmentLabel text={label} position={[0, 1.04, 0]} width={1.85} />
    </group>
  );
}

function CloudEnvironment({
  stage,
  time,
}: {
  stage: number;
  time: RefObject<number>;
}) {
  return (
    <group>
      <BeveledCase
        size={[6.15, 0.35, 7.4]}
        color="#4b6572"
        position={[7.05, -0.2, 0.1]}
        radius={0.14}
      />
      <EquipmentLabel
        text="AWS · INFRASTRUCTURE & APPLICATION"
        position={[7.1, 0.1, -3.4]}
        width={5.4}
      />
      <group position={[6.2, 0.05, -2.1]}>
        <ServerRack />
        <EquipmentLabel
          text="EC2 · OPENVPN"
          position={[0, 2.15, 0]}
          width={2.5}
        />
      </group>
      <group position={[8.5, 0.1, -2.1]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.46, 0.48, 40]} />
          <meshStandardMaterial
            color="#b0c5c9"
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        <EquipmentLabel text="CERTIFICATS" position={[0, 0.35, 0]} width={2} />
      </group>
      <Service
        kind="api"
        position={API}
        label="API Gateway"
        reveal={2}
        time={time}
        stage={stage}
      />
      <Service
        kind="lambda"
        position={LAMBDA}
        label="Lambda · Node/TS"
        reveal={2}
        time={time}
        stage={stage}
      />
      <Service
        kind="s3"
        position={S3}
        label="S3 · contenus"
        reveal={2}
        time={time}
        stage={stage}
      />
      <Service
        kind="watch"
        position={WATCH}
        label="CloudWatch"
        reveal={3}
        time={time}
        stage={stage}
      />
      <Service
        kind="event"
        position={EVENT}
        label="EventBridge"
        reveal={3}
        time={time}
        stage={stage}
      />
      <Service
        kind="ses"
        position={SES}
        label="SES · rapport PDF"
        reveal={3}
        time={time}
        stage={stage}
      />
      <Signal
        from={API}
        to={LAMBDA}
        time={time}
        active={stage === 2}
        height={0.25}
      />
      <Signal
        from={LAMBDA}
        to={S3}
        time={time}
        active={stage === 2}
        height={0.25}
      />
      <Signal
        from={EVENT}
        to={LAMBDA}
        time={time}
        active={stage === 3}
        color="#d4c49e"
        height={0.5}
      />
      <Signal
        from={WATCH}
        to={LAMBDA}
        time={time}
        active={stage === 3}
        color="#d4c49e"
        height={0.35}
      />
      <Signal
        from={LAMBDA}
        to={SES}
        time={time}
        active={stage === 3}
        color="#d4c49e"
        height={0.5}
      />
    </group>
  );
}

function FleetCamera({
  view,
  selectedBus,
  time,
}: Pick<FleetSceneProps, 'view' | 'selectedBus' | 'time'>) {
  const { invalidate, size } = useThree();
  const target = useRef(new THREE.Vector3(-2.5, 0.5, 0)),
    transitionAge = useRef(0);
  useEffect(() => {
    transitionAge.current = 0;
    invalidate();
  }, [view, selectedBus, invalidate]);
  useFrame((state, dt) => {
    const camera = state.camera;
    const delta = Math.min(dt, 0.05);
    transitionAge.current += delta;
    const position = new THREE.Vector3(8.4, 10.7, 13.7),
      aim = new THREE.Vector3(-2.4, 0.4, 0);
    let zoom = Math.min(size.width / 16.3, size.height / 10.4);
    if (view === 'architecture') {
      position.set(12.8, 10.7, 16.5);
      aim.set(3.4, 0.65, 0);
      zoom = Math.min(size.width / 23, size.height / 12);
    }
    if (view === 'detail') {
      const bus = fleetPose(time.current, selectedBus).position;
      const t = THREE.MathUtils.smoothstep(transitionAge.current, 1.4, 3.6);
      aim
        .copy(bus)
        .add(new THREE.Vector3(0, 0.45, 0))
        .lerp(ROUTER, t);
      position.copy(aim).add(new THREE.Vector3(4, 4.1, 5.8));
      zoom = Math.min(size.width / 7.8, size.height / 5.2);
    }
    camera.position.lerp(position, 1 - Math.exp(-delta * 3));
    target.current.lerp(aim, 1 - Math.exp(-delta * 3));
    camera.lookAt(target.current);
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = THREE.MathUtils.damp(camera.zoom, zoom, 3, delta);
      camera.updateProjectionMatrix();
    }
    if (
      camera.position.distanceTo(position) > 0.01 ||
      target.current.distanceTo(aim) > 0.01 ||
      (view === 'detail' && transitionAge.current < 4)
    )
      invalidate();
  });
  return null;
}

export default function FleetScene({
  time,
  stage,
  selectedBus,
  view,
  onSelectBus,
}: FleetSceneProps) {
  const busSource = () =>
    fleetPose(time.current, selectedBus).position.add(
      new THREE.Vector3(0, 0.75, 0),
    );
  return (
    <group>
      <FleetCamera view={view} selectedBus={selectedBus} time={time} />
      <RoadSurface />
      <StreetFurniture />
      {[0, 1, 2].map((index) => (
        <MovingBus
          key={index}
          index={index}
          time={time}
          selected={index === selectedBus}
          onSelect={() => onSelectBus?.(index)}
        />
      ))}
      <group position={[-2.5, 0.16, 0]}>
        <BeveledCase
          size={[3.2, 0.12, 2.05]}
          color="#233d4b"
          position={[0, 0.07, 0]}
          radius={0.06}
        />
        <group position={[0.5, 0.3, 0]} scale={0.72}>
          <RouterModel detail />
        </group>
        <group position={[-0.98, 0.9, 0.12]} scale={0.8}>
          <PassengerPhone />
        </group>
        <EquipmentLabel
          text={`BUS ${String.fromCharCode(65 + selectedBus)} · ÉQUIPEMENT AGRANDI`}
          position={[0, 1.64, -0.1]}
          width={3.5}
        />
      </group>
      <CloudEnvironment stage={stage} time={time} />
      <Signal
        from={busSource}
        to={MAST}
        time={time}
        active={stage >= 1}
        height={1.1}
        color="#a4c5d7"
      />
      <Signal
        from={MAST}
        to={EC2}
        time={time}
        active={stage === 1}
        height={1.2}
        color="#a2d2bc"
      />
      <Signal
        from={MAST}
        to={API}
        time={time}
        active={stage === 2}
        height={0.5}
        color="#9dc6dd"
      />
      <Signal
        from={new THREE.Vector3(-3.45, 1.03, 0.12)}
        to={ROUTER}
        time={time}
        active={stage === 0}
        height={0.3}
        color="#a2d2bc"
      />
    </group>
  );
}
