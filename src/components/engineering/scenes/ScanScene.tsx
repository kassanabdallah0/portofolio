'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneProps } from '../core/types';
import { scanState } from '../animations/timelines';
import { RiggedWorker } from '../models/RiggedWorker';
import {
  Cable,
  DepthCamera,
  Enclosure,
  FloorMark,
  IndustrialFloor,
  Jetson,
} from '../models/IndustrialEquipment';

function Screen({ time }: Pick<SceneProps, 'time'>) {
  const resources = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 576;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { canvas, texture };
  }, []);
  useEffect(() => () => resources.texture.dispose(), [resources]);
  const last = useRef(-1);
  useFrame(() => {
    const tick = Math.floor(time.current * 10);
    if (last.current === tick) return;
    last.current = tick;
    const { canvas, texture } = resources,
      ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = scanState(time.current),
      done = state.phase === 'result';
    const title =
      {
        approach: 'Bienvenue au point de contrôle',
        stabilize: 'Gardez votre position',
        acquire: 'Acquisition en cours',
        validate: 'Vérification des équipements',
        result: 'Équipements validés',
        depart: 'Station disponible',
      }[state.phase] ?? 'Station disponible';
    ctx.fillStyle = '#eef3f3';
    ctx.fillRect(0, 0, 1024, 576);
    ctx.fillStyle = '#12303c';
    ctx.fillRect(0, 0, 1024, 68);
    ctx.fillStyle = '#f1f8f8';
    ctx.font = 'bold 23px sans-serif';
    ctx.fillText('COLAS / SCAN EPI', 38, 43);
    ctx.font = '16px monospace';
    ctx.fillStyle = '#b3d1d6';
    ctx.fillText('DÉMONSTRATION', 788, 42);
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#163b49';
    ctx.fillText(title, 38, 126);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#526e78';
    ctx.fillText(
      done
        ? 'Vous pouvez quitter la zone de scan.'
        : 'Placez-vous sur le repère, face à l’écran.',
      38,
      161,
    );
    ctx.fillStyle = '#dce8e9';
    ctx.beginPath();
    ctx.roundRect(38, 190, 350, 280, 20);
    ctx.fill();
    // Deliberately graphic positioning guide, not a claim to show live video.
    ctx.strokeStyle = done ? '#217b62' : '#4c899c';
    ctx.lineWidth = 5;
    ctx.strokeRect(135, 218, 150, 218);
    ctx.fillStyle = '#446274';
    ctx.beginPath();
    ctx.arc(210, 261, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e4af50';
    ctx.beginPath();
    ctx.roundRect(165, 290, 90, 84, 14);
    ctx.fill();
    ctx.fillStyle = '#edf4e6';
    ctx.fillRect(183, 296, 9, 70);
    ctx.fillRect(226, 296, 9, 70);
    ctx.strokeStyle = '#446274';
    ctx.lineWidth = 19;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(188, 379);
    ctx.lineTo(183, 420);
    ctx.moveTo(231, 379);
    ctx.lineTo(236, 420);
    ctx.stroke();
    const labels = ['Positionnement', 'Acquisition', 'Validation', 'Résultat'];
    labels.forEach((label, i) => {
      const y = 216 + i * 66,
        complete = i < state.stage || (i === 3 && done),
        active = i === state.stage;
      ctx.fillStyle = complete ? '#217b62' : active ? '#1f6075' : '#d7e2e5';
      ctx.beginPath();
      ctx.arc(440, y + 10, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = active || complete ? '#fff' : '#45616f';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText(complete ? '✓' : String(i + 1), 434, y + 16);
      ctx.font = active ? 'bold 23px sans-serif' : '22px sans-serif';
      ctx.fillStyle = active ? '#153e4e' : '#526e78';
      ctx.fillText(label, 477, y + 17);
      if (active) {
        ctx.fillStyle = '#d4e2e5';
        ctx.fillRect(478, y + 29, 460, 4);
        ctx.fillStyle = done ? '#217b62' : '#438fa5';
        ctx.fillRect(478, y + 29, 460 * state.progress, 4);
      }
    });
    ctx.fillStyle = done ? '#d1ebde' : '#e2ebed';
    ctx.fillRect(0, 504, 1024, 72);
    ctx.fillStyle = done ? '#145b43' : '#466572';
    ctx.font = '19px sans-serif';
    ctx.fillText(
      done
        ? '✓ Casque     ✓ Gilet     · Résultat illustratif'
        : 'CAMÉRA CONNECTÉE  •  ÉTAT ORCHESTRÉ PAR LE BACKEND',
      38,
      548,
    );
    // CanvasTexture requires an explicit upload after the screen is drawn.
    // eslint-disable-next-line react-hooks/immutability
    texture.needsUpdate = true;
  });
  return (
    <mesh position={[0, 0, 0.066]}>
      <planeGeometry args={[2.25, 1.266]} />
      <meshBasicMaterial map={resources.texture} toneMapped={false} />
    </mesh>
  );
}
function DisplayStation({ time }: Pick<SceneProps, 'time'>) {
  return (
    <group position={[1.1, 0, -0.7]} rotation={[0, -0.24, 0]}>
      <Enclosure
        size={[1.25, 0.065, 0.75]}
        position={[0, 0.08, 0]}
        color="#52646b"
        radius={0.05}
      />
      {[-0.46, 0.46].flatMap((x) =>
        [-0.23, 0.23].map((z) => (
          <group
            key={x + ':' + z}
            position={[x, 0.07, z]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <mesh>
              <cylinderGeometry args={[0.07, 0.07, 0.075, 16]} />
              <meshStandardMaterial color="#273038" roughness={0.8} />
            </mesh>
          </group>
        )),
      )}
      {[-0.3, 0.3].map((x) => (
        <Enclosure
          key={x}
          size={[0.065, 1.9, 0.065]}
          position={[x, 1.06, 0]}
          color="#a6b4b9"
          metalness={0.85}
          radius={0.01}
        />
      ))}
      <Enclosure
        size={[1.05, 0.04, 0.54]}
        position={[0, 0.68, 0.13]}
        color="#6f858f"
        radius={0.02}
      />
      <Jetson position={[0, 0.71, 0.16]} scale={0.85} />
      <Cable
        points={[
          [0.25, 0.75, 0.3],
          [0.47, 0.9, 0.15],
          [0.42, 1.45, -0.08],
          [0.16, 1.67, -0.08],
        ]}
      />
      <group position={[0, 1.84, 0]}>
        <Enclosure
          size={[2.38, 1.4, 0.125]}
          color="#253239"
          radius={0.06}
          metalness={0.5}
        />
        <Screen time={time} />
        <DepthCamera position={[0, 0.84, 0]} scale={0.8} />
        <mesh position={[1.06, -0.67, 0.07]}>
          <sphereGeometry args={[0.015, 8, 6]} />
          <meshBasicMaterial color="#77d6bb" />
        </mesh>
      </group>
    </group>
  );
}
export default function ScanScene({ time }: SceneProps) {
  const worker = useRef<THREE.Group>(null);
  const motion = useRef({
    walking: true,
    speed: 0.7,
    distance: 0,
    interaction: false,
  });
  const yaw = useRef(0);
  useFrame((_, delta) => {
    const s = scanState(time.current),
      pose = s.pose;
    motion.current = {
      walking: pose.walking,
      speed: pose.speed,
      distance: pose.distance,
      interaction: pose.interaction,
    };
    if (worker.current) {
      worker.current.position.set(pose.x, 0, pose.z);
      const target = pose.walking ? pose.yaw : 2.2;
      yaw.current +=
        Math.atan2(
          Math.sin(target - yaw.current),
          Math.cos(target - yaw.current),
        ) *
        (1 - Math.exp(-Math.min(delta, 0.05) * 5));
      worker.current.rotation.y = yaw.current;
    }
  }, -1);
  return (
    <group>
      <IndustrialFloor />
      <Enclosure
        size={[8, 2.8, 0.16]}
        position={[0, 1.28, -2.9]}
        color="#536a75"
        radius={0.03}
        metalness={0.05}
        roughness={0.8}
      />
      {[-3.7, -1.8, 0.1, 2, 3.7].map((x) => (
        <Enclosure
          key={x}
          size={[0.065, 2.75, 0.12]}
          position={[x, 1.3, -2.77]}
          color="#87999e"
          radius={0.008}
        />
      ))}
      <Enclosure
        size={[3.2, 0.035, 0.16]}
        position={[-1.3, 2.58, -2.7]}
        color="#dce6df"
        radius={0.01}
      />
      <Enclosure
        size={[1.05, 1.3, 0.65]}
        position={[2.9, 0.65, -2.25]}
        color="#aab7b9"
        radius={0.035}
      />
      <Enclosure
        size={[0.94, 1.1, 0.015]}
        position={[2.9, 0.68, -1.915]}
        color="#c6d0d0"
        radius={0.02}
      />
      <Enclosure
        size={[0.025, 0.18, 0.025]}
        position={[3.25, 0.7, -1.89]}
        color="#263d47"
        radius={0.006}
      />
      <FloorMark position={[-0.55, 0, 0.45]} size={[1, 1.1]} />
      {/* Low safety rail establishes scale without obscuring the human or display. */}
      {[-3.7, -2.4].map((x) => (
        <mesh key={x} position={[x, 0.42, 2.45]} castShadow>
          <cylinderGeometry args={[0.035, 0.045, 0.84, 12]} />
          <meshStandardMaterial color="#d2b361" metalness={0.45} />
        </mesh>
      ))}
      <mesh position={[-3.05, 0.8, 2.45]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.3, 12]} />
        <meshStandardMaterial color="#d2b361" metalness={0.45} />
      </mesh>
      <DisplayStation time={time} />
      <group ref={worker}>
        <RiggedWorker time={time} motion={motion} />
      </group>
    </group>
  );
}
