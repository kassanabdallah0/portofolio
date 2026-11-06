'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Self-contained, original procedural 3D reconstructions. No external CAD,
 * trademarks as textures, network calls, or production camera footage.
 * Every moving mesh uses continuous motion with delta clamped after tab changes.
 */
export type PhysicalScene = 'scan' | 'cloud' | 'vision';

type SceneProps = {
  mode: PhysicalScene;
  stage: number;
  running: boolean;
  selectedBus: number;
};

function Floor({ width = 11, depth = 7 }: { width?: number; depth?: number }) {
  return (
    <group>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[width, 0.16, depth]} />
        <meshStandardMaterial color="#192e3a" roughness={0.82} metalness={0.16} />
      </mesh>
      <gridHelper args={[Math.max(width, depth), 20, '#486573', '#2e4755']} position={[0, 0.012, 0]} />
    </group>
  );
}

function DeviceBox({ position, size = [0.88, 0.32, 0.67] }: {
  position: [number, number, number];
  size?: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#394b58" roughness={0.35} metalness={0.62} />
      </mesh>
      <mesh position={[0, 0, size[2] / 2 + 0.006]}>
        <boxGeometry args={[size[0] * 0.74, size[1] * 0.6, 0.01]} />
        <meshStandardMaterial color="#111e28" roughness={0.45} metalness={0.55} />
      </mesh>
      <mesh position={[-size[0] * 0.32, 0, size[2] / 2 + 0.02]}>
        <sphereGeometry args={[0.026, 9, 9]} />
        <meshBasicMaterial color="#80dec6" />
      </mesh>
      {[-0.27, -0.15, -0.03, 0.09, 0.21].map((x) => (
        <mesh key={x} position={[x * size[0], size[1] / 2 + 0.009, 0]}>
          <boxGeometry args={[0.025, 0.017, size[2] * 0.64]} />
          <meshStandardMaterial color="#8497a4" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ position = [-1.65, 3.25, -1.85] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.055, 0.055, 0.6, 12]} /><meshStandardMaterial color="#8ca0ad" metalness={0.8} roughness={0.2} /></mesh>
      <mesh rotation={[0.12, -0.2, 0]}>
        <boxGeometry args={[0.64, 0.29, 0.43]} />
        <meshStandardMaterial color="#c0ced7" metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.228]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 24]} />
        <meshStandardMaterial color="#263d4b" metalness={0.45} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0, 0.293]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.09, 24]} /><meshPhysicalMaterial color="#6bc8e3" metalness={0.45} roughness={0.12} clearcoat={1} />
      </mesh>
    </group>
  );
}

