'use client';

import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';

const NeuralScene = dynamic(() => import('./NeuralScene'), { ssr: false });

export function NeuralFallback({ compact = false }: { compact?: boolean }) {
  const points = Array.from({ length: 64 }, (_, i) => {
    const z = 1 - (2 * (i + 0.5)) / 64,
      a = i * 2.399963;
    const x = Math.sqrt(1 - z * z) * Math.cos(a),
      y = Math.sqrt(1 - z * z) * Math.sin(a);
    return { x: 300 + x * 181, y: 300 + (y * 0.91 + z * 0.28) * 181, z };
  });
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      className={`neural-fallback ${compact ? 'compact' : ''}`}
      aria-hidden="true"
    >
      <g stroke="#00e5ff" strokeWidth=".7">
        {points.flatMap((p, i) =>
          points.slice(i + 1).map((q, j) => {
            const distance = Math.hypot(
              p.x - q.x,
              p.y - q.y,
              (p.z - q.z) * 181,
            );
            return distance < 103 ? (
              <path
                key={`${i}-${j}`}
                d={`M${p.x},${p.y}L${q.x},${q.y}`}
                opacity={0.12 + (p.z + 1) * 0.12}
              />
            ) : null;
          }),
        )}
      </g>
      <ellipse
        cx="300"
        cy="300"
        rx="244"
        ry="95"
        transform="rotate(-28 300 300)"
        stroke="#00e5ff"
        strokeOpacity=".35"
        strokeWidth=".8"
      />
      <ellipse
        cx="300"
        cy="300"
        rx="245"
        ry="124"
        transform="rotate(48 300 300)"
        stroke="#7a7efb"
        strokeOpacity=".4"
        strokeWidth=".7"
      />
      <path
        d="M300 212 380 262 350 359 250 359 220 262ZM300 212 300 310 350 359M300 310 250 359M220 262 300 310 380 262"
        stroke="#56e8f8"
        strokeOpacity=".7"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.z > 0.2 ? 2 : 1.2}
          fill="#a9f8ff"
          opacity={0.4 + (p.z + 1) * 0.25}
        />
      ))}
      {!compact &&
        Array.from({ length: 38 }, (_, i) => (
          <circle
            key={i}
            cx={30 + ((i * 163) % 540)}
            cy={30 + ((i * 97) % 540)}
            r="1"
            fill="#94a3b8"
            opacity=".35"
          />
        ))}
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

export default function CoreVisual() {
  const root = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  useEffect(() => {
    const media = window.matchMedia(
      '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
    );
    let supported: boolean | undefined;
    const update = () => {
      if (media.matches && supported === undefined) {
        const canvas = document.createElement('canvas');
        try {
          const context = canvas.getContext('webgl2');
          supported = !!context;
          context?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch {
          supported = false;
        }
      }
      setEnabled(media.matches && !!supported);
      setReady(false);
    };
    update();
    media.addEventListener('change', update);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (root.current) observer.observe(root.current);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      media.removeEventListener('change', update);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  const live = enabled && !failed;
  return (
    <div ref={root} className="core-visual">
      <div className="core-halo" />
      <div className={`core-static ${live && ready ? 'is-hidden' : ''}`}>
        <NeuralFallback />
      </div>
      {live && (
        <div className="core-canvas" aria-hidden="true">
          <SceneBoundary onError={onUnavailable}>
            <NeuralScene
              paused={paused || !visible || !pageVisible}
              onReady={onReady}
              onUnavailable={onUnavailable}
            />
          </SceneBoundary>
        </div>
      )}
      <div className="core-annotation annotation-top">
        <span className="tiny-cross">+</span>
        <span>
          NOYAU NEURONAL
          <br />
          <b>{live && ready ? 'MODÈLE INTERACTIF' : 'STRUCTURE NEURONALE'}</b>
        </span>
      </div>
      <div className="core-annotation annotation-bottom">
        <span className="annotation-line" />
        <span>ALGORITHME → SYSTÈME</span>
      </div>
      {live && ready && (
        <button
          type="button"
          className="animation-control"
          aria-label={
            paused
              ? 'Reprendre l’animation 3D'
              : 'Mettre l’animation 3D en pause'
          }
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
          <span>{paused ? 'Reprendre' : 'Pause'}</span>
        </button>
      )}
    </div>
  );
}
