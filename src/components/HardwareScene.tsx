'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

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

function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = generator.fromScene(room, 0.04);
    // Three owns this mutable scene; it is not React state.
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = target.texture;
    room.dispose();
    generator.dispose();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Hardware({
  time,
  paused,
}: {
  time: RefObject<number>;
  paused: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const packets = useRef<THREE.Mesh[]>([]);
  const resources = useMemo(() => {
    const box = new RoundedBoxGeometry(1, 1, 1, 3, 0.055);
    const canvas = document.createElement('canvas');
    canvas.width = 576;
    canvas.height = 320;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const paths = [
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-1.55, 0.38, -0.15),
        new THREE.Vector3(-1.4, 0.7, -1.05),
        new THREE.Vector3(0.7, 0.4, -1),
        new THREE.Vector3(0.9, -0.14, 0.1),
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(0.85, 0.15, 0.2),
        new THREE.Vector3(1.2, 0.7, 0.2),
        new THREE.Vector3(0.8, 1.05, -0.7),
        new THREE.Vector3(0.2, 1.23, -0.65),
      ),
    ];
    return {
      box,
      canvas,
      texture,
      paths,
      tubes: paths.map(
        (path) => new THREE.TubeGeometry(path, 40, 0.009, 6, false),
      ),
      sphere: new THREE.SphereGeometry(0.027, 8, 8),
    };
  }, []);
  useEffect(
    () => () => {
      resources.box.dispose();
      resources.texture.dispose();
      resources.tubes.forEach((t) => t.dispose());
      resources.sphere.dispose();
    },
    [resources],
  );
  const lastScreen = useRef(-1);
  useFrame(({ pointer }, delta) => {
    const t = time.current;
    if (group.current && !paused) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        pointer.x * 0.1,
        3,
        Math.min(delta, 0.05),
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        -pointer.y * 0.035,
        3,
        Math.min(delta, 0.05),
      );
    }
    packets.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = (t * 0.18 + (i % 4) / 4) % 1;
      resources.paths[Math.floor(i / 4)].getPoint(phase, mesh.position);
      mesh.scale.setScalar(Math.sin(Math.PI * phase));
    });
    if (t - lastScreen.current < 1 / 18 && lastScreen.current >= 0) return;
    lastScreen.current = t;
    const ctx = resources.canvas.getContext('2d');
    if (!ctx) return;
    const w = 576,
      h = 320;
    ctx.fillStyle = '#152029';
    ctx.fillRect(0, 0, w, h);
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#364a57');
    gradient.addColorStop(1, '#1a2630');
    ctx.fillStyle = gradient;
    ctx.fillRect(12, 12, w - 24, h - 24);
    ctx.strokeStyle = '#4a5f6c';
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 100 + i * 38);
      ctx.lineTo(576, 40 + i * 38);
      ctx.stroke();
    }
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 85 - 90, 320);
      ctx.lineTo(i * 65 + 50, 48);
      ctx.stroke();
    }
    ctx.fillStyle = '#526470';
    ctx.fillRect(40, 56, 106, 117);
    ctx.fillStyle = '#273c48';
    ctx.fillRect(48, 69, 88, 76);
    ctx.fillStyle = '#4a5d69';
    ctx.fillRect(426, 99, 109, 117);
    ctx.fillStyle = '#6b7f8c';
    ctx.fillRect(426, 99, 109, 18);
    ctx.strokeStyle = '#9bb9c8';
    ctx.fillStyle = '#8baabb22';
    ctx.beginPath();
    ctx.moveTo(284, 154);
    ctx.lineTo(431, 191);
    ctx.lineTo(389, 286);
    ctx.lineTo(247, 229);
    ctx.closePath();
    ctx.fill();
    ctx.setLineDash([5, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
    const p = (t % 18) / 18;
    const x = 275 - Math.sin(p * Math.PI * 2) * 116;
    const y = 204 + Math.cos(p * Math.PI * 2) * 12;
    ctx.fillStyle = '#17232e55';
    ctx.beginPath();
    ctx.ellipse(x, y + 29, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ced7dc';
    ctx.beginPath();
    ctx.arc(x, y - 49, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c1ac8d';
    ctx.fillRect(x - 16, y - 33, 32, 40);
    ctx.strokeStyle = '#b0bdc5';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(x - 9, y + 7);
    ctx.lineTo(x - 12, y + 28);
    ctx.moveTo(x + 9, y + 7);
    ctx.lineTo(x + 12, y + 28);
    ctx.stroke();
    ctx.strokeStyle = '#bad7e3';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 29, y - 66, 58, 100);
    ctx.fillStyle = '#c2dce7';
    ctx.fillRect(x - 29, y - 85, 95, 19);
    ctx.fillStyle = '#1b2c36';
    ctx.font = '12px sans-serif';
    ctx.fillText('personne · 01', x - 24, y - 71);
    ctx.fillStyle = '#e1ebf1';
    ctx.font = '12px sans-serif';
    ctx.fillText('VISION EMBARQUÉE', 27, 34);
    ctx.fillStyle = '#abbfcb';
    ctx.fillText('Scène illustrative', 425, 34);
    const stage = Math.floor(p * 5);
    ctx.fillStyle = '#0f1b24';
    ctx.fillRect(20, 279, 536, 26);
    ctx.fillStyle = stage === 4 ? '#b9d6c5' : '#bfd2de';
    ctx.font = '13px sans-serif';
    ctx.fillText(
      [
        'Acquisition vidéo',
        'Détection · YOLO / TensorRT',
        'Suivi · identité conservée',
        'Règle temporelle · présence confirmée',
        'Événement · condition satisfaite',
      ][stage],
      32,
      297,
    );
    // Upload the imperative canvas buffer without a React render per frame.
    // eslint-disable-next-line react-hooks/immutability
    resources.texture.needsUpdate = true;
  });
  const box = (
    key: string,
    position: [number, number, number],
    scale: [number, number, number],
    color: string,
    metalness = 0.7,
    roughness = 0.3,
  ) => (
    <mesh
      key={key}
      position={position}
      scale={scale}
      geometry={resources.box}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  );
  return (
    <group ref={group} position={[0, -0.15, 0]}>
      <group position={[-1.55, 0.17, 0.35]} rotation={[0, -0.22, 0]}>
        {box('body', [0, 0, 0], [1.02, 0.82, 0.73], '#b7c1ca')}
        {box('front', [0, 0, 0.39], [0.94, 0.74, 0.08], '#26313b')}
        {box('back', [0, 0, -0.37], [0.89, 0.7, 0.035], '#7f8b95')}
        <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.62]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.31, 0.32, 0.41, 64]} />
            <meshStandardMaterial
              color="#28313b"
              metalness={0.85}
              roughness={0.24}
            />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              position={[0, -0.12 + i * 0.07, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.315, 0.009, 8, 64]} />
              <meshStandardMaterial
                color="#8d9da9"
                metalness={1}
                roughness={0.2}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.215, 0]}>
            <cylinderGeometry args={[0.265, 0.265, 0.025, 64]} />
            <meshStandardMaterial
              color="#16252e"
              metalness={0.7}
              roughness={0.12}
            />
          </mesh>
          <mesh position={[0, 0.235, 0]} scale={[1, 0.24, 1]}>
            <sphereGeometry
              args={[0.258, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshPhysicalMaterial
              color="#708ba4"
              metalness={0.05}
              roughness={0.06}
              transmission={0.72}
              thickness={0.32}
              ior={1.52}
              clearcoat={1}
              envMapIntensity={2}
            />
          </mesh>
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.012, 48]} />
            <meshStandardMaterial
              color="#080e16"
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.237, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.252, 0.009, 8, 64]} />
            <meshStandardMaterial
              color="#97b5c7"
              metalness={0.85}
              roughness={0.18}
            />
          </mesh>
        </group>
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((y) => (
            <mesh
              key={`${x}-${y}`}
              position={[x * 0.4, y * 0.3, 0.44]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.025, 0.025, 0.012, 12]} />
              <meshStandardMaterial
                color="#87929b"
                metalness={0.95}
                roughness={0.3}
              />
            </mesh>
          )),
        )}
        {box('mount', [0, -0.59, -0.08], [0.18, 0.4, 0.2], '#71808c')}
        {box('foot', [0, -0.78, 0], [0.85, 0.08, 0.65], '#9dabb7')}
      </group>
      <group position={[0.83, -0.51, 0.52]} rotation={[0, -0.15, 0]}>
        {box('base', [0, 0, 0], [1.63, 0.48, 1.13], '#727f8a')}
        {box('top', [0, 0.27, 0], [1.55, 0.07, 1.05], '#29343e')}
        {Array.from({ length: 13 }, (_, i) =>
          box(
            `fin-${i}`,
            [-0.69 + i * 0.115, 0.35, 0],
            [0.035, 0.19, 0.99],
            '#83919c',
          ),
        )}
        {box('port', [0, -0.04, 0.573], [1.42, 0.28, 0.02], '#25313a')}
        {[-0.5, -0.23, 0.08].map((x, i) =>
          box(
            `usb-${i}`,
            [x, -0.04, 0.59],
            [0.17, 0.13, 0.025],
            '#0a1117',
            0.2,
            0.7,
          ),
        )}
        <mesh position={[0.55, -0.035, 0.598]}>
          <sphereGeometry args={[0.021, 12, 12]} />
          <meshBasicMaterial color="#b8d7be" />
        </mesh>
        {[-0.55, 0.55].map((x) =>
          box(
            `feet-${x}`,
            [x, -0.28, 0],
            [0.25, 0.09, 0.85],
            '#202932',
            0.2,
            0.8,
          ),
        )}
      </group>
      <group position={[0.25, 1.43, -0.8]} rotation={[0, -0.06, 0]}>
        {box('screen', [0, 0, 0], [2.66, 1.51, 0.075], '#8f9da9', 0.9, 0.2)}
        <mesh position={[0, 0, 0.043]}>
          <planeGeometry args={[2.54, 1.41]} />
          <meshBasicMaterial map={resources.texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.051]} rotation={[0, 0, 0]}>
          <planeGeometry args={[2.57, 1.44]} />
          <meshPhysicalMaterial
            color="#e6f1f8"
            transparent
            opacity={0.035}
            roughness={0.08}
            metalness={0.2}
            clearcoat={1}
          />
        </mesh>
        {box('screen-foot', [0, -0.97, -0.12], [0.1, 0.5, 0.1], '#a0acb6')}
      </group>
      {resources.tubes.map((tube, i) => (
        <mesh key={i} geometry={tube}>
          <meshStandardMaterial
            color="#6e92a7"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) packets.current[i] = el;
          }}
          geometry={resources.sphere}
        >
          <meshBasicMaterial color="#b3d4e3" />
        </mesh>
      ))}
    </group>
  );
}

export default function HardwareScene({
  paused,
  time,
  onReady,
  onUnavailable,
}: {
  paused: boolean;
  time: RefObject<number>;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={paused ? 'demand' : 'always'}
      shadows
      camera={{ position: [3.9, 2.5, 7.6], fov: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 0.2, 0);
      }}
    >
      <SceneStatus onReady={onReady} onUnavailable={onUnavailable} />
      <Studio />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[-3, 8, 5]}
        intensity={2.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-normalBias={0.025}
        shadow-radius={5}
      />
      <directionalLight position={[4, 2, -3]} intensity={2} color="#c4d9e8" />
      <Hardware paused={paused} time={time} />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.13, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.13} />
      </mesh>
    </Canvas>
  );
}