function Worker({ mode, running }: { mode: 'scan' | 'vision'; running: boolean }) {
  const root = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!running) return;
    elapsed.current += Math.min(delta, 0.05);
    const t = elapsed.current;
    const stride = mode === 'vision' ? Math.sin(t * 2.3) * 0.30 : Math.sin(t * 0.8) * 0.055;
    if (root.current) {
      root.current.position.x = mode === 'vision' ? -0.48 + Math.sin(t * 0.24) * 1.2 : -0.60 + Math.sin(t * 0.47) * 0.04;
      root.current.position.y = Math.abs(Math.sin(t * (mode === 'vision' ? 2.3 : 0.8))) * (mode === 'vision' ? 0.042 : 0.014);
      root.current.rotation.y = mode === 'vision' ? Math.cos(t * 0.24) * 0.5 : -0.17;
    }
    if (leftArm.current) leftArm.current.rotation.x = stride * 0.8;
    if (rightArm.current) rightArm.current.rotation.x = -stride * 0.8;
    if (leftLeg.current) leftLeg.current.rotation.x = -stride;
    if (rightLeg.current) rightLeg.current.rotation.x = stride;
  });

  return (
    <group ref={root} position={mode === 'vision' ? [-0.48, 0, 0.95] : [-0.6, 0, 1.55]} scale={mode === 'vision' ? 0.9 : 1}>
      <mesh position={[0, 1.57, 0]} castShadow><capsuleGeometry args={[0.28, 0.62, 5, 12]} /><meshStandardMaterial color="#dca44c" roughness={0.68} /></mesh>
      <mesh position={[0, 1.55, 0.25]}><boxGeometry args={[0.34, 0.60, 0.06]} /><meshStandardMaterial color="#eebf66" roughness={0.64} /></mesh>
      {[-0.125, 0.125].map((x) => <mesh key={x} position={[x, 1.55, 0.292]}><boxGeometry args={[0.07, 0.59, 0.02]} /><meshBasicMaterial color="#e8f0ed" /></mesh>)}
      <mesh position={[0, 2.29, 0]} castShadow><sphereGeometry args={[0.205, 18, 14]} /><meshStandardMaterial color="#ba8667" roughness={0.82} /></mesh>
      <mesh position={[0, 2.49, 0]} scale={[1.08, 0.65, 1]} castShadow><sphereGeometry args={[0.236, 18, 14]} /><meshStandardMaterial color="#f1c56b" roughness={0.46} /></mesh>
      <mesh position={[0, 2.42, 0.145]} scale={[1, 0.16, 0.53]}><cylinderGeometry args={[0.27, 0.27, 0.12, 24]} /><meshStandardMaterial color="#f4d589" /></mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <group ref={side < 0 ? leftArm : rightArm} position={[side * 0.37, 1.91, 0]}>
            <mesh position={[side * 0.045, -0.34, 0]} rotation={[0, 0, side * 0.1]} castShadow>
              <capsuleGeometry args={[0.12, 0.43, 4, 10]} /><meshStandardMaterial color="#506b7e" roughness={0.72} />
            </mesh>
            <mesh position={[side * 0.083, -0.7, 0.012]}><sphereGeometry args={[0.12, 12, 9]} /><meshStandardMaterial color="#282f36" /></mesh>
          </group>
          <group ref={side < 0 ? leftLeg : rightLeg} position={[side * 0.16, 1.04, 0]}>
            <mesh position={[0, -0.42, 0]} castShadow><capsuleGeometry args={[0.155, 0.52, 5, 10]} /><meshStandardMaterial color="#263d52" roughness={0.84} /></mesh>
            <mesh position={[0, -0.94, 0.10]} castShadow><boxGeometry args={[0.32, 0.18, 0.52]} /><meshStandardMaterial color="#19242c" roughness={0.72} /></mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/** Render a synthetic SCAN UI into an actual television screen texture. */
function ScanScreen({ stage }: { stage: number }) {
  const texture = useMemo(() => {
    // Construct the entire image before publishing it to React: no mutation of
    // memoized hook return values in effects (React 19 immutability rule).
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const phases = ['POSITIONNEMENT', 'ACQUISITION', 'VALIDATION', 'RÉSULTAT'];
    ctx.fillStyle = '#0d1d2a'; ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = '#173247'; ctx.fillRect(0, 0, 640, 57);
    ctx.fillStyle = '#edf8ff'; ctx.font = 'bold 23px Arial'; ctx.fillText('SCAN EPI', 27, 37);
    ctx.fillStyle = '#99c3d5'; ctx.font = '14px monospace'; ctx.fillText('DÉMONSTRATION', 452, 37);
    ctx.strokeStyle = '#6cbed1'; ctx.lineWidth = 3; ctx.strokeRect(45, 90, 340, 254);
    ctx.setLineDash([10, 8]);ctx.strokeStyle = '#7da9bb';ctx.lineWidth=2;ctx.strokeRect(80, 106, 270, 220);ctx.setLineDash([]);
    ctx.strokeStyle = '#bee2ea';ctx.lineWidth=5;
    ctx.beginPath();ctx.arc(215, 159, 32, 0, Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(215,193);ctx.lineTo(215,277);ctx.moveTo(165,214);ctx.lineTo(265,214);ctx.moveTo(215,277);ctx.lineTo(175,312);ctx.moveTo(215,277);ctx.lineTo(255,312);ctx.stroke();
    ctx.fillStyle = '#8ebed1';ctx.font='14px monospace';ctx.fillText('ZONE DE POSITIONNEMENT',58,379);
    ctx.fillStyle = '#86cbd5';ctx.font='15px monospace';ctx.fillText('ÉTAPE 0'+(stage+1),419,117);
    ctx.fillStyle = '#effcff';ctx.font='bold 22px Arial';ctx.fillText(phases[stage],419,153);
    ctx.fillStyle = '#91abb9';ctx.font='14px Arial';
    const explanations = ['Placez-vous face à l’écran','Acquisition synthétique','Traitement du résultat','Parcours terminé'];
    ctx.fillText(explanations[stage],419,185);
    for(let i=0;i<4;i++){
      ctx.fillStyle = i <= stage ? '#8ed6c0' : '#355366';
      ctx.fillRect(420+i*45,225,34,7);
    }
    if (stage===3) {ctx.fillStyle='#a9e8ce';ctx.font='bold 17px Arial';ctx.fillText('✓ RESTITUTION',419,292);}
    ctx.fillStyle='#94b0bf';ctx.font='11px monospace';ctx.fillText('ÉCRAN SYNTHÉTIQUE • NON CONNECTÉ',25,387);
    const finished = new THREE.CanvasTexture(canvas);
    finished.colorSpace = THREE.SRGBColorSpace;
    finished.anisotropy = 2;
    return finished;
  }, [stage]);
  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;
  return (
    <mesh position={[0, 1.97, 0.168]}>
      <planeGeometry args={[2.58, 1.58]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function IndustrialTV({ stage }: { stage: number }) {
  return (
    <group position={[1.44, 0, -0.55]} rotation={[0,-0.10,0]}>
      <mesh position={[0, 1.93, 0]} castShadow><boxGeometry args={[2.9,1.94,0.20]} /><meshStandardMaterial color="#29343d" metalness={0.53} roughness={0.36} /></mesh>
      <mesh position={[0, 1.94,0.111]}><boxGeometry args={[2.75,1.78,0.035]} /><meshStandardMaterial color="#070f15" roughness={0.36} /></mesh>
      <ScanScreen stage={stage} />
      <mesh position={[0, 0.88, -0.12]}><cylinderGeometry args={[0.065,0.08,0.94,16]} /><meshStandardMaterial color="#8c9ca7" metalness={0.8} roughness={0.33}/></mesh>
      <mesh position={[0, 0.35,-0.13]}><boxGeometry args={[1.05,0.12,0.65]} /><meshStandardMaterial color="#708490" metalness={0.7} roughness={0.42}/></mesh>
      <mesh position={[1.22, 1.08,0.01]}><sphereGeometry args={[0.034,10,10]} /><meshBasicMaterial color="#a2dfcb" /></mesh>
    </group>
  );
}

function Station({stage,running}:{stage:number;running:boolean}){
  return (
    <group>
      <Floor width={9.7} depth={6.4}/>
      <mesh position={[0,0.018,1]} rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[2.4,2.4]} />
        <meshBasicMaterial color="#70c4d6" transparent opacity={0.10}/>
      </mesh>
      <mesh position={[-0.65,0.024,1.52]} rotation={[-Math.PI/2,0,0]}>
        <ringGeometry args={[0.88,0.9,40]}/><meshBasicMaterial color="#81d8e6" transparent opacity={0.62}/>
      </mesh>
      <IndustrialTV stage={stage}/>
      <Worker mode="scan" running={running}/>
      <group position={[-3.05,0,-0.6]}>
        <mesh position={[0,1,0]}><boxGeometry args={[1.25,2.0,0.68]}/><meshStandardMaterial color="#354a58" metalness={0.55} roughness={0.38}/></mesh>
        <mesh position={[0,1.25,0.36]}><boxGeometry args={[0.86,0.85,0.04]}/><meshBasicMaterial color="#4e98a9"/></mesh>
        <DeviceBox position={[0,0.38,0.44]} size={[0.72,0.26,0.46]}/>
      </group>
      <CameraRig position={[-0.55,3.12,-1.08]}/>
      <mesh position={[-0.55,2.72,-1.2]} rotation={[-Math.PI/2,0,0]}>
        <coneGeometry args={[0.92,2.55,4,1,true]}/>
        <meshBasicMaterial color="#73d9e5" transparent opacity={0.048} side={THREE.DoubleSide} depthWrite={false}/>
      </mesh>
      <mesh position={[0,-0.05,-2.7]}><boxGeometry args={[9.5,0.06,0.15]}/><meshStandardMaterial color="#d5ad63" roughness={0.8}/></mesh>
    </group>
  );
}

function Workshop({stage,running}:{stage:number;running:boolean}){
  return (
    <group>
      <Floor width={10.4} depth={7.2}/>
      {[-3.5,2.7].map((x)=>(
        <group key={x} position={[x,0,-1.35]}>
          <mesh position={[0,0.94,0]}><boxGeometry args={[1.65,1.88,1.1]}/><meshStandardMaterial color="#566e7d" metalness={0.55} roughness={0.42}/></mesh>
          <mesh position={[0,1.55,0.57]}><boxGeometry args={[1.24,0.53,0.05]}/><meshBasicMaterial color="#387082"/></mesh>
          <mesh position={[0,0.25,0.58]}><boxGeometry args={[1.5,0.34,0.05]}/><meshStandardMaterial color="#d6b16d" roughness={0.52}/></mesh>
        </group>
      ))}
      <mesh position={[0,0.024,0.95]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.9,2.5]}/><meshBasicMaterial color="#f1b96a" transparent opacity={0.15}/></mesh>
      <mesh position={[0,0.037,0.95]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.05,1.10,40]}/><meshBasicMaterial color="#f3c476"/></mesh>
      <Worker mode="vision" running={running}/>
      <CameraRig position={[-2.0,3.15,-2.1]}/>
      <DeviceBox position={[3.55,0.46,1.5]} size={[1.05,0.42,0.82]}/>
      {stage>=1 && (
        <mesh position={[-0.48,1.35,0.95]} >
          <boxGeometry args={[1.2,2.75,1.0]}/>
          <meshBasicMaterial color="#79d9e8" transparent opacity={0.22} wireframe depthWrite={false}/>
        </mesh>
      )}
      {stage===4 && (
        <group position={[3.4,0.86,1.5]}>
          <mesh><cylinderGeometry args={[0.12,0.14,0.29,18]}/><meshBasicMaterial color="#eaa24c"/></mesh>
          <pointLight color="#ffb967" intensity={1.3} distance={2}/>
        </group>
      )}
    </group>
  );
}

function BusModel({ index, selected, running }: {index:number;selected:boolean;running:boolean}) {
  const root=useRef<THREE.Group>(null);
  const seconds=useRef(index*0.31);
  const path=useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.55,0,1.95),new THREE.Vector3(-1.75,0,2.2),new THREE.Vector3(1.45,0,2.18),
    new THREE.Vector3(2.65,0,1.45),new THREE.Vector3(2.8,0,-1.45),
    new THREE.Vector3(1.4,0,-2.1),new THREE.Vector3(-1.7,0,-2.18),
    new THREE.Vector3(-3.5,0,-1.4),
  ],true,'centripetal',0.3),[]);
  useFrame((_,delta)=>{
    if(!running||!root.current)return;
    seconds.current+=Math.min(delta,0.05);
    const u=(seconds.current*0.017+index/8)%1;
    const pos=path.getPointAt(u);
    const tangent=path.getTangentAt(u);
    root.current.position.set(pos.x,0.11,pos.z);
    root.current.rotation.y=Math.atan2(tangent.x,tangent.z);
  });
  const paint=selected?'#f1d8a5':index%2?'#e8eef0':'#c5dce8';
  return (
    <group ref={root} scale={0.47} position={path.getPointAt(index/8)}>
      <mesh position={[0,0.91,0]} castShadow><boxGeometry args={[1.48,1.52,3.65]}/><meshStandardMaterial color={paint} metalness={0.24} roughness={0.52}/></mesh>
      <mesh position={[0,1.78,0]}><boxGeometry args={[1.38,0.1,3.34]}/><meshStandardMaterial color="#b4bdc4" metalness={0.64} roughness={0.33}/></mesh>
      <mesh position={[0,1.28,1.86]}><boxGeometry args={[1.34,0.79,0.05]}/><meshPhysicalMaterial color="#3d667a" metalness={0.2} roughness={0.18} clearcoat={0.55}/></mesh>
      {[-1,1].map(side=>(
        <group key={side}>
          {[ -1.05,-0.20,0.65 ].map(z=><mesh key={z} position={[side*.747,1.29,z]}>
            <boxGeometry args={[0.028,0.66,0.69]}/><meshStandardMaterial color="#35607a" metalness={0.24} roughness={0.22}/>
          </mesh>)}
          {[-1.22,1.15].map(z=><mesh key={z} position={[side*.74,0.39,z]} rotation={[0,0,Math.PI/2]}>
            <cylinderGeometry args={[0.31,0.31,0.17,16]}/><meshStandardMaterial color="#19252d" roughness={0.87}/>
          </mesh>)}
        </group>
      ))}
      <mesh position={[0,0.70,-1.84]}><boxGeometry args={[1.28,0.20,0.06]}/><meshStandardMaterial color="#739caa" roughness={0.36}/></mesh>
      {[-.55,.55].map(x=><mesh key={x} position={[x,.72,1.85]}><boxGeometry args={[.22,.12,.07]}/><meshBasicMaterial color={selected?'#c9f3e7':'#d4eef4'}/></mesh>)}
      <mesh position={[0,0.34,1.85]}><boxGeometry args={[1.1,.10,.07]}/><meshStandardMaterial color="#364c57" metalness={0.44}/></mesh>
      {selected&&<mesh position={[0,2.00,0]}><sphereGeometry args={[0.13,12,10]}/><meshBasicMaterial color="#98f0d1"/></mesh>}
    </group>
  );
}

