'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Boxes, Camera, Gauge, RotateCcw, ScanEye } from 'lucide-react';
import type { SceneProps, SceneView } from '../core/types';
import { visionState } from './visionTimeline';
const Scene = dynamic(() => import('../../Engineering3DScene'), {
  ssr: false,
  loading: () => (
    <div className="lab-3d-loading">Préparation de l’atelier…</div>
  ),
});
const names = {
  normal: 'Surveillance active',
  approach: 'Personne observée',
  detection: 'Entrée dans la zone A',
  tracking: 'Suivi · personne 01',
  confirmation: 'Observations successives',
  alert: 'Zone A · présence confirmée',
  departure: 'Retour à la surveillance',
};
export default function VisionExperience({
  fallback,
  onReplay,
  ...props
}: SceneProps & { fallback: ReactNode; onReplay?: () => void }) {
  const [view, setView] = useState<SceneView>('physical');
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Paint the exhibit controls before initializing GPU resources. Debounce transient visibility
    // while dialogs open/close to avoid creating short-lived GPU contexts.
    const id = setTimeout(() => setReady(true), props.lowPower ? 2500 : 180);
    return () => clearTimeout(id);
  }, [props.lowPower]);
  const root = useRef<HTMLElement>(null),
    last = useRef('');
  const scenario = props.visionScenario ?? 'normal';
  useEffect(() => {
    let id = 0;
    const draw = () => {
      const s = visionState(props.time.current, scenario),
        key = [s.phase, s.observations, s.observed, scenario].join(':');
      if (root.current && last.current !== key) {
        last.current = key;
        root.current.dataset.visionPhase = s.phase;
        root.current.dataset.visionObserved = String(s.observed);
        root.current.dataset.visionConfirmed = String(s.confirmed);
        const status = root.current.querySelector('[data-vision-status]');
        if (status) status.textContent = names[s.phase as keyof typeof names];
        root.current
          .querySelectorAll<HTMLElement>('[data-evidence]')
          .forEach((el, i) => {
            el.dataset.active = String(i < s.observations);
          });
        const counter = root.current.querySelector('[data-evidence-count]');
        if (counter) counter.textContent = s.observations + ' / 10';
      }
      if (props.running) id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [props.time, props.running, props.stage, scenario]);
  if (failed)
    return (
      <div
        className="lab-3d-unsupported"
        role="group"
        data-renderer="2d"
        aria-label="Illustration de secours"
      >
        {fallback}
      </div>
    );
  return (
    <section
      ref={root}
      className="lab-three-story lab-three-story--vision vision-experience"
      data-three-scene="vision"
      data-render-tier={props.lowPower ? 'software' : 'hardware'}
      data-view={view}
      aria-label="SecuriSPOT · atelier surveillé"
    >
      <div className="vision-toolbar">
        <span>
          <i /> SECURISPOT / VISION
        </span>
        <div role="group" aria-label="Perspectives SecuriSPOT">
          {(
            [
              { id: 'physical', label: 'Atelier', icon: Boxes },
              { id: 'camera', label: 'Caméra', icon: Camera },
              { id: 'architecture', label: 'Pipeline', icon: ScanEye },
              { id: 'comparison', label: '5 → 30 FPS', icon: Gauge },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
              key={id}
            >
              <Icon size={13} />
              <span>{label}</span>
            </button>
          ))}
          {onReplay && (
            <button
              type="button"
              onClick={onReplay}
              aria-label="Rejouer le scénario"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </div>
      </div>
      <div className="lab-three-stage vision-stage">
        {ready ? (
          <Scene
            {...props}
            mode="vision"
            view={view}
            onUnavailable={() => setFailed(true)}
          />
        ) : (
          <div className="vision-loading-preview" aria-hidden="true" inert>
            {fallback}
          </div>
        )}
        {view === 'camera' && (
          <div className="vision-camera-label">
            <i /> REALSENSE · CAM-01 <span>IMAGE SYNTHÉTIQUE</span>
          </div>
        )}
        <div
          data-tracking-box="true"
          className="eng-tracking-box vision-track"
          aria-hidden="true"
        >
          <span>PERSONNE · ID 01</span>
          <i>observation directe</i>
        </div>
        {view === 'architecture' && <VisionPipeline stage={props.stage} />}
        {view === 'comparison' && (
          <Throughput time={props.time} running={props.running} />
        )}
        <div className="vision-event" data-vision-event="true">
          <span>ZONE A</span>
          <strong>Présence confirmée</strong>
          <small>PERSONNE 01 · SCÉNARIO ILLUSTRATIF</small>
        </div>
        <div className="vision-statusbar">
          <span>
            <i />
            <strong data-vision-status="true">Surveillance active</strong>
          </span>
          <div
            className="vision-evidence"
            role="group"
            aria-label="Observations successives dans la zone"
          >
            <span>
              {Array.from({ length: 10 }, (_, i) => (
                <i data-evidence={i} key={i} />
              ))}
            </span>
            <small data-evidence-count="true">0 / 10</small>
          </div>
        </div>
      </div>
      <div className="vision-footer">
        <button
          type="button"
          aria-pressed={scenario === 'brief'}
          onClick={() =>
            props.onVisionScenarioChange?.(
              scenario === 'normal' ? 'brief' : 'normal',
            )
          }
        >
          {scenario === 'brief'
            ? 'Passage bref · sans alarme'
            : 'Explorer un passage bref'}
        </button>
        <span>Reconstitution illustrative · hors ligne</span>
      </div>
      <p className="vision-scope">
        <b>TRAITEMENT SUR JETSON · ≈ 5 → 30 FPS</b>
        <span>Débit observé sur le terrain, pas cadence d’affichage.</span>
      </p>
    </section>
  );
}
function VisionPipeline({ stage }: { stage: number }) {
  return (
    <aside
      className="vision-pipeline"
      aria-label="Pipeline de vision embarquée"
    >
      <span>IMAGES → MÉTADONNÉES → ÉVÉNEMENT</span>
      <ol>
        {[
          'RealSense',
          'OpenCV',
          'YOLO / TensorRT',
          'Suivi · identifiant + boîte',
          'FIFO · règles temporelles',
          'Dispositif d’alerte',
        ].map((label, i) => (
          <li key={label} className={i <= stage + 1 ? 'is-lit' : ''}>
            <i />
            {label}
          </li>
        ))}
      </ol>
      <p>
        Exemple ralenti : 10 observations. FIFO d’environ 30 frames et seuils
        configurables dans le projet.
      </p>
    </aside>
  );
}
function Throughput({ time, running }: Pick<SceneProps, 'time' | 'running'>) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    let id = 0;
    const draw = () => {
      root.current
        ?.querySelectorAll<HTMLElement>('[data-frame-rate]')
        .forEach((el) => {
          const rate = Number(el.dataset.frameRate),
            processed = Math.floor(time.current * rate) % rate;
          el.style.setProperty('--processed', String(processed / rate));
          const count = el.querySelector('output');
          if (count) count.textContent = String(processed + 1).padStart(2, '0');
        });
      if (running) id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [time, running]);
  return (
    <aside ref={root} className="vision-throughput">
      <span>OPTIMISATION DU PIPELINE</span>
      <h4>Plus d’images traitées.</h4>
      {[
        [5, 'Pipeline initial'],
        [30, 'Pipeline optimisé'],
      ].map(([rate, label]) => (
        <div key={rate} data-frame-rate={rate}>
          <span>
            {label}
            <b>≈ {rate} FPS</b>
          </span>
          <div className="vision-frame-stream">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <small>
            IMAGE TRAITÉE <output>01</output>
          </small>
        </div>
      ))}
      <p>
        Rapport illustratif ×6 · estimations terrain.
        <br />
        Cette animation ne mesure pas le navigateur.
      </p>
    </aside>
  );
}
