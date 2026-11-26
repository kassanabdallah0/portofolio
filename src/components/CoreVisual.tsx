'use client';

import dynamic from 'next/dynamic';
import {
  Component,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  ArrowUpRight,
  Braces,
  Check,
  Cloud,
  Code2,
  Cpu,
  Pause,
  Play,
} from 'lucide-react';
import { heroLayers, type HeroLayer, type HeroProject } from '@/data/hero';
import SkillMark from './SkillMark';
import { useSimulation } from './useSimulation';

const HardwareScene = dynamic(() => import('./HardwareScene'), { ssr: false });

export function HardwareFallback() {
  return (
    <svg className="hardware-fallback" viewBox="0 0 720 540" aria-hidden="true">
      <g transform="translate(547 72)">
        <ellipse cx="58" cy="105" rx="67" ry="11" fill="#6a8ca012" />
        <path d="M5 76L60 57L116 76L61 96Z" fill="#d6e3eb" stroke="#9db5c5" />
        <path d="M5 76V86L61 107V96ZM61 96L116 76V87L61 107" fill="#7897ac" />
        <path
          d="M23 45C10 14 38-2 60 13C75-10 110 9 105 33C135 40 129 72 101 72H34C8 73 1 50 23 45Z"
          fill="#edf5f9"
          stroke="#98b2c3"
          strokeWidth="2"
        />
        <path d="M26 80L58 91M67 91L101 80" stroke="#52758d" strokeWidth="3" />
      </g>
      <g transform="translate(542 333)">
        <ellipse cx="64" cy="103" rx="70" ry="10" fill="#6a8ca018" />
        <path d="M0 43L51 21L126 47L74 72Z" fill="#3f5d6b" stroke="#8eacba" />
        <path d="M0 43V67L74 96V72ZM74 72L126 47V72L74 96Z" fill="#53758c" />
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            d={`M${10 + i * 5} ${38 - i * 1.7}l65 23v-26l-65-23Z`}
            fill={i % 2 ? '#829eaf' : '#b5c7d2'}
            stroke="#617e91"
          />
        ))}
        <path
          d="M11 61L24 66M32 69L45 74M53 77L65 82"
          stroke="#203e52"
          strokeWidth="7"
        />
        <circle cx="112" cy="71" r="3" fill="#83b5a0" />
      </g>
    </svg>
  );
}

function ManagerScreen() {
  return (
    <svg className="showcase-screen" viewBox="0 0 320 180" aria-hidden="true">
      <rect width="320" height="180" fill="#1e3442" />
      <rect x="0" width="32" height="180" fill="#142a38" />
      <g stroke="#9dbbcd" fill="none" strokeWidth="2">
        <rect x="9" y="17" width="13" height="10" rx="2" />
        <path d="M10 44H22M10 51H18M10 70H22M10 77H18" />
      </g>
      <rect x="43" y="12" width="208" height="135" rx="5" fill="#2c4959" />
      <g stroke="#6c899a" opacity=".32" fill="none">
        <path d="M45 50H248M45 87H248M45 125H248M70 15V145M117 15V145M164 15V145M211 15V145" />
        <path d="M44 132L144 41L248 113M70 145L161 62L247 130" />
      </g>
      <path
        d="M61 40H103V75H61ZM178 25H232V72H178Z"
        fill="#496777"
        stroke="#718a98"
      />
      <g transform="translate(137 91)">
        <circle cy="-23" r="8" fill="#d4b57f" />
        <path d="M-9-12H9V11H-9Z" fill="#deb86e" />
        <path d="M-6 11L-8 29M6 11L9 29" stroke="#bccbd1" strokeWidth="6" />
        <rect
          x="-17"
          y="-35"
          width="34"
          height="69"
          rx="3"
          fill="none"
          stroke="#c4e3df"
        />
      </g>
      <rect
        data-zone
        x="94"
        y="59"
        width="96"
        height="59"
        rx="3"
        fill="#78bdd72d"
        stroke="#a9d9ef"
        strokeWidth="2"
        strokeDasharray="5 3"
      />
      <g data-zone-handle transform="translate(190 118)">
        <rect x="-4" y="-4" width="8" height="8" rx="1" fill="#e4f4fc" />
        <circle
          data-ui-click
          r="5"
          fill="none"
          stroke="#d9edf7"
          strokeWidth="1.5"
          opacity="0"
        />
      </g>
      <g fill="#658497">
        <rect x="264" y="19" width="43" height="5" rx="2" />
        <rect x="264" y="36" width="33" height="4" rx="2" />
        <rect x="264" y="61" width="43" height="4" rx="2" />
        <rect x="264" y="86" width="43" height="4" rx="2" />
      </g>
      <g fill="#bad6e4">
        <circle cx="291" cy="46" r="4" />
        <circle cx="276" cy="71" r="4" />
        <circle cx="299" cy="96" r="4" />
      </g>
      <rect x="262" y="120" width="47" height="22" rx="4" fill="#8ab5b3" />
      <path
        d="M280 131L284 135L292 126"
        fill="none"
        stroke="#153f48"
        strokeWidth="2"
      />
      <path d="M46 160H111M46 167H88" stroke="#7e9bab" strokeWidth="3" />
      <g className="showcase-save-check" transform="translate(231 158)">
        <circle r="13" fill="#b5daca" />
        <path
          d="M-6 0L-2 4L7-5"
          fill="none"
          stroke="#2f6654"
          strokeWidth="2.2"
        />
      </g>
      <g data-hero-cursor transform="translate(191 120)">
        <path
          d="M0 0L2 20L7 14L12 23L17 20L12 12L20 10Z"
          fill="#f5fafc"
          stroke="#18394c"
          strokeWidth="1.4"
        />
      </g>
    </svg>
  );
}