function Tree({x,z}:{x:number;z:number}){
  return <group position={[x,0,z]}><mesh position={[0,.44,0]}><cylinderGeometry args={[.065,.09,.88,8]}/><meshStandardMaterial color="#5d635c"/></mesh>
    <mesh position={[0,1.12,0]}><icosahedronGeometry args={[.53,1]}/><meshStandardMaterial color="#427a73" roughness={.84}/></mesh></group>;
}

function NetworkPulse({ running }: { running: boolean }) {
  const group=useRef<THREE.Group>(null);
  const t=useRef(0);
  const path=useMemo(()=>new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-2.5,0.9,-0.65), new THREE.Vector3(-0.35,4.0,-1.6),new THREE.Vector3(3.75,2.5,-1.6)),[]);
  const tube=useMemo(()=>new THREE.TubeGeometry(path,36,0.018,6,false),[path]);
  useEffect(()=>()=>tube.dispose(),[tube]);
  useFrame((_,delta)=>{if(!running||!group.current)return;t.current=(t.current+Math.min(delta,.05)*.21)%1;
    const p=path.getPointAt(t.current);group.current.position.copy(p);group.current.scale.setScalar(Math.max(.05,Math.sin(Math.PI*t.current)));
  });
  return (
    <group>
      <mesh geometry={tube}><meshBasicMaterial color="#89d3e3" transparent opacity={.5} depthWrite={false}/></mesh>
      <group ref={group} position={path.getPointAt(0)}>
        <mesh><sphereGeometry args={[0.14,12,10]}/><meshBasicMaterial color="#adf4de"/></mesh>
      </group>
    </group>
  );
}

