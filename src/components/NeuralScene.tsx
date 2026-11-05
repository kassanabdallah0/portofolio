'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

function Core({ paused }: { paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const resources = useMemo(() => {
    const shape = new THREE.IcosahedronGeometry(2, 2);
    const edges = new THREE.EdgesGeometry(shape, 1);
    const raw = shape.attributes.position;
    const unique = new Map<string, number[]>();
    for (let i = 0; i < raw.count; i++) {
      const xyz = [raw.getX(i), raw.getY(i), raw.getZ(i)];
      unique.set(xyz.map((v) => v.toFixed(4)).join(','), xyz);
    }
    const nodes = new THREE.BufferGeometry();
    nodes.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([...unique.values()].flat(), 3),
    );
    const dust = new THREE.BufferGeometry();
    const dots = Array.from({ length: 180 }, (_, i) => {
      const a = i * 2.399963,
        z = 1 - (2 * i) / 180,
        r = 3.2 + (i % 7) * 0.19;
      return [
        r * Math.sqrt(1 - z * z) * Math.cos(a),
        r * Math.sqrt(1 - z * z) * Math.sin(a),
        r * z,
      ];
    }).flat();
    dust.setAttribute('position', new THREE.Float32BufferAttribute(dots, 3));
    shape.dispose();
    return { edges, nodes, dust };
  }, []);
  useEffect(
    () => () =>
      Object.values(resources).forEach((resource) => resource.dispose()),
    [resources],
  );
  useFrame(({ pointer }, delta) => {
    if (paused || !group.current) return;
    const dt = Math.min(delta, 0.04);
    group.current.rotation.y += dt * 0.075;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      0.22 + pointer.y * 0.13,
      2,
      dt,
    );
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      -0.18 + pointer.x * 0.09,
      2,
      dt,
    );
    if (inner.current) {
      inner.current.rotation.y -= dt * 0.2;
      inner.current.rotation.z += dt * 0.08;
    }
  });
  return (
    <>
      <group ref={group} rotation={[0.22, 0.3, -0.18]}>
        <lineSegments geometry={resources.edges}>
          <lineBasicMaterial color="#23c4d6" transparent opacity={0.28} />
        </lineSegments>
        <points geometry={resources.nodes}>
          <pointsMaterial
            color="#9cf8ff"
            size={0.034}
            sizeAttenuation
            transparent
            opacity={0.95}
          />
        </points>
        <mesh ref={inner} rotation={[0.4, 0.2, 0.3]}>
          <icosahedronGeometry args={[0.86, 0]} />
          <meshBasicMaterial
            color="#10d8ed"
            wireframe
            transparent
            opacity={0.75}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.5, 0.25, 0.3]}>
          <torusGeometry args={[2.55, 0.006, 4, 160]} />
          <meshBasicMaterial color="#00c8e3" transparent opacity={0.55} />
        </mesh>
        <mesh rotation={[0.6, 0.6, -0.5]}>
          <torusGeometry args={[2.74, 0.004, 4, 160]} />
          <meshBasicMaterial color="#8183ef" transparent opacity={0.5} />
        </mesh>
        <points geometry={resources.dust}>
          <pointsMaterial
            color="#7a93b2"
            size={0.015}
            transparent
            opacity={0.55}
          />
        </points>
      </group>
    </>
  );
}

export default function NeuralScene({
  paused,
  onReady,
  onUnavailable,
}: {
  paused: boolean;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={paused ? 'demand' : 'always'}
      camera={{ position: [0, 0, 7.6], fov: 48 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onUnavailable, {
          once: true,
        });
        onReady();
      }}
      fallback={null}
    >
      <Core paused={paused} />
    </Canvas>
  );
}
