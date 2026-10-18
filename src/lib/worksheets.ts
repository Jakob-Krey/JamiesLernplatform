/* ==========================================================================
   ÜBUNGSBLÄTTER-GENERATOR
   Erzeugt Aufgaben im Stil der 1. Mathearbeit (Plus/Minus bis 100, 2 Schritte,
   Zahlenmauern, Malpfeile, Produkte, Division mit Rest, Punkt-vor-Strich,
   Sachaufgaben). Gleicher Seed = gleiches Blatt (online wie gedruckt).
   ========================================================================== */

export type Item =
  | { kind: 'eq'; text: string; answer: number }
  | { kind: 'steps'; a: number; op: '+' | '-'; b: number; mid: number; answer: number }
  | { kind: 'rest'; dividend: number; divisor: number; q: number; r: number }
  | { kind: 'pfeil'; factor: number; rows: { from: number; to: number }[] }
  | { kind: 'produkt'; a: number; b: number }
  | { kind: 'mauer'; levels: number[][]; hidden: boolean[][] }
  | { kind: 'sach'; story: string; table?: { head: string[]; rows: string[][] }; parts: SachPart[] };

export interface SachPart {
  question: string;
  answer: number;
  unit: string;
}

export interface Section {
  nr: number;
  title: string;
  hint?: string;
  points?: number;
  layout: 'cols4' | 'cols3' | 'cols2' | 'cols1';
  items: Item[];
}

export interface Sheet {
  title: string;
  sections: Section[];
}

export const TOPICS = [
  { id: 'plusminus', label: 'Plus & Minus bis 100', group: 'Plus & Minus' },
  { id: 'plus2', label: 'Plus in 2 Schritten', group: 'Plus & Minus' },
  { id: 'minus2', label: 'Minus in 2 Schritten', group: 'Plus & Minus' },
  { id: 'mix2', label: 'Plus/Minus gemischt', group: 'Plus & Minus' },
  { id: 'mauer', label: 'Zahlenmauern (Basis gegeben)', group: 'Zahlenmauern' },
  { id: 'mauer_fehlt', label: 'Zahlenmauern (Steine fehlen)', group: 'Zahlenmauern' },
  { id: 'wiederholung', label: 'Wiederholung Plus/Minus & Mauern', group: 'Zahlenmauern' },
  { id: 'mal_a', label: 'Einmaleins 2er, 5er, 10er, 4er', group: 'Mal & Geteilt' },
  { id: 'mal_b', label: 'Einmaleins 3er, 6er, 7er, 8er, 9er', group: 'Mal & Geteilt' },
  { id: 'mal_geteilt', label: 'Einmaleins gemischt & Geteilt', group: 'Mal & Geteilt' },
  { id: 'rest', label: 'Division mit Rest', group: 'Mal & Geteilt' },
  { id: 'punkt', label: 'Punkt-vor-Strich', group: 'Rechenregeln & Sachaufgaben' },
  { id: 'sach', label: 'Sachaufgaben', group: 'Rechenregeln & Sachaufgaben' },
  { id: 'probe', label: 'Probearbeit (wie die echte Arbeit)', group: 'Probearbeit' },
  { id: 'zr10', label: 'Plus & Minus bis 10', group: 'Zahlenraum bis 20' },
  { id: 'zr20', label: 'Plus & Minus bis 20', group: 'Zahlenraum bis 20' }
] as const;

export type TopicId = (typeof TOPICS)[number]['id'];

// ---------- Zufall (gleicher Seed = gleiche Aufgaben) ----------

