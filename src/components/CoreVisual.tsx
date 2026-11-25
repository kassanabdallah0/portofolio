'use client';

import dynamic from 'next/dynamic';
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ArrowUpRight, Braces, Cloud, Cpu, Pause, Play } from 'lucide-react';
import { heroLayers, type HeroLayer, type HeroProject } from '@/data/hero';
import { useSimulation } from './useSimulation';

const HardwareScene = dynamic(() => import('./HardwareScene'), { ssr: false });

/** Decorative counterpart of the small WebGL workbench; all meaning is HTML. */
export function HardwareFallback() {
  return (
    <svg viewBox="0 0 640 116" className="hardware-fallback" aria-hidden="true">
      <g fill="none" stroke="#9bb2bf" strokeWidth="1.2">
        <path d="M130 63H271M352 63H487" strokeDasharray="4 5" />
      </g>
      <g transform="translate(52 16)">
        <path d="M0 12L58 0L112 20L54 34Z" fill="#e2ebf0" stroke="#9db2c0" />
        <path d="M0 12V59L54 83V34Z" fill="#b5c5cf" />
        <path d="M54 34L112 20V67L54 83Z" fill="#7d99ad" />
        <path d="M10 27L45 40V61L10 47Z" fill="#36566a" />
        <path d="M19 35L35 41M19 41L37 48" stroke="#d6eaf3" strokeWidth="3" />
      </g>
      <g transform="translate(273 27)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0 ${i * 18})`}>
            <path d="M0 7L39 0L77 12L38 20Z" fill="#dae5eb" stroke="#9db4c2" />
            <path d="M0 7V19L38 32V20Z" fill="#829fac" />
            <path d="M38 20L77 12V24L38 32Z" fill="#55798e" />
          </g>
        ))}
      </g>
      <g transform="translate(475 25)">
        <path d="M0 30L45 14L102 33L57 52Z" fill="#9bacb7" />
        <path d="M0 30V53L57 76V52Z" fill="#3b5261" />
        <path d="M57 52L102 33V56L57 76Z" fill="#708b9e" />
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            d={`M${7 + i * 5} ${27 - i * 1.7}l51 18v8l-51-18Z`}
            fill="#9dafbb"
            stroke="#647e91"
          />
        ))}
        <path
          d="M70 8C63-6 82-14 90-6C101-15 119-5 114 6C131 12 121 28 107 24H78C64 25 60 14 70 8Z"
          fill="#e6eff4"
          stroke="#8ca9bc"
        />
      </g>
    </svg>
  );
}

