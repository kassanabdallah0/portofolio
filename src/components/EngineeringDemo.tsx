'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Check, Pause, Play, RotateCcw } from 'lucide-react';
import { orbit, simulations, type DemoType } from '@/data/simulations';
import { useSimulation } from './useSimulation';

function Person({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cy="18" rx="20" ry="6" fill="#080b10" opacity=".2" />
      <circle cy="-39" r="10" fill="#c6cdd1" />
      <path d="M-13-23Q0-32 13-23L17 0H-17Z" fill="#c5a77e" />
      <path
        d="M-9 0-12 16M9 0 12 16"
        stroke="#454e57"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M-15-20-23-1M15-20 23-1"
        stroke="#b8c2c7"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </g>
  );
}

function Bus({ name }: { name: string }) {
  return (
    <>
      <ellipse cy="13" rx="30" ry="12" fill="#101318" opacity=".12" />
      <rect x="-26" y="-11" width="52" height="24" rx="7" fill="#35424b" />
      <rect
        x="-27"
        y="-16"
        width="54"
        height="23"
        rx="7"
        fill="#edf1f3"
        stroke="#a2adb6"
      />
      <path d="M-17-11H17V-3H-17Z" fill="#527180" />
      <path d="M-8-11V-3M2-11V-3M12-11V-3" stroke="#c9d1d6" strokeWidth="2" />
      <rect x="-21" y="5" width="42" height="3" rx="1" fill="#7098aa" />
      <text y="23" textAnchor="middle" fill="#384b57" fontSize="11">
        {name}
      </text>
    </>
  );
}

