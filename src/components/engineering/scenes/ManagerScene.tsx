'use client';

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import {
  Camera,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cpu,
  History,
  LoaderCircle,
  Maximize2,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';

type Props = {
  stage: number;
  running: boolean;
  sensitivity: number;
  applied: number;
  pending: boolean;
  onZoneChange?: (value: number) => void;
};

/** A local reconstruction of the configuration workflow, never a production feed. */
export default function ManagerScene({
  stage,
  running,
  sensitivity,
  applied,
  pending,
  onZoneChange,
}: Props) {
  const [tab, setTab] = useState<'camera' | 'history'>('camera');
  const feed = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; value: number; width: number } | null>(null);
  const id = useId().replace(/:/g, '');
  const zoneWidth = 82 + sensitivity * 1.75;
  const zoneHeight = 48 + sensitivity * 1.04;
  const zoneX = 272 - zoneWidth / 2;
  const zoneY = 180 - zoneHeight / 2;
  const changed = sensitivity !== applied;
  const requestSteps = ['React', 'REST', 'Flask', 'Jetson', 'Confirmé'];

  const beginResize = (event: PointerEvent<HTMLButtonElement>) => {
    if (!onZoneChange || !feed.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      x: event.clientX,
      value: sensitivity,
      width: feed.current.getBoundingClientRect().width,
    };
  };
  const resize = (event: PointerEvent<HTMLButtonElement>) => {
    const start = drag.current;
    if (!start || !onZoneChange) return;
    const dx = ((event.clientX - start.x) * 520) / start.width;
    onZoneChange(
      Math.max(20, Math.min(100, Math.round(start.value + dx / 0.875))),
    );
  };
  const resizeKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      ![
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ].includes(event.key) ||
      !onZoneChange
    )
      return;
    event.preventDefault();
    const change = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 5 : -5;
    onZoneChange(
      event.key === 'Home'
        ? 20
        : event.key === 'End'
          ? 100
          : Math.min(100, Math.max(20, sensitivity + change)),
    );
  };

  return (
    <section
      className="eng-manager lab-manager-app"
      aria-label="Application de configuration SecuriSPOT Manager"
      data-motion={running ? 'running' : 'paused'}
    >
      <header className="eng-app-chrome">
        <span className="eng-app-brand">
          <ShieldCheck size={19} />
          <strong>
            SecuriSPOT <span>Manager</span>
          </strong>
        </span>
        <span className="eng-app-context">
          ATELIER A <ChevronRight size={11} /> CAM-01
        </span>
        <span className="eng-simulation-tag">APPLICATION RECONSTITUÉE</span>
      </header>
      <div className="eng-manager-body">
        <nav
          className="eng-app-rail"
          aria-label="Vues de la démonstration Manager"
        >
          <button
            type="button"
            title="Configuration caméra"
            aria-label="Configuration caméra"
            aria-pressed={tab === 'camera'}
            onClick={() => setTab('camera')}
          >
            <Camera size={20} />
            <span>Caméra</span>
          </button>
          <button
            type="button"
            title="Historique des alarmes"
            aria-label="Historique des alarmes"
            aria-pressed={tab === 'history'}
            onClick={() => setTab('history')}
          >
            <History size={20} />
            <span>Alarmes</span>
          </button>
          <span className="eng-rail-device" title="Jetson illustratif">
            <Cpu size={20} />
            <small>EDGE</small>
          </span>
        </nav>
        <div className="eng-app-workspace">
          <div className="eng-workspace-heading">
            <div>
              <span className="eng-eyebrow">SUPERVISION INDUSTRIELLE</span>
              <h4>
                {tab === 'camera'
                  ? 'Une zone. Votre règle.'
                  : 'Historique des événements'}
              </h4>
            </div>
            <span className="eng-state-pill">
              <i /> Exemple local
            </span>
          </div>
          {tab === 'camera' ? (
            <div className="eng-camera-layout">
              <div>
                <div className="eng-feed-label">
                  <span>
                    <Camera size={13} /> Caméra 01
                  </span>
                  <span>FLUX SYNTHÉTIQUE</span>
                </div>
                <div className="lab-manager-feed eng-manager-feed" ref={feed}>
                  <svg
                    viewBox="0 0 520 310"
                    role="img"
                    aria-label="Caméra synthétique de l’atelier et zone d’intérêt réglable"
                  >
                    <defs>
                      <linearGradient id={id + '-wall'} x2="0" y2="1">
                        <stop stopColor="#71818a" />
                        <stop offset="1" stopColor="#394e5a" />
                      </linearGradient>
                      <linearGradient id={id + '-floor'} x2="0" y2="1">
                        <stop stopColor="#657580" />
                        <stop offset="1" stopColor="#273b48" />
                      </linearGradient>
                    </defs>
                    <rect
                      width="520"
                      height="310"
                      fill={'url(#' + id + '-wall)'}
                    />
                    <path
                      d="M0 170H520V310H0Z"
                      fill={'url(#' + id + '-floor)'}
                    />
                    <path d="M0 168H520" stroke="#a4b0b4" strokeWidth="5" />
                    <g stroke="#a6b1b8" strokeWidth="1" opacity=".24">
                      <path d="M0 218H520M0 280H520M130 170L14 310M260 170L256 310M390 170L503 310M0 44H520M0 92H520" />
                    </g>
                    <g fill="#30434e" stroke="#9caaaf" strokeWidth="1.5">
                      <path d="M24 64H150V169H24Z" />
                      <path
                        d="M34 75H140V101H34ZM34 109H140V135H34ZM34 143H140V161H34Z"
                        fill="#697b85"
                      />
                      <path d="M391 42H488V166H391Z" />
                      <path d="M399 51H480V150H399Z" fill="#455c69" />
                      <path d="M433 51V150" />
                      <path d="M426 94V110M441 94V110" strokeWidth="3" />
                      <path
                        d="M177 0H188V168H177ZM353 0H363V168H353Z"
                        fill="#73838b"
                      />
                    </g>
                    <path
                      d="M43 294L143 192M391 192L487 294"
                      stroke="#dfbb63"
                      strokeWidth="6"
                    />
                    <path
                      d="M52 294L149 196M386 196L479 294"
                      stroke="#283f4c"
                      strokeWidth="2"
                    />
                    <g transform="translate(272 238)">
                      <ellipse
                        cy="3"
                        rx="26"
                        ry="8"
                        fill="#142a35"
                        opacity=".4"
                      />
                      <path
                        d="M-12-56L-16-11-21-1H-7L-3-45H3L8-1H22L16-11 12-56"
                        fill="#1e3443"
                      />
                      <path
                        d="M-16-102Q0-111 16-102L20-58Q0-51-20-58Z"
                        fill="#efc06b"
                      />
                      <path
                        d="M-9-102V-61M9-102V-61M-19-73H19"
                        stroke="#dfe6cf"
                        strokeWidth="4"
                      />
                      <path
                        d="M-19-98L-28-70-25-56M19-98L29-73 26-58"
                        stroke="#344b59"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M-25-56V-51M26-58V-53"
                        stroke="#c99575"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M-9-126Q0-136 9-126V-112Q0-103-9-112Z"
                        fill="#cb9b7e"
                      />
                      <path
                        d="M-13-124Q-12-141 0-142 12-141 13-124Z"
                        fill="#ecd7ac"
                      />
                      <path d="M-17-124H17" stroke="#f5e6c6" strokeWidth="4" />
                    </g>
                    <g stroke="#82d6bf" strokeWidth="1.5" fill="none">
                      <rect x="236" y="91" width="74" height="153" rx="2" />
                      <path
                        d="M236 102V91H249M297 91H310V104M310 231V244H297M249 244H236V231"
                        strokeWidth="3"
                      />
                    </g>
                    <rect
                      x="236"
                      y="77"
                      width="92"
                      height="14"
                      rx="2"
                      fill="#9bdec6"
                    />
                    <text
                      x="242"
                      y="87"
                      fill="#183e35"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      person · #01
                    </text>
                    <rect
                      x={zoneX}
                      y={zoneY}
                      width={zoneWidth}
                      height={zoneHeight}
                      rx="3"
                      fill="#77d6ef24"
                      stroke="#ade9f7"
                      strokeWidth="2"
                      strokeDasharray={changed ? '7 4' : undefined}
                    />
                    <path
                      d={`M${zoneX} ${zoneY + 10}V${zoneY}H${zoneX + 10}M${zoneX + zoneWidth - 10} ${zoneY}H${zoneX + zoneWidth}V${zoneY + 10}M${zoneX} ${zoneY + zoneHeight - 10}V${zoneY + zoneHeight}H${zoneX + 10}`}
                      stroke="#e3f7fc"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                  {onZoneChange && (
                    <button
                      type="button"
                      className="eng-roi-handle"
                      aria-label={`Redimensionner la zone : ${sensitivity} %. Utilisez les flèches ou faites glisser.`}
                      style={{
                        left: (zoneX + zoneWidth) / 5.2 + '%',
                        top: (zoneY + zoneHeight) / 3.1 + '%',
                      }}
                      onPointerDown={beginResize}
                      onPointerMove={resize}
                      onPointerUp={() => {
                        drag.current = null;
                      }}
                      onPointerCancel={() => {
                        drag.current = null;
                      }}
                      onLostPointerCapture={() => {
                        drag.current = null;
                      }}
                      onKeyDown={resizeKey}
                    >
                      <Maximize2 size={12} />
                    </button>
                  )}
                  <div className="lab-feed-corner">
                    ROI 01 · {sensitivity}% {changed ? '· MODIFIÉE' : ''}
                  </div>
                </div>
                <div className="eng-feed-caption">
                  <CircleHelp size={12} />
                  <span>Glissez la poignée pour redimensionner la zone.</span>
                  <span>1280 × 720</span>
                </div>
              </div>
              <aside className="eng-config-panel">
                <div className="eng-config-title">
                  <SlidersHorizontal size={15} />
                  <strong>Zone d’intérêt</strong>
                  <span>01</span>
                </div>
                <dl className="eng-property-list">
                  <div>
                    <dt>Surface</dt>
                    <dd>{sensitivity}%</dd>
                  </div>
                  <div>
                    <dt>Objet recherché</dt>
                    <dd>Personne</dd>
                  </div>
                  <div>
                    <dt>Règle</dt>
                    <dd>Présence</dd>
                  </div>
                </dl>
                <div
                  className={
                    'lab-config-state eng-config-state ' +
                    (pending ? 'is-pending' : changed ? '' : 'is-valid')
                  }
                >
                  {pending ? (
                    <LoaderCircle size={15} />
                  ) : changed ? (
                    <SlidersHorizontal size={15} />
                  ) : (
                    <Check size={15} />
                  )}
                  <span>
                    {pending
                      ? 'Transmission simulée…'
                      : changed
                        ? 'Modification non appliquée'
                        : 'Configuration active : ' + applied + '%'}
                  </span>
                </div>
                <div className="eng-equipment-status">
                  <Cpu size={17} />
                  <div>
                    <strong>Jetson · Atelier A</strong>
                    <span>Flask API / configuration locale</span>
                  </div>
                  <i />
                </div>
              </aside>
            </div>
          ) : (
            <div className="eng-alarm-history">
              <div className="eng-history-head">
                <span>APERÇU</span>
                <span>ÉVÉNEMENT</span>
                <span>ÉTAT</span>
              </div>
              {[
                ['Présence dans la zone 01', 'Confirmé'],
                ['Observation sans confirmation', 'Filtré'],
                ['Entrée dans la zone 02', 'Confirmé'],
              ].map(([name, state], index) => (
                <div className="eng-history-row" key={name}>
                  <div className="eng-history-thumb">
                    <span style={{ left: `${25 + index * 15}%` }} />
                    <Camera size={12} />
                  </div>
                  <div>
                    <strong>{name}</strong>
                    <small>
                      <Clock3 size={11} /> Exemple {index + 1} · capture locale
                      Jetson
                    </small>
                  </div>
                  <span
                    className={
                      'eng-history-status ' +
                      (state === 'Filtré' ? 'is-filtered' : '')
                    }
                  >
                    {state}
                  </span>
                </div>
              ))}
              <p>
                Captures et métadonnées synthétiques · aucun équipement
                connecté.
              </p>
            </div>
          )}
          <div
            className="eng-request-route"
            aria-label="Configuration : React, requête REST, Flask, Jetson, confirmation"
            data-pending={pending}
          >
            {requestSteps.map((step, index) => (
              <span
                key={step}
                className={
                  pending && stage === index
                    ? 'is-active'
                    : !pending && !changed && index === 4
                      ? 'is-confirmed'
                      : ''
                }
              >
                <i>{index === 4 ? <Check size={10} /> : index + 1}</i>
                {step}
                {index < 4 && <ChevronRight size={11} />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
