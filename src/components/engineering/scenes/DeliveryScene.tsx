'use client';

import { useId, type ReactNode } from 'react';
import {
  ArrowDown,
  Check,
  CheckCheck,
  Circle,
  Container,
  GitCommitHorizontal,
  GitBranch,
  ShieldCheck,
  Terminal,
  Undo2,
} from 'lucide-react';

type Props = {
  stage: number;
  running: boolean;
  rollback: boolean;
  restored: boolean;
  hardware?: ReactNode;
  cycle?: number;
};

/** Portable technical cutaway used when the shared 3D device renderer is unavailable. */
export function JetsonIllustration({
  state,
}: {
  state: 'stable' | 'updating' | 'warning';
}) {
  const id = useId().replace(/:/g, '');
  const indicator =
    state === 'warning'
      ? '#e9b36c'
      : state === 'updating'
        ? '#9cd6ed'
        : '#8fd6b5';
  return (
    <svg
      viewBox="0 0 430 290"
      role="img"
      aria-label="Illustration technique d’un calculateur Jetson : dissipateur, ventilateur, ports USB, Ethernet et alimentation"
      className="eng-jetson-drawing"
    >
      <defs>
        <linearGradient id={id + '-metal'} x1="0" y1="0" x2=".8" y2="1">
          <stop stopColor="#a5b3bd" />
          <stop offset=".5" stopColor="#6e818e" />
          <stop offset="1" stopColor="#354c5d" />
        </linearGradient>
        <linearGradient id={id + '-board'} x2="0" y2="1">
          <stop stopColor="#3c675c" />
          <stop offset="1" stopColor="#233c3c" />
        </linearGradient>
      </defs>
      <ellipse cx="215" cy="246" rx="157" ry="21" fill="#07131f" opacity=".5" />
      <path
        d="M61 163L232 112L377 179L208 239Z"
        fill="#172e3c"
        stroke="#496376"
      />
      <path
        d="M61 151L232 100L377 167L208 227Z"
        fill={'url(#' + id + '-board)'}
        stroke="#85a29a"
        strokeWidth="1.5"
      />
      <path
        d="M61 151V163L208 239V227ZM208 227L377 167V179L208 239"
        fill="#1c363c"
      />
      <path
        d="M94 126L241 81L347 131L198 180Z"
        fill="#283d4a"
        stroke="#bac6cf"
      />
      <path
        d="M94 126V148L198 203V180ZM198 180L347 131V154L198 203"
        fill={'url(#' + id + '-metal)'}
      />
      {Array.from({ length: 18 }, (_, i) => (
        <path
          key={i}
          d={`M${102 + i * 8} ${123 - i * 2.4}V${141 - i * 2.4}L${202 + i * 8} ${194 - i * 2.5}V${176 - i * 2.5}Z`}
          fill={i % 2 ? '#6e8493' : '#a4b3bd'}
          stroke="#243b4b"
          strokeWidth=".6"
        />
      ))}
      <path
        d="M123 95L237 61L322 101L207 140Z"
        fill="#607886"
        stroke="#afbec8"
      />
      <path
        d="M123 95V112L207 156V140ZM207 140L322 101V118L207 156"
        fill="#2d4656"
        stroke="#718995"
      />
      <ellipse
        cx="222"
        cy="101"
        rx="54"
        ry="25"
        fill="#1b303d"
        stroke="#9eb0bc"
        strokeWidth="2"
      />
      <g transform="translate(222 101) scale(1 .48)">
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            transform={`rotate(${i * 40})`}
            d="M4-7Q12-43 34-35Q47-25 42-11Q19-23 7 4Z"
            fill="#4b6372"
            stroke="#8a9eab"
            strokeWidth=".7"
          />
        ))}
        <circle r="12" fill="#1b2c37" stroke="#a3b4be" />
      </g>
      {[
        [133, 96],
        [235, 68],
        [309, 102],
        [208, 132],
      ].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <ellipse rx="3.3" ry="1.8" fill="#d9e1e4" />
          <path d="M-1.5 0H1.5" stroke="#526776" strokeWidth=".6" />
        </g>
      ))}
      <g stroke="#9dacb5" strokeWidth="1">
        <path d="M71 157L99 170V190L71 175Z" fill="#90a2af" />
        <path d="M76 163L94 172V183L76 173Z" fill="#192f3c" />
        <path d="M106 174L134 187V205L106 192Z" fill="#a2b3bd" />
        <path d="M111 180L129 188V197L111 188Z" fill="#17475c" />
        <path d="M143 191L171 204V220L143 207Z" fill="#98aab4" />
        <path d="M148 196L166 205V214L148 205Z" fill="#17475c" />
      </g>
      <path d="M271 191L298 181V194L271 204Z" fill="#b0bec4" stroke="#526d7b" />
      <path d="M275 193L294 186V191L275 198Z" fill="#162b39" />
      <path d="M312 177L332 170V183L312 190Z" fill="#172b36" stroke="#9caeb7" />
      <ellipse cx="322" cy="179" rx="3" ry="4" fill="#adbac1" />
      <path
        d="M332 181Q387 208 392 251"
        fill="none"
        stroke="#071922"
        strokeWidth="5"
      />
      <path
        d="M332 180Q387 207 392 250"
        fill="none"
        stroke="#516b7b"
        strokeWidth="1.5"
      />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d={`M${242 + i * 7} ${164 - i * 2.4}V${155 - i * 2.4}`}
          stroke="#b3a16e"
          strokeWidth="2.2"
        />
      ))}
      <circle cx="197" cy="217" r="3" fill={indicator} />
      <g fill="#a8c3d1" fontFamily="monospace" fontSize="9">
        <text x="44" y="255">
          USB / REALSENSE
        </text>
        <text x="282" y="263">
          HDMI / RÉSEAU
        </text>
      </g>
      <path
        d="M86 244V198M307 250V213"
        fill="none"
        stroke="#608294"
        strokeDasharray="3 4"
      />
    </svg>
  );
}

