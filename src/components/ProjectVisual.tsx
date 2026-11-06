import type { Project } from '@/data/portfolio';

export default function ProjectVisual({ type }: { type: Project['visual'] }) {
  return (
    <div className={`project-art project-art-${type}`} aria-hidden="true">
      <div className="art-grid" />
      {type === 'vision' && (
        <svg viewBox="0 0 640 340" fill="none">
          <g stroke="#28434e" strokeWidth="1">
            <path d="M40 248 318 102 604 246 322 398ZM40 208 320 62 604 206M40 288 320 142 604 286M109 212 390 358M179 175 460 321M250 138 530 284" />
            <path d="M110 283 390 138M180 320 460 175M250 357 530 211" />
          </g>
          <path
            d="m153 211 146-77 191 97-146 77Z"
            fill="#00e5ff"
            fillOpacity=".035"
            stroke="#00c9db"
            strokeDasharray="5 5"
          />
          <g stroke="#526877" fill="#0d1823">
            <path d="m390 158 44-23 68 35v61l-44 24-68-35Zm0 0 68 35 44-23M458 193v62" />
            <path d="m412 148 22-11 43 22-22 11Z" fill="#142b37" />
          </g>
          <g transform="translate(271 149)">
            <circle cx="0" cy="0" r="12" fill="#85a9b8" />
            <path d="M-13 17h26l8 43H-21Z" fill="#547985" />
            <path
              d="m-12 60-4 35m28-35 5 35"
              stroke="#85a9b8"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>
          <path
            d="M235 126v-12h17m38 0h17v12m0 117v12h-17m-38 0h-17v-12"
            stroke="#00e5ff"
            strokeWidth="1.8"
          />
          <path d="M228 104h92v164h-92z" stroke="#00e5ff" strokeOpacity=".3" />
          <path
            d="m306 191 74 1 32-47"
            stroke="#00e5ff"
            strokeOpacity=".6"
            strokeDasharray="3 4"
          />
          <g fill="#68d9e7" fontSize="10" fontFamily="monospace">
            <text x="228" y="94">
              DÉTECTION / PERSONNE
            </text>
            <text x="420" y="122">
              ZONE D’INTÉRÊT
            </text>
          </g>
          <circle cx="306" cy="191" r="3" fill="#b7faff" />
          <circle cx="412" cy="145" r="3" fill="#b7faff" />
          <path
            d="M82 76H62v20m496-20h20v20M62 260v20h20m496-20v20h-20"
            stroke="#4d6977"
          />
        </svg>
      )}
      {type === 'interface' && (
        <svg viewBox="0 0 640 340" fill="none">
          <rect
            x="84"
            y="52"
            width="472"
            height="258"
            rx="6"
            fill="#0a111c"
            stroke="#2b3d4d"
          />
          <path d="M84 82h472M128 82v228" stroke="#253747" />
          <g fill="#456071">
            <circle cx="100" cy="67" r="3" />
            <circle cx="111" cy="67" r="3" />
            <circle cx="122" cy="67" r="3" />
          </g>
          <g stroke="#446577">
            <rect x="98" y="103" width="16" height="16" rx="3" />
            <rect x="98" y="136" width="16" height="16" rx="3" />
            <rect x="98" y="169" width="16" height="16" rx="3" />
          </g>
          <rect
            x="145"
            y="103"
            width="265"
            height="182"
            rx="3"
            fill="#101e29"
          />
          <path
            d="m146 250 130-81 134 73M185 285V224l63-35v96m61 0V187l78 45v53"
            stroke="#284454"
          />
          <path
            d="m179 242 96-57 97 55-96 31Z"
            stroke="#00d8ec"
            fill="#00d8ec"
            fillOpacity=".06"
          />
          <g fill="#b5faff">
            {[
              [179, 242],
              [275, 185],
              [372, 240],
              [276, 271],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" />
            ))}
          </g>
          <rect
            x="270"
            y="162"
            width="31"
            height="73"
            stroke="#00e5ff"
            strokeDasharray="4 2"
          />
          <g stroke="#324a5e" strokeWidth="4" strokeLinecap="round">
            <path d="M433 136h98M433 184h98M433 232h98" />
          </g>
          <g fill="#00e5ff">
            <circle cx="489" cy="136" r="4" />
            <circle cx="462" cy="184" r="4" />
            <circle cx="513" cy="232" r="4" />
          </g>
          <g fill="#7891a7" fontFamily="monospace" fontSize="9">
            <text x="433" y="120">
              ZONE ACTIVE
            </text>
            <text x="433" y="168">
              SENSIBILITÉ
            </text>
            <text x="433" y="216">
              CONFIRMATION
            </text>
            <text x="148" y="72">
              CONFIGURATION / CAMÉRA
            </text>
          </g>
        </svg>
      )}
      {type === 'cloud' && (
        <svg viewBox="0 0 640 340" fill="none">
          <ellipse
            cx="320"
            cy="180"
            rx="182"
            ry="102"
            stroke="#294650"
            strokeDasharray="3 7"
          />
          <ellipse cx="320" cy="180" rx="232" ry="132" stroke="#1c303f" />
          <g stroke="#3b8a99">
            <path
              d="m170 110 150 70 155-80M152 231l168-51 170 57M320 180v103"
              strokeDasharray="5 5"
            />
          </g>
          <path
            d="m320 125 63 34v69l-63 34-63-34v-69Z"
            fill="#0a1a25"
            stroke="#00bad0"
          />
          <path d="m257 159 63 35 63-35M320 194v68" stroke="#00bad0" />
          <text
            x="304"
            y="170"
            fill="#9ef6ff"
            fontFamily="monospace"
            fontSize="14"
          >
            AWS
          </text>
          {[
            [170, 110],
            [475, 100],
            [152, 231],
            [490, 237],
            [320, 283],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect
                x="-28"
                y="-19"
                width="56"
                height="34"
                rx="5"
                fill="#0b1722"
                stroke="#527b92"
              />
              <rect
                x="-21"
                y="-12"
                width="18"
                height="12"
                rx="1"
                stroke="#527b92"
              />
              <rect
                x="4"
                y="-12"
                width="17"
                height="12"
                rx="1"
                stroke="#527b92"
              />
              <circle cx="-16" cy="16" r="4" fill="#86a7b9" />
              <circle cx="16" cy="16" r="4" fill="#86a7b9" />
            </g>
          ))}
          <text
            x="241"
            y="57"
            fill="#6a94a6"
            fontFamily="monospace"
            fontSize="10"
          >
            UNE FLOTTE CONNECTÉE
          </text>
        </svg>
      )}
      {type === 'delivery' && (
        <svg viewBox="0 0 640 340" fill="none">
          <path d="M112 166h416" stroke="#24515d" />
          <path
            d="M483 211v46H157v-46"
            stroke="#565baa"
            strokeDasharray="5 5"
          />
          <path d="m153 220 4-9 4 9" stroke="#818cf8" />
          {[
            [112, '01', 'VERSION'],
            [250, '02', 'TESTS'],
            [389, '03', 'JETSON'],
            [528, '04', 'ACTIF'],
          ].map(([x, n, label]) => (
            <g key={n} transform={`translate(${x} 166)`}>
              <rect
                x="-42"
                y="-41"
                width="84"
                height="82"
                rx="6"
                fill="#0a1822"
                stroke={n === '04' ? '#00d9e9' : '#3a5669'}
              />
              <path
                d="m-13 0 9 9 18-19"
                stroke={n === '04' ? '#00e5ff' : '#8aa5b5'}
                strokeWidth="2"
              />
              <text
                x="0"
                y="-62"
                fill="#698291"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {n}
              </text>
              <text
                x="0"
                y="65"
                fill="#91aaba"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          ))}
          <text
            x="320"
            y="280"
            fill="#969be5"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
          >
            RETOUR À LA VERSION PRÉCÉDENTE
          </text>
          <path d="m313 254-9 3 9 3" stroke="#818cf8" />
        </svg>
      )}
      {type === 'scan' && (
        <svg viewBox="0 0 640 340" fill="none">
          <path d="M70 282h500M104 300h432" stroke="#263f50" />
          <rect
            x="137"
            y="42"
            width="368"
            height="229"
            rx="8"
            fill="#0a131f"
            stroke="#476274"
          />
          <rect
            x="150"
            y="55"
            width="342"
            height="195"
            rx="3"
            fill="#10202d"
            stroke="#263f50"
          />
          <path
            d="M296 272v24h51v-24M268 298h107"
            stroke="#6c8296"
            strokeWidth="3"
          />
          <path d="M169 77h65M169 83h40" stroke="#49697c" />
          <g transform="translate(261 105)">
            <circle r="17" fill="#8aa7b8" />
            <path
              d="M-19-2a19 19 0 0 1 38 0"
              stroke="#00d4e6"
              strokeWidth="5"
            />
            <path d="m-17 26-13 64h60L17 26Z" fill="#1e4b57" stroke="#61d3dd" />
            <path
              d="M-10 27v58M10 27v58M-22 63h44"
              stroke="#9debf1"
              strokeWidth="3"
            />
            <path
              d="m-17 90-3 32m37-32 3 32"
              stroke="#8aa7b8"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </g>
          <path
            d="M214 89V76h16m63 0h16v13m0 131v14h-16m-63 0h-16v-14"
            stroke="#00d5e5"
          />
          <path
            d="M207 155h109"
            stroke="#00e5ff"
            strokeOpacity=".55"
            strokeDasharray="3 4"
          />
          {[
            ['CASQUE', 100],
            ['GILET', 145],
            ['VALIDATION', 190],
          ].map(([label, y]) => (
            <g key={label} transform={`translate(353 ${y})`}>
              <rect
                width="112"
                height="30"
                rx="3"
                fill="#0d3038"
                stroke="#2b6470"
              />
              <path d="m10 15 4 4 8-9" stroke="#71dfcd" />
              <text
                x="31"
                y="19"
                fill="#accdd7"
                fontSize="9"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          ))}
          <path d="m92 134 45 0M92 142h45" stroke="#4b6574" />
          <rect
            x="49"
            y="121"
            width="43"
            height="35"
            rx="3"
            fill="#11232c"
            stroke="#4f6a7a"
          />
          <text
            x="46"
            y="178"
            fill="#7b9caf"
            fontSize="8"
            fontFamily="monospace"
          >
            JETSON
          </text>
        </svg>
      )}
      {type === 'observability' && (
        <svg viewBox="0 0 640 340" fill="none">
          <ellipse
            cx="320"
            cy="183"
            rx="230"
            ry="101"
            stroke="#323759"
            strokeDasharray="3 7"
          />
          <path
            d="M192 159h256M192 211h256"
            stroke="#4b5086"
            strokeDasharray="5 6"
          />
          {[161, 320, 479].map((x, i) => (
            <g transform={`translate(${x} 128)`} key={x}>
              <rect
                x="-49"
                y="-22"
                width="98"
                height="117"
                rx="5"
                fill="#0f1726"
                stroke="#686f9c"
              />
              <path d="M-49 15h98M-49 52h98" stroke="#363f66" />
              {[0, 37, 74].map((y) => (
                <g key={y}>
                  <circle cx="-29" cy={y} r="3" fill="#7ad3c5" />
                  <path d={`M-16 ${y}h43`} stroke="#687c9e" />
                </g>
              ))}
              <text
                x="0"
                y="120"
                fill="#aebcd2"
                fontFamily="monospace"
                fontSize="9"
                textAnchor="middle"
              >
                NŒUD {i + 1}
              </text>
            </g>
          ))}
          <rect
            x="229"
            y="39"
            width="182"
            height="30"
            rx="15"
            fill="#141c31"
            stroke="#565c8e"
          />
          <text
            x="320"
            y="58"
            textAnchor="middle"
            fill="#bbbdf2"
            fontFamily="monospace"
            fontSize="10"
          >
            ÉCHANGES CHIFFRÉS / TLS
          </text>
          <path d="M320 69v37" stroke="#656ba1" strokeDasharray="4 4" />
          <text
            x="320"
            y="298"
            textAnchor="middle"
            fill="#a3a9db"
            fontFamily="monospace"
            fontSize="10"
          >
            CYCLE DE VIE DES INDEX / ILM · 180 JOURS
          </text>
        </svg>
      )}
      <span className="art-caption">SCHÉMA ILLUSTRATIF</span>
      <span className="art-corner">+</span>
    </div>
  );
}
