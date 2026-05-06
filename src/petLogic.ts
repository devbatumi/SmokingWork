import type { PetStat, PetState } from './types';

// Decay rate: 6 пунктов в час → стат падает с 100 до 0 за ~17 часов.
// Достаточно медленно, чтобы не быть нытьём, но быстро,
// чтобы хотелось возвращаться в момент тяги.
export const PET_DECAY_PER_HOUR = 6;

export type PetActionDef = {
  id: string;
  label: string;
  emoji: string;
  hint: string;
  stat: PetStat;
  amount: number;
  cooldownMs: number;
};

export const PET_ACTIONS: PetActionDef[] = [
  {
    id: 'feed',
    label: 'Покормить',
    emoji: '🌾',
    hint: 'Зерно — попугай любит просо и семечки.',
    stat: 'hunger',
    amount: 35,
    cooldownMs: 25 * 60 * 1000,
  },
  {
    id: 'play',
    label: 'Поиграть',
    emoji: '🎾',
    hint: 'Бросаешь мячик, он догоняет.',
    stat: 'happiness',
    amount: 30,
    cooldownMs: 20 * 60 * 1000,
  },
  {
    id: 'wash',
    label: 'Помыть',
    emoji: '🛁',
    hint: 'Тёплая вода и чистые пёрышки.',
    stat: 'cleanliness',
    amount: 40,
    cooldownMs: 60 * 60 * 1000,
  },
  {
    id: 'sleep',
    label: 'Уложить спать',
    emoji: '💤',
    hint: 'Накрываешь клетку, тишина — он спит.',
    stat: 'energy',
    amount: 45,
    cooldownMs: 90 * 60 * 1000,
  },
  {
    id: 'pet',
    label: 'Погладить',
    emoji: '🤗',
    hint: 'Чешешь за ухом, маленькая радость.',
    stat: 'happiness',
    amount: 8,
    cooldownMs: 4 * 60 * 1000,
  },
  {
    id: 'snack',
    label: 'Дать орех',
    emoji: '🥜',
    hint: 'Любимое лакомство.',
    stat: 'hunger',
    amount: 10,
    cooldownMs: 5 * 60 * 1000,
  },
];

export function defaultPet(now: number): PetState {
  return {
    name: 'Чубчик',
    hunger: 70,
    happiness: 80,
    energy: 70,
    cleanliness: 70,
    lastTick: now,
    cooldowns: {},
    totalActions: 0,
    bornAt: now,
  };
}

export type PetCurrent = Record<PetStat, number>;

export function currentStats(pet: PetState, now: number): PetCurrent {
  const hours = Math.max(0, (now - pet.lastTick) / 3_600_000);
  const decay = hours * PET_DECAY_PER_HOUR;
  return {
    hunger: Math.max(0, pet.hunger - decay),
    happiness: Math.max(0, pet.happiness - decay),
    energy: Math.max(0, pet.energy - decay),
    cleanliness: Math.max(0, pet.cleanliness - decay),
  };
}

export type PetMood = 'happy' | 'ok' | 'sad' | 'sick' | 'sleep';

export function petMood(stats: PetCurrent): PetMood {
  if (stats.energy < 12) return 'sleep';
  const avg =
    (stats.hunger + stats.happiness + stats.energy + stats.cleanliness) / 4;
  if (avg > 75) return 'happy';
  if (avg > 50) return 'ok';
  if (avg > 25) return 'sad';
  return 'sick';
}

export function moodMessage(mood: PetMood, name: string): string {
  switch (mood) {
    case 'happy':
      return `${name} в восторге, скачет по жёрдочке.`;
    case 'ok':
      return `${name} спокойно чистит пёрышки.`;
    case 'sad':
      return `${name} грустит и смотрит в иллюминатор.`;
    case 'sick':
      return `${name} болеет — ему нужен уход прямо сейчас.`;
    case 'sleep':
      return `${name} спит, не буди.`;
  }
}

// Stages by total actions — чтобы прогрессия была на любом нормоиде.
export type PetStage = 'egg' | 'chick' | 'fledgling' | 'adult' | 'captain';

export function petStage(totalActions: number): PetStage {
  if (totalActions < 5) return 'egg';
  if (totalActions < 25) return 'chick';
  if (totalActions < 80) return 'fledgling';
  if (totalActions < 200) return 'adult';
  return 'captain';
}

export function stageLabel(stage: PetStage): string {
  switch (stage) {
    case 'egg':
      return 'яйцо';
    case 'chick':
      return 'птенец';
    case 'fledgling':
      return 'подросток';
    case 'adult':
      return 'попугай';
    case 'captain':
      return 'капитан';
  }
}

// Применить действие к питомцу: декей до now, затем + amount к нужному стату.
export function applyPetAction(
  pet: PetState,
  actionId: string,
  now: number,
): PetState | null {
  const def = PET_ACTIONS.find((a) => a.id === actionId);
  if (!def) return null;
  if ((pet.cooldowns?.[actionId] ?? 0) > now) return null;
  const stats = currentStats(pet, now);
  const next: PetCurrent = { ...stats };
  next[def.stat] = Math.min(100, stats[def.stat] + def.amount);
  return {
    ...pet,
    hunger: next.hunger,
    happiness: next.happiness,
    energy: next.energy,
    cleanliness: next.cleanliness,
    lastTick: now,
    cooldowns: { ...pet.cooldowns, [actionId]: now + def.cooldownMs },
    totalActions: pet.totalActions + 1,
  };
}
