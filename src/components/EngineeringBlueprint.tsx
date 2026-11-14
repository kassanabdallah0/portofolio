'use client';

import { useId, type CSSProperties, type RefObject } from 'react';
import type { DemoType } from '@/data/simulations';
import EngineeringStory3D from './EngineeringStory3D';
import Manager from './engineering/scenes/ManagerScene';
import Delivery, {
  JetsonIllustration,
} from './engineering/scenes/DeliveryScene';
import Observability from './engineering/scenes/ObservabilityScene';
import VisionFallback from './engineering/vision/VisionFallback';

type Props = {
  type: DemoType;
  visionScenario?: import('./engineering/vision/visionTimeline').VisionScenario;
  onVisionScenarioChange?: (
    scenario: import('./engineering/vision/visionTimeline').VisionScenario,
  ) => void;
  stage: number;
  running: boolean;
  sensitivity: number;
  applied: number;
  selectedBus: number;
  rollback: boolean;
  restored: boolean;
  cycle: number;
  pending: boolean;
  active3D: boolean;
  time: RefObject<number>;
  onZoneChange: (value: number) => void;
  onSelectBus: (value: number) => void;
  onReplay: () => void;
};

const steps: Record<DemoType, string[]> = {
  vision: ['Caméra', 'YOLO · TRT', 'Suivi', 'FIFO · règles', 'Alerte'],
  interface: ['React', 'REST', 'Flask', 'Jetson', 'Accusé'],
  cloud: ['Routeur', 'VPN', 'Services AWS', 'Portail · rapports'],
  delivery: [
    'Tag Git',
    'Tests · Registry',
    'Contrôle Jetson',
    'Activation',
    'Santé / repli',
  ],
  scan: ['Stabiliser', 'Acquérir', 'Valider', 'Afficher'],
  observability: ['Journaux', 'Logstash', 'Cluster ES', 'Kibana'],
};

