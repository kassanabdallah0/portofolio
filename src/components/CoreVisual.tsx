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
import { Pause, Play } from 'lucide-react';
import { useSimulation } from './useSimulation';

const HardwareScene = dynamic(() => import('./HardwareScene'), { ssr: false });
const stages = [
  'Acquisition',
  'Détection',
  'Suivi',
  'Règle temporelle',
  'Événement',
];
const explanations = [
  'La caméra observe le monde physique.',
  'Le calculateur identifie les objets.',
  'Une identité relie les observations.',
  'Plusieurs observations confirment la condition.',
  'Le système transforme la perception en décision.',
];

export function HardwareFallback() {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 640 440" className="hardware-fallback" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" />
          <stop offset=".5" stopColor="#c1cbd3" />
          <stop offset=".7" stopColor="#f1f4f6" />
          <stop offset="1" stopColor="#94a4b1" />
        </linearGradient>
        <radialGradient id={`${id}-lens`}>
          <stop stopColor="#080e18" />
          <stop offset=".5" stopColor="#263c51" />
          <stop offset=".8" stopColor="#7b94ad" />
          <stop offset="1" stopColor="#15242f" />
        </radialGradient>
      </defs>
      <ellipse
        cx="324"
        cy="365"
        rx="240"
        ry="29"
        fill="#7e93a3"
        opacity=".10"
      />
      <g transform="translate(252 36)">
        <rect width="280" height="167" rx="13" fill={`url(#${id}-metal)`} />
        <rect x="7" y="7" width="266" height="153" rx="8" fill="#233541" />
        <path
          d="M20 137 131 58 262 125M20 158 147 77 260 144"
          fill="none"
          stroke="#4b6475"
        />
        <path
          d="M126 127 193 98 245 121 172 153Z"
          fill="#83b6cd"
          fillOpacity=".2"
          stroke="#93b5c6"
          strokeDasharray="4 5"
        />
        <g data-hero-person="true" transform="translate(143 100)">
          <circle cy="-21" r="8" fill="#c0cbd2" />
          <path d="M-10-10H10V18H-10Z" fill="#c9b497" />
          <path d="M-6 18V35M6 18V35" stroke="#aabcc7" strokeWidth="5" />
          <rect
            x="-19"
            y="-34"
            width="38"
            height="74"
            rx="2"
            fill="none"
            stroke="#b8d2df"
          />
        </g>
        <text x="21" y="27" fill="#d7e6ef" fontSize="10">
          PERCEPTION · SCÈNE ILLUSTRATIVE
        </text>
      </g>
      <path
        d="M180 234Q222 156 371 268M411 251Q470 213 395 204"
        fill="none"
        stroke="#a2bccb"
        strokeWidth="2"
      />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          data-hero-packet={i}
          cx={210 + i * 50}
          cy={219 + i * 9}
          r="3"
          fill="#527e96"
        />
      ))}
      <g transform="translate(79 192)">
        <path d="M0 0 87-27 148 4 60 32Z" fill={`url(#${id}-metal)`} />
        <path d="M0 0V99L60 130V32Z" fill="#a3b1bd" />
        <path d="M60 32 148 4V104L60 130Z" fill="#7a8e9e" />
        <ellipse
          cx="103"
          cy="71"
          rx="36"
          ry="43"
          transform="rotate(15 103 71)"
          fill="#283640"
          stroke="#acbbc7"
          strokeWidth="5"
        />
        <ellipse
          cx="109"
          cy="75"
          rx="27"
          ry="33"
          transform="rotate(15 109 75)"
          fill={`url(#${id}-lens)`}
        />
        <path
          d="M99 51Q113 43 122 57"
          fill="none"
          stroke="#d1e4f2"
          strokeOpacity=".7"
          strokeWidth="2"
        />
        <path d="M30 115V151L97 170 126 154" fill="#a7b7c2" />
      </g>
      <g transform="translate(337 273)">
        <path d="M0 0 103-40 202-4 101 38Z" fill={`url(#${id}-metal)`} />
        <path d="M0 0V69L101 107V38Z" fill="#364854" />
        <path d="M101 38 202-4V66L101 107Z" fill="#6d8393" />
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            d={`M${12 + i * 9} ${-3 - i * 3.4}l85 31v8l-85-31Z`}
            fill="#637987"
            stroke="#a8bac6"
            strokeWidth=".7"
          />
        ))}
        <path d="M20 38 48 49M61 54 85 63" stroke="#17232d" strokeWidth="10" />
        <circle cx="170" cy="60" r="3" fill="#cadcce" />
      </g>
    </svg>
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
}: {
  suspended?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useState(0);
  const [inspect, setInspect] = useState<number | null>(null);
  const previous = useRef(0);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  const draw = useCallback((t: number) => {
    const next = Math.floor(((t % 18) / 18) * 5);
    if (next !== previous.current) {
      previous.current = next;
      setStage(next);
    }
    const person = root.current?.querySelector('[data-hero-person]');
    person?.setAttribute(
      'transform',
      `translate(${143 + Math.sin(t * 0.35) * 40} 100)`,
    );
    root.current?.querySelectorAll('[data-hero-packet]').forEach((el, i) => {
      const p = (t * 0.15 + i / 3) % 1;
      el.setAttribute('cx', `${180 + p * 191}`);
      el.setAttribute('cy', `${234 - 45 * Math.sin(p * Math.PI) + p * 34}`);
      el.setAttribute('opacity', `${Math.sin(p * Math.PI) ** 2}`);
    });
  }, []);
  const { running, reduced, time, entered } = useSimulation(root, paused, draw);
  useEffect(() => {
    const media = matchMedia(
      '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
    );
    let supported: boolean | undefined;
    const update = () => {
      if (media.matches && supported === undefined) {
        const canvas = document.createElement('canvas');
        try {
          const gl = canvas.getContext('webgl2');
          supported = !!gl;
          gl?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch {
          supported = false;
        }
      }
      setEnabled(media.matches && !!supported);
      setReady(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  // Direct links to a case study do not need to initialize a WebGL studio behind it.
  const live = enabled && entered && !failed && (!suspended || ready);
  return (
    <div
      className="core-visual"
      ref={root}
      data-running={running}
      data-stage={stage}
    >
      <div className="hardware-caption">
        <span>Du monde physique à la décision.</span>
        <span>VISION EMBARQUÉE</span>
      </div>
      <div className="hardware-stage">
        <div className={`core-static ${live && ready ? 'is-hidden' : ''}`}>
          <HardwareFallback />
        </div>
        {live && (
          <div className="core-canvas" aria-hidden="true">
            <SceneBoundary onError={onUnavailable}>
              <HardwareScene
                paused={!running || suspended}
                time={time}
                onReady={onReady}
                onUnavailable={onUnavailable}
              />
            </SceneBoundary>
          </div>
        )}
        <div className="hardware-object-label camera-label">
          01 <span>Acquérir</span>
        </div>
        <div className="hardware-object-label edge-label">
          02 <span>Comprendre</span>
        </div>
      </div>
      <div
        className="hero-process"
        aria-label="Du monde physique à la décision"
      >
        {stages.map((label, i) => (
          <button
            type="button"
            key={label}
            className={stage === i ? 'is-active' : ''}
            aria-pressed={inspect === i}
            onClick={() => setInspect(inspect === i ? null : i)}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {label}
          </button>
        ))}
      </div>
      <div className="hardware-explanation">
        <p>{explanations[inspect ?? stage]}</p>
        <button
          type="button"
          className="animation-control"
          disabled={reduced}
          aria-label={
            paused
              ? 'Reprendre l’animation 3D'
              : 'Mettre l’animation 3D en pause'
          }
          onClick={() => setPaused(!paused)}
        >
          {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
          <span>{reduced ? 'Vue fixe' : paused ? 'Reprendre' : 'Pause'}</span>
        </button>
      </div>
      <p className="hardware-note">
        Matériel conceptuel · simulation illustrative
      </p>
    </div>
  );
}
