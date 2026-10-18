/* ==========================================================================
   LERNPLAN BIS ZUR MATHEARBEIT (siehe LERNPLAN.md)
   Pro Tag gibt es Seiten-Ziele (Schreiblernheft + Mathe) und eine Belohnung.
   Sterne gibt es erst, wenn alle Seiten bis zu diesem Tag geschafft sind.
   ========================================================================== */

export interface PlanDay {
  date: string;   // YYYY-MM-DD
  topic: string;
  week: 1 | 2;
  reward: number; // Sterne für diesen Tag
}

export const EXAM_DATE = '2026-11-02';

export const SCHREIB_TOTAL = 41; // Seite 35 bis 76
export const MATHE_TOTAL = 34;   // 17 gelb + 17 blau

export const WEEK_TITLES: Record<number, string> = {
  1: 'Woche 1: Zahlenraum bis 100',
  2: 'Woche 2: Einmaleins, Division & Co.'
};

export const PLAN_DAYS: PlanDay[] = [
  { date: '2026-10-18', week: 1, topic: 'Plus & Minus bis 100 (Start)', reward: 3 },
  { date: '2026-10-19', week: 1, topic: 'Plus mit Zehnerübergang in 2 Schritten', reward: 3 },
  { date: '2026-10-20', week: 1, topic: 'Minus mit Zehnerübergang in 2 Schritten', reward: 3 },
  { date: '2026-10-21', week: 1, topic: 'Plus/Minus gemischt & Probe', reward: 3 },
  { date: '2026-10-22', week: 1, topic: 'Zahlenmauern (Plus)', reward: 3 },
  { date: '2026-10-23', week: 1, topic: 'Zahlenmauern mit fehlenden Steinen', reward: 3 },
  { date: '2026-10-24', week: 1, topic: 'Puffer & Wiederholung', reward: 3 },
  { date: '2026-10-25', week: 2, topic: 'Einmaleins: 2er, 5er, 10er, 4er', reward: 3 },
  { date: '2026-10-26', week: 2, topic: 'Einmaleins: 3er, 6er, 7er, 8er, 9er', reward: 3 },
  { date: '2026-10-27', week: 2, topic: 'Einmaleins gemischt & Division', reward: 3 },
  { date: '2026-10-28', week: 2, topic: 'Division mit Rest', reward: 3 },
  { date: '2026-10-29', week: 2, topic: 'Division mit Rest vertiefen', reward: 3 },
  { date: '2026-10-30', week: 2, topic: 'Punkt-vor-Strich', reward: 3 },
  { date: '2026-10-31', week: 2, topic: 'Sachaufgaben', reward: 3 },
  { date: '2026-11-01', week: 2, topic: 'Probearbeit mit Zeitlimit', reward: 5 }
];

/** Kumulatives Seiten-Ziel bis einschließlich Tag `index` (0-basiert). */
export function cumulativeTarget(total: number, index: number): number {
  return Math.round((total * (index + 1)) / PLAN_DAYS.length);
}

/** Seiten-Ziel nur für den Tag `index`. */
export function dailyQuota(total: number, index: number): number {
  return cumulativeTarget(total, index) - (index === 0 ? 0 : cumulativeTarget(total, index - 1));
}