const ciSteps = [
  { label: 'Tag Git', detail: '', icon: GitCommitHorizontal },
  { label: 'GitLab CI', detail: 'Jest · pytest', icon: GitBranch },
  { label: 'Registry', detail: 'image Docker', icon: Container },
];

export default function DeliveryScene({
  stage,
  running,
  rollback,
  restored,
  hardware,
  cycle = 0,
}: Props) {
  const failure = rollback && stage === 4 && !restored;
  const recovered = rollback && stage === 4 && restored;
  const previousVersion = `v1.2.${rollback ? 3 : 3 + cycle}`;
  const candidateVersion = `v1.2.${4 + cycle}`;
  const activeVersion =
    recovered || stage < 3 ? previousVersion : candidateVersion;
  const state = failure
    ? 'warning'
    : stage === 2 || stage === 3
      ? 'updating'
      : 'stable';
  const lines = [
    {
      visible: true,
      prefix: '$',
      text:
        stage < 2
          ? `await release ${candidateVersion}`
          : `deploy --version ${candidateVersion}`,
      kind: 'command',
    },
    {
      visible: stage >= 2,
      prefix: '✓',
      text: 'RealSense / USB · caméra disponible',
      kind: 'ok',
    },
    {
      visible: stage >= 2,
      prefix: '✓',
      text: 'Images Docker · modèles vérifiés',
      kind: 'ok',
    },
    {
      visible: stage >= 3,
      prefix: '→',
      text: `Activation contrôlée de ${candidateVersion}`,
      kind: 'info',
    },
    {
      visible: stage === 4 && !rollback,
      prefix: '✓',
      text: 'Health checks / smoke tests validés',
      kind: 'ok',
    },
    {
      visible: failure,
      prefix: '!',
      text: 'Health check en échec · repli en cours',
      kind: 'warning',
    },
    {
      visible: recovered,
      prefix: '↶',
      text: `${previousVersion} restaurée · contrôles validés`,
      kind: 'ok',
    },
  ];
  return (
    <section
      className="eng-delivery"
      data-motion={running ? 'running' : 'paused'}
      data-release-state={
        recovered
          ? 'restored'
          : failure
            ? 'rollback'
            : stage < 2
              ? 'preparation'
              : stage < 4
                ? 'activation'
                : 'healthy'
      }
      aria-label="Release Jetson préparée par CI et activée par commande locale"
    >
      <header className="eng-delivery-heading">
        <div>
          <span className="eng-eyebrow">DE LA RELEASE AU TERRAIN</span>
          <h4>Préparer. Vérifier. Activer.</h4>
        </div>
        <span className="eng-simulation-tag">SCÉNARIO ILLUSTRATIF</span>
      </header>
      <div
        className="eng-ci-lane"
        aria-label="Préparation automatique en intégration continue"
      >
        <span className="eng-lane-label">CI AUTOMATIQUE</span>
        {ciSteps.map(({ label, detail, icon: Icon }, i) => (
          <div
            key={label}
            className={
              'eng-ci-step ' + (stage >= (i === 0 ? 0 : 1) ? 'is-ready' : '')
            }
          >
            <span className="eng-ci-icon">
              <Icon size={19} />
            </span>
            <div>
              <strong>{label}</strong>
              <small>{i === 0 ? candidateVersion : detail}</small>
            </div>
            {stage > 1 ? <Check size={13} /> : <Circle size={10} />}
          </div>
        ))}
      </div>
      <div className="eng-local-boundary">
        <span />
        <ArrowDown size={13} />
        <strong>Déploiement déclenché par une commande locale</strong>
        <span />
      </div>
      <div className="eng-device-console">
        <div className="eng-device-stage">
          <div className="eng-device-caption">
            <CpuGlyph />
            <span>
              JETSON ORIN <small>ÉQUIPEMENT DÉJÀ PROVISIONNÉ</small>
            </span>
            <span className={'eng-device-status is-' + state}>
              {failure
                ? 'REPLI'
                : stage === 2 || stage === 3
                  ? 'MISE À JOUR'
                  : 'DISPONIBLE'}
            </span>
          </div>
          <div className="eng-device-view">
            {hardware ?? <JetsonIllustration state={state} />}
          </div>
          <div className="eng-release-slots">
            <div>
              <span>VERSION ACTIVE</span>
              <strong>{activeVersion}</strong>
            </div>
            <div>
              <span>VERSION DE SECOURS</span>
              <strong>
                {previousVersion} <ShieldCheck size={13} />
              </strong>
            </div>
          </div>
        </div>
        <div className="eng-deploy-terminal">
          <div className="eng-terminal-chrome">
            <Terminal size={14} />
            <span>jetson / déploiement local</span>
            <span>EXEMPLE</span>
          </div>
          <div
            className="eng-terminal-lines"
            role="group"
            aria-label="Journal de déploiement simulé"
          >
            {lines
              .filter((line) => line.visible)
              .map((line) => (
                <div
                  key={line.text}
                  className={'eng-terminal-line is-' + line.kind}
                >
                  <span>{line.prefix}</span>
                  <code>{line.text}</code>
                </div>
              ))}
          </div>
          <div
            className={
              'eng-terminal-result ' +
              (failure
                ? 'is-warning'
                : recovered || stage === 4
                  ? 'is-success'
                  : '')
            }
          >
            {failure ? (
              <Undo2 size={18} />
            ) : recovered || stage === 4 ? (
              <CheckCheck size={18} />
            ) : (
              <ShieldCheck size={18} />
            )}
            <div>
              <strong>
                {failure
                  ? 'Restauration de la version précédente'
                  : recovered
                    ? 'Service restauré'
                    : stage === 4
                      ? 'Release validée'
                      : stage < 2
                        ? 'La CI prépare la release'
                        : 'Activation locale contrôlée'}
              </strong>
              <span>
                {failure
                  ? 'La nouvelle version reste en échec jusqu’au repli terminé.'
                  : recovered
                    ? `${previousVersion} · retour validé après contrôle de santé`
                    : stage < 2
                      ? 'La publication ne déclenche pas le déploiement.'
                      : stage === 4
                        ? `${candidateVersion} · contrôles de santé terminés`
                        : 'Matériel → dépendances → service → santé'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CpuGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="12" height="12" rx="2" stroke="currentColor" />
      <rect x="8" y="8" width="6" height="6" rx="1" stroke="currentColor" />
      <path
        d="M8 2V5M14 2V5M8 17V20M14 17V20M2 8H5M2 14H5M17 8H20M17 14H20"
        stroke="currentColor"
      />
    </svg>
  );
}
