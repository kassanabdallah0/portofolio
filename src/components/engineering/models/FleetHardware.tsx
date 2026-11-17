'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/** Small, original equipment reconstructions. Dimensions are illustrative, not CAD. */
export function BeveledCase({
  size,
  color = '#b9c6cc',
  position = [0, 0, 0],
  radius = 0.06,
}: {
  size: [number, number, number];
  color?: string;
  position?: [number, number, number];
  radius?: number;
}) {
  const [width, height, depth] = size;
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = -width / 2 + radius,
      y = -height / 2 + radius;
    const w = width - 2 * radius,
      h = height - 2 * radius;
    shape.moveTo(x, y);
    shape.lineTo(x + w, y);
    shape.lineTo(x + w, y + h);
    shape.lineTo(x, y + h);
    shape.closePath();
    const result = new THREE.ExtrudeGeometry(shape, {
      depth: depth - radius * 2,
      bevelEnabled: true,
      bevelSize: radius,
      bevelThickness: radius,
      bevelSegments: 3,
      steps: 1,
    });
    result.translate(0, 0, -depth / 2 + radius);
    return result;
  }, [width, height, depth, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={position} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={0.45} roughness={0.36} />
    </mesh>
  );
}

export function EquipmentLabel({
  text,
  position,
  width = 1.5,
  color = '#d5e6eb',
}: {
  text: string;
  position: [number, number, number];
  width?: number;
  color?: string;
}) {
  const label = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.height = 96;
    const measure = canvas.getContext('2d')!;
    measure.font = '600 64px Arial';
    canvas.width = Math.ceil(measure.measureText(text).width) + 32;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#173442dc';
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, 96, 10);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = '600 64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, 48);
    const value = new THREE.CanvasTexture(canvas);
    value.colorSpace = THREE.SRGBColorSpace;
    return { texture: value, aspect: canvas.width / canvas.height };
  }, [text, color]);
  useEffect(() => () => label.texture.dispose(), [label]);
  return (
    <sprite position={position} scale={[width, width / label.aspect, 1]}>
      <spriteMaterial
        map={label.texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

export function RouterModel({ detail = false }: { detail?: boolean }) {
  return (
    <group>
      <BeveledCase
        size={[1.65, 0.43, 1.06]}
        color="#acb7bd"
        position={[0, 0.22, 0]}
        radius={0.035}
      />
      <mesh position={[0, 0.22, 0.541]}>
        <boxGeometry args={[1.59, 0.36, 0.025]} />
        <meshStandardMaterial
          color="#1c2931"
          roughness={0.45}
          metalness={0.35}
        />
      </mesh>
      <mesh position={[0, 0.445, 0]}>
        <boxGeometry args={[1.49, 0.014, 0.9]} />
        <meshStandardMaterial
          color="#334550"
          roughness={0.45}
          metalness={0.45}
        />
      </mesh>
      {[-0.61, -0.22, 0.17, 0.56].map((x, i) => (
        <group key={x} position={[x, 0.24, 0.562]}>
          <mesh>
            <boxGeometry args={[0.3, 0.23, 0.038]} />
            <meshStandardMaterial
              color="#9ca5a4"
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <boxGeometry args={[0.245, 0.17, 0.016]} />
            <meshStandardMaterial color="#0b151b" />
          </mesh>
          {[0, 1, 2, 3].map((pin) => (
            <mesh key={pin} position={[-0.074 + pin * 0.049, 0.035, 0.033]}>
              <boxGeometry args={[0.015, 0.055, 0.007]} />
              <meshStandardMaterial
                color="#c5ab6c"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          ))}
          <mesh position={[-0.1, 0.096, 0.032]}>
            <boxGeometry args={[0.035, 0.025, 0.015]} />
            <meshBasicMaterial color={i === 0 ? '#7bcbac' : '#8b988c'} />
          </mesh>
        </group>
      ))}
      {[-0.68, -0.33, 0.33, 0.68].map((x, i) => (
        <group
          key={x}
          position={[x, 0.27, -0.53]}
          rotation={[i % 2 ? -0.16 : 0.16, 0, x * -0.25]}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.14, 10]} />
            <meshStandardMaterial
              color="#b9a465"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.43, -0.07]}>
            <capsuleGeometry args={[0.038, 0.78, 3, 8]} />
            <meshStandardMaterial color="#19242b" roughness={0.7} />
          </mesh>
        </group>
      ))}
      {[-0.73, 0.73].map((x) => (
        <mesh
          key={x}
          position={[x, 0.452, 0.41]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.026, 0.026, 0.012, 8]} />
          <meshStandardMaterial
            color="#b0b9bc"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      ))}
      {detail && (
        <EquipmentLabel
          text="TELTONIKA · RUTX11"
          position={[0, 0.6, 0.75]}
          width={2.5}
        />
      )}
    </group>
  );
}

