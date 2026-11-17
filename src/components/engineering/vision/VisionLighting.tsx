'use client';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
export default function VisionLighting({ lowPower }: { lowPower?: boolean }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    if (lowPower) return;
    const generator = new PMREMGenerator(gl),
      room = new RoomEnvironment(),
      target = generator.fromScene(room, 0.06, 0.1, 100, { size: 64 });
    // Three owns this mutable render resource.
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = target.texture;
    room.dispose();
    generator.dispose();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene, lowPower]);
  return (
    <>
      <color attach="background" args={['#c1cdd2']} />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#f1f6fa', '#707875', 0.8]} />
      <directionalLight
        position={[-3, 12, 7]}
        color="#fff3dd"
        intensity={2.25}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-normalBias={0.035}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[8, 6, -6]}
        color="#c9ddeb"
        intensity={1.05}
      />
    </>
  );
}