function Scene({
  type,
  id,
  sensitivity,
  selectedBus,
  rollback,
  restored,
  stage,
}: {
  type: DemoType;
  id: string;
  sensitivity: number;
  selectedBus: number;
  rollback: boolean;
  restored: boolean;
  stage: number;
}) {
  const metal = `url(#${id}-metal)`;
  return (
    <svg
      className={`exhibit-scene scene-${type}`}
      viewBox="0 0 660 360"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2=".8" y2="1">
          <stop stopColor="#fff" />
          <stop offset=".45" stopColor="#d4dce1" />
          <stop offset=".7" stopColor="#f5f7f8" />
          <stop offset="1" stopColor="#adb9c2" />
        </linearGradient>
        <radialGradient id={`${id}-light`}>
          <stop stopColor="#b2cddc" stopOpacity=".2" />
          <stop offset="1" stopColor="#b2cddc" stopOpacity="0" />
        </radialGradient>
        <pattern
          id={`${id}-grid`}
          width="44"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M44 0H0V28"
            fill="none"
            stroke="currentColor"
            strokeWidth=".5"
            opacity=".11"
          />
        </pattern>
      </defs>
      {(type === 'vision' || type === 'scan') && (
        <>
          <ellipse
            cx="350"
            cy="250"
            rx="260"
            ry="90"
            fill={`url(#${id}-light)`}
          />
          <path
            d="M30 235 295 90 640 230 360 350Z"
            fill="#1e252c"
            stroke="#3b444c"
          />
          <path
            d="M70 235 300 109 596 230 359 329Z"
            fill={`url(#${id}-grid)`}
          />
          <path d="M85 213V103L204 57V148Z" fill="#2c333a" />
          <path d="M204 57 248 77V166L204 148Z" fill="#1b2228" />
          <path d="M104 116 184 86V119L104 150Z" fill="#566976" />
          <path d="M104 165 184 134" stroke="#8294a0" strokeWidth="2" />
          <path d="M446 152 540 187 595 159 501 125Z" fill="#515d66" />
          <path d="M446 152V219L540 256V187Z" fill="#38434c" />
          <path d="M540 187 595 159V224L540 256Z" fill="#26313a" />
          <path
            d="M302 258 412 181 525 227 410 309Z"
            className="detection-zone"
            fill="#83b6cd"
            fillOpacity=".10"
            stroke="#8cb7ca"
            strokeDasharray="5 6"
          />
          <text x="426" y="310" fill="#b0c2cb" fontSize="12">
            {type === 'vision' ? 'Zone surveillée' : 'Zone de scan'}
          </text>
          <g transform="translate(290 79)">
            <path d="M0 0V49" stroke="#73838e" strokeWidth="4" />
            <rect x="-22" y="-13" width="44" height="22" rx="4" fill={metal} />
            <circle cx="0" cy="-2" r="7" fill="#253843" />
            <circle cx="0" cy="-2" r="3" fill="#9fc1d1" />
          </g>
          <path
            d="M290 92 215 231M290 92 455 277"
            stroke="#97c0d2"
            opacity=".13"
          />
          <path
            data-trail="true"
            d="M180 230Q260 260 360 245"
            fill="none"
            stroke="#9fbcc9"
            strokeOpacity=".55"
            strokeWidth="1.5"
            strokeDasharray="3 5"
          />
          <g data-person="true" transform="translate(320 235)">
            <Person />
            <g data-box="true">
              <rect
                x="-31"
                y="-58"
                width="62"
                height="84"
                rx="3"
                fill="none"
                stroke="#a6c9d8"
                strokeWidth="1.5"
              />
              <rect
                x="-31"
                y="-76"
                width="75"
                height="18"
                rx="3"
                fill="#bdd3de"
              />
              <text x="-24" y="-63" fill="#172831" fontSize="10">
                personne · 01
              </text>
            </g>
          </g>
          {type === 'scan' && (
            <path
              data-scan="true"
              d="M270 180H385"
              stroke="#cee2eb"
              strokeWidth="2"
              opacity=".7"
            />
          )}
          <g transform="translate(37 303)">
            <circle r="3" fill="#a6c9d8" />
            <text x="12" y="4" fill="#c0ccd4" fontSize="12">
              {type === 'vision'
                ? 'Caméra → calcul embarqué'
                : 'Chromium sur Jetson → HDMI'}
            </text>
          </g>
          <g transform="translate(404 49)">
            <rect
              width="210"
              height="42"
              rx="10"
              fill="#202a33"
              stroke="#46545e"
            />
            <circle
              cx="18"
              cy="21"
              r="4"
              fill={
                stage === simulations[type].stages.length - 1
                  ? '#b3d0bc'
                  : '#89a5b5'
              }
            />
            <text x="31" y="25" fill="#e3e9ed" fontSize="12">
              {type === 'scan'
                ? [
                    'Positionnement',
                    'Acquisition en cours',
                    'Validation du résultat',
                    'Résultat affiché',
                  ][stage]
                : [
                    'Image reçue',
                    'Personne détectée',
                    'Identité conservée',
                    'Présence confirmée',
                    'Événement généré',
                  ][stage]}
            </text>
          </g>
          {type === 'vision' && (
            <g transform="translate(482 112)">
              {[0, 1, 2, 3, 4].map((i) => (
                <rect
                  key={i}
                  data-confirm={i}
                  x={i * 15}
                  width="10"
                  height="4"
                  rx="2"
                  fill="#b7d2be"
                  opacity=".2"
                />
              ))}
            </g>
          )}
        </>
      )}
      {type === 'interface' && (
        <>
          <ellipse
            cx="332"
            cy="292"
            rx="260"
            ry="32"
            fill="#99acb8"
            opacity=".13"
          />
          <path
            d="M77 62 407 38 410 280 80 306Z"
            fill="#ced8df"
            stroke="#a6b5bf"
          />
          <rect
            x="58"
            y="45"
            width="342"
            height="247"
            rx="15"
            fill="#fff"
            stroke="#ccd4db"
          />
          <path d="M59 80H399" stroke="#e4e8eb" />
          <circle cx="77" cy="63" r="3" fill="#b0bdc6" />
          <circle cx="90" cy="63" r="3" fill="#c8d1d8" />
          <text x="111" y="67" fill="#374957" fontSize="11">
            SecuriSPOT Manager
          </text>
          <rect x="75" y="98" width="207" height="146" rx="7" fill="#e8edf0" />
          <path
            d="M75 220 170 150 282 210M75 245 179 174 282 232"
            fill="none"
            stroke="#ced8de"
          />
          <path
            d="M75 130H282M75 157H282M135 99V243M229 99V243"
            stroke="#dae1e6"
          />
          <Person x={169} y={199} />
          <rect
            x={137 - sensitivity * 0.18}
            y={137 - sensitivity * 0.13}
            width={66 + sensitivity * 0.36}
            height={85 + sensitivity * 0.13}
            rx="3"
            fill="#8fb6ca"
            fillOpacity=".13"
            stroke="#527e96"
            strokeDasharray="4 3"
          />
          <text x="298" y="115" fill="#62737f" fontSize="10">
            ZONE 01
          </text>
          <path
            d="M298 134H376M298 150H362M298 166H370"
            stroke="#dce2e6"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect x="295" y="193" width="83" height="29" rx="7" fill="#e8eef2" />
          <text
            x="336"
            y="212"
            fill="#42677a"
            fontSize="10"
            textAnchor="middle"
          >
            {stage === 4 ? 'Confirmé' : 'Configuration'}
          </text>
          <path
            d="M95 266H254"
            stroke="#e4e9ed"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M400 160C438 160 427 232 472 232M472 232C432 232 440 92 400 92"
            fill="none"
            stroke="#9fb5c2"
            strokeWidth="1.5"
          />
          {[0, 1, 2].map((i) => (
            <circle key={i} data-packet={i} r="3" fill="#527e96" />
          ))}
          <g transform="translate(460 150)">
            <path d="M0 9 62-7 137 17 73 36Z" fill={metal} />
            <path d="M0 9V91L73 116V36Z" fill="#36434c" />
            <path d="M73 36 137 17V95L73 116Z" fill="#647681" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                d={`M${12 + i * 9} ${20 + i * 3}v64`}
                stroke="#70838f"
                strokeWidth="3"
              />
            ))}
            <circle cx="91" cy="80" r="3" fill="#b3d0bc" />
          </g>
          <text
            x="532"
            y="297"
            textAnchor="middle"
            fill="#526673"
            fontSize="12"
          >
            Jetson · API Flask
          </text>
        </>
      )}
      {type === 'cloud' && (
        <>
          <path
            d="M39 216 292 93 631 216 366 341Z"
            fill="#e0e6eb"
            stroke="#c1ced7"
          />
          <ellipse
            cx="330"
            cy="205"
            rx="208"
            ry="70"
            fill="none"
            stroke="#fafbfc"
            strokeWidth="31"
          />
          <ellipse
            cx="330"
            cy="205"
            rx="208"
            ry="70"
            fill="none"
            stroke="#bcc9d3"
            strokeWidth="1"
            strokeDasharray="5 8"
          />
          <path d="M280 155 331 137 392 159 340 178Z" fill="#c1cfd8" />
          <path d="M280 155V230L340 250V178Z" fill="#8195a3" />
          <path d="M340 178 392 159V228L340 250Z" fill="#a6b7c2" />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M290 ${172 + i * 18}l39 13`}
              stroke="#d3dfe6"
              strokeWidth="3"
            />
          ))}
          <path
            data-uplink="true"
            d="M160 214Q195 30 328 155"
            fill="none"
            stroke="#527e96"
            strokeWidth="1.5"
            opacity=".6"
          />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} data-packet={i} r="3" fill="#527e96" />
          ))}
          <g transform="translate(279 30)">
            <rect
              width="112"
              height="39"
              rx="10"
              fill="#fff"
              stroke={stage === 1 ? '#527e96' : '#c6d3dc'}
            />
            <text
              x="56"
              y="24"
              textAnchor="middle"
              fill="#3b5362"
              fontSize="12"
            >
              OpenVPN · EC2
            </text>
          </g>
          <path d="M391 49H452V89" fill="none" stroke="#adc0cd" />
          <circle data-service-packet="true" r="3" fill="#527e96" />
          <g transform="translate(428 89)">
            <rect
              width="145"
              height="57"
              rx="10"
              fill="#f9fbfc"
              stroke={stage >= 2 ? '#527e96' : '#c5d2db'}
            />
            <text x="15" y="23" fill="#354f5f" fontSize="12">
              Node.js · AWS
            </text>
            <text x="15" y="42" fill="#667d8d" fontSize="11">
              API / portail / rapports
            </text>
          </g>
          <text
            x="336"
            y="274"
            textAnchor="middle"
            fill="#526b7c"
            fontSize="11"
          >
            Accès distant · EC2
          </text>
          {[0, 1, 2].map((i) => (
            <g
              data-bus={i}
              key={i}
              transform={`translate(${orbit(0, i * 2.094).x} ${orbit(0, i * 2.094).y})`}
              opacity={selectedBus === i ? 1 : 0.63}
            >
              <Bus name={String.fromCharCode(65 + i)} />
            </g>
          ))}
          <text x="58" y="331" fill="#617888" fontSize="11">
            Flotte conceptuelle · parcours continus
          </text>
        </>
      )}
      {type === 'delivery' && (
        <>
          <ellipse
            cx="330"
            cy="260"
            rx="275"
            ry="45"
            fill="#000"
            opacity=".16"
          />
          <path
            d="M66 198H590"
            stroke="#3b4954"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path d="M66 192H590" stroke="#7f97a6" strokeWidth="1" />
          {['Git', 'CI / Tests', 'Jetson', 'Activation', 'Santé'].map(
            (name, i) => (
              <g key={name} transform={`translate(${72 + i * 127} 179)`}>
                <path
                  d="M-34-21 0-35 34-21 0-7Z"
                  fill={i === stage ? '#a8c5d4' : '#8d9ca7'}
                />
                <path d="M-34-21V33L0 47V-7Z" fill="#303f4a" />
                <path d="M0-7 34-21V33L0 47Z" fill="#516575" />
                <g
                  transform="matrix(1 .4 0 1 -28 -7)"
                  fill="none"
                  stroke="#b4cbd9"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {i === 0 && (
                    <>
                      <path d="M8 3V26M8 15Q23 15 23 5" />
                      <circle cx="8" cy="3" r="3" fill="#303f4a" />
                      <circle cx="8" cy="26" r="3" fill="#303f4a" />
                      <circle cx="23" cy="4" r="3" fill="#303f4a" />
                    </>
                  )}
                  {i === 1 &&
                    [0, 1, 2].map((row) => (
                      <g key={row} opacity={stage >= 1 ? 1 : 0.4}>
                        <path
                          d={`M2 ${row * 11 + 3}l3 3 5-6M15 ${row * 11 + 3}h9`}
                        />
                      </g>
                    ))}
                  {i === 2 && (
                    <>
                      <rect x="5" y="3" width="21" height="24" rx="2" />
                      {[0, 1, 2, 3].map((fin) => (
                        <path key={fin} d={`M${8 + fin * 5} 6v18`} />
                      ))}
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <rect x="1" y="2" width="29" height="25" rx="3" />
                      <path
                        d="m12 9 8 6-8 6Z"
                        fill={stage >= 3 ? '#b7d2c2' : 'none'}
                      />
                    </>
                  )}
                  {i === 4 && (
                    <path
                      d={
                        rollback && stage === 4 && !restored
                          ? 'M5 5 26 26M5 26 26 5'
                          : 'M0 17h6l5-13 7 25 5-12h8'
                      }
                      stroke={
                        rollback && stage === 4 && !restored
                          ? '#d3b891'
                          : '#b7d2c2'
                      }
                    />
                  )}
                </g>
                <circle
                  cx="15"
                  cy="18"
                  r="3"
                  fill={i === stage ? '#d0e3dc' : '#849aa8'}
                />
                <text y="79" textAnchor="middle" fill="#c1ccd5" fontSize="12">
                  {name}
                </text>
              </g>
            ),
          )}
          {[0, 1, 2].map((i) => (
            <g key={i} data-package={i}>
              <path d="M-10-6 0-12 10-6 0 0Z" fill="#e0ebef" />
              <path d="M-10-6V7L0 13V0Z" fill="#8ba7b9" />
              <path d="M0 0 10-6V7L0 13Z" fill="#c0d4df" />
            </g>
          ))}
          <path d="M325 92V133" stroke="#bfced7" strokeDasharray="3 5" />
          <rect
            x="246"
            y="58"
            width="158"
            height="33"
            rx="8"
            fill="#283741"
            stroke="#566e7d"
          />
          <text x="325" y="79" fill="#d8e3e9" textAnchor="middle" fontSize="11">
            Déclenchement local
          </text>
          <path
            d="M580 221C580 324 325 324 325 221"
            fill="none"
            stroke={rollback ? '#c8ac86' : '#455663'}
            strokeWidth="1.5"
            strokeDasharray="5 6"
          />
          <circle data-rollback="true" r="4" fill="#d3b891" />
          <text
            x="451"
            y="326"
            fill={rollback ? '#e0c49e' : '#a3b5c1'}
            textAnchor="middle"
            fontSize="12"
          >
            {rollback
              ? restored
                ? 'Version stable restaurée'
                : stage === 4
                  ? 'Santé refusée → restauration en cours'
                  : 'Retour prêt · scénario de contrôle négatif'
              : 'Version stable conservée pour le retour'}
          </text>
          <g transform="translate(475 58)">
            <rect
              width="143"
              height="33"
              rx="8"
              fill="#25332e"
              stroke="#526b5e"
            />
            <text
              x="71"
              y="21"
              textAnchor="middle"
              fill="#c1d7ca"
              fontSize="11"
            >
              {rollback && restored
                ? 'Version stable active'
                : 'Version stable disponible'}
            </text>
          </g>
        </>
      )}
      {type === 'observability' && (
        <>
          <path
            d="M49 237 318 133 616 236 346 337Z"
            fill="#1e2931"
            stroke="#40515e"
          />
          <g transform="translate(54 80)">
            <rect
              width="145"
              height="130"
              rx="10"
              fill="#28353f"
              stroke="#4b5d6a"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i} data-log={i}>
                <circle cx="16" cy={24 + i * 21} r="2" fill="#9bb9ca" />
                <path
                  d={`M28 ${24 + i * 21}h${70 + (i % 2) * 24}`}
                  stroke="#849cac"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ))}
            <text
              x="72"
              y="151"
              textAnchor="middle"
              fill="#b7c7d3"
              fontSize="12"
            >
              Journaux → Logstash
            </text>
          </g>
          <path
            d="M199 143C237 143 228 240 279 240M428 203H491"
            fill="none"
            stroke="#7796aa"
          />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} data-packet={i} r="3" fill="#c4dbe7" />
          ))}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${270 + i * 54} ${181 - i * 16})`}>
              <path d="M0 0 26-11 53 0 27 11Z" fill={metal} />
              <path d="M0 0V89L27 101V11Z" fill="#526776" />
              <path d="M27 11 53 0V89L27 101Z" fill="#8398a6" />
              {[0, 1, 2].map((j) => (
                <path
                  key={j}
                  d={`M6 ${19 + j * 22}l14 6`}
                  stroke="#c9dce6"
                  strokeWidth="3"
                />
              ))}
              <circle cx="39" cy="72" r="2" fill="#c0d6c7" />
            </g>
          ))}
          <text
            x="352"
            y="310"
            fill="#c2d0da"
            textAnchor="middle"
            fontSize="12"
          >
            Elasticsearch · 3 nœuds · ILM 180 jours
          </text>
          <g transform="translate(475 116)">
            <rect
              width="132"
              height="103"
              rx="9"
              fill="#344650"
              stroke="#8ba5b6"
            />
            <path
              d="M16 70 34 54 50 66 71 35 91 49 112 25"
              fill="none"
              stroke="#c2dbe8"
              strokeWidth="2"
            />
            <text
              x="66"
              y="126"
              fill="#c2d0da"
              textAnchor="middle"
              fontSize="12"
            >
              Kibana · TLS
            </text>
          </g>
        </>
      )}
    </svg>
  );
}