function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Rng {
  private next: () => number;
  constructor(seed: string) {
    this.next = mulberry32(hashSeed(seed));
  }
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(list: readonly T[]): T {
    return list[this.int(0, list.length - 1)];
  }
  shuffle<T>(list: T[]): T[] {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

// ---------- Aufgaben-Bausteine ----------

/** Plus oder Minus einstellig mit Zehnerübergang, z. B. 28 + 6 oder 63 - 4 */
function eqSingleDigit(r: Rng, op: '+' | '-'): Item {
  if (op === '+') {
    for (;;) {
      const a = r.int(21, 89);
      const b = r.int(3, 9);
      if ((a % 10) + b > 9 && a + b < 100) return { kind: 'eq', text: `${a} + ${b} =`, answer: a + b };
    }
  }
  for (;;) {
    const a = r.int(31, 99);
    const b = r.int(3, 9);
    if (a % 10 < b) return { kind: 'eq', text: `${a} − ${b} =`, answer: a - b };
  }
}

/** Ganze Zehner, z. B. 45 + 30 oder 82 - 40 */
function eqTens(r: Rng, op: '+' | '-'): Item {
  if (op === '+') {
    const a = r.int(12, 69);
    const b = r.int(1, Math.floor((99 - a) / 10)) * 10;
    return { kind: 'eq', text: `${a} + ${b} =`, answer: a + b };
  }
  const a = r.int(42, 99);
  const b = r.int(1, Math.floor((a - 1) / 10)) * 10;
  return { kind: 'eq', text: `${a} − ${b} =`, answer: a - b };
}

/** Zweistellig ohne Übergang, z. B. 34 + 25 oder 78 - 35 */
function eqTwoDigitNoCarry(r: Rng, op: '+' | '-'): Item {
  if (op === '+') {
    for (;;) {
      const a = r.int(11, 68);
      const b = r.int(11, 88 - a > 11 ? 88 - a : 11);
      if ((a % 10) + (b % 10) <= 9 && a + b < 100) return { kind: 'eq', text: `${a} + ${b} =`, answer: a + b };
    }
  }
  for (;;) {
    const a = r.int(33, 99);
    const b = r.int(11, a - 11);
    if (a % 10 >= b % 10) return { kind: 'eq', text: `${a} − ${b} =`, answer: a - b };
  }
}

function stepsPlus(r: Rng): Item {
  for (;;) {
    const a = r.int(21, 76);
    const b = r.int(14, 38);
    if ((a % 10) + (b % 10) > 9 && a + b < 100) {
      return { kind: 'steps', a, op: '+', b, mid: a + Math.floor(b / 10) * 10, answer: a + b };
    }
  }
}

function stepsMinus(r: Rng): Item {
  for (;;) {
    const a = r.int(51, 99);
    const b = r.int(14, 48);
    if (a % 10 < b % 10 && a - b > 5) {
      return { kind: 'steps', a, op: '-', b, mid: a - Math.floor(b / 10) * 10, answer: a - b };
    }
  }
}

/** Plus oder Minus im Zahlenraum bis `max`; `carry` steuert den Zehnerübergang (null = egal). */
function eqSmall(r: Rng, op: '+' | '-', max: number, carry: boolean | null): Item {
  for (let tries = 0; tries < 500; tries++) {
    if (op === '+') {
      const a = r.int(1, max - 1);
      const b = r.int(1, max - a);
      const isCarry = max > 10 && a < 10 && a + b > 10;
      if (carry !== null && carry !== isCarry) continue;
      return { kind: 'eq', text: `${a} + ${b} =`, answer: a + b };
    }
    const a = r.int(2, max);
    const b = r.int(1, a - 1);
    const isCarry = max > 10 && a > 10 && a - b < 10;
    if (carry !== null && carry !== isCarry) continue;
    return { kind: 'eq', text: `${a} − ${b} =`, answer: a - b };
  }
  return { kind: 'eq', text: `${max - 1} − 1 =`, answer: max - 2 };
}

function build<T>(n: number, fn: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

/** Wie build, aber ohne doppelte Aufgaben. */
function uniq<T>(n: number, fn: (i: number) => T): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (let tries = 0; out.length < n && tries < n * 50; tries++) {
    const item = fn(out.length);
    const key = JSON.stringify(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function eqMul(a: number, b: number): Item {
  return { kind: 'eq', text: `${a} · ${b} =`, answer: a * b };
}

function eqDiv(a: number, b: number): Item {
  return { kind: 'eq', text: `${a * b} : ${b} =`, answer: a };
}

function pfeilCards(r: Rng, factors: number[], rowsPerCard: number): Item[] {
  return factors.map((factor) => {
    const froms = r.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, rowsPerCard);
    return { kind: 'pfeil', factor, rows: froms.map((from) => ({ from, to: from * factor })) } as Item;
  });
}

function produkte(r: Rng, rows: number[], n: number): Item[] {
  return uniq(n, () => ({ kind: 'produkt', a: r.pick(rows), b: r.int(2, 10) }) as Item);
}

function restItems(r: Rng, n: number): Item[] {
  const seen = new Set<string>();
  const out: Item[] = [];
  while (out.length < n) {
    const divisor = r.int(3, 9);
    const q = r.int(2, 9);
    const rest = r.int(1, divisor - 1);
    const dividend = q * divisor + rest;
    const key = `${dividend}:${divisor}`;
    if (dividend > 60 || seen.has(key)) continue;
    seen.add(key);
    out.push({ kind: 'rest', dividend, divisor, q, r: rest });
  }
  return out;
}

function punktItems(r: Rng, n: number): Item[] {
  const out: Item[] = [];
  while (out.length < n) {
    const type = out.length % 4;
    if (type === 0) {
      const a = r.int(2, 9), b = r.int(2, 9), c = r.int(5, 30);
      out.push({ kind: 'eq', text: `${a} · ${b} + ${c} =`, answer: a * b + c });
    } else if (type === 1) {
      const b = r.int(2, 6), c = r.int(2, 6), a = b * c + r.int(2, 30);
      out.push({ kind: 'eq', text: `${a} − ${b} · ${c} =`, answer: a - b * c });
    } else if (type === 2) {
      const a = r.int(3, 9), b = r.int(3, 9), c = r.int(2, a * b - 1);
      out.push({ kind: 'eq', text: `${a} · ${b} − ${c} =`, answer: a * b - c });
    } else {
      const c = r.int(2, 6), q = r.int(2, 9), b = c * q, a = b + r.int(5, 40);
      out.push({ kind: 'eq', text: `${a} − ${b} : ${c} =`, answer: a - q });
    }
  }
  return out;
}

// ---------- Zahlenmauern ----------

/** levels[0] = Spitze, letzte Zeile = Basis */
function makePyramid(r: Rng, baseSize: number): number[][] {
  const base = build(baseSize, () => r.int(3, 20));
  const levels: number[][] = [base];
  while (levels[0].length > 1) {
    const prev = levels[0];
    levels.unshift(prev.slice(0, -1).map((v, i) => v + prev[i + 1]));
  }
  return levels;
}

function isSolvable(levels: number[][], hidden: boolean[][]): boolean {
  const known = hidden.map((row) => row.map((h) => !h));
  let changed = true;
  while (changed) {
    changed = false;
    for (let l = 0; l < levels.length - 1; l++) {
      for (let i = 0; i < levels[l].length; i++) {
        const parent = known[l][i];
        const left = known[l + 1][i];
        const right = known[l + 1][i + 1];
        const cnt = Number(parent) + Number(left) + Number(right);
        if (cnt === 2) {
          known[l][i] = true;
          known[l + 1][i] = true;
          known[l + 1][i + 1] = true;
          changed = true;
        }
      }
    }
  }
  return known.every((row) => row.every(Boolean));
}

function pyramidFill(r: Rng, baseSize: number): Item {
  const levels = makePyramid(r, baseSize);
  const hidden = levels.map((row, l) => row.map(() => l < levels.length - 1));
  return { kind: 'mauer', levels, hidden };
}

function pyramidMissing(r: Rng, baseSize: number, hiddenCount: number): Item {
  const levels = makePyramid(r, baseSize);
  const total = levels.reduce((s, row) => s + row.length, 0);
  for (let tries = 0; tries < 500; tries++) {
    const idx = r.shuffle(build(total, (i) => i)).slice(0, hiddenCount);
    const set = new Set(idx);
    let n = 0;
    const hidden = levels.map((row) => row.map(() => set.has(n++)));
    if (isSolvable(levels, hidden)) return { kind: 'mauer', levels, hidden };
  }
  return pyramidFill(r, baseSize);
}

// ---------- Sachaufgaben ----------

const NAMES = ['Jamie', 'Lena', 'Tim', 'Mia', 'Ben', 'Nele', 'Paul', 'Emma'];

function sachItem(r: Rng, variant: number): Item {
  const name = r.pick(NAMES);
  switch (variant % 6) {
    case 0: {
      // Bootsverleih: Personen pro Boot, Preis pro Boot
      const kids = r.int(10, 17);
      const persons = kids + 1;
      const perBoat = 3;
      const boats = Math.ceil(persons / perBoat);
      const price = r.pick([6, 7, 8, 9]);
      return {
        kind: 'sach',
        story: `${kids} Kinder und Frau Müller wollen 1 Stunde Ruderboot fahren. In ein Boot passen ${perBoat} Personen.`,
        table: { head: ['', '1 Stunde'], rows: [['Ruderboot (bis 3 Pers.)', `${price} €`]] },
        parts: [
          { question: 'Wie viele Ruderboote brauchen sie?', answer: boats, unit: 'Boote' },
          { question: 'Wie viel Euro müssen sie bezahlen?', answer: boats * price, unit: '€' }
        ]
      };
    }
    case 1: {
      const per = r.pick([4, 5, 6, 8]);
      const boxes = r.int(4, 9);
      return {
        kind: 'sach',
        story: `Im Obstladen werden Äpfel in Kisten gepackt. In jede Kiste kommen ${per} Äpfel. Es gibt ${boxes} Kisten.`,
        parts: [{ question: 'Wie viele Äpfel sind das insgesamt?', answer: per * boxes, unit: 'Äpfel' }]
      };
    }
    case 2: {
      const kids = r.int(12, 25);
      const price = r.pick([6, 7, 8, 9]);
      return {
        kind: 'sach',
        story: `${name}s Klasse macht einen Ausflug in den Zoo. Jedes Kind zahlt ${price} € Eintritt. Es fahren ${kids} Kinder mit.`,
        parts: [{ question: 'Wie viel Euro kostet der Eintritt für alle Kinder?', answer: kids * price, unit: '€' }]
      };
    }
    case 3: {
      const eggs = r.int(31, 58);
      const box = r.pick([6, 10]);
      return {
        kind: 'sach',
        story: `${name} hat ${eggs} Eier. In einen Karton passen ${box} Eier.`,
        parts: [
          { question: 'Wie viele Kartons werden ganz voll?', answer: Math.floor(eggs / box), unit: 'Kartons' },
          { question: 'Wie viele Eier bleiben übrig?', answer: eggs % box, unit: 'Eier' }
        ]
      };
    }
    case 4: {
      const start = r.int(55, 90);
      const gave = r.int(14, 38);
      const got = r.int(12, 29);
      return {
        kind: 'sach',
        story: `${name} hat ${start} Sticker. ${name} verschenkt ${gave} Sticker und bekommt ${got} neue dazu.`,
        parts: [{ question: 'Wie viele Sticker hat sie jetzt?', answer: start - gave + got, unit: 'Sticker' }]
      };
    }
    default: {
      const scoops = r.int(2, 4);
      const price = r.pick([2, 3]);
      const kids = r.int(3, 6);
      return {
        kind: 'sach',
        story: `Beim Eisverkäufer kostet eine Kugel Eis ${price} €. ${kids} Kinder kaufen jeweils ${scoops} Kugeln.`,
        parts: [{ question: 'Wie viel Euro müssen die Kinder zusammen bezahlen?', answer: kids * scoops * price, unit: '€' }]
      };
    }
  }
}

// ---------- Blätter ----------

function sec(
  nr: number,
  title: string,
  layout: Section['layout'],
  items: Item[],
  extra: Partial<Section> = {}
): Section {
  return { nr, title, layout, items, ...extra };
}

export function generateSheet(topic: TopicId, seed: string): Sheet {
  const r = new Rng(`${topic}|${seed}`);
  const label = TOPICS.find((t) => t.id === topic)!.label;
  const plus = () => eqSingleDigit(r, '+');
  const minus = () => eqSingleDigit(r, '-');

  switch (topic) {
    case 'plusminus':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne.', 'cols4', [...uniq(6, plus), ...uniq(6, minus)]),
          sec(2, 'Rechne mit ganzen Zehnern.', 'cols4', [
            ...uniq(6, () => eqTens(r, '+')),
            ...uniq(6, () => eqTens(r, '-'))
          ]),
          sec(3, 'Rechne.', 'cols4', [
            ...uniq(6, () => eqTwoDigitNoCarry(r, '+')),
            ...uniq(6, () => eqTwoDigitNoCarry(r, '-'))
          ])
        ]
      };
    case 'plus2':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne in 2 Schritten.', 'cols2', uniq(8, () => stepsPlus(r)), {
            hint: 'Erst die Zehner, dann die Einer.'
          }),
          sec(2, 'Rechne.', 'cols4', uniq(12, plus))
        ]
      };
    case 'minus2':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne in 2 Schritten.', 'cols2', uniq(8, () => stepsMinus(r)), {
            hint: 'Erst die Zehner, dann die Einer.'
          }),
          sec(2, 'Rechne.', 'cols4', uniq(12, minus))
        ]
      };
    case 'mix2':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne in 2 Schritten.', 'cols2', [
            ...uniq(4, () => stepsPlus(r)),
            ...uniq(4, () => stepsMinus(r))
          ]),
          sec(2, 'Rechne und mache die Probe (Umkehraufgabe).', 'cols4', [
            ...uniq(6, plus),
            ...uniq(6, minus)
          ])
        ]
      };
    case 'mauer':
      return {
        title: label,
        sections: [
          sec(1, 'Fülle die Zahlenmauern aus.', 'cols2', build(6, () => pyramidFill(r, 4)), {
            hint: 'Zwei Steine nebeneinander ergeben zusammen den Stein darüber.'
          }),
          sec(2, 'Rechne.', 'cols4', uniq(8, plus))
        ]
      };
    case 'mauer_fehlt':
      return {
        title: label,
        sections: [
          sec(1, 'Fülle die Zahlenmauern aus.', 'cols2', build(6, () => pyramidMissing(r, 4, 6)), {
            hint: 'Fang dort an, wo du schon zwei Zahlen weißt. Rechne auch rückwärts (Minus).'
          }),
          sec(2, 'Rechne.', 'cols4', uniq(8, minus))
        ]
      };
    case 'wiederholung':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne.', 'cols4', [...uniq(6, plus), ...uniq(6, minus)]),
          sec(2, 'Rechne in 2 Schritten.', 'cols2', [stepsPlus(r), stepsMinus(r), stepsPlus(r), stepsMinus(r)]),
          sec(3, 'Fülle die Zahlenmauern aus.', 'cols2', [pyramidFill(r, 4), pyramidMissing(r, 4, 6)])
        ]
      };
    case 'mal_a':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne mit dem Malpfeil.', 'cols4', pfeilCards(r, [2, 5, 10, 4], 3)),
          sec(2, 'Berechne die Produkte.', 'cols3', produkte(r, [2, 5, 10, 4], 9)),
          sec(3, 'Rechne.', 'cols4', uniq(16, () => eqMul(r.pick([2, 5, 10, 4]), r.int(1, 10))))
        ]
      };
    case 'mal_b':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne mit dem Malpfeil.', 'cols4', pfeilCards(r, [3, 6, 8, 9], 3)),
          sec(2, 'Berechne die Produkte.', 'cols3', produkte(r, [3, 6, 7, 8, 9], 9)),
          sec(3, 'Rechne.', 'cols4', uniq(16, () => eqMul(r.pick([3, 6, 7, 8, 9]), r.int(1, 10))))
        ]
      };
    case 'mal_geteilt':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne mit dem Malpfeil.', 'cols4', pfeilCards(r, [r.int(2, 5), r.int(6, 7), 8, 9], 3)),
          sec(2, 'Rechne.', 'cols4', uniq(12, () => eqMul(r.int(2, 10), r.int(2, 10)))),
          sec(3, 'Rechne geteilt.', 'cols4', uniq(16, () => eqDiv(r.int(2, 10), r.int(2, 10))), {
            hint: 'Denk an die Malaufgabe: 24 : 6 → 6 mal wie viel ergibt 24?'
          })
        ]
      };
    case 'rest':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne mit Rest.', 'cols4', restItems(r, 16), {
            hint: 'Welche Malaufgabe passt am nächsten (und ist nicht zu groß)? Der Rest muss kleiner sein als die Zahl, durch die du teilst.'
          }),
          sec(2, 'Rechne geteilt (ohne Rest).', 'cols4', uniq(8, () => eqDiv(r.int(2, 9), r.int(2, 9))))
        ]
      };
    case 'punkt':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne. Punkt vor Strich!', 'cols2', punktItems(r, 12), {
            hint: 'Erst Mal und Geteilt, dann Plus und Minus.'
          }),
          sec(2, 'Rechne.', 'cols4', uniq(8, () => eqMul(r.int(2, 10), r.int(2, 10))))
        ]
      };
    case 'sach':
      return {
        title: label,
        sections: [
          sec(1, 'Löse die Sachaufgaben. Schreibe Rechnung und Antwort auf.', 'cols1', (() => {
            const offset = r.int(0, 5);
            return build(4, (i) => sachItem(r, i + offset));
          })())
        ]
      };
    case 'zr10':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne.', 'cols4', uniq(12, () => eqSmall(r, '+', 10, null))),
          sec(2, 'Rechne.', 'cols4', uniq(12, () => eqSmall(r, '-', 10, null))),
          sec(3, 'Verdopple.', 'cols4', uniq(8, () => {
            const n = r.int(1, 5);
            return { kind: 'eq', text: `${n} + ${n} =`, answer: n * 2 } as Item;
          }))
        ]
      };
    case 'zr20':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne.', 'cols4', [
            ...uniq(6, () => eqSmall(r, '+', 20, false)),
            ...uniq(6, () => eqSmall(r, '-', 20, false))
          ]),
          sec(2, 'Rechne mit Zehnerübergang.', 'cols4', [
            ...uniq(6, () => eqSmall(r, '+', 20, true)),
            ...uniq(6, () => eqSmall(r, '-', 20, true))
          ], { hint: 'Erst bis zur 10 rechnen, dann weiter.' }),
          sec(3, 'Verdopple und halbiere.', 'cols4', [
            ...uniq(6, () => {
              const n = r.int(3, 10);
              return { kind: 'eq', text: `${n} + ${n} =`, answer: n * 2 } as Item;
            }),
            ...uniq(6, () => {
              const n = r.int(3, 10);
              return { kind: 'eq', text: `${n * 2} : 2 =`, answer: n } as Item;
            })
          ])
        ]
      };
    case 'probe':
    default:
      return {
        title: 'Probearbeit',
        sections: [
          sec(1, 'Rechne.', 'cols4', [...uniq(6, plus), ...uniq(6, minus)], { points: 12 }),
          sec(2, 'Rechne in 2 Schritten.', 'cols3', [
            stepsPlus(r), stepsPlus(r), stepsPlus(r), stepsMinus(r), stepsMinus(r), stepsMinus(r)
          ], { points: 6 }),
          sec(3, 'Fülle die Zahlenmauern aus.', 'cols2', [pyramidFill(r, 4), pyramidMissing(r, 4, 6)], { points: 12 }),
          sec(4, 'Rechne mit dem Malpfeil.', 'cols4', pfeilCards(r, [r.int(2, 5), r.int(6, 7), 8, 9], 2), { points: 8 }),
          sec(5, 'Berechne die Produkte!', 'cols3', produkte(r, [3, 4, 5, 6, 7, 8, 9], 3), { points: 3 }),
          sec(6, 'Rechne mit Rest.', 'cols4', restItems(r, 8), { points: 6 }),
          sec(7, 'Punkt vor Strich!', 'cols2', punktItems(r, 4), { points: 8 }),
          sec(8, 'Sachaufgabe', 'cols1', [sachItem(r, 0)], { points: 4 })
        ]
      };
  }
}