function CloudHub(){
  return (
    <group position={[3.95,0,-1.67]}>
      <mesh position={[0,0.2,0]}><cylinderGeometry args={[1.14,1.24,0.36,32]}/><meshStandardMaterial color="#304e64" metalness={.53} roughness={.38}/></mesh>
      {[0,.7,1.4].map((y)=><group key={y} position={[0,.76+y,0]}>
        <mesh><boxGeometry args={[1.32,.64,.78]}/><meshStandardMaterial color="#394b5a" metalness={.62} roughness={.3}/></mesh>
        <mesh position={[0,0,.402]}><boxGeometry args={[1.11,.47,.02]}/><meshStandardMaterial color="#132430" metalness={.22}/></mesh>
        {[-.40,-.18,.04,.26].map((x)=><mesh key={x} position={[x,0,.423]}><boxGeometry args={[.09,.07,.02]}/><meshBasicMaterial color="#83ddbe"/></mesh>)}
      </group>)}
      <mesh position={[0,3.0,0]}><torusGeometry args={[.75,.022,6,56]}/><meshBasicMaterial color="#9de1e7" transparent opacity={.55}/></mesh>
    </group>
  );
}

function Fleet({ selectedBus, running }: {selectedBus:number;running:boolean}){
  return (
    <group>
      <Floor width={11.4} depth={7.6}/>
      <mesh position={[-.4,.016,0]}><boxGeometry args={[9.8,.025,5.35]}/><meshStandardMaterial color="#2f4857" roughness={.84}/></mesh>
      <mesh position={[-.4,.035,0]}><boxGeometry args={[6.9,.02,3.56]}/><meshStandardMaterial color="#213644" roughness={.83}/></mesh>
      {[0,1,2,3,4,5,6,7].map(i=><BusModel key={i} index={i} selected={i===selectedBus} running={running}/>)}
      {[-4.5,-3.9,3.4].map((x,i)=><Tree key={x} x={x} z={i===2?2.9:-2.75}/>)}
      {[-4.9,4.75].map(x=><group key={x} position={[x,0,1.4]}>
        <mesh position={[0,.85,0]}><boxGeometry args={[.7,1.7,.9]}/><meshStandardMaterial color="#527180" metalness={.18} roughness={.72}/></mesh>
        <mesh position={[0,1.12,.47]}><boxGeometry args={[.4,.65,.03]}/><meshBasicMaterial color="#82abba"/></mesh>
      </group>)}
      <CloudHub/>
      <NetworkPulse running={running}/>
    </group>
  );
}

