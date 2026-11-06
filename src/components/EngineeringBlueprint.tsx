'use client';

import { useId, type CSSProperties } from 'react';
import type { DemoType } from '@/data/simulations';

type Props = {
  type: DemoType;
  stage: number;
  running: boolean;
  sensitivity: number;
  applied: number;
  selectedBus: number;
  rollback: boolean;
  restored: boolean;
  pending: boolean;
};

const steps: Record<DemoType, string[]> = {
  vision: ['Caméra', 'YOLO · TRT', 'Suivi', 'FIFO · règles', 'Alerte'],
  interface: ['React', 'REST', 'Flask', 'Jetson', 'Accusé'],
  cloud: ['Routeur', 'VPN', 'Services AWS', 'Portail · rapports'],
  delivery: ['Tag Git', 'Tests · Registry', 'Contrôle Jetson', 'Activation', 'Santé / repli'],
  scan: ['Stabiliser', 'Acquérir', 'Valider', 'Afficher'],
  observability: ['Journaux', 'Logstash', 'Cluster ES', 'Kibana'],
};

function SignalPath({ type, stage }: { type: DemoType; stage: number }) {
  return (
    <div className="lab-signal" aria-label="Étapes du système">
      {steps[type].map((label, index) => (
        <div key={label} className={'lab-signal-step ' + (index === stage ? 'is-current' : index < stage ? 'is-complete' : '')}>
          <span className="lab-signal-index">{String(index + 1).padStart(2, '0')}</span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Worker({ x, y, accent = '#b7d7e4' }: { x: number; y: number; accent?: string }) {
  return (
    <g transform={'translate(' + x + ' ' + y + ')'}>
      <ellipse cx="0" cy="5" rx="16" ry="5" fill="#070d14" opacity=".32" />
      <path d="M-6 -23L-10 0M6 -23L10 0" stroke="#213342" strokeWidth="7" strokeLinecap="round" />
      <path d="M-13 -54L13 -54L17 -24L-17 -24Z" fill="#e4b869" stroke="#f5d99b" strokeWidth="1" />
      <path d="M-7 -50V-31M7 -50V-31" stroke="#f8f4d5" strokeWidth="4" opacity=".85" />
      <path d="M-15 -49L-21 -29M15 -49L21 -29" stroke="#b1bfc9" strokeWidth="6" strokeLinecap="round" />
      <rect x="-8" y="-72" width="16" height="17" rx="7" fill="#d7a987" />
      <path d="M-12 -70Q0 -86 12 -70Z" fill={accent} />
      <path d="M-15 -70H15" stroke={accent} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

function IndustrialView({ stage, running, scan = false }: { stage: number; running: boolean; scan?: boolean }) {
  const sceneId = useId().replace(/:/g, '');
  const floorId = sceneId + '-floor';
  const wallId = sceneId + '-wall';
  return (
    <div className={'lab-camera-view ' + (scan ? 'lab-camera-view--scan' : '')} data-motion={running ? 'running' : 'paused'}>
      <div className="lab-camera-toolbar">
        <span><i className="lab-online-dot" /> CAM-01 / ATELIER A</span>
        <span>1280 × 720 <b>·</b> FLUX SYNTHÉTIQUE</span>
      </div>
      <svg viewBox="0 0 640 315" className="lab-industrial-svg" role="img"
        aria-label={scan ? 'Scène de scan EPI illustrative, avec zone de positionnement' : 'Atelier industriel synthétique, personne suivie et zone de sécurité'}>
        <defs>
          <linearGradient id={floorId} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#2d4554" />
            <stop offset="1" stopColor="#111d28" />
          </linearGradient>
          <linearGradient id={wallId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#3a5261" /><stop offset="1" stopColor="#192b39" />
          </linearGradient>
        </defs>
        <rect width="640" height="315" fill={'url(#' + wallId + ')'} />
        <path d="M0 170L640 170V315H0Z" fill={'url(#' + floorId + ')'} />
        <g stroke="#688393" strokeWidth="1" opacity=".24">
          <path d="M0 210H640M0 260H640M0 308H640M320 170L0 315M320 170L140 315M320 170L320 315M320 170L500 315M320 170L640 315" />
          <path d="M0 37H640M0 93H640" />
        </g>
        <g fill="#233745" stroke="#7592a3" strokeWidth="2" opacity=".85">
          <path d="M40 57H220V182H40Z" /><path d="M425 43H613V180H425Z" />
          <path d="M51 70H209V95H51ZM51 106H209V131H51ZM51 143H209V169H51Z" fill="#405765" />
          <path d="M435 59H602V92H435ZM435 108H602V161H435Z" fill="#435d6b" />
          <path d="M251 15H263V168H251ZM377 15H389V168H377Z" fill="#708693" />
        </g>
        <path d="M0 170H640" stroke="#a3b7be" strokeWidth="3" opacity=".45" />
        <g stroke="#f4c376" strokeWidth="4" opacity=".55"><path d="M94 292L165 216M515 293L456 218" /></g>
        <path d={scan ? 'M197 265L290 194L369 194L453 265Z' : 'M227 283L277 199L445 199L504 283Z'}
          fill={scan ? '#82c0dc19' : '#e7b7631d'} stroke={scan ? '#8dd7f5' : '#ffca81'}
          strokeWidth="2" strokeDasharray="8 7" />
        <g data-person="true" className={scan ? 'lab-worker-static' : 'lab-worker-track'}>
          <Worker x={scan ? 322 : 329} y={scan ? 250 : 258} />
          <rect x={scan ? 292 : 300} y={scan ? 145 : 154} width="60" height="113"
            fill="none" stroke={stage >= 1 ? '#91e8d4' : '#9cd7f0'} strokeWidth="2" rx="4" />
          <path d={scan ? 'M292 156H304M340 156H352M292 246H304M340 246H352' : 'M300 166H312M348 166H360M300 247H312M348 247H360'} fill="none" stroke="#b5eaf6" strokeWidth="3" />
          <rect x={scan ? 292 : 300} y={scan ? 130 : 139} width="100" height="17" rx="3" fill="#91d9f1" />
          <text x={scan ? 298 : 306} y={scan ? 142 : 151} fill="#0d2936" fontSize="10" fontWeight="bold">PERSONNE · ID 01</text>
        </g>
        <path className="lab-scanline" d="M220 180H490" stroke="#8ee2ed" strokeWidth="2" opacity=".65" />
        <g fontSize="11" fontFamily="monospace" fill="#b7d3dd">
          <text x="15" y="25">REALSENSE / VISION EDGE</text>
          <text x="15" y="303">ZONE {scan ? 'DE SCAN EPI' : 'SURVEILLÉE'} · EXEMPLE</text>
          <text x="526" y="25">● {stage >= (scan ? 3 : 4) ? 'VALIDÉ' : 'ANALYSE'}</text>
        </g>
      </svg>
      <div className={'lab-camera-event ' + (stage >= (scan ? 3 : 4) ? 'is-alert' : '')}>
        <span>{stage >= (scan ? 3 : 4) ? (scan ? 'RÉSULTAT PRÉSENTÉ' : 'RÈGLE CONFIRMÉE') : 'OBSERVATION EN COURS'}</span>
        <span>{scan ? 'PARCOURS ILLUSTRATIF' : 'TRACK #01'}</span>
      </div>
    </div>
  );
}

function Vision({ stage, running }: Props) {
  return (
    <div className="lab-vision-layout">
      <IndustrialView stage={stage} running={running} />
      <div className="lab-analysis-panel">
        <div className="lab-panel-title"><span>PIPELINE EDGE</span><b>JETSON ORIN</b></div>
        <div className="lab-pipeline-chips"><span>RealSense</span><span>OpenCV</span><span>YOLO / TensorRT</span></div>
        <div className="lab-code-label">MÉTADONNÉES / INTERPROCESSUS</div>
        <div className="lab-code-lines"><span>frame_id <b>01847</b></span><span>class <b>person</b></span><span>track_id <b>01</b></span><span>bbox <b>[x, y, w, h]</b></span></div>
        <div className="lab-code-label">VALIDATION TEMPORELLE</div>
        <div className="lab-observations" role="img" aria-label="Illustration des observations de suivi">
          {Array.from({ length: 10 }, (_, i) =>
            <span key={i} className={i < (stage + 1) * 2 ? 'is-confirmed' : ''} />
          )}
        </div>
        <p className="lab-explainer">{stage < 3
          ? 'Les images sont traitées sur Jetson. Les processus échangent surtout des identifiants et des boîtes.'
          : stage === 3
            ? 'Une fenêtre glissante (≈ 30 frames) et des seuils configurables limitent les alertes intempestives.'
            : 'Une condition confirmée produit un événement exploitable par le dispositif d’alerte.'}</p>
      </div>
    </div>
  );
}

function Manager({ stage, sensitivity, applied, pending }: Props) {
  return (
    <div className="lab-manager-app">
      <div className="lab-app-header"><span className="lab-app-mark">S</span><strong>SecuriSPOT <em>Manager</em></strong><span className="lab-app-status"><i className="lab-online-dot" /> JETSON SIMULÉ · HORS LIGNE</span></div>
      <div className="lab-manager-shell">
        <aside className="lab-app-sidebar">
          <span className="is-selected">◉ &nbsp; Vue caméra</span><span>▧ &nbsp; Zones</span><span>▤ &nbsp; Alarmes</span><span>⌁ &nbsp; Équipement</span>
          <small>APPLICATION RECONSTITUÉE</small>
        </aside>
        <div className="lab-manager-main">
          <div className="lab-app-subhead"><strong>Configuration · Zone 01</strong><span>CAM-01</span></div>
          <div className="lab-manager-feed">
            <svg viewBox="0 0 470 230" role="img" aria-label="Aperçu caméra avec zone de détection modifiable">
              <rect width="470" height="230" fill="#253947" />
              <g stroke="#688294" strokeWidth="1" opacity=".35"><path d="M0 135H470M0 180H470M220 0V230M0 60H470"/><path d="M0 225L205 139L470 225" /></g>
              <rect x="23" y="43" width="123" height="103" fill="#344e5d" stroke="#91a3ad" />
              <path d="M23 73H146M23 113H146" stroke="#708999" />
              <rect x="342" y="26" width="100" height="119" fill="#324654" stroke="#718797" />
              <Worker x={240} y={185} />
              <rect x={235 - sensitivity * .55} y={92 - sensitivity * .34} width={74 + sensitivity * 1.1} height={52 + sensitivity * .7}
                stroke="#8fe1f2" strokeWidth="2" strokeDasharray="7 4" fill="#7bc7ec1e" rx="3" />
              <g fill="#cfeaf1" fontFamily="monospace" fontSize="10"><text x="15" y="18">CAM-01 · ZONE CONFIGURABLE</text><text x="322" y="217">1280 × 720</text></g>
            </svg>
            <div className="lab-feed-corner">ROI 01 · {sensitivity}% {applied !== sensitivity ? '· MODIFIÉE' : ''}</div>
          </div>
        </div>
        <aside className="lab-config-pane">
          <div className="lab-code-label">PROPRIÉTÉS</div>
          <strong>Zone de détection</strong>
          <div className="lab-setting"><span>Taille de zone</span><b>{sensitivity}%</b></div>
          <div className="lab-setting-track"><i style={{ width: sensitivity + '%' }} /></div>
          <div className="lab-setting"><span>Règles</span><b>Actives</b></div>
          <div className="lab-setting"><span>API</span><b>Flask · REST</b></div>
          <div className={'lab-config-state ' + (pending ? 'is-pending' : stage === 4 ? 'is-valid' : '')}>
            {pending ? 'Transmission simulée…' : applied === sensitivity ? 'Configuration active : ' + applied + '%' : 'Modification non appliquée'}
          </div>
          <small>Le curseur et le bouton sous cette illustration modifient cet exemple.</small>
        </aside>
      </div>
    </div>
  );
}

function TopologyNode({ label, detail, active = false, emphasized = false }: { label: string; detail: string; active?: boolean; emphasized?: boolean }) {
  return <div className={'lab-topo-node ' + (active ? 'is-active ' : '') + (emphasized ? 'is-emphasized' : '')}>
    <span className="lab-topo-icon" aria-hidden="true">{emphasized ? '▥' : '◇'}</span><strong>{label}</strong><small>{detail}</small>
  </div>;
}

function Connector({ active = true }: { active?: boolean }) {
  return <span className={'lab-connector ' + (active ? 'is-flowing' : '')} aria-hidden="true"><i /></span>;
}

function Cloud({ selectedBus, stage }: Props) {
  return (
    <div className="lab-cloud-layout">
      <div className="lab-cloud-fleet">
        <div className="lab-panel-title"><span>FLOTTE CONNECTÉE</span><b>70 BUS</b></div>
        <div className="lab-fleet-icons">
          {['A', 'B', 'C'].map((b, i) => <div key={b} className={'lab-bus-tile ' + (selectedBus === i ? 'is-selected' : '')}>
            <span className="lab-bus-roof"><i /><i /><i /></span><small>BUS {b}</small>
          </div>)}
        </div>
        <div className="lab-router-card"><span>ÉQUIPEMENT EMBARQUÉ</span><strong>Teltonika RUTX11</strong><small>Routeur réseau · certificat VPN</small></div>
        <p>Le routeur reste dans le véhicule ; le PC embarqué historique est supprimé.</p>
      </div>
      <div className="lab-cloud-network">
        <div className="lab-cloud-boundary">
          <span className="lab-cloud-caption">☁ AWS / SERVICES CENTRALISÉS</span>
          <div className="lab-topology-row">
            <TopologyNode label="OpenVPN" detail="EC2 · tunnel certifié" active={stage >= 1} />
            <Connector active={stage >= 1} />
            <TopologyNode label="API" detail="Node.js · Lambda" active={stage >= 2} />
          </div>
          <div className="lab-topology-row lab-topology-row--services">
            <TopologyNode label="S3" detail="Contenus / PDF" active={stage >= 2} />
            <TopologyNode label="CloudWatch" detail="Journaux" active={stage >= 2} />
            <TopologyNode label="Reporting" detail="EventBridge · SES" active={stage >= 3} />
          </div>
          <div className="lab-cloud-security">VPC · IAM · Security Groups <span>TRANSPORT SÉCURISÉ</span></div>
        </div>
        <div className="lab-cloud-route"><i /> BUS {String.fromCharCode(65 + selectedBus)} → OpenVPN / EC2 → services AWS</div>
      </div>
    </div>
  );
}

function Delivery({ stage, rollback, restored }: Props) {
  const status = (index: number) => index < stage ? 'TERMINÉ' : index === stage ? 'EN COURS' : 'EN ATTENTE';
  const titles = ['01 · Tag Git', '02 · GitLab CI / Registry', '03 · Contrôles Jetson', '04 · Activation', '05 · Health'];
  const descriptions = ['Version identifiée', 'Tests + image Docker', 'Commande locale + prérequis', 'Mise à jour contrôlée', 'Smoke tests / repli'];
  return (
    <div className="lab-release-layout">
      <div className="lab-release-header"><div><span className="lab-code-label">CHAÎNE DE LIVRAISON</span><strong>Release contrôlée</strong></div><span className="lab-release-version">v1.2.4 · EXEMPLE</span></div>
      <div className="lab-release-track">
        {titles.map((title, i) => <div className={'lab-release-node ' + (i === stage ? 'is-current ' : '') + (i < stage ? 'is-done' : '')} key={title}>
          <span className="lab-release-symbol">{i < stage ? '✓' : i === stage ? '◉' : '○'}</span>
          <strong>{title}</strong><small>{descriptions[i]}</small><em>{status(i)}</em>
        </div>)}
      </div>
      <div className="lab-release-bottom">
        <div className="lab-release-terminal"><div><i /><i /><i /> <span>JETSON · CONTRÔLES LOCAUX</span></div>
          <code>$ verify --camera --models --health</code>
          <code>• Caméra RealSense / USB</code>
          <code>• Images et modèles à vérifier</code>
          <code className={rollback ? 'is-warning' : ''}>{rollback ? '↺ Health check dégradé · retour en cours' : '• Tests et vérifications applicatives'}</code>
        </div>
        <div className={'lab-release-outcome ' + (rollback ? 'is-rollback' : '')}>
          <span>ÉTAT DU DÉPLOIEMENT</span><strong>{rollback ? (restored ? 'Service restauré' : 'Retour à la version stable') : 'Activation contrôlée'}</strong>
          <p>{rollback ? 'Un échec récupérable déclenche une restauration et ses vérifications.' : 'La CI prépare la release ; le déploiement final est déclenché localement.'}</p>
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
          <div className="lab-kiosk-header"><span>COLAS · SCAN EPI</span><span>SCÉNARIO RECONSTITUÉ</span></div>
          <div className="lab-kiosk-display">
            <IndustrialView stage={stage} running={running} scan />
            <span className="lab-kiosk-step">{String(stage + 1).padStart(2, '0')} / 04 · {captions[stage]}</span>
          </div>
        </div>
        <div className="lab-kiosk-stand" />
      </div>
      <div className="lab-scan-system">
        <div className="lab-panel-title"><span>ARCHITECTURE D’AFFICHAGE</span><b>JETSON → HDMI</b></div>
        <div className="lab-scan-route">
          <TopologyNode label="Jetson" detail="Calcul + backend" active={stage >= 0} />
          <Connector />
          <TopologyNode label="Chromium" detail="React · Weston" active={stage >= 1} />
          <Connector />
          <TopologyNode label="TV" detail="Sortie HDMI" active={stage >= 2} />
        </div>
        <div className="lab-scan-stream"><span>VIDÉO LOCALE</span><strong>GStreamer / WebRTC</strong><small>Logique d’état gérée côté backend</small></div>
        <p>L’architecture d’affichage a été déplacée de la TV vers le Jetson. Le modèle de détection IA était réalisé par un collègue.</p>
      </div>
    </div>
  );
}

function Observability({ stage }: Props) {
  return (
    <div className="lab-elk-layout">
      <div className="lab-elk-process">
        <div className="lab-panel-title"><span>FLUX DE DONNÉES</span><b>TRANSPORT TLS</b></div>
        <div className="lab-elk-row">
          <TopologyNode label="Journaux" detail="Applications" active={stage >= 0} />
          <Connector active={stage >= 1} />
          <TopologyNode label="Logstash" detail="Ingestion" active={stage >= 1} />
          <Connector active={stage >= 2} />
          <div className={'lab-elk-cluster ' + (stage >= 2 ? 'is-active' : '')}><span>ELASTICSEARCH</span><strong>Cluster · 3 nœuds</strong><div><i>01</i><i>02</i><i>03</i></div><small>Index · recherche</small></div>
          <Connector active={stage >= 3} />
          <TopologyNode label="Kibana" detail="Exploration" active={stage >= 3} />
        </div>
      </div>
      <div className="lab-elk-bottom">
        <div className="lab-elk-retention"><span className="lab-code-label">CYCLE DE VIE DES INDEX</span><strong>ILM · 180 jours</strong><div className="lab-retention-meter"><i /></div><span>Conservation configurée → suppression des anciens index</span></div>
        <div className="lab-elk-scale"><span className="lab-code-label">ÉCHELLE HISTORIQUE</span><strong>306 M <small>documents</small></strong><strong>644 Go <small>stockage historique</small></strong><p>Volumes passés, pas des mesures en direct.</p></div>
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
  const rootStyle = { '--lab-progress': (stage + 1) / steps[type].length * 100 + '%' } as CSSProperties;
  return (
    <div className={'lab-blueprint lab-blueprint--' + type} data-lab={type}
      data-motion={running ? 'running' : 'paused'} data-step={stage} style={rootStyle}>
      <div className="lab-blueprint-heading"><span><i className="lab-online-dot" /> {label[type]}</span><span>ÉTUDE DE CAS · RECONSTITUTION</span></div>
      <div className="lab-blueprint-content">
        {type === 'vision' && <Vision {...props} />}
        {type === 'interface' && <Manager {...props} />}
        {type === 'cloud' && <Cloud {...props} />}
        {type === 'delivery' && <Delivery {...props} />}
        {type === 'scan' && <Scan {...props} />}
        {type === 'observability' && <Observability {...props} />}
      </div>
      <SignalPath type={type} stage={stage} />
      <div className="lab-blueprint-footer"><span>Scénario synthétique, sans équipement connecté</span><span>Architecture basée sur les réalisations décrites</span></div>
    </div>
  );
}