export function PassengerPhone() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 480;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ecf1f0';
    ctx.fillRect(0, 0, 256, 480);
    ctx.fillStyle = '#213d50';
    ctx.fillRect(0, 0, 256, 115);
    ctx.fillStyle = '#eaf6fa';
    ctx.font = 'bold 23px Arial';
    ctx.fillText('MediaSpot', 22, 70);
    ctx.fillStyle = '#4e7682';
    ctx.font = '15px Arial';
    ctx.fillText('Votre espace à bord', 22, 149);
    ctx.fillStyle = '#d2dcd8';
    ctx.fillRect(20, 175, 216, 145);
    ctx.fillStyle = '#4d676e';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('Le journal', 34, 223);
    ctx.font = '14px Arial';
    ctx.fillText('Édition du jour', 34, 254);
    ctx.fillStyle = '#216573';
    ctx.fillRect(20, 350, 216, 45);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 17px Arial';
    ctx.fillText('Lire à bord', 77, 379);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group rotation={[-0.18, 0.2, 0.06]}>
      <BeveledCase size={[0.63, 1.22, 0.09]} color="#15242d" radius={0.035} />
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[0.55, 1.04]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.565, 0.055]}>
        <boxGeometry args={[0.13, 0.022, 0.01]} />
        <meshStandardMaterial color="#050c11" />
      </mesh>
    </group>
  );
}

export function CellularMast() {
  return (
    <group>
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.09, 3.4, 10]} />
        <meshStandardMaterial
          color="#85959d"
          metalness={0.7}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.6, 0.16, 0.6]} />
        <meshStandardMaterial color="#9ba5a5" roughness={0.95} />
      </mesh>
      {[0, 2.09, 4.18].map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh position={[0, 2.95, 0.17]} castShadow>
            <boxGeometry args={[0.18, 0.72, 0.1]} />
            <meshStandardMaterial
              color="#d1dadd"
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>
          <mesh position={[0, 2.48, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.23, 0.1, 16]} />
            <meshStandardMaterial color="#b6c2c8" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function ServerRack() {
  return (
    <group>
      <BeveledCase
        size={[0.95, 1.8, 0.8]}
        color="#263c48"
        position={[0, 0.9, 0]}
        radius={0.045}
      />
      <mesh position={[0, 0.91, 0.412]}>
        <boxGeometry args={[0.78, 1.6, 0.025]} />
        <meshStandardMaterial color="#152733" roughness={0.6} />
      </mesh>
      {[0.38, 0.68, 0.98, 1.28, 1.58].map((y) => (
        <group key={y} position={[0, y, 0.44]}>
          <mesh>
            <boxGeometry args={[0.7, 0.23, 0.07]} />
            <meshStandardMaterial
              color="#536b77"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {[-0.23, -0.1, 0.03].map((x) => (
            <mesh key={x} position={[x, 0, 0.04]}>
              <boxGeometry args={[0.08, 0.11, 0.012]} />
              <meshStandardMaterial color="#11232f" />
            </mesh>
          ))}
          <mesh position={[0.26, 0, 0.05]}>
            <sphereGeometry args={[0.019, 6, 6]} />
            <meshBasicMaterial color="#a4d7b7" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
