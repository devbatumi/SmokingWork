import type { Status } from './types';

type SectionView = { id: string; name: string; cost: number; filled: number };

type Props = {
  sections: SectionView[];
  status: Status;
  totalBuilt: number;
};

function op(s: SectionView, min = 0) {
  const v = s.filled / s.cost;
  return Math.max(min, Math.min(1, v));
}

export function Ship({ sections, status, totalBuilt }: Props) {
  const get = (id: string) => sections.find((s) => s.id === id)!;
  const keel = get('keel');
  const hull = get('hull');
  const deck = get('deck');
  const cabin = get('cabin');
  const mFore = get('mast-fore');
  const mMain = get('mast-main');
  const mMizzen = get('mast-mizzen');
  const sails = get('sails');
  const flag = get('flag');

  const shipClass =
    status === 'sailed' ? 'ship-group sailing' :
    status === 'sunk' ? 'ship-group sinking' :
    'ship-group';

  // Companions appear at milestones
  const seagullA = totalBuilt >= 100 ? 1 : 0;
  const seagullB = totalBuilt >= 300 ? 1 : 0;
  const barrel = totalBuilt >= 500 ? 1 : 0;
  const cannon = totalBuilt >= 700 ? 1 : 0;
  const parrot = totalBuilt >= 900 ? 1 : 0;
  const lantern = totalBuilt >= 1100 ? 1 : 0;

  return (
    <svg className="ship-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1b2550" />
          <stop offset="100%" stopColor="#0f1a3a" />
        </linearGradient>
        <linearGradient id="sea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1b2a55" />
          <stop offset="100%" stopColor="#081028" />
        </linearGradient>
        <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a87042" />
          <stop offset="100%" stopColor="#5e3a1d" />
        </linearGradient>
        <linearGradient id="wood2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c48a52" />
          <stop offset="100%" stopColor="#7a4d28" />
        </linearGradient>
        <linearGradient id="sail" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f7f0dc" />
          <stop offset="100%" stopColor="#d9c89a" />
        </linearGradient>
        <radialGradient id="moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="100%" stopColor="#f8d97a" stopOpacity="0.0" />
        </radialGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffd97a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd97a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="800" height="300" fill="url(#sky)" />
      <circle cx="640" cy="70" r="44" fill="url(#moon)" />
      <circle cx="640" cy="70" r="26" fill="#fff4cf" opacity="0.92" />
      <g fill="#fff" opacity="0.8">
        <circle cx="80" cy="50" r="1.2" />
        <circle cx="160" cy="80" r="0.8" />
        <circle cx="230" cy="30" r="1" />
        <circle cx="320" cy="90" r="1.4" />
        <circle cx="430" cy="40" r="0.9" />
        <circle cx="520" cy="110" r="1" />
        <circle cx="700" cy="160" r="0.8" />
        <circle cx="100" cy="180" r="1" />
        <circle cx="480" cy="180" r="1.2" />
        <circle cx="580" cy="60" r="0.9" />
        <circle cx="720" cy="30" r="1.1" />
        <circle cx="380" cy="130" r="0.7" />
      </g>

      {/* seagulls */}
      {seagullA === 1 && (
        <g opacity="0.9">
          <path d="M120 90 q 6 -5 12 0 q 6 -5 12 0" stroke="#d9d9d9" strokeWidth="2" fill="none">
            <animateTransform attributeName="transform" type="translate"
              values="0 0; 40 -6; 0 0" dur="12s" repeatCount="indefinite" />
          </path>
        </g>
      )}
      {seagullB === 1 && (
        <g opacity="0.9">
          <path d="M540 130 q 5 -4 10 0 q 5 -4 10 0" stroke="#d9d9d9" strokeWidth="2" fill="none">
            <animateTransform attributeName="transform" type="translate"
              values="0 0; -30 -4; 0 0" dur="15s" repeatCount="indefinite" />
          </path>
        </g>
      )}

      <rect x="0" y="300" width="800" height="150" fill="url(#sea)" />
      <path d="M0 310 Q 80 304 160 310 T 320 310 T 480 310 T 640 310 T 800 310 L 800 320 L 0 320 Z"
        fill="#28407a" opacity="0.6">
        <animate attributeName="d" dur="7s" repeatCount="indefinite"
          values="
            M0 310 Q 80 304 160 310 T 320 310 T 480 310 T 640 310 T 800 310 L 800 320 L 0 320 Z;
            M0 310 Q 80 316 160 310 T 320 310 T 480 310 T 640 310 T 800 310 L 800 320 L 0 320 Z;
            M0 310 Q 80 304 160 310 T 320 310 T 480 310 T 640 310 T 800 310 L 800 320 L 0 320 Z" />
      </path>

      <g className={shipClass} style={{ transformOrigin: '400px 340px', transformBox: 'fill-box' }}>
        <ellipse cx="400" cy="392" rx="200" ry="6" fill="#000" opacity="0.35" />

        <g opacity={op(keel)}>
          <path d="M220 360 L580 360 L540 384 L260 384 Z" fill="#3b2410" />
          <line x1="220" y1="360" x2="580" y2="360" stroke="#2a1708" strokeWidth="1.5" />
        </g>

        <g opacity={op(hull)}>
          <path d="M180 330 L620 330 L580 360 L220 360 Z" fill="url(#wood)" />
          <path d="M180 330 L620 330 L620 335 L180 335 Z" fill="#2a1708" opacity="0.5" />
          <g stroke="#2a1708" strokeWidth="1" opacity="0.5">
            <line x1="220" y1="335" x2="215" y2="360" />
            <line x1="280" y1="335" x2="278" y2="360" />
            <line x1="340" y1="335" x2="340" y2="360" />
            <line x1="400" y1="335" x2="400" y2="360" />
            <line x1="460" y1="335" x2="460" y2="360" />
            <line x1="520" y1="335" x2="522" y2="360" />
            <line x1="580" y1="335" x2="585" y2="360" />
          </g>
          <g fill="#ffd97a" opacity="0.85">
            <circle cx="250" cy="348" r="4" />
            <circle cx="300" cy="348" r="4" />
            <circle cx="350" cy="348" r="4" />
            <circle cx="450" cy="348" r="4" />
            <circle cx="500" cy="348" r="4" />
            <circle cx="550" cy="348" r="4" />
          </g>
        </g>

        <g opacity={op(deck)}>
          <path d="M200 320 L600 320 L620 330 L180 330 Z" fill="url(#wood2)" />
          <line x1="200" y1="320" x2="600" y2="320" stroke="#2a1708" strokeWidth="1" opacity="0.5" />
          <line x1="280" y1="320" x2="280" y2="330" stroke="#2a1708" strokeWidth="0.6" opacity="0.4" />
          <line x1="360" y1="320" x2="360" y2="330" stroke="#2a1708" strokeWidth="0.6" opacity="0.4" />
          <line x1="440" y1="320" x2="440" y2="330" stroke="#2a1708" strokeWidth="0.6" opacity="0.4" />
          <line x1="520" y1="320" x2="520" y2="330" stroke="#2a1708" strokeWidth="0.6" opacity="0.4" />
        </g>

        {/* barrel companion */}
        {barrel === 1 && (
          <g opacity="0.95">
            <rect x="225" y="306" width="18" height="14" rx="2" fill="#7a4d28" />
            <line x1="225" y1="310" x2="243" y2="310" stroke="#3b2410" strokeWidth="1" />
            <line x1="225" y1="316" x2="243" y2="316" stroke="#3b2410" strokeWidth="1" />
          </g>
        )}

        {/* cannon companion */}
        {cannon === 1 && (
          <g opacity="0.95">
            <rect x="400" y="312" width="30" height="7" rx="2" fill="#2d2d2d" />
            <rect x="395" y="315" width="6" height="5" fill="#5a3520" />
          </g>
        )}

        <g opacity={op(cabin)}>
          <rect x="500" y="290" width="80" height="30" fill="#7a4d28" />
          <rect x="500" y="286" width="80" height="6" fill="#5e3a1d" />
          <rect x="510" y="298" width="14" height="14" fill="#ffd97a" opacity="0.9" />
          <rect x="534" y="298" width="14" height="14" fill="#ffd97a" opacity="0.9" />
          <rect x="558" y="298" width="14" height="14" fill="#ffd97a" opacity="0.9" />
        </g>

        {/* lantern on cabin */}
        {lantern === 1 && (
          <g>
            <circle cx="540" cy="280" r="14" fill="url(#glow)" />
            <rect x="535" y="276" width="10" height="12" rx="2" fill="#ffd97a" />
            <rect x="537" y="272" width="6" height="4" fill="#3b2410" />
          </g>
        )}

        <g opacity={op(mFore)}>
          <rect x="258" y="170" width="6" height="150" fill="#4a2d14" />
          <rect x="220" y="200" width="80" height="4" fill="#4a2d14" />
        </g>

        <g opacity={op(mMain)}>
          <rect x="397" y="140" width="7" height="180" fill="#4a2d14" />
          <rect x="350" y="175" width="100" height="4" fill="#4a2d14" />
          <rect x="360" y="215" width="80" height="4" fill="#4a2d14" />
        </g>

        <g opacity={op(mMizzen)}>
          <rect x="536" y="175" width="6" height="115" fill="#4a2d14" />
          <rect x="506" y="205" width="66" height="4" fill="#4a2d14" />
        </g>

        {/* parrot on yard */}
        {parrot === 1 && (
          <g>
            <ellipse cx="450" cy="172" rx="6" ry="4" fill="#6cf0c2" />
            <circle cx="454" cy="170" r="2.5" fill="#6cf0c2" />
            <circle cx="455" cy="169" r="0.5" fill="#000" />
            <path d="M455 171 l 3 1 l -3 1 z" fill="#ff7b8b" />
          </g>
        )}

        <g opacity={op(sails)}>
          <path d="M224 204 Q 261 212 298 204 L 296 240 Q 261 246 226 240 Z" fill="url(#sail)" />
          <path d="M230 172 Q 261 168 292 172 L 290 198 Q 261 202 232 198 Z" fill="url(#sail)" opacity="0.95" />
          <path d="M352 179 Q 400 170 448 179 L 446 215 Q 400 222 354 215 Z" fill="url(#sail)" />
          <path d="M362 219 Q 400 213 438 219 L 436 258 Q 400 266 364 258 Z" fill="url(#sail)" />
          <path d="M372 143 Q 400 139 428 143 L 426 170 Q 400 174 374 170 Z" fill="url(#sail)" opacity="0.95" />
          <path d="M510 209 Q 539 204 568 209 L 566 240 Q 539 246 512 240 Z" fill="url(#sail)" />
          <g stroke="#d9c89a" strokeWidth="1" opacity="0.6" fill="none">
            <line x1="360" y1="195" x2="440" y2="195" />
            <line x1="370" y1="240" x2="430" y2="240" />
          </g>
        </g>

        <g opacity={op(flag)}>
          <g stroke="#2a1708" strokeWidth="1" opacity="0.7">
            <line x1="400" y1="140" x2="300" y2="320" />
            <line x1="400" y1="140" x2="500" y2="320" />
            <line x1="261" y1="170" x2="220" y2="320" />
            <line x1="261" y1="170" x2="300" y2="320" />
            <line x1="539" y1="175" x2="510" y2="320" />
            <line x1="539" y1="175" x2="578" y2="320" />
          </g>
          <path d="M400 130 L 430 124 L 400 118 Z" fill="#ff5d73" />
          <path d="M261 160 L 283 156 L 261 152 Z" fill="#ffc65a" />
          <path d="M539 165 L 560 161 L 539 157 Z" fill="#6cf0c2" />
          <rect x="392" y="138" width="17" height="4" fill="#3b2410" />
        </g>
      </g>

      <path d="M0 360 Q 80 354 160 360 T 320 360 T 480 360 T 640 360 T 800 360 L 800 450 L 0 450 Z"
        fill="#0f1a3a">
        <animate attributeName="d" dur="5s" repeatCount="indefinite"
          values="
            M0 360 Q 80 354 160 360 T 320 360 T 480 360 T 640 360 T 800 360 L 800 450 L 0 450 Z;
            M0 360 Q 80 366 160 360 T 320 360 T 480 360 T 640 360 T 800 360 L 800 450 L 0 450 Z;
            M0 360 Q 80 354 160 360 T 320 360 T 480 360 T 640 360 T 800 360 L 800 450 L 0 450 Z" />
      </path>
      <path d="M0 380 Q 60 374 120 380 T 240 380 T 360 380 T 480 380 T 600 380 T 720 380 T 800 380 L 800 450 L 0 450 Z"
        fill="#081028">
        <animate attributeName="d" dur="4s" repeatCount="indefinite"
          values="
            M0 380 Q 60 374 120 380 T 240 380 T 360 380 T 480 380 T 600 380 T 720 380 T 800 380 L 800 450 L 0 450 Z;
            M0 380 Q 60 386 120 380 T 240 380 T 360 380 T 480 380 T 600 380 T 720 380 T 800 380 L 800 450 L 0 450 Z;
            M0 380 Q 60 374 120 380 T 240 380 T 360 380 T 480 380 T 600 380 T 720 380 T 800 380 L 800 450 L 0 450 Z" />
      </path>
    </svg>
  );
}
