'use client';
import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { Boxes, Camera, Cpu, Gauge, RotateCcw } from 'lucide-react';
import type {
  PhysicalScene,
  SceneProps,
  SceneView,
} from './engineering/core/types';
import { FleetOverlay } from './engineering/overlays/FleetOverlay';
import VisionExperience from './engineering/vision/VisionExperience';
const Scene3D = dynamic(() => import('./Engineering3DScene'), {
  ssr: false,
  loading: () => (
    <div className="lab-3d-loading">Préparation de la scène 3D…</div>
  ),
});
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
const spec = {
  scan: {
    label: 'COLAS · STATION EPI',
    chip: 'AFFICHAGE · TV',
    metric: '≈ 2–3 → 10 FPS',
    explanation:
      'Cadence d’affichage, pas FPS d’inférence. 15–20 FPS observés en essais ; réglage final ≈ 10. Détecteur IA développé par un collègue.',
    stages: ['Positionnement', 'Acquisition', 'Validation', 'Résultat'],
  },
  cloud: {
    label: 'MEDIASPOT · FLOTTE CONNECTÉE',
    chip: 'DÉPLOIEMENT · 70 BUS',
    metric: '70 PC retirés',
    explanation:
      'Flotte représentative. Wi-Fi local, RUTX11 + cellulaire et OpenVPN sur EC2 : des rôles distincts. Scénarios illustratifs, sans télémétrie en direct.',
    stages: [
      'Wi-Fi local / cellulaire',
      'OpenVPN · certificat / EC2',
      'API / contenus',
      'Supervision / reporting',
    ],
  },
  vision: {
    label: 'SECURISPOT · ATELIER INSTRUMENTÉ',
    chip: 'TRAITEMENT SUR JETSON',
    metric: '≈ 5 → 30 FPS',
    explanation:
      'Débit de traitement observé sur le terrain, pas cadence d’affichage. Comparaison illustrative, sans benchmark du navigateur.',
    stages: [
      'Observation',
      'Détection',
      'Suivi',
      'Confirmation temporelle',
      'Alerte confirmée',
    ],
  },
  delivery: {
    label: 'JETSON · RELEASE CONTRÔLÉE',
    chip: 'ACTIVATION LOCALE',
    metric: 'Versionnée',
    explanation:
      'Reconstitution technique du calculateur, pas un modèle CAO constructeur.',
    stages: ['Tag', 'CI', 'Validation', 'Activation', 'Santé'],
  },
};
function Architecture({ mode, stage }: { mode: PhysicalScene; stage: number }) {
  const scan = mode === 'scan';
  const nodes = scan
    ? [
        'Caméra',
        'Jetson / backend',
        'GStreamer · WebRTC',
        'React · Chromium / Weston',
        'HDMI → TV',
      ]
    : [
        'RealSense',
        'OpenCV',
        'YOLO / TensorRT',
        'Suivi · métadonnées',
        'FIFO · règle temporelle',
        'Alerte',
      ];
  return (
    <div
      role="group"
      className="eng-architecture-panel"
      aria-label={
        scan
          ? 'Architecture vidéo et affichage'
          : 'Pipeline de vision embarquée'
      }
    >
      <span className="eng-panel-kicker">
        {scan
          ? 'CAPTURE → VIDÉO LOCALE → AFFICHAGE'
          : 'IMAGES → INFÉRENCE → MÉTADONNÉES → DÉCISION'}
      </span>
      <ol>
        {nodes.map((text, i) => (
          <li key={text} className={i <= stage + 1 ? 'is-lit' : ''}>
            <i aria-hidden="true" />
            {text}
          </li>
        ))}
      </ol>
      <p>
        {scan
          ? 'Le backend pilote le scan. WebRTC transporte la vidéo vers React ; HDMI transporte la sortie écran du Jetson vers la TV.'
          : 'Les images restent dans le pipeline de vision. Le suivi échange identifiants et boîtes ; plusieurs observations confirment la règle.'}
      </p>
    </div>
  );
}
function Comparison({
  mode,
  time,
  running,
}: Pick<SceneProps, 'time' | 'running'> & { mode: PhysicalScene }) {
  const markers = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id = 0;
    const draw = () => {
      const rates = mode === 'scan' ? [2.5, 10] : [5, 30];
      markers.current
        ?.querySelectorAll<HTMLElement>('[data-sample]')
        .forEach((e, i) => {
          const t = Math.floor(time.current * rates[i]) / rates[i];
          e.style.transform = `translateX(${((Math.sin(t * 1.4) + 1) / 2) * 130}px)`;
          e.dataset.sample = String(Math.floor(time.current * rates[i]));
        });
      if (running) id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [mode, time, running]);
  return (
    <div className="eng-comparison" ref={markers}>
      <span className="eng-panel-kicker">
        COMPARAISON ILLUSTRATIVE ·{' '}
        {mode === 'scan' ? 'AFFICHAGE' : 'TRAITEMENT'}
      </span>
      {(mode === 'scan'
        ? [
            ['Navigateur TV', '≈ 2–3 FPS'],
            ['Jetson → HDMI', '≈ 10 FPS'],
          ]
        : [
            ['Pipeline initial', '≈ 5 FPS'],
            ['Pipeline optimisé', '≈ 30 FPS'],
          ]
      ).map(([title, rate]) => (
        <div className="eng-rate" key={title}>
          <span>
            {title}
            <b>{rate}</b>
          </span>
          <div>
            <i data-sample="0" />
          </div>
        </div>
      ))}
      <small>
        {mode === 'scan'
          ? '15–20 FPS en essais. Cadence finale configurée à 10 FPS.'
          : 'Échantillonnage relatif du pipeline, sans mesure du rendu WebGL.'}
      </small>
    </div>
  );
}
export default function EngineeringStory3D({
  mode,
  fallback,
  onReplay,
  ...props
}: SceneProps & {
  mode: PhysicalScene;
  fallback: ReactNode;
  onReplay?: () => void;
}) {
  const [view, setView] = useState<SceneView>('physical');
  const [support] = useState(() => {
    if (typeof document === 'undefined')
      return { available: false, software: false };
    try {
      const probe = document.createElement('canvas'),
        gl = probe.getContext('webgl2');
      const info = gl?.getExtension('WEBGL_debug_renderer_info');
      const renderer =
        gl && info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
      const result = {
        available: Boolean(gl),
        software: /swiftshader|llvmpipe|softpipe|software/i.test(renderer),
      };
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      return result;
    } catch {
      return { available: false, software: false };
    }
  });
  const fallbackView = (
    <div
      className="lab-3d-unsupported"
      role="group"
      data-renderer="2d"
      aria-label="Illustration de secours"
    >
      {fallback}
    </div>
  );
  if (!support.available) return fallbackView;
  if (mode === 'vision')
    return (
      <SceneBoundary fallback={fallbackView}>
        <VisionExperience
          {...props}
          lowPower={support.software}
          fallback={fallback}
          onReplay={onReplay}
        />
      </SceneBoundary>
    );
  const item = spec[mode];
  return (
    <SceneBoundary fallback={fallbackView}>
      <section
        className={'lab-three-story lab-three-story--' + mode}
        data-three-scene={mode}
        data-view={view}
        aria-label={item.label}
      >
        <div className="eng-scene-toolbar">
          <span>{item.label}</span>
          <div role="group" aria-label="Perspectives de la démonstration">
            {(
              [
                { id: 'physical', label: 'Scène', icon: Camera },
                { id: 'detail', label: 'Équipement', icon: Cpu },
                ...(mode !== 'delivery'
                  ? [{ id: 'architecture', label: 'Architecture', icon: Boxes }]
                  : []),
                ...(mode === 'scan'
                  ? [{ id: 'comparison', label: 'Comparer', icon: Gauge }]
                  : []),
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                aria-pressed={view === id}
                onClick={() => setView(id as SceneView)}
              >
                <Icon size={13} />
                <span>{label}</span>
              </button>
            ))}
            {onReplay && (
              <button
                type="button"
                aria-label="Rejouer le scénario"
                onClick={onReplay}
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>
        <div className="lab-three-stage">
          <Scene3D
            {...props}
            mode={mode}
            view={view}
            onSelectBus={(index) => {
              props.onSelectBus?.(index);
              setView('detail');
            }}
          />
          <div className="eng-scene-badge">
            <span>{item.chip}</span>
            <strong>{item.metric}</strong>
          </div>
          {mode === 'cloud' && (
            <FleetOverlay
              stage={props.stage}
              selectedBus={props.selectedBus}
              view={view === 'comparison' ? 'physical' : view}
            />
          )}
          {view === 'architecture' && mode !== 'cloud' && (
            <Architecture mode={mode} stage={props.stage} />
          )}
          {view === 'comparison' && (
            <Comparison mode={mode} time={props.time} running={props.running} />
          )}
          <div className="eng-scene-caption">
            <i aria-hidden="true" />
            <span>{item.stages[props.stage]}</span>
            <small>RECONSTITUTION · HORS LIGNE</small>
          </div>
        </div>
        <p className="lab-three-footnote">{item.explanation}</p>
      </section>
    </SceneBoundary>
  );
}