function Worker({
  x,
  y,
  accent = '#b7d7e4',
}: {
  x: number;
  y: number;
  accent?: string;
}) {
  return (
    <g transform={'translate(' + x + ' ' + y + ')'}>
      <ellipse cx="0" cy="5" rx="16" ry="5" fill="#070d14" opacity=".32" />
      <path
        d="M-6 -23L-10 0M6 -23L10 0"
        stroke="#213342"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M-13 -54L13 -54L17 -24L-17 -24Z"
        fill="#e4b869"
        stroke="#f5d99b"
        strokeWidth="1"
      />
      <path
        d="M-7 -50V-31M7 -50V-31"
        stroke="#f8f4d5"
        strokeWidth="4"
        opacity=".85"
      />
      <path
        d="M-15 -49L-21 -29M15 -49L21 -29"
        stroke="#b1bfc9"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect x="-8" y="-72" width="16" height="17" rx="7" fill="#d7a987" />
      <path d="M-12 -70Q0 -86 12 -70Z" fill={accent} />
      <path
        d="M-15 -70H15"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

function IndustrialView({
  stage,
  running,
  scan = false,
}: {
  stage: number;
  running: boolean;
  scan?: boolean;
}) {
  const sceneId = useId().replace(/:/g, '');
  const floorId = sceneId + '-floor';
  const wallId = sceneId + '-wall';
  return (
    <div
      className={'lab-camera-view ' + (scan ? 'lab-camera-view--scan' : '')}
      data-motion={running ? 'running' : 'paused'}
    >
      <div className="lab-camera-toolbar">
        <span>
          <i className="lab-online-dot" /> CAM-01 / ATELIER A
        </span>
        <span>
          1280 × 720 <b>·</b> FLUX SYNTHÉTIQUE
        </span>
      </div>
      <svg
        viewBox="0 0 640 315"
        className="lab-industrial-svg"
        role="img"
        aria-label={
          scan
            ? 'Scène de scan EPI illustrative, avec zone de positionnement'
            : 'Atelier industriel synthétique, personne suivie et zone de sécurité'
        }
      >
        <defs>
          <linearGradient id={floorId} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#2d4554" />
            <stop offset="1" stopColor="#111d28" />
          </linearGradient>
          <linearGradient id={wallId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#3a5261" />
            <stop offset="1" stopColor="#192b39" />
          </linearGradient>
        </defs>
        <rect width="640" height="315" fill={'url(#' + wallId + ')'} />
        <path d="M0 170L640 170V315H0Z" fill={'url(#' + floorId + ')'} />
        <g stroke="#688393" strokeWidth="1" opacity=".24">
          <path d="M0 210H640M0 260H640M0 308H640M320 170L0 315M320 170L140 315M320 170L320 315M320 170L500 315M320 170L640 315" />
          <path d="M0 37H640M0 93H640" />
        </g>
        <g fill="#233745" stroke="#7592a3" strokeWidth="2" opacity=".85">
          <path d="M40 57H220V182H40Z" />
          <path d="M425 43H613V180H425Z" />
          <path
            d="M51 70H209V95H51ZM51 106H209V131H51ZM51 143H209V169H51Z"
            fill="#405765"
          />
          <path d="M435 59H602V92H435ZM435 108H602V161H435Z" fill="#435d6b" />
          <path d="M251 15H263V168H251ZM377 15H389V168H377Z" fill="#708693" />
        </g>
        <path d="M0 170H640" stroke="#a3b7be" strokeWidth="3" opacity=".45" />
        <g stroke="#f4c376" strokeWidth="4" opacity=".55">
          <path d="M94 292L165 216M515 293L456 218" />
        </g>
        <path
          d={
            scan
              ? 'M197 265L290 194L369 194L453 265Z'
              : 'M227 283L277 199L445 199L504 283Z'
          }
          fill={scan ? '#82c0dc19' : '#e7b7631d'}
          stroke={scan ? '#8dd7f5' : '#ffca81'}
          strokeWidth="2"
          strokeDasharray="8 7"
        />
        <g
          data-person="true"
          className={scan ? 'lab-worker-static' : 'lab-worker-track'}
        >
          <Worker x={scan ? 322 : 329} y={scan ? 250 : 258} />
          <rect
            x={scan ? 292 : 300}
            y={scan ? 145 : 154}
            width="60"
            height="113"
            fill="none"
            stroke={stage >= 1 ? '#91e8d4' : '#9cd7f0'}
            strokeWidth="2"
            rx="4"
          />
          <path
            d={
              scan
                ? 'M292 156H304M340 156H352M292 246H304M340 246H352'
                : 'M300 166H312M348 166H360M300 247H312M348 247H360'
            }
            fill="none"
            stroke="#b5eaf6"
            strokeWidth="3"
          />
          <rect
            x={scan ? 292 : 300}
            y={scan ? 130 : 139}
            width="100"
            height="17"
            rx="3"
            fill="#91d9f1"
          />
          <text
            x={scan ? 298 : 306}
            y={scan ? 142 : 151}
            fill="#0d2936"
            fontSize="10"
            fontWeight="bold"
          >
            PERSONNE · ID 01
          </text>
        </g>
        <path
          className="lab-scanline"
          d="M220 180H490"
          stroke="#8ee2ed"
          strokeWidth="2"
          opacity=".65"
        />
        <g fontSize="11" fontFamily="monospace" fill="#b7d3dd">
          <text x="15" y="25">
            REALSENSE / VISION EDGE
          </text>
          <text x="15" y="303">
            ZONE {scan ? 'DE SCAN EPI' : 'SURVEILLÉE'} · EXEMPLE
          </text>
          <text x="526" y="25">
            ● {stage >= (scan ? 3 : 4) ? 'VALIDÉ' : 'ANALYSE'}
          </text>
        </g>
      </svg>
      <div
        className={
          'lab-camera-event ' + (stage >= (scan ? 3 : 4) ? 'is-alert' : '')
        }
      >
        <span>
          {stage >= (scan ? 3 : 4)
            ? scan
              ? 'RÉSULTAT PRÉSENTÉ'
              : 'RÈGLE CONFIRMÉE'
            : 'OBSERVATION EN COURS'}
        </span>
        <span>{scan ? 'PARCOURS ILLUSTRATIF' : 'TRACK #01'}</span>
      </div>
    </div>
  );
}

function Vision(props: Props) {
  return <VisionFallback {...props} />;
}

function TopologyNode({
  label,
  detail,
  active = false,
  emphasized = false,
}: {
  label: string;
  detail: string;
  active?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div
      className={
        'lab-topo-node ' +
        (active ? 'is-active ' : '') +
        (emphasized ? 'is-emphasized' : '')
      }
    >
      <span className="lab-topo-icon" aria-hidden="true">
        {emphasized ? '▥' : '◇'}
      </span>
      <strong>{label}</strong>
      <small>{detail}</small>
    </div>
  );
}

function Connector({ active = true }: { active?: boolean }) {
  return (
    <span
      className={'lab-connector ' + (active ? 'is-flowing' : '')}
      aria-hidden="true"
    >
      <i />
    </span>
  );
}

function Cloud({ selectedBus, stage }: Props) {
  return (
    <div className="lab-cloud-layout">
      <div className="lab-cloud-fleet">
        <div className="lab-panel-title">
          <span>FLOTTE CONNECTÉE</span>
          <b>70 BUS</b>
        </div>
        <div className="lab-fleet-icons">
          {['A', 'B', 'C'].map((b, i) => (
            <div
              key={b}
              className={
                'lab-bus-tile ' + (selectedBus === i ? 'is-selected' : '')
              }
            >
              <span className="lab-bus-roof">
                <i />
                <i />
                <i />
              </span>
              <small>BUS {b}</small>
            </div>
          ))}
        </div>
        <div className="lab-router-card">
          <span>ÉQUIPEMENT EMBARQUÉ</span>
          <strong>Teltonika RUTX11</strong>
          <small>Routeur réseau · certificat VPN</small>
        </div>
        <p>
          Le routeur reste dans le véhicule ; le PC embarqué historique est
          supprimé.
        </p>
      </div>
      <div className="lab-cloud-network">
        <div className="lab-cloud-boundary">
          <span className="lab-cloud-caption">
            ☁ AWS / SERVICES CENTRALISÉS
          </span>
          <div className="lab-topology-row">
            <TopologyNode
              label="OpenVPN"
              detail="EC2 · tunnel certifié"
              active={stage >= 1}
            />
            <span className="lab-network-separator">chemins distincts</span>
            <TopologyNode
              label="API"
              detail="API Gateway · Node.js · Lambda"
              active={stage >= 2}
            />
          </div>
          <div className="lab-topology-row lab-topology-row--services">
            <TopologyNode
              label="S3"
              detail="Contenus / PDF"
              active={stage >= 2}
            />
            <TopologyNode
              label="CloudWatch"
              detail="Journaux"
              active={stage >= 2}
            />
            <TopologyNode
              label="Reporting"
              detail="EventBridge · SES"
              active={stage >= 3}
            />
          </div>
          <div className="lab-cloud-security">
            VPC · IAM · Security Groups <span>TRANSPORT SÉCURISÉ</span>
          </div>
        </div>
        <div className="lab-cloud-route">
          <i /> BUS {String.fromCharCode(65 + selectedBus)} · gestion : OpenVPN
          / EC2 · application : API / contenus
        </div>
      </div>
    </div>
  );
}

function Scan({ stage, running }: Props) {
  const captions = ['POSITIONNEMENT', 'ACQUISITION', 'VALIDATION', 'RÉSULTAT'];
  return (
    <div className="lab-scan-layout">
      <div className="lab-kiosk">
        <div className="lab-kiosk-bezel">
          <div className="lab-kiosk-header">
            <span>COLAS · SCAN EPI</span>
            <span>SCÉNARIO RECONSTITUÉ</span>
          </div>
          <div className="lab-kiosk-display">
            <IndustrialView stage={stage} running={running} scan />
            <span className="lab-kiosk-step">
              {String(stage + 1).padStart(2, '0')} / 04 · {captions[stage]}
            </span>
          </div>
        </div>
        <div className="lab-kiosk-stand" />
      </div>
      <div className="lab-scan-system">
        <div className="lab-panel-title">
          <span>ARCHITECTURE D’AFFICHAGE</span>
          <b>JETSON → HDMI</b>
        </div>
        <div className="lab-scan-route">
          <TopologyNode
            label="Jetson"
            detail="Calcul + backend"
            active={stage >= 0}
          />
          <Connector />
          <TopologyNode
            label="Chromium"
            detail="React · Weston"
            active={stage >= 1}
          />
          <Connector />
          <TopologyNode label="TV" detail="Sortie HDMI" active={stage >= 2} />
        </div>
        <div className="lab-scan-stream">
          <span>VIDÉO LOCALE</span>
          <strong>GStreamer / WebRTC</strong>
          <small>Logique d’état gérée côté backend</small>
        </div>
        <p>
          L’architecture d’affichage a été déplacée de la TV vers le Jetson. Le
          modèle de détection IA était réalisé par un collègue.
        </p>
      </div>
    </div>
  );
}

const label: Record<DemoType, string> = {
  vision: 'VISION INDUSTRIELLE / PIPELINE IA',
  interface: 'APPLICATION MÉTIER / CONFIGURATION',
  cloud: 'FLOTTE CONNECTÉE / ARCHITECTURE AWS',
  delivery: 'DEVOPS / FIABILITÉ DES RELEASES',
  scan: 'INTERFACE INDUSTRIELLE / AFFICHAGE',
  observability: 'OBSERVABILITÉ / SÉCURITÉ',
};

export default function EngineeringBlueprint(props: Props) {
  const { type, stage, running } = props;
  const rootStyle = {
    '--lab-progress': ((stage + 1) / steps[type].length) * 100 + '%',
  } as CSSProperties;
  const physical =
    (type === 'scan' || type === 'vision' || type === 'cloud') &&
    props.active3D;
  return (
    <div
      className={'lab-blueprint lab-blueprint--' + type}
      data-lab={type}
      data-motion={running ? 'running' : 'paused'}
      data-step={stage}
      style={rootStyle}
    >
      {!physical && (
        <div className="lab-blueprint-heading">
          <span>
            <i className="lab-online-dot" /> {label[type]}
          </span>
          <span>ÉTUDE DE CAS · RECONSTITUTION</span>
        </div>
      )}
      <div className="lab-blueprint-content">
        {physical && (
          <EngineeringStory3D
            mode={type as 'vision' | 'scan' | 'cloud'}
            stage={stage}
            visionScenario={props.visionScenario}
            onVisionScenarioChange={props.onVisionScenarioChange}
            running={running}
            selectedBus={props.selectedBus}
            time={props.time}
            view="physical"
            onSelectBus={props.onSelectBus}
            onReplay={props.onReplay}
            fallback={
              type === 'vision' ? (
                <Vision {...props} />
              ) : type === 'scan' ? (
                <Scan {...props} />
              ) : (
                <Cloud {...props} />
              )
            }
          />
        )}
        {!physical && type === 'vision' && <Vision {...props} />}
        {type === 'interface' && <Manager {...props} />}
        {!physical && type === 'cloud' && <Cloud {...props} />}
        {type === 'delivery' && (
          <Delivery
            {...props}
            hardware={
              props.active3D ? (
                <EngineeringStory3D
                  mode="delivery"
                  stage={stage}
                  running={running}
                  selectedBus={0}
                  time={props.time}
                  view="physical"
                  fallback={<JetsonIllustration state="stable" />}
                />
              ) : undefined
            }
          />
        )}
        {!physical && type === 'scan' && <Scan {...props} />}
        {type === 'observability' && <Observability {...props} />}
      </div>
    </div>
  );
}
