import { Cloud, Cpu } from 'lucide-react';

export type Skill =
  'react' | 'typescript' | 'python' | 'node' | 'cloud' | 'jetson';

export default function SkillMark({
  skill,
  className = '',
}: {
  skill: Skill;
  className?: string;
}) {
  if (skill === 'cloud')
    return <Cloud className={className} strokeWidth={1.5} aria-hidden="true" />;
  if (skill === 'jetson')
    return <Cpu className={className} strokeWidth={1.5} aria-hidden="true" />;
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {skill === 'react' && (
        <g fill="none" stroke="currentColor" strokeWidth="1.3">
          <ellipse cx="12" cy="12" rx="10.5" ry="4.1" />
          <ellipse
            cx="12"
            cy="12"
            rx="10.5"
            ry="4.1"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="10.5"
            ry="4.1"
            transform="rotate(120 12 12)"
          />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </g>
      )}
      {skill === 'typescript' && (
        <>
          <rect x="1" y="1" width="22" height="22" rx="4" fill="#456e88" />
          <text
            x="4"
            y="18"
            fill="white"
            fontSize="13"
            fontWeight="700"
            fontFamily="Arial,sans-serif"
          >
            TS
          </text>
        </>
      )}
      {skill === 'python' && (
        <>
          <path
            d="M12 1C5 1 5 3 5 6V9H13V10H3C0 10 0 17 3 17H6V13C6 11 8 10 10 10H15C17 10 18 9 18 7V4C18 2 16 1 12 1Z"
            fill="#527a95"
          />
          <path
            d="M12 23C19 23 19 21 19 18V15H11V14H21C24 14 24 7 21 7H18V11C18 13 16 14 14 14H9C7 14 6 15 6 17V20C6 22 8 23 12 23Z"
            fill="#d7b56e"
          />
          <circle cx="9" cy="4" r="1" fill="white" />
          <circle cx="15" cy="20" r="1" fill="white" />
        </>
      )}
      {skill === 'node' && (
        <>
          <path d="M12 1L22 6.5V17.5L12 23L2 17.5V6.5Z" fill="#496d5d" />
          <text
            x="5"
            y="16"
            fill="white"
            fontFamily="Arial,sans-serif"
            fontSize="11"
            fontWeight="700"
          >
            JS
          </text>
        </>
      )}
    </svg>
  );
}
