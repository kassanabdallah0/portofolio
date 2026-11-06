'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Check, Pause, Play, RotateCcw } from 'lucide-react';
import { simulations, type DemoType } from '@/data/simulations';
import EngineeringBlueprint from './EngineeringBlueprint';
import { useSimulation } from './useSimulation';

/**
 * Shared simulation controller. The project-specific view lives in
 * EngineeringBlueprint: no hidden duplicate SVG scene or second animation clock.
 */
export default function EngineeringDemo({ type }: { type: DemoType }) {
  const root = useRef<HTMLDivElement>(null);
  const controlId = useId();
  const trackedPerson = useRef<SVGGElement | null>(null);
  const requestAt = useRef<number | null>(null);
  const requestValue = useRef(60);
  const confirmedUntil = useRef(0);
  const restoredRef = useRef(false);

  const definition = simulations[type];
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);
  const [inspected, setInspected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [sensitivity, setSensitivity] = useState(60);
  const [applied, setApplied] = useState(60);
  const [pending, setPending] = useState(false);
  const [selectedBus, setSelectedBus] = useState(0);
  const [rollback, setRollback] = useState(false);
  const [restored, setRestored] = useState(false);

  const draw = useCallback((seconds: number) => {
    const duration = type === 'vision' ? 18 : type === 'interface' ? 12 : 16;
    const phase = (seconds % duration) / duration;
    const stages = simulations[type].stages.length;
    let next = Math.min(stages - 1, Math.floor(phase * stages));
    let progress = (phase * stages) % 1;

    if (type === 'interface') {
      if (seconds < confirmedUntil.current) next = 4;
      if (requestAt.current !== null) {
        const age = seconds - requestAt.current;
        next = Math.min(4, Math.floor(age / 0.65));
        progress = (age / 0.65) % 1;
        if (age >= 3.25) {
          requestAt.current = null;
          confirmedUntil.current = seconds + 2;
          setApplied(requestValue.current);
          setPending(false);
          next = 4;
        }
      }
    }

    if (type === 'delivery' && rollback && phase > 0.94 && !restoredRef.current) {
      restoredRef.current = true;
      setRestored(true);
    }

    root.current?.style.setProperty('--step-progress', String(progress));
    if (next !== stageRef.current) {
      stageRef.current = next;
      setStage(next);
    }

    // Animate the REAL, visible industrial scene. The same clock drives stages,
    // pause/resume, visibility suspension and the test-observable worker.
    if (trackedPerson.current) {
      const dx = type === 'scan' ? Math.sin(seconds * 0.34) * 5 : Math.sin(seconds * 0.52) * 32;
      trackedPerson.current.setAttribute('transform', `translate(${dx.toFixed(2)} 0)`);
    }
  }, [type, rollback]);

  const { running, reduced, time } = useSimulation(root, paused, draw);
  useEffect(() => {
    trackedPerson.current = root.current?.querySelector<SVGGElement>('[data-person]') ?? null;
    return () => { trackedPerson.current = null; };
  }, [type]);

  useEffect(() => {
    if (reduced && pending) {
      requestAt.current = null;
      setApplied(requestValue.current);
      setPending(false);
      setStage(4);
      stageRef.current = 4;
    }
  }, [reduced, pending]);

  const apply = () => {
    if (paused || reduced) {
      requestAt.current = null;
      setApplied(sensitivity);
      setStage(4);
      stageRef.current = 4;
      setPending(false);
      return;
    }
    requestAt.current = time.current;
    requestValue.current = sensitivity;
    setPending(true);
    setInspected(null);
  };

  const toggleRollback = () => {
    setRollback(!rollback);
    setRestored(false);
    restoredRef.current = false;
  };
  const focus = hovered ?? inspected ?? stage;
  const displayStage = inspected ?? stage;

  return (
    <div
      ref={root}
      className={`engineering-demo glass-instrument demo-${type}`}
      data-demo={type}
      data-running={running}
      data-stage={stage}
    >
      <div className="demo-heading">
        <span>{definition.title}</span>
        <button
          type="button"
          className="demo-pause"
          disabled={reduced}
          onClick={() => setPaused((value) => !value)}
          aria-label={`${paused ? 'Reprendre' : 'Mettre en pause'} : ${definition.title}`}
          aria-pressed={paused}
        >
          {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
          <span>{reduced ? 'Vue fixe' : paused ? 'Reprendre' : 'Pause'}</span>
        </button>
      </div>

      <div className="demo-world demo-world--blueprint">
        <EngineeringBlueprint
          type={type}
          stage={displayStage}
          running={running && inspected === null}
          sensitivity={sensitivity}
          applied={applied}
          selectedBus={selectedBus}
          rollback={rollback}
          restored={restored}
          pending={pending}
        />
      </div>

      {type === 'interface' && (
        <div className="demo-interaction manager-controls">
          <label htmlFor={controlId}>
            Taille de zone <output>{sensitivity}%</output>
            <input
              id={controlId}
              aria-label="Taille de la zone"
              type="range"
              min="20"
              max="100"
              value={sensitivity}
              onChange={(event) => setSensitivity(Number(event.target.value))}
            />
          </label>
          <button type="button" onClick={apply} disabled={pending}>
            {pending ? 'Transmission…' : 'Appliquer'}
            {pending ? <ArrowRight size={13} /> : <Check size={13} />}
          </button>
          <span role="status" aria-label="État de la configuration">
            {pending ? 'Configuration en cours' : `Configuration active : ${applied}%`}
          </span>
        </div>
      )}

      {type === 'cloud' && (
        <div className="demo-interaction fleet-controls">
          <span>Suivre un bus</span>
          <div role="group" aria-label="Choisir un bus illustratif">
            {['A', 'B', 'C'].map((bus, index) => (
              <button
                type="button"
                key={bus}
                aria-pressed={selectedBus === index}
                onClick={() => setSelectedBus(index)}
              >
                Bus {bus}
              </button>
            ))}
          </div>
          <p>Bus {String.fromCharCode(65 + selectedBus)} → tunnel VPN → services AWS</p>
        </div>
      )}

      {type === 'delivery' && (
        <div className="demo-interaction delivery-controls">
          <span>Scénario illustratif</span>
          <button type="button" aria-pressed={rollback} onClick={toggleRollback}>
            <RotateCcw size={13} />
            {rollback ? 'Retour à la version stable' : 'Explorer le rollback'}
          </button>
        </div>
      )}

      <div className="architecture" aria-label={`Architecture : ${definition.title}`}>
        <div className="architecture-stages">
          {definition.stages.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className={`${stage === index ? 'is-active' : ''} ${focus === index ? 'is-inspected' : ''}`}
              aria-pressed={inspected === index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              onClick={() => setInspected(inspected === index ? null : index)}
            >
              <span className="stage-index">{String(index + 1).padStart(2, '0')}</span>
              <span>{item.name}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="stage-explanation">
          <span>{definition.stages[focus].name}</span>
          {definition.stages[focus].explanation}
        </p>
      </div>

      <p className="demo-caption">
        Simulation illustrative
        {type === 'interface' ? ' · interactions locales' : ''}{' '}
        <span>Sélectionnez une étape pour voir son état dans le schéma.</span>
      </p>
    </div>
  );
}