function PortalScreen() {
  const clip = useId().replace(/:/g, '');
  return (
    <svg className="showcase-screen" viewBox="0 0 320 160" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <rect x="12" y="43" width="296" height="104" rx="5" />
        </clipPath>
      </defs>
      <rect width="320" height="160" fill="#edf3f7" />
      <rect x="13" y="13" width="294" height="21" rx="4" fill="#d2e3ed" />
      <g
        transform="translate(23 15)"
        stroke="#587b91"
        fill="none"
        strokeWidth="1.7"
      >
        <rect width="24" height="12" rx="3" />
        <path d="M4 3H20M5 14H6M18 14H19" />
        <circle cx="5" cy="13" r="1.5" />
        <circle cx="19" cy="13" r="1.5" />
      </g>
      <path d="M60 23H116M263 23H292" stroke="#6e92a6" strokeWidth="3" />
      <g clipPath={`url(#${clip})`}>
        <g data-portal-cards transform="translate(0 0)">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${14 + i * 91} 45)`}>
              <rect
                width="82"
                height="100"
                rx="6"
                fill="white"
                stroke="#c3d6e1"
              />
              <rect
                x="6"
                y="6"
                width="70"
                height="58"
                rx="4"
                fill={['#abc7d8', '#ccdcd5', '#c3cadb', '#cbdde7'][i]}
              />
              {i % 2 === 0 ? (
                <>
                  <path d="M29 19H47L55 27V51H29Z" fill="#f2f7fa" />
                  <path
                    d="M47 19V28H55M34 35H48M34 41H46"
                    fill="none"
                    stroke="#6f90a6"
                    strokeWidth="2"
                  />
                </>
              ) : (
                <>
                  <circle cx="41" cy="35" r="16" fill="#f0f6f7" />
                  <path d="M37 27L48 35L37 43Z" fill="#6b8c7a" />
                </>
              )}
              <path d="M9 76H65M9 84H50" stroke="#9bb3c3" strokeWidth="3" />
              <rect
                x="9"
                y="91"
                width="18"
                height="3"
                rx="1.5"
                fill="#63879d"
              />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

const connections = [
  {
    id: 'manager-ui',
    project: 'securispot',
    d: 'M350 190C395 190 390 230 428 230',
  },
  {
    id: 'manager-edge',
    project: 'securispot',
    d: 'M477 244C546 244 526 381 601 381',
  },
  {
    id: 'media-ui',
    project: 'mediaspot',
    d: 'M331 397C374 397 385 385 428 385',
  },
  {
    id: 'media-cloud',
    project: 'mediaspot',
    d: 'M477 369C551 369 523 126 602 126',
  },
];

function Connections() {
  return (
    <svg className="showcase-wires" viewBox="0 0 720 540" aria-hidden="true">
      {connections.map(({ id, project, d }, i) => (
        <g key={id} data-connection-project={project}>
          <path
            data-flow-id={id}
            d={d}
            fill="none"
            stroke={project === 'securispot' ? '#8aaec3' : '#a8bbbd'}
            strokeWidth="1.4"
          />
          <path
            d={d}
            fill="none"
            stroke="#dbe8ee"
            strokeWidth="8"
            opacity=".16"
          />
          {[false, true].map((reverse) => (
            <circle
              key={String(reverse)}
              data-flow-packet={id}
              data-reverse={String(reverse)}
              data-packet-index={i}
              r={reverse ? 3 : 4}
              fill={reverse ? '#83aa99' : '#5e8da7'}
            />
          ))}
        </g>
      ))}
      <circle
        className="showcase-sync-ring"
        data-sync-ring
        cx="605"
        cy="126"
        r="59"
        fill="none"
        stroke="#92b5c7"
        strokeWidth="1.4"
        strokeDasharray="371"
        strokeDashoffset="371"
        transform="rotate(-90 605 126)"
      />
    </svg>
  );
}

function Application({
  project,
  onExplore,
}: {
  project: HeroProject;
  onExplore: (project: HeroProject) => void;
}) {
  return (
    <article
      className={`showcase-window ${project === 'securispot' ? 'manager-window' : 'portal-window'}`}
      data-project={project}
      data-layer="interface"
    >
      <h2>
        <button type="button" onClick={() => onExplore(project)}>
          <SkillMark skill="react" />
          {project === 'securispot' ? 'SecuriSPOT Manager' : 'MediaSpot'}
          <ArrowUpRight size={13} aria-hidden="true" />
        </button>
      </h2>
      {project === 'securispot' ? <ManagerScreen /> : <PortalScreen />}
      <span className="sr-only">
        {project === 'securispot'
          ? 'Interface React et TypeScript : configuration graphique des zones et supervision industrielle.'
          : 'Portail passagers React et TypeScript : consultation des contenus hébergés sur AWS.'}
      </span>
    </article>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function CoreVisual({
  suspended = false,
  onExploreProject,
}: {
  suspended?: boolean;
  onExploreProject: (project: HeroProject) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [paused, setPaused] = useState(false);
  const [stage, setStage] = useState(0),
    [inspect, setInspect] = useState<HeroLayer | null>(null);
  const previous = useRef(0),
    lengths = useRef(new WeakMap<SVGPathElement, number>());
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const draw = useCallback((t: number) => {
    const local = t % 18,
      next = Math.floor(local / 6),
      scene = root.current;
    if (next !== previous.current) {
      previous.current = next;
      setStage(next);
    }
    if (!scene) return;
    scene.dataset.simulationMs = String(Math.round(t * 1000));
    scene.style.setProperty('--float-a', `${Math.sin(t * 0.8) * 3}px`);
    scene.style.setProperty('--float-b', `${Math.cos(t * 0.7) * 3}px`);
    scene.style.setProperty('--pulse', String(1 + Math.sin(t * 2) * 0.015));
    scene.style.setProperty('--sync', String((local % 6) / 6));
    const ease = (value: number) => value * value * (3 - 2 * value);
    const resize =
      local < 6 ? ease(local / 6) : local < 17 ? 1 : 1 - ease(local - 17);
    const width = 96 + 44 * resize,
      height = 59 + 18 * resize;
    scene.querySelector('[data-zone]')?.setAttribute('width', width.toFixed(2));
    scene
      .querySelector('[data-zone]')
      ?.setAttribute('height', height.toFixed(2));
    scene
      .querySelector('[data-zone-handle]')
      ?.setAttribute('transform', `translate(${94 + width} ${59 + height})`);
    scene
      .querySelector('[data-hero-cursor]')
      ?.setAttribute('transform', `translate(${95 + width} ${61 + height})`);
    scene
      .querySelector('[data-hero-cursor]')
      ?.setAttribute('opacity', next === 0 ? '1' : '.15');
    const click = (local % 3) / 3;
    scene
      .querySelector('[data-ui-click]')
      ?.setAttribute('r', String(4 + click * 13));
    scene
      .querySelector('[data-ui-click]')
      ?.setAttribute('opacity', next === 0 ? String(1 - click) : '0');
    scene
      .querySelector('[data-portal-cards]')
      ?.setAttribute(
        'transform',
        `translate(${-12 * (1 - Math.cos((t * Math.PI) / 6))} 0)`,
      );
    scene
      .querySelector('[data-sync-ring]')
      ?.setAttribute('stroke-dashoffset', String(371 * (1 - (local % 6) / 6)));
    scene
      .querySelectorAll<SVGCircleElement>('[data-flow-packet]')
      .forEach((el) => {
        const path = scene.querySelector<SVGPathElement>(
          `[data-flow-id="${el.dataset.flowPacket}"]`,
        );
        if (!path) return;
        let length = lengths.current.get(path);
        if (length === undefined) {
          length = path.getTotalLength();
          lengths.current.set(path, length);
        }
        const phase = (t / 2.8 + Number(el.dataset.packetIndex) * 0.21) % 1;
        const point = path.getPointAtLength(
          (el.dataset.reverse === 'true' ? 1 - phase : phase) * length,
        );
        el.setAttribute('cx', String(point.x));
        el.setAttribute('cy', String(point.y));
        el.setAttribute(
          'opacity',
          String(0.25 + Math.sin(phase * Math.PI) * 0.75),
        );
      });
  }, []);
  const { running, reduced, time, entered, visible, seek } = useSimulation(
    root,
    paused || inspect !== null || suspended,
    draw,
  );
  useEffect(() => {
    const media = matchMedia(
      '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
    );
    const update = () => {
      setEnabled(media.matches);
      if (!media.matches) setReady(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const live =
    enabled &&
    entered &&
    (visible || ready) &&
    !failed &&
    (!suspended || ready);
  const activeLayer = inspect ?? heroLayers[stage].id,
    held = paused || inspect !== null;
  return (
    <div
      className="core-visual software-overview cinematic-overview"
      ref={root}
      data-running={running}
      data-stage={stage}
      data-layer={activeLayer}
      role="region"
      aria-label="Applications web, API, cloud et systèmes Jetson"
    >
      <div className="showcase-stage">
        <div className="showcase-ambience" aria-hidden="true" />
        <div className="showcase-hardware" aria-hidden="true">
          <div className={`core-static ${live && ready ? 'is-hidden' : ''}`}>
            <HardwareFallback />
          </div>
          {live && (
            <div className="core-canvas">
              <SceneBoundary onError={onUnavailable}>
                <HardwareScene
                  paused={!running || suspended}
                  activeLayer={activeLayer}
                  time={time}
                  onReady={onReady}
                  onUnavailable={onUnavailable}
                />
              </SceneBoundary>
            </div>
          )}
        </div>
        <Connections />
        <Application project="securispot" onExplore={onExploreProject} />
        <Application project="mediaspot" onExplore={onExploreProject} />
        <div
          className="showcase-service python-service"
          data-project="securispot"
          data-layer="backend"
        >
          <SkillMark skill="python" className="service-mark" />
          <span>Flask</span>
          <Braces className="service-braces" size={17} aria-hidden="true" />
          <span className="service-port" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div
          className="showcase-service node-service"
          data-project="mediaspot"
          data-layer="backend"
        >
          <SkillMark skill="node" className="service-mark" />
          <span>Node.js</span>
          <Braces className="service-braces" size={17} aria-hidden="true" />
          <span className="service-port" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div
          className="showcase-endpoint cloud-label"
          data-project="mediaspot"
          data-layer="production"
        >
          <Cloud size={15} aria-hidden="true" />
          <span>AWS</span>
          <Check className="endpoint-check" size={13} aria-hidden="true" />
        </div>
        <div
          className="showcase-endpoint jetson-label"
          data-project="securispot"
          data-layer="production"
        >
          <Cpu size={15} aria-hidden="true" />
          <span>Jetson</span>
          <Check className="endpoint-check" size={13} aria-hidden="true" />
        </div>
        <div className="showcase-react" aria-hidden="true">
          <SkillMark skill="react" />
        </div>
        <div className="showcase-code-symbol" aria-hidden="true">
          <Code2 />
        </div>
      </div>
      <div className="showcase-toolbar">
        <div
          className="hero-process"
          role="group"
          aria-label="Explorer mes contributions"
        >
          {heroLayers.map(({ id, label }, i) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={inspect === id}
              aria-controls="hero-contribution"
              className={activeLayer === id ? 'is-active' : ''}
              onClick={() => {
                if (inspect === id) setInspect(null);
                else {
                  seek(i * 6);
                  setInspect(id);
                }
              }}
            >
              {i === 0 ? (
                <SkillMark skill="react" />
              ) : i === 1 ? (
                <Braces size={18} aria-hidden="true" />
              ) : (
                <Cloud size={18} aria-hidden="true" />
              )}
              <span className="control-label">
                {['Web', 'API', 'Cloud'][i]}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="animation-control"
          disabled={reduced}
          aria-label={
            held ? 'Reprendre l’animation 3D' : 'Mettre l’animation 3D en pause'
          }
          title={reduced ? 'Vue fixe' : held ? 'Reprendre' : 'Pause'}
          aria-pressed={held}
          onClick={() => {
            setPaused(!held);
            setInspect(null);
          }}
        >
          {held || reduced ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="sr-only" id="hero-contribution" data-layer-explanation>
        {heroLayers.find((layer) => layer.id === activeLayer)!.explanation}
      </p>
      <p className="showcase-caption">Scènes illustratives</p>
    </div>
  );
}
