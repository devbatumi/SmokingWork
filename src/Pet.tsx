import { useMemo } from 'react';
import type { PetState } from './types';
import {
  PET_ACTIONS,
  currentStats,
  moodMessage,
  petMood,
  petStage,
  stageLabel,
  type PetCurrent,
  type PetMood,
  type PetStage,
} from './petLogic';
import { useNow } from './store';

type Props = {
  pet: PetState;
  onAction: (actionId: string) => void;
};

function fmtCooldown(ms: number) {
  if (ms <= 0) return '';
  if (ms < 60_000) return `${Math.ceil(ms / 1000)}с`;
  if (ms < 3600_000) return `${Math.ceil(ms / 60_000)}мин`;
  return `${Math.ceil(ms / 3600_000)}ч`;
}

function StatBar({
  label,
  value,
  icon,
  warn,
}: {
  label: string;
  value: number;
  icon: string;
  warn: boolean;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const tone =
    pct > 60 ? 'good' : pct > 30 ? 'mid' : 'low';
  return (
    <div className={`pet-stat tone-${tone}${warn ? ' warn' : ''}`}>
      <div className="pet-stat-head">
        <span className="pet-stat-icon">{icon}</span>
        <span className="pet-stat-label">{label}</span>
        <span className="pet-stat-val">{Math.round(pct)}</span>
      </div>
      <div className="pet-stat-bar">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ParrotSVG({
  mood,
  stage,
  bored,
}: {
  mood: PetMood;
  stage: PetStage;
  bored: boolean;
}) {
  const sleeping = mood === 'sleep';
  const happy = mood === 'happy';
  const sad = mood === 'sad' || mood === 'sick';
  // По стадии меняем размер тела
  const scale =
    stage === 'egg'
      ? 0.55
      : stage === 'chick'
      ? 0.7
      : stage === 'fledgling'
      ? 0.85
      : 1;

  if (stage === 'egg') {
    return (
      <svg viewBox="0 0 200 200" className={`pet-svg ${sleeping ? 'pet-sleep' : happy ? 'pet-happy' : ''}`}>
        <ellipse cx="100" cy="180" rx="50" ry="6" fill="#000" opacity="0.3" />
        <path
          d="M70 110 Q 60 60 100 50 Q 140 60 130 110 Q 130 160 100 165 Q 70 160 70 110 Z"
          fill="#f7d27b"
          stroke="#b48334"
          strokeWidth="2"
        />
        <ellipse cx="92" cy="90" rx="4" ry="6" fill="#fff" opacity="0.6" />
        {!sleeping && bored && (
          <text x="100" y="108" textAnchor="middle" fontSize="14" fill="#5e3a1d" opacity="0.6">
            тук-тук?
          </text>
        )}
      </svg>
    );
  }

  // Параметры для разных настроений
  const eyeY = sleeping ? 82 : sad ? 86 : 80;
  const eyeR = sleeping ? 0.5 : 4;
  const beakRot = happy ? -8 : sad ? 8 : 0;
  const wingY = happy ? 105 : 110;

  return (
    <svg
      viewBox="0 0 200 200"
      className={`pet-svg ${sleeping ? 'pet-sleep' : happy ? 'pet-happy' : sad ? 'pet-sad' : ''}`}
    >
      <defs>
        <linearGradient id="parrot-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6cf0c2" />
          <stop offset="100%" stopColor="#2a9879" />
        </linearGradient>
        <linearGradient id="parrot-head" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff7b8b" />
          <stop offset="100%" stopColor="#d63449" />
        </linearGradient>
        <linearGradient id="parrot-beak" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffd97a" />
          <stop offset="100%" stopColor="#e0a734" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="190" rx="55 " ry="5" fill="#000" opacity="0.3" />

      {/* perch */}
      <rect x="55" y="170" width="90" height="6" rx="2" fill="#5e3a1d" />
      <rect x="55" y="170" width="90" height="2" rx="1" fill="#7a4d28" />

      <g transform={`translate(100 ${130}) scale(${scale}) translate(-100 -130)`}>
        {/* tail */}
        <path
          d="M62 130 Q 40 145 50 165 L 70 150 Z"
          fill="#3aa28a"
          opacity="0.95"
        />
        <path
          d="M68 138 Q 52 160 64 170 L 78 152 Z"
          fill="#5dc7a5"
          opacity="0.95"
        />

        {/* body */}
        <ellipse cx="100" cy="130" rx="38" ry="42" fill="url(#parrot-body)" />
        {/* belly */}
        <ellipse cx="100" cy="140" rx="22" ry="26" fill="#f7f0dc" opacity="0.85" />

        {/* legs */}
        <g stroke="#a87042" strokeWidth="3" strokeLinecap="round">
          <line x1="92" y1="168" x2="92" y2="178" />
          <line x1="108" y1="168" x2="108" y2="178" />
        </g>

        {/* wing */}
        <ellipse
          cx="80"
          cy={wingY}
          rx="14"
          ry="22"
          fill="#2a9879"
          stroke="#1f7a60"
          strokeWidth="1"
          style={{ transition: 'cy 0.4s ease' }}
        />
        <ellipse
          cx="80"
          cy={wingY}
          rx="9"
          ry="16"
          fill="#3aa28a"
          opacity="0.8"
        />

        {/* head */}
        <circle cx="100" cy="80" r="32" fill="url(#parrot-head)" />
        {/* crest */}
        <path
          d="M100 50 L 108 36 L 102 52 L 110 42 L 105 58 L 116 50 Z"
          fill="#ffc65a"
          opacity={happy ? 1 : 0.85}
        />

        {/* eye */}
        <g>
          {sleeping ? (
            <path
              d="M88 82 Q 96 86 104 82"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <>
              <circle cx="96" cy={eyeY} r={eyeR + 1} fill="#fff" />
              <circle cx="96" cy={eyeY} r={eyeR} fill="#1a1a1a" />
              <circle cx="97" cy={eyeY - 1} r="1" fill="#fff" />
            </>
          )}
        </g>

        {/* cheek */}
        {happy && (
          <circle cx="86" cy="92" r="4" fill="#ff7b8b" opacity="0.4" />
        )}

        {/* beak */}
        <g
          transform={`rotate(${beakRot} 116 88)`}
          style={{ transition: 'transform 0.3s ease' }}
        >
          <path
            d="M116 80 Q 132 86 128 96 Q 120 100 110 96 Z"
            fill="url(#parrot-beak)"
            stroke="#a87042"
            strokeWidth="1"
          />
          <line
            x1="115"
            y1="90"
            x2="124"
            y2="92"
            stroke="#a87042"
            strokeWidth="1"
            opacity="0.6"
          />
        </g>

        {/* sleep zzz */}
        {sleeping && (
          <g fill="#8a97c4" opacity="0.85">
            <text x="135" y="60" fontSize="14">
              z
            </text>
            <text x="148" y="48" fontSize="18">
              Z
            </text>
            <text x="160" y="32" fontSize="22">
              Z
            </text>
          </g>
        )}

        {/* sad tear */}
        {sad && (
          <ellipse cx="92" cy="98" rx="2" ry="4" fill="#6cb8f0" opacity="0.85" />
        )}

        {/* happy notes */}
        {happy && (
          <g fill="#ffd97a" opacity="0.9">
            <text x="138" y="70" fontSize="16">
              ♪
            </text>
            <text x="50" y="80" fontSize="14">
              ♫
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}

export function Pet({ pet, onAction }: Props) {
  const now = useNow(2000);
  const stats: PetCurrent = useMemo(() => currentStats(pet, now), [pet, now]);
  const mood = petMood(stats);
  const stage = petStage(pet.totalActions);
  const ageDays = Math.max(0, (now - pet.bornAt) / 86_400_000);
  const ageLabel =
    ageDays < 1 ? `${Math.floor(ageDays * 24)}ч` : `${Math.floor(ageDays)}д`;
  const lowestStat = Math.min(
    stats.hunger,
    stats.happiness,
    stats.energy,
    stats.cleanliness,
  );
  const bored = lowestStat < 25;

  return (
    <div className="pet-wrap">
      <div className="pet-stage-card">
        <div className="pet-figure">
          <ParrotSVG mood={mood} stage={stage} bored={bored} />
        </div>
        <div className="pet-id">
          <div className="pet-name">{pet.name}</div>
          <div className="pet-meta">
            {stageLabel(stage)} · {ageLabel} · {pet.totalActions} забот
          </div>
          <div className={`pet-mood pet-mood-${mood}`}>
            {moodMessage(mood, pet.name)}
          </div>
        </div>
      </div>

      <div className="pet-stats">
        <StatBar label="Сытость" value={stats.hunger} icon="🌾" warn={stats.hunger < 25} />
        <StatBar label="Настроение" value={stats.happiness} icon="🎾" warn={stats.happiness < 25} />
        <StatBar label="Энергия" value={stats.energy} icon="💤" warn={stats.energy < 25} />
        <StatBar label="Чистота" value={stats.cleanliness} icon="🛁" warn={stats.cleanliness < 25} />
      </div>

      <div className="pet-actions-grid">
        {PET_ACTIONS.map((a) => {
          const cdEnd = pet.cooldowns?.[a.id] ?? 0;
          const remain = Math.max(0, cdEnd - now);
          const ready = remain <= 0;
          return (
            <button
              key={a.id}
              className={`pet-action${ready ? '' : ' is-cooldown'}`}
              onClick={() => ready && onAction(a.id)}
              disabled={!ready}
              title={a.hint}
            >
              <div className="pa-emoji">{a.emoji}</div>
              <div className="pa-body">
                <div className="pa-label">{a.label}</div>
                <div className="pa-hint">{a.hint}</div>
                <div className="pa-meta">
                  {ready ? `+${a.amount} ${statShort(a.stat)}` : `через ${fmtCooldown(remain)}`}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="tiny" style={{ marginTop: 12 }}>
        Тяга накатила — займи руки тут. Чем дольше держится корабль,
        тем взрослее становится {pet.name}: {pet.totalActions}/200 действий до капитана.
      </p>
    </div>
  );
}

function statShort(stat: string): string {
  switch (stat) {
    case 'hunger':
      return 'к сытости';
    case 'happiness':
      return 'к настроению';
    case 'energy':
      return 'к энергии';
    case 'cleanliness':
      return 'к чистоте';
    default:
      return '';
  }
}
