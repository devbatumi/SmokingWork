export type Status = 'building' | 'sailed' | 'sunk';

export type JournalEntry = {
  ts: number;
  craving: number; // 0..10
  trigger?: string;
  note?: string;
  overcame: boolean;
};

export type Persist = {
  onboarded: boolean;
  startedAt: number;
  lastCigaretteAt: number;
  perDay: number;
  pricePerPack: number;
  relapses: number;
  status: Status;
  bonusBricks: number;
  cooldowns: Record<string, number>;
  journal: JournalEntry[];
  reasons: string[];
  letterToSelf: string;
};

export type Section = {
  id: string;
  name: string;
  cost: number;
};
