'use client';
import { useEffect, useRef } from 'react';
import { visionState, forkliftPose, workerPose } from './visionTimeline';
import type { SceneProps } from '../core/types';
const screen = (x: number, z: number) => ({
  x: 350 + x * 23 - z * 23,
  y: 194 + x * 10 + z * 10,
});
/** Lightweight technical illustration; uses the same physical state as WebGL. */
export default function VisionFallback({
  time,
  running,
  stage,
  visionScenario = 'normal',
  onVisionScenarioChange,
}: Pick<
  SceneProps,
  'time' | 'running' | 'stage' | 'visionScenario' | 'onVisionScenarioChange'
>) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id = 0;
    const draw = () => {
      if (!root.current) return;
      const s = visionState(time.current, visionScenario);
      root.current.dataset.visionConfirmed = String(s.confirmed);
      root.current.dataset.visionPhase = s.phase;
      for (let i = 0; i < 3; i++) {
        const p = workerPose(time.current, i),
          q = screen(p.x, p.z);
        root.current
          .querySelector('[data-vision-worker="' + i + '"]')
          ?.setAttribute('transform', `translate(${q.x} ${q.y})`);
      }
      const f = forkliftPose(time.current),
        q = screen(f.x, f.z);
      root.current
        .querySelector('[data-vision-forklift]')
        ?.setAttribute('transform', `translate(${q.x} ${q.y})`);
      const box = root.current.querySelector<SVGRectElement>(
        '[data-fallback-track]',
      );
      const p = screen(s.pose.x, s.pose.z);
      if (box) {
        box.setAttribute('x', String(p.x - 13));
        box.setAttribute('y', String(p.y - 54));
        box.style.opacity = s.inside && s.observed ? '1' : '0';
      }
      const text = root.current.querySelector('[data-fallback-status]');
      if (text)
        text.textContent = s.confirmed
          ? 'ZONE A · PRÉSENCE CONFIRMÉE'
          : s.inside
            ? 'ZONE A · ' + s.observations + ' / 10 observations'
            : 'Surveillance · atelier en activité';
      if (running) id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [time, running, stage, visionScenario]);
  return (
    <div ref={root} className="vision-fallback">
      <div className="vision-fallback-label">
        <span>SECURISPOT / ATELIER</span>
        <span>VUE LÉGÈRE</span>
      </div>
      <svg
        viewBox="0 0 700 410"
        role="img"
        aria-label="Atelier surveillé, travailleurs, chariot élévateur et zone de sécurité. Illustration de secours."
      >
        <rect width="700" height="410" fill="#c4d1d5" />
        <g transform="translate(350 194) matrix(23 10 -23 10 0 0)">
          <rect
            x="-7"
            y="-5"
            width="14"
            height="10"
            rx=".15"
            fill="#b1bebd"
            stroke="#708894"
            strokeWidth=".09"
          />
          {[-4, 0, 4].map((v) => (
            <path
              key={v}
              d={`M${v} -5V5M-7 ${v}H7`}
              stroke="#9aaead"
              strokeWidth=".025"
            />
          ))}
          <rect x="-6.2" y="3.25" width="12" height="1" fill="#6e8e80" />
          <rect
            x="3.8"
            y="-4.5"
            width="2.8"
            height="7"
            fill="#93a5a7"
            stroke="#d7b96e"
            strokeWidth=".07"
          />
          <rect
            x={visionScenario === 'brief' ? -0.3 : -0.9}
            y={visionScenario === 'brief' ? 1.1 : 0.2}
            width={visionScenario === 'brief' ? 0.75 : 3.6}
            height={visionScenario === 'brief' ? 0.7 : 1.9}
            className="vision-fallback-zone"
            strokeWidth=".09"
          />
        </g>
        <g transform="translate(323 111)">
          <path d="M-80 6L12-34 69-9-24 33Z" fill="#637b86" />
          <path
            d="M-80 6V64L-24 91V33M-24 33L69-9V49L-24 91"
            fill="#b9c6c8"
            stroke="#627d8a"
          />
          <path d="M-64 20L-31 35V69L-64 53Z" fill="#264959" />
          <path d="M-18 40L28 20V49L-18 68Z" fill="#486d7b" />
        </g>
        <g transform="translate(452 98)" fill="#6b8590" stroke="#c4d4d5">
          <path d="M-20 0L61-35V29L-20 64Z" />
          <path d="M-20 20L61-15M-20 41L61 5" />
          <path d="M5-11V51M33-23V40" />
        </g>
        <g transform="translate(306 112)">
          <path d="M0 0V78" stroke="#738f9d" strokeWidth="4" />
          <rect
            x="-15"
            y="-5"
            width="30"
            height="10"
            rx="4"
            fill="#e0e9e9"
            stroke="#38596b"
          />
          <circle cx="-8" r="3" fill="#315b72" />
          <circle cx="8" r="3" fill="#315b72" />
          <path
            d="M-6 6L69 119M9 6L196 119"
            stroke="#6095ad"
            strokeWidth="1"
            opacity=".4"
          />
        </g>
        {[0, 1, 2].map((i) => (
          <g key={i} data-vision-worker={i} transform={initialPosition(i)}>
            <ellipse cy="1" rx="10" ry="4" fill="#4a677444" />
            <path
              d="M-4-17L-6-1M4-17L7-1"
              stroke="#344e59"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M-9-37H9L11-17H-11Z"
              fill={i === 1 ? '#c8bd6a' : '#d6aa55'}
            />
            <path d="M-5-35V-20M5-35V-20" stroke="#e4e9d7" strokeWidth="2" />
            <path
              d="M-10-35L-13-19M10-35L13-19"
              stroke="#6d8b98"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cy="-44" r="6" fill="#bb977e" />
            <path d="M-9-46Q0-59 9-46Z" fill="#e4c975" />
          </g>
        ))}
        <g data-vision-forklift="true" transform={initialPosition(3)}>
          <ellipse cy="-1" rx="23" ry="7" fill="#647c8b55" />
          <path d="M-20-22H14V-5H-20Z" fill="#d6b655" stroke="#62767e" />
          <path
            d="M-13-23V-48H9V-23M-16-48H12"
            stroke="#425f6c"
            strokeWidth="3"
            fill="none"
          />
          <rect x="15" y="-50" width="4" height="44" fill="#405b68" />
          <path d="M19-8H39M19-3H35" stroke="#687d86" strokeWidth="3" />
          <circle cx="-12" cy="-5" r="6" fill="#31434c" />
          <circle cx="11" cy="-5" r="7" fill="#31434c" />
        </g>
        <rect
          data-fallback-track="true"
          width="26"
          height="57"
          fill="none"
          stroke="#3a877c"
          strokeWidth="1.5"
          opacity="0"
        />
      </svg>
      <div className="vision-fallback-status" data-fallback-status="true">
        Surveillance · atelier en activité
      </div>
      <div className="vision-footer">
        <button
          type="button"
          aria-pressed={visionScenario === 'brief'}
          onClick={() =>
            onVisionScenarioChange?.(
              visionScenario === 'normal' ? 'brief' : 'normal',
            )
          }
        >
          {visionScenario === 'brief'
            ? 'Passage bref · sans alarme'
            : 'Explorer un passage bref'}
        </button>
        <span>Illustration · hors ligne</span>
      </div>
      <p className="vision-scope">
        <b>TRAITEMENT SUR JETSON · ≈ 5 → 30 FPS</b>
        <span>
          Observations successives avant confirmation. Exemple ralenti.
        </span>
      </p>
    </div>
  );
}

function initialPosition(index: number) {
  const p = index === 3 ? forkliftPose(0) : workerPose(0, index),
    q = screen(p.x, p.z);
  return `translate(${q.x} ${q.y})`;
}
