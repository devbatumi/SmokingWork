import type { Section } from './types';

// 66 дней × 20 сигарет = 1320 досок (Lally et al. 2010, UCL)
export const SECTIONS: Section[] = [
  { id: 'keel', name: 'Киль', cost: 78 },
  { id: 'hull', name: 'Корпус', cost: 236 },
  { id: 'deck', name: 'Палуба', cost: 142 },
  { id: 'cabin', name: 'Каюта', cost: 126 },
  { id: 'mast-fore', name: 'Фок-мачта', cost: 126 },
  { id: 'mast-main', name: 'Грот-мачта', cost: 157 },
  { id: 'mast-mizzen', name: 'Бизань-мачта', cost: 126 },
  { id: 'sails', name: 'Паруса', cost: 236 },
  { id: 'flag', name: 'Флаг и такелаж', cost: 93 },
];

export const TOTAL_BRICKS = SECTIONS.reduce((s, x) => s + x.cost, 0); // 1320

export function buildProgress(built: number) {
  const sections = SECTIONS.map((s) => ({ ...s, filled: 0 }));
  let rem = Math.min(built, TOTAL_BRICKS);
  for (const s of sections) {
    const take = Math.min(rem, s.cost);
    s.filled = take;
    rem -= take;
    if (rem <= 0) break;
  }
  return sections;
}