export default function Engineering3DScene({mode,stage,running,selectedBus}:SceneProps){
  return (
    <Canvas
      className="lab-physical-canvas"
      orthographic
      camera={{
        position:mode==='cloud'?[8.9,7.5,11.8]:[6.3,4.6,8.7],
        zoom:mode==='cloud'?41:52,
        near:0.1,
        far:75
      }}
      dpr={[1,1.4]}
      frameloop={running?'always':'demand'}
      gl={{alpha:false,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:false}}
      aria-label={mode==='scan'?'Reconstitution tridimensionnelle du scan EPI':mode==='cloud'?'Flotte de bus 3D et serveur OpenVPN sur AWS':'Atelier industriel et détection par caméra'}>
      <color attach="background" args={['#111f2b']}/>
      <fog attach="fog" args={['#111f2b',17,35]}/>
      <ambientLight intensity={1.5}/>
      <hemisphereLight args={['#dcf1ff','#253b48',2.2]}/>
      <directionalLight color="#f6f0dd" position={[5,10,7]} intensity={3.4}/>
      <pointLight position={[-5,5,0]} color="#67b4d8" intensity={30} distance={13} decay={2}/>
      {mode==='scan'&&<Station stage={stage} running={running}/>}
      {mode==='vision'&&<Workshop stage={stage} running={running}/>}
      {mode==='cloud'&&<Fleet selectedBus={selectedBus} running={running}/>}
    </Canvas>
  );
}