function MiniApplication({ project }: { project: HeroProject }) {
  return (
    <svg viewBox="0 0 140 65" className="overview-ui" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="138"
        height="63"
        rx="6"
        fill="#f7fafc"
        stroke="#b5cbd8"
      />
      <path d="M1 14H139" stroke="#c5d6df" />
      <g fill="#8ba7b8">
        <circle cx="9" cy="8" r="1.5" />
        <circle cx="15" cy="8" r="1.5" />
        <circle cx="21" cy="8" r="1.5" />
      </g>
      {project === 'securispot' ? (
        <>
          <rect x="7" y="20" width="83" height="37" rx="3" fill="#294654" />
          <path
            d="M10 50L40 31L85 44M30 56L58 26"
            fill="none"
            stroke="#587584"
          />
          <path
            d="M29 49L44 33L72 41L57 54Z"
            fill="#a9d3e744"
            stroke="#b0d5e7"
          />
          <circle cx="49" cy="35" r="3" fill="#ecd4a8" />
          <path d="M49 39V46M46 40H52" stroke="#ecd4a8" strokeWidth="3" />
          <rect x="97" y="23" width="33" height="6" rx="2" fill="#d3e2eb" />
          <path d="M97 37H127M97 44H122" stroke="#9bb3c2" strokeWidth="3" />
          <rect x="97" y="51" width="30" height="6" rx="2" fill="#52798e" />
        </>
      ) : (
        <>
          <rect x="7" y="20" width="126" height="14" rx="3" fill="#dceaf2" />
          <path d="M14 27H62" stroke="#557b92" strokeWidth="3" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${7 + i * 43} 39)`}>
              <rect
                width="39"
                height="18"
                rx="3"
                fill={i === 0 ? '#567c91' : '#e2ebf0'}
              />
              <path
                d="M7 6H31M7 11H24"
                stroke={i === 0 ? '#d3e5ee' : '#9bb1bf'}
                strokeWidth="2"
              />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}

function Connector() {
  return (
    <svg className="overview-connector" viewBox="0 0 36 20" aria-hidden="true">
      <path
        d="M2 6H32L28 2M32 14H4L8 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle data-hero-packet="request" cx="8" cy="6" r="2.1" fill="#426b84" />
      <circle
        data-hero-packet="response"
        cx="28"
        cy="14"
        r="1.8"
        fill="#8aa89e"
      />
    </svg>
  );
}

function ProjectFlow({
  project,
  activeLayer,
  onExplore,
}: {
  project: HeroProject;
  activeLayer: HeroLayer;
  onExplore: (project: HeroProject) => void;
}) {
  const manager = project === 'securispot';
  return (
    <article className="overview-project" data-project={project}>
      <div className="overview-project-heading">
        <h3>
          <button type="button" onClick={() => onExplore(project)}>
            {manager ? 'SecuriSPOT Manager' : 'MediaSpot'}
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </h3>
        <p>
          {manager
            ? 'Configuration industrielle'
            : 'Portail passagers & plateforme cloud'}
        </p>
      </div>
      <ol
        className="overview-flow"
        aria-label={
          manager
            ? 'Architecture de SecuriSPOT Manager'
            : 'Architecture de MediaSpot'
        }
      >
        <li
          className="overview-node"
          data-layer="interface"
          data-active={activeLayer === 'interface'}
        >
          <MiniApplication project={project} />
          <strong>React</strong>
          <small>
            {manager ? 'Configuration de zones' : 'Portail passagers'}
          </small>
          <span className="overview-tech">TypeScript</span>
          <Connector />
        </li>
        <li
          className="overview-node"
          data-layer="backend"
          data-active={activeLayer === 'backend'}
        >
          <Braces
            className="overview-node-icon"
            size={25}
            strokeWidth={1.4}
            aria-hidden="true"
          />
          <strong>{manager ? 'Python · Flask' : 'Node.js · TypeScript'}</strong>
          <small>
            {manager ? 'Paramètres & règles métier' : 'Contenus & services'}
          </small>
          <span className="overview-tech">API REST</span>
          <Connector />
        </li>
        <li
          className="overview-node"
          data-layer="production"
          data-active={activeLayer === 'production'}
        >
          {manager ? (
            <Cpu
              className="overview-node-icon"
              size={25}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          ) : (
            <Cloud
              className="overview-node-icon"
              size={25}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          )}
          <strong>{manager ? 'NVIDIA Jetson' : 'AWS'}</strong>
          <small>
            {manager
              ? 'Configuration & supervision'
              : 'Hébergement & exploitation'}
          </small>
          <span className="overview-tech">
            {manager ? 'Équipement industriel' : 'Plateforme connectée'}
          </span>
        </li>
      </ol>
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
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useState(0);
  const [inspect, setInspect] = useState<HeroLayer | null>(null);
  const previous = useRef(0);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const draw = useCallback((t: number) => {
    const next = Math.floor((t % 18) / 6);
    if (next !== previous.current) {
      previous.current = next;
      setStage(next);
    }
    if (root.current)
      root.current.dataset.simulationMs = String(Math.round(t * 1000));
    root.current?.querySelectorAll('[data-hero-packet]').forEach((el, i) => {
      const p = (t / 3 + Math.floor(i / 2) * 0.2) % 1;
      const reverse = el.getAttribute('data-hero-packet') === 'response';
      el.setAttribute('cx', String(reverse ? 32 - p * 28 : 4 + p * 28));
      el.setAttribute('opacity', String(0.35 + Math.sin(p * Math.PI) * 0.65));
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
  const activeLayer = inspect ?? heroLayers[stage].id;
  const held = paused || inspect !== null;
  return (
    <div
      className="core-visual software-overview glass glass--raised glass--optical"
      ref={root}
      data-running={running}
      data-stage={stage}
      data-layer={activeLayer}
    >
      <header className="overview-heading">
        <span className="overview-kicker">DU PRODUIT À LA PRODUCTION</span>
        <h2>Ce que je développe</h2>
      </header>
      <div className="overview-columns" aria-hidden="true">
        <span>Interfaces web</span>
        <span>API & Backend</span>
        <span>Cloud & Edge</span>
      </div>
      <ProjectFlow
        project="securispot"
        activeLayer={activeLayer}
        onExplore={onExploreProject}
      />
      <ProjectFlow
        project="mediaspot"
        activeLayer={activeLayer}
        onExplore={onExploreProject}
      />
      <div className="hardware-stage overview-hardware" aria-hidden="true">
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
      <div
        className="hero-process"
        role="group"
        aria-label="Explorer mes contributions"
      >
        {heroLayers.map(({ id, label }, i) => (
          <button
            key={id}
            type="button"
            className={activeLayer === id ? 'is-active' : ''}
            aria-pressed={inspect === id}
            aria-controls="hero-contribution"
            onClick={() => {
              if (inspect === id) setInspect(null);
              else {
                seek(i * 6);
                setInspect(id);
              }
            }}
          >
            <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            {label}
          </button>
        ))}
      </div>
      <div className="hardware-explanation">
        <p id="hero-contribution" data-layer-explanation>
          {heroLayers.find((layer) => layer.id === activeLayer)!.explanation}
        </p>
        <button
          type="button"
          className="animation-control"
          disabled={reduced}
          aria-label={
            held ? 'Reprendre l’animation 3D' : 'Mettre l’animation 3D en pause'
          }
          aria-pressed={held}
          onClick={() => {
            setPaused(!held);
            setInspect(null);
          }}
        >
          {held || reduced ? <Play size={13} /> : <Pause size={13} />}
          <span>{reduced ? 'Vue fixe' : held ? 'Reprendre' : 'Pause'}</span>
        </button>
      </div>
      <p className="hardware-note">
        Vue simplifiée de deux projets professionnels
      </p>
    </div>
  );
}