export default function EngineeringDemo({
  type,
  presentation = 'full',
}: {
  type: DemoType;
  presentation?: 'preview' | 'full';
}) {
  const root = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');
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
  const restoredRef = useRef(false);
  const requestAt = useRef<number | null>(null);
  const requestValue = useRef(60);
  const confirmedUntil = useRef(0);
  const nodes = useRef<{
    person: SVGGElement | null;
    box: SVGGElement | null;
    trail: SVGPathElement | null;
    scan: SVGPathElement | null;
    packets: SVGCircleElement[];
    buses: SVGGElement[];
    packages: SVGGElement[];
    confirmations: SVGRectElement[];
    rollback: SVGCircleElement | null;
    uplink: SVGPathElement | null;
    service: SVGCircleElement | null;
    logs: SVGGElement[];
  }>({
    person: null,
    box: null,
    trail: null,
    scan: null,
    packets: [],
    buses: [],
    packages: [],
    confirmations: [],
    rollback: null,
    uplink: null,
    service: null,
    logs: [],
  });
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    nodes.current = {
      person: el.querySelector('[data-person]'),
      box: el.querySelector('[data-box]'),
      trail: el.querySelector('[data-trail]'),
      scan: el.querySelector('[data-scan]'),
      packets: Array.from(el.querySelectorAll('[data-packet]')),
      buses: Array.from(el.querySelectorAll('[data-bus]')),
      packages: Array.from(el.querySelectorAll('[data-package]')),
      confirmations: Array.from(el.querySelectorAll('[data-confirm]')),
      rollback: el.querySelector('[data-rollback]'),
      uplink: el.querySelector('[data-uplink]'),
      service: el.querySelector('[data-service-packet]'),
      logs: Array.from(el.querySelectorAll('[data-log]')),
    };
  }, [type]);
  const draw = useCallback(
    (t: number) => {
      const period = type === 'vision' ? 18 : type === 'interface' ? 12 : 16;
      const p = (t % period) / period;
      let progress = (p * definition.stages.length) % 1;
      let next = Math.min(
        definition.stages.length - 1,
        Math.floor(p * definition.stages.length),
      );
      if (type === 'interface' && t < confirmedUntil.current) next = 4;
      if (type === 'interface' && requestAt.current !== null) {
        const progress = t - requestAt.current;
        next = Math.min(4, Math.floor(progress / 0.65));
        if (progress >= 3.25) {
          requestAt.current = null;
          confirmedUntil.current = t + 2;
          setApplied(requestValue.current);
          setPending(false);
        }
      }
      if (type === 'interface' && requestAt.current !== null)
        progress = ((t - requestAt.current) / 0.65) % 1;
      root.current?.style.setProperty('--step-progress', `${progress}`);
      const isRestored = rollback && p > 0.94;
      if (isRestored !== restoredRef.current) {
        restoredRef.current = isRestored;
        setRestored(isRestored);
      }
      if (next !== stageRef.current) {
        stageRef.current = next;
        setStage(next);
      }
      const n = nodes.current;
      if (n.person) {
        const x =
          type === 'scan'
            ? 342 + Math.sin(t * 0.34) * 5
            : 320 - Math.sin(p * Math.PI * 2) * 150;
        const y = type === 'scan' ? 245 : 238 + Math.cos(p * Math.PI * 2) * 16;
        n.person.setAttribute(
          'transform',
          `translate(${x.toFixed(2)} ${y.toFixed(2)})`,
        );
        n.box?.setAttribute(
          'opacity',
          `${0.85 + 0.15 * Math.sin(t * 0.8) ** 2}`,
        );
        n.trail?.setAttribute(
          'd',
          `M${x - 75} ${y + 15} Q${x - 30} ${y + 32} ${x} ${y + 18}`,
        );
        n.scan?.setAttribute(
          'transform',
          `translate(0 ${Math.sin(t * 1.8) * 25})`,
        );
        n.confirmations.forEach((el, i) =>
          el.setAttribute(
            'opacity',
            p > 0.6 + i * 0.035 && p < 0.96 ? '1' : '.2',
          ),
        );
      }
      n.buses.forEach((el, i) => {
        const pt = orbit(t, (i * Math.PI * 2) / 3);
        el.setAttribute(
          'transform',
          `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`,
        );
      });
      const bus = orbit(t, (selectedBus * Math.PI * 2) / 3);
      n.uplink?.setAttribute(
        'd',
        `M${bus.x} ${bus.y - 13}Q${(bus.x + 335) / 2} -22 335 67`,
      );
      if (n.service) {
        const q = (t * 0.26) % 1;
        n.service.setAttribute('cx', `${391 + Math.min(q * 2, 1) * 61}`);
        n.service.setAttribute('cy', `${49 + Math.max(0, q * 2 - 1) * 40}`);
        n.service.setAttribute('opacity', `${Math.sin(q * Math.PI) ** 2}`);
      }
      n.logs.forEach((line, i) => {
        const q = (t * 0.12 + i / 5) % 1;
        line.setAttribute('transform', `translate(0 ${q * 100 - i * 21})`);
        line.setAttribute('opacity', `${Math.sin(q * Math.PI) ** 2}`);
      });
      n.packets.forEach((el, i) => {
        const q = (t * 0.19 + i / n.packets.length) % 1;
        let x = 199 + q * 276,
          y = 143 + Math.sin(q * Math.PI) * 66;
        if (type === 'cloud') {
          x =
            (1 - q) ** 2 * bus.x +
            (2 * (1 - q) * q * (bus.x + 335)) / 2 +
            q * q * 335;
          y = (1 - q) ** 2 * (bus.y - 13) + 2 * (1 - q) * q * -22 + q * q * 67;
        }
        if (type === 'interface') {
          const v = q < 0.5 ? q * 2 : (q - 0.5) * 2;
          const a = 1 - v;
          x =
            q < 0.5
              ? a ** 3 * 400 +
                3 * a * a * v * 438 +
                3 * a * v * v * 427 +
                v ** 3 * 472
              : a ** 3 * 472 +
                3 * a * a * v * 432 +
                3 * a * v * v * 440 +
                v ** 3 * 400;
          y =
            q < 0.5
              ? a ** 3 * 160 +
                3 * a * a * v * 160 +
                3 * a * v * v * 232 +
                v ** 3 * 232
              : a ** 3 * 232 +
                3 * a * a * v * 232 +
                3 * a * v * v * 92 +
                v ** 3 * 92;
        }
        el.setAttribute('cx', x.toFixed(2));
        el.setAttribute('cy', y.toFixed(2));
        el.setAttribute('opacity', `${Math.sin(q * Math.PI) ** 2}`);
      });
      n.packages.forEach((el, i) => {
        const q = (p + i / 3) % 1;
        el.setAttribute('transform', `translate(${40 + q * 580} 137)`);
        el.setAttribute('opacity', `${Math.sin(q * Math.PI) ** 2}`);
      });
      if (n.rollback) {
        const q = Math.max(0, Math.min(1, (p - 0.8) / 0.14));
        n.rollback.setAttribute('cx', `${580 - 255 * q}`);
        n.rollback.setAttribute('cy', `${221 + Math.sin(q * Math.PI) * 78}`);
        n.rollback.setAttribute(
          'opacity',
          rollback ? `${Math.sin(q * Math.PI) ** 2}` : '0',
        );
      }
    },
    [type, definition, selectedBus, rollback],
  );
  const { running, reduced, time } = useSimulation(root, paused, draw);
  const focus = hovered ?? inspected ?? stage;
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
    if (reduced || paused) {
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
  return (
    <div
      ref={root}
      className={`engineering-demo demo-${type} demo-${presentation}`}
      data-presentation={presentation}
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
          onClick={() => setPaused(!paused)}
          aria-label={`${paused ? 'Reprendre' : 'Mettre en pause'} : ${definition.title}`}
          aria-pressed={paused}
        >
          {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
          <span>{reduced ? 'Vue fixe' : paused ? 'Reprendre' : 'Pause'}</span>
        </button>
      </div>
      <div className="demo-world">
        <Scene
          type={type}
          id={id}
          sensitivity={applied}
          selectedBus={selectedBus}
          rollback={rollback}
          restored={restored}
          stage={stage}
        />
        <div className="optical-reflection" aria-hidden="true" />
      </div>
      {presentation === 'full' && (
        <>
          {type === 'interface' && (
            <div className="demo-interaction manager-controls">
              <label htmlFor={`${id}-sensitivity`}>
                Taille de zone <output>{sensitivity}%</output>
                <input
                  id={`${id}-sensitivity`}
                  aria-label="Taille de la zone"
                  type="range"
                  min="20"
                  max="100"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                />
              </label>
              <button onClick={apply} disabled={pending}>
                {pending ? 'Transmission…' : 'Appliquer'}
                {pending ? <ArrowRight size={13} /> : <Check size={13} />}
              </button>
              <span role="status" aria-label="État de la configuration">
                {pending
                  ? 'Configuration en cours'
                  : `Configuration active : ${applied}%`}
              </span>
            </div>
          )}
          {type === 'cloud' && (
            <div className="demo-interaction fleet-controls">
              <span>Suivre un bus</span>
              <div role="group" aria-label="Choisir un bus illustratif">
                {['A', 'B', 'C'].map((bus, i) => (
                  <button
                    key={bus}
                    aria-pressed={selectedBus === i}
                    onClick={() => setSelectedBus(i)}
                  >
                    Bus {bus}
                  </button>
                ))}
              </div>
              <p>
                Bus {String.fromCharCode(65 + selectedBus)} → tunnel VPN →
                services AWS
              </p>
            </div>
          )}
          {type === 'delivery' && (
            <div className="demo-interaction delivery-controls">
              <span>Scénario illustratif</span>
              <button
                aria-pressed={rollback}
                onClick={() => setRollback(!rollback)}
              >
                <RotateCcw size={13} />
                {rollback
                  ? 'Retour à la version stable'
                  : 'Explorer le rollback'}
              </button>
            </div>
          )}
          <div
            className="architecture"
            aria-label={`Architecture : ${definition.title}`}
          >
            <div className="architecture-stages">
              {definition.stages.map((item, i) => (
                <button
                  key={item.name}
                  className={`${stage === i ? 'is-active' : ''} ${focus === i ? 'is-inspected' : ''}`}
                  type="button"
                  aria-pressed={inspected === i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setInspected(inspected === i ? null : i)}
                >
                  <span className="stage-index">
                    {String(i + 1).padStart(2, '0')}
                  </span>
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
        </>
      )}
      <p className="demo-caption">
        Simulation illustrative
        {type === 'interface' ? ' · interactions locales' : ''}{' '}
        {presentation === 'full' && (
          <span>Sélectionnez une étape pour l’explorer.</span>
        )}
      </p>
    </div>
  );
}
