'use client';

import dynamic from 'next/dynamic';
import { useState, type ReactNode } from 'react';
import type { PhysicalScene } from './Engineering3DScene';

const Scene3D = dynamic(() => import('./Engineering3DScene'), {
  ssr: false,
  loading: () => <div className="lab-3d-loading" aria-hidden="true">Préparation de la scène 3D…</div>,
});

type Props = {
  mode: PhysicalScene;
  stage: number;
  running: boolean;
  selectedBus: number;
  fallback: ReactNode;
};

const spec = {
  scan: {
    label: 'COLAS · STATION EPI',
    chip: 'AFFICHAGE · TV',
    metric: '≈ 2–3 → 10 FPS',
    explanation: 'Cadence d’affichage (ancienne TV → Chromium/Weston sur Jetson), pas FPS d’inférence.',
    stages: ['Positionnement', 'Acquisition', 'Validation', 'Restitution'],
  },
  cloud: {
    label: 'MEDIASPOT · RÉSEAU CONNECTÉ',
    chip: 'FLOTTE · 70 BUS',
    metric: '70 PC retirés',
    explanation: 'Wi-Fi passagers ≠ connexion cellulaire ≠ tunnel OpenVPN vers EC2.',
    stages: ['Teltonika RUTX11', 'OpenVPN · serveur EC2', 'API / services AWS', 'Portail / reporting'],
  },
  vision: {
    label: 'SECURISPOT · VISION EDGE',
    chip: 'TRAITEMENT SUR JETSON',
    metric: '≈ 5 → 30 FPS',
    explanation: 'Débit du pipeline de traitement vidéo observé sur le terrain, pas cadence d’affichage.',
    stages: ['Acquisition RealSense', 'YOLO / TensorRT', 'Suivi des objets', 'Règle temporelle', 'Alerte terrain'],
  },
};

export default function EngineeringStory3D({ mode, stage, running, selectedBus, fallback }: Props) {
  const [supported] = useState(() => {
    // This component only mounts after the client-side viewport/WebGL gate.
    // Resolve support once instead of creating a second render through an effect.
    if (typeof document === 'undefined') return false;
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl');
      const available = Boolean(gl);
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      return available;
    } catch {
      return false;
    }
  });
  if (!supported) {
    return <div className="lab-3d-unsupported" role="group" data-renderer="2d" aria-label="Illustration de secours">{fallback}</div>;
  }

  const item = spec[mode];
  return (
    <section className={'lab-three-story lab-three-story--' + mode} data-three-scene={mode}
      aria-label={item.label}>
      <div className="lab-three-stage">
        <Scene3D mode={mode} stage={stage} running={running} selectedBus={selectedBus} />
        <div className="lab-three-topbar" aria-hidden="true">
          <span><i className="lab-online-dot" /> {item.label}</span>
          <span>RECONSTITUTION 3D · HORS LIGNE</span>
        </div>
        <div className="lab-three-metric">
          <span>{item.chip}</span>
          <strong>{item.metric}</strong>
        </div>
        <div className="lab-three-stage-note">
          <span>ÉTAPE {String(stage+1).padStart(2,'0')} / {String(item.stages.length).padStart(2,'0')}</span>
          <strong>{item.stages[stage]}</strong>
        </div>
        <div className="lab-three-floor-glow" aria-hidden="true" />
      </div>
      {mode==='cloud'&&(
        <div className="lab-three-flow" role="group" aria-label="Architecture réseau illustrée">
          <span>PASSAGER<br/><b>Wi-Fi local</b></span><i aria-hidden="true">›</i>
          <span>BUS<br/><b>RUTX11 + cellulaire</b></span><i aria-hidden="true">›</i>
          <span>VPN<br/><b>OpenVPN sur EC2</b></span><i aria-hidden="true">›</i>
          <span>AWS<br/><b>Services applicatifs</b></span>
        </div>
      )}
      {mode==='scan'&&(
        <div className="lab-three-flow" role="group" aria-label="Architecture vidéo et affichage">
          <span>CAPTURE<br/><b>Caméra / Jetson</b></span><i aria-hidden="true">›</i>
          <span>VIDÉO<br/><b>GStreamer · WebRTC</b></span><i aria-hidden="true">›</i>
          <span>INTERFACE<br/><b>React / Chromium</b></span><i aria-hidden="true">›</i>
          <span>ÉCRAN<br/><b>Sortie HDMI</b></span>
        </div>
      )}
      {mode==='vision'&&(
        <div className="lab-three-flow" role="group" aria-label="Pipeline de vision embarquée">
          <span>CAPTURE<br/><b>RealSense</b></span><i aria-hidden="true">›</i>
          <span>INFÉRENCE<br/><b>YOLO / TensorRT</b></span><i aria-hidden="true">›</i>
          <span>RÈGLES<br/><b>Suivi + FIFO</b></span><i aria-hidden="true">›</i>
          <span>ACTION<br/><b>Alerte si confirmée</b></span>
        </div>
      )}
      <p className="lab-three-footnote">{item.explanation} Animation illustrative non mesurée et sans connexion aux équipements.</p>
    </section>
  );
}
