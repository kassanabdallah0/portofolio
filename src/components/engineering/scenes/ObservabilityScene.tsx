'use client';

import { useId } from 'react';
import {
  ArrowRight,
  Database,
  FileText,
  LockKeyhole,
  Search,
  ShieldCheck,
  Timer,
  Trash2,
} from 'lucide-react';

type Props = { stage: number; running: boolean };

/** An architectural cutaway, with synthetic documents and historical scale clearly separated. */
export default function ObservabilityScene({ stage, running }: Props) {
  const id = useId().replace(/:/g, '');
  return (
    <section
      className="eng-observability"
      data-motion={running ? 'running' : 'paused'}
      data-index-stage={stage}
      aria-label="Observabilité ELK, cluster à trois nœuds et rétention des index"
    >
      <header className="eng-observability-header">
        <div>
          <span className="eng-eyebrow">OBSERVABILITÉ & MAINTENANCE</span>
          <h4>Du journal à la compréhension.</h4>
        </div>
        <span className="eng-tls-badge">
          <LockKeyhole size={13} /> TLS
        </span>
      </header>
      <div className="eng-observability-system">
        <div className="eng-ingest-source">
          <span className="eng-node-kicker">APPLICATIONS</span>
          <div className="eng-log-stack">
            <FileText size={20} />
            <code>INFO</code>
            <code>WARN</code>
            <code>EVENT</code>
          </div>
          <strong>Journaux</strong>
          <span>Traces synthétiques</span>
        </div>
        <div
          className={'eng-data-link ' + (stage >= 1 ? 'is-active' : '')}
          aria-hidden="true"
        >
          <i />
          <ArrowRight size={12} />
        </div>
        <div className={'eng-logstash ' + (stage >= 1 ? 'is-active' : '')}>
          <span className="eng-node-kicker">INGESTION</span>
          <svg width="58" height="68" viewBox="0 0 58 68" aria-hidden="true">
            <path
              d="M4 10L29 2L54 10V44L29 57L4 44Z"
              fill="#354b61"
              stroke="#7797ad"
            />
            <path d="M4 10L29 20L54 10M29 20V57" stroke="#94b2c6" fill="none" />
            <path
              d="M12 23L23 27M12 30L23 34M12 37L23 41M35 27L46 23M35 34L46 30M35 41L46 37"
              stroke="#b9d7e6"
              strokeWidth="2"
            />
          </svg>
          <strong>Logstash</strong>
          <span>Préparer les événements</span>
        </div>
        <div
          className={'eng-data-link ' + (stage >= 2 ? 'is-active' : '')}
          aria-hidden="true"
        >
          <i />
          <ArrowRight size={12} />
        </div>
        <div className="eng-es-boundary">
          <div className="eng-es-label">
            <Database size={12} />
            <strong>ELASTICSEARCH</strong>
            <span>3 NŒUDS</span>
          </div>
          <svg
            className="eng-cluster-drawing"
            viewBox="0 0 400 220"
            role="img"
            aria-label="Trois nœuds Elasticsearch reliés par des communications TLS"
          >
            <defs>
              <linearGradient id={id + '-server'} x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#687d8e" />
                <stop offset="1" stopColor="#30495f" />
              </linearGradient>
            </defs>
            <path
              d="M40 179L201 123L363 179L201 231Z"
              fill="#152b40"
              stroke="#456480"
            />
            <g fill="none" stroke="#7a9db8" strokeWidth="1.5">
              <path d="M84 162L202 191L319 157M202 191V108" />
            </g>
            <g fill="#b2d5e5">
              <circle cx="84" cy="162" r="3" />
              <circle cx="202" cy="191" r="3" />
              <circle cx="319" cy="157" r="3" />
            </g>
            {[
              [48, 72, '01'],
              [165, 27, '02'],
              [282, 72, '03'],
            ].map(([x, y, name], i) => (
              <g key={name} transform={`translate(${x} ${y})`}>
                <path
                  d="M0 12L38 0L68 15L30 28Z"
                  fill="#8194a4"
                  stroke="#b1c5d4"
                />
                <path
                  d="M0 12L30 28V99L0 81Z"
                  fill="#233c52"
                  stroke="#6b8aa2"
                />
                <path
                  d="M30 28L68 15V85L30 99Z"
                  fill={'url(#' + id + '-server)'}
                  stroke="#8ba8bc"
                />
                {[0, 1, 2, 3].map((slot) => (
                  <g key={slot}>
                    <path
                      d={`M35 ${35 + slot * 14}L63 ${25 + slot * 14}V${33 + slot * 14}L35 ${43 + slot * 14}Z`}
                      fill="#192f43"
                      stroke="#6c8ca5"
                      strokeWidth=".6"
                    />
                    <path
                      d={`M40 ${37 + slot * 14}L51 ${33 + slot * 14}`}
                      stroke="#8caabc"
                    />
                    <circle
                      cx="58"
                      cy={31 + slot * 14}
                      r="1.5"
                      fill={stage >= 2 ? '#a0ddc6' : '#8daaba'}
                    />
                  </g>
                ))}
                <path
                  d="M6 29L22 37M6 36L22 44M6 43L22 51M6 50L22 58"
                  stroke="#526e84"
                />
                <text
                  x="17"
                  y="122"
                  fill="#d4e5ef"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  ES-{name}
                </text>
                {stage >= 2 && (
                  <circle
                    className={'eng-node-index-light eng-node-index-light-' + i}
                    cx="48"
                    cy="84"
                    r="2"
                    fill="#b9eace"
                  />
                )}
              </g>
            ))}
            <path
              className="eng-cluster-packet"
              d="M84 162L202 191L319 157"
              fill="none"
              stroke="#b4e0d6"
              strokeWidth="3"
              strokeDasharray="7 230"
            />
          </svg>
          <div className="eng-cluster-status">
            <LockKeyhole size={10} />
            <span>Communications inter-nœuds protégées</span>
          </div>
        </div>
        <div
          className={'eng-data-link ' + (stage >= 3 ? 'is-active' : '')}
          aria-hidden="true"
        >
          <i />
          <ArrowRight size={12} />
        </div>
        <div className="eng-kibana">
          <span className="eng-node-kicker">EXPLORATION</span>
          <div className="eng-kibana-screen">
            <div>
              <Search size={9} />
              <span>event.dataset: *</span>
            </div>
            <div className="eng-kibana-chart">
              {[
                24, 38, 31, 59, 43, 72, 52, 83, 61, 44, 67, 45, 56, 34, 61, 42,
              ].map((height, index) => (
                <i key={index} style={{ height: height + '%' }} />
              ))}
            </div>
            <div className="eng-kibana-rows">
              <i />
              <i />
              <i />
            </div>
          </div>
          <strong>Kibana</strong>
          <span>Recherche · diagnostic</span>
        </div>
      </div>
      <div className="eng-observability-bottom">
        <div className="eng-ilm-panel">
          <div className="eng-ilm-heading">
            <Timer size={15} />
            <strong>Une politique. 180 jours.</strong>
            <span>ILM</span>
          </div>
          <div
            role="group"
            className="eng-index-lifecycle"
            aria-label="Les index sont conservés 180 jours, puis supprimés automatiquement"
          >
            <span className="eng-index-origin">J0</span>
            <div className="eng-index-belt">
              {Array.from({ length: 10 }, (_, index) => (
                <span className="eng-retained-index" key={index}>
                  <Database size={10} />
                  <small>{index < 3 ? 'récent' : 'index'}</small>
                </span>
              ))}
            </div>
            <span className="eng-retention-boundary">J180</span>
            <div className="eng-expired-index">
              <Database size={11} />
            </div>
            <Trash2 size={17} />
          </div>
          <div className="eng-ilm-legend">
            <span>Événements indexés</span>
            <span>Conservation</span>
            <span>Suppression automatique</span>
          </div>
        </div>
        <aside className="eng-historical-scale">
          <span className="eng-eyebrow">
            <ShieldCheck size={12} /> VOLUMES HISTORIQUES
          </span>
          <div>
            <strong>
              306 M<small>documents</small>
            </strong>
            <strong>
              644 Go<small>de données</small>
            </strong>
          </div>
          <span>Animation illustrative · aucune télémétrie en direct</span>
        </aside>
      </div>
    </section>
  );
}
