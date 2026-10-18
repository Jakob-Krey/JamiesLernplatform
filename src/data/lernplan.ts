/* ==========================================================================
   LERNPLAN BIS ZUR MATHEARBEIT (siehe LERNPLAN.md)
   Pro Tag gibt es Seiten-Ziele (Schreiblernheft + Mathe) und eine Belohnung.
   Sterne gibt es erst, wenn alle Seiten bis zu diesem Tag geschafft sind.
   ========================================================================== */

export interface PlanDay {
  date: string;   // YYYY-MM-DD
  topic: string;
  week: 1 | 2 | 3;
  reward: number; // Sterne für diesen Tag
  sheet?: string; // Übungsblatt-Thema (siehe lib/worksheets.ts)
}

export const EXAM_DATE = '2026-11-02';

export const SCHREIB_TOTAL = 41; // Seite 35 bis 76
export const MATHE_TOTAL = 34;   // 17 gelb + 17 blau

export const WEEK_TITLES: Record<number, string> = {
  1: 'Woche 1: Zahlenraum bis 100',
  2: 'Woche 2: Einmaleins, Division & Co.',
  3: 'Woche 3: Schreiblernheft zu Ende bringen'
};

/** Bereits vor dem Start des Pfads erledigte Tage (zählen nicht zu den Seiten-Zielen unten). */
export const DONE_DAYS: PlanDay[] = [
  { date: '2026-10-17', week: 1, topic: 'Erster Übungstag geschafft', reward: 3 }
];

export const PLAN_DAYS: PlanDay[] = [
  { date: '2026-10-18', week: 1, topic: 'Plus & Minus bis 100 (Start)', reward: 3, sheet: 'plusminus' },
  { date: '2026-10-19', week: 1, topic: 'Plus mit Zehnerübergang in 2 Schritten', reward: 3, sheet: 'plus2' },
  { date: '2026-10-20', week: 1, topic: 'Minus mit Zehnerübergang in 2 Schritten', reward: 3, sheet: 'minus2' },
  { date: '2026-10-21', week: 1, topic: 'Plus/Minus gemischt & Probe', reward: 3, sheet: 'mix2' },
  { date: '2026-10-22', week: 1, topic: 'Zahlenmauern (Plus)', reward: 3, sheet: 'mauer' },
  { date: '2026-10-23', week: 1, topic: 'Zahlenmauern mit fehlenden Steinen', reward: 3, sheet: 'mauer_fehlt' },
  { date: '2026-10-24', week: 1, topic: 'Puffer & Wiederholung', reward: 3, sheet: 'wiederholung' },
  { date: '2026-10-25', week: 2, topic: 'Einmaleins: 2er, 5er, 10er, 4er', reward: 3, sheet: 'mal_a' },
  { date: '2026-10-26', week: 2, topic: 'Einmaleins: 3er, 6er, 7er, 8er, 9er', reward: 3, sheet: 'mal_b' },
  { date: '2026-10-27', week: 2, topic: 'Einmaleins gemischt & Division', reward: 3, sheet: 'mal_geteilt' },
  { date: '2026-10-28', week: 2, topic: 'Division mit Rest', reward: 3, sheet: 'rest' },
  { date: '2026-10-29', week: 2, topic: 'Division mit Rest vertiefen', reward: 3, sheet: 'rest' },
  { date: '2026-10-30', week: 2, topic: 'Punkt-vor-Strich', reward: 3, sheet: 'punkt' },
  { date: '2026-10-31', week: 2, topic: 'Sachaufgaben', reward: 3, sheet: 'sach' },
  { date: '2026-11-01', week: 2, topic: 'Probearbeit mit Zeitlimit', reward: 5, sheet: 'probe' },
  { date: '2026-11-02', week: 3, topic: 'Mathearbeit! 💪 Danach 2 Seiten Deutsch', reward: 3 },
  { date: '2026-11-03', week: 3, topic: 'Nur Deutsch: Schreiblernheft', reward: 3 },
  { date: '2026-11-04', week: 3, topic: 'Nur Deutsch: Schreiblernheft', reward: 3 },
  { date: '2026-11-05', week: 3, topic: 'Nur Deutsch: Schreiblernheft', reward: 3 },
  { date: '2026-11-06', week: 3, topic: 'Nur Deutsch: Schreiblernheft', reward: 3 },
  { date: '2026-11-07', week: 3, topic: 'Letzte Seite Schreiblernheft 🏁', reward: 3 }
];

/** Mathe wird bis zur Arbeit am 02.11. (Tag 17) fertig, Deutsch läuft danach weiter. */
const MATHE_DAYS = 15;
/** Deutsch (Schreiblernheft): jeden Tag höchstens 2 Seiten. */
const SCHREIB_PER_DAY = 2;

/** Kumulatives Seiten-Ziel bis einschließlich Tag `index` (0-basiert). */
export function cumulativeTarget(total: number, index: number): number {
  if (total === SCHREIB_TOTAL) return Math.min(total, SCHREIB_PER_DAY * (index + 1));
  return Math.round((total * Math.min(index + 1, MATHE_DAYS)) / MATHE_DAYS);
}

/** Seiten-Ziel nur für den Tag `index`. */
export function dailyQuota(total: number, index: number): number {
  return cumulativeTarget(total, index) - (index === 0 ? 0 : cumulativeTarget(total, index - 1));
}
