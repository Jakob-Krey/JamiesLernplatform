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
  | { kind: 'mauer'; levels: number[][]; hidden: boolean[][]; big?: boolean }
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
  // Klasse 4
  { id: 'k4_plusminus', label: 'Schriftlich Plus & Minus (bis 10.000)', group: 'Klasse 4: Rechnen' },
  { id: 'k4_mal', label: 'Schriftlich Malnehmen', group: 'Klasse 4: Rechnen' },
  { id: 'k4_geteilt', label: 'Schriftlich Teilen (auch mit Rest)', group: 'Klasse 4: Rechnen' },
  { id: 'k4_kopf', label: 'Kopfrechnen: 10, 100, 1000', group: 'Klasse 4: Rechnen' },
  { id: 'k4_runden', label: 'Runden & Zahlen bis 100.000', group: 'Klasse 4: Rechnen' },
  { id: 'k4_punkt', label: 'Klammern & Punkt-vor-Strich', group: 'Klasse 4: Rechnen' },
  { id: 'k4_mauer', label: 'Große Zahlenmauern', group: 'Klasse 4: Rechnen' },
  { id: 'k4_groessen', label: 'Größen umrechnen', group: 'Klasse 4: Größen & Sachaufgaben' },
  { id: 'k4_sach', label: 'Sachaufgaben (mehrere Schritte)', group: 'Klasse 4: Größen & Sachaufgaben' },
  { id: 'k4_mix', label: 'Gemischte Übungsarbeit Klasse 4', group: 'Klasse 4: Größen & Sachaufgaben' }
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
function makePyramid(r: Rng, baseSize: number, lo = 3, hi = 20): number[][] {
  const base = build(baseSize, () => r.int(lo, hi));
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

function pyramidFill(r: Rng, baseSize: number, lo = 3, hi = 20): Item {
  const levels = makePyramid(r, baseSize, lo, hi);
  const hidden = levels.map((row, l) => row.map(() => l < levels.length - 1));
  return { kind: 'mauer', levels, hidden, big: hi > 99 };
}

function pyramidMissing(r: Rng, baseSize: number, hiddenCount: number, lo = 3, hi = 20): Item {
  const levels = makePyramid(r, baseSize, lo, hi);
  const total = levels.reduce((s, row) => s + row.length, 0);
  for (let tries = 0; tries < 500; tries++) {
    const idx = r.shuffle(build(total, (i) => i)).slice(0, hiddenCount);
    const set = new Set(idx);
    let n = 0;
    const hidden = levels.map((row) => row.map(() => set.has(n++)));
    if (isSolvable(levels, hidden)) return { kind: 'mauer', levels, hidden, big: hi > 99 };
  }
  return pyramidFill(r, baseSize, lo, hi);
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

// ---------- Klasse 4 ----------

/** 4567 -> "4.567" */
function fmt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function eqText(text: string, answer: number): Item {
  return { kind: 'eq', text, answer };
}

function k4Plus(r: Rng): Item {
  const a = r.int(1200, 6800);
  const b = r.int(1100, 9900 - a);
  return eqText(`${fmt(a)} + ${fmt(b)} =`, a + b);
}

function k4Minus(r: Rng): Item {
  const a = r.int(3000, 9990);
  const b = r.int(1100, a - 150);
  return eqText(`${fmt(a)} − ${fmt(b)} =`, a - b);
}

function k4Plus3(r: Rng): Item {
  const a = r.int(120, 2400), b = r.int(150, 2900), c = r.int(110, 3000);
  return eqText(`${fmt(a)} + ${fmt(b)} + ${fmt(c)} =`, a + b + c);
}

function k4MulSmall(r: Rng): Item {
  const a = r.int(120, 985), b = r.int(3, 9);
  return eqText(`${fmt(a)} · ${b} =`, a * b);
}

function k4MulTwo(r: Rng, lo = 12, hi = 48): Item {
  const a = r.int(lo, hi), b = r.int(11, 39);
  return eqText(`${a} · ${b} =`, a * b);
}

function k4MulBig(r: Rng): Item {
  const a = r.int(105, 350), b = r.int(12, 29);
  return eqText(`${fmt(a)} · ${b} =`, a * b);
}

function k4DivSmall(r: Rng): Item {
  const d = r.int(2, 9), q = r.int(40, 250);
  return eqText(`${fmt(d * q)} : ${d} =`, q);
}

function k4DivTwo(r: Rng): Item {
  const d = r.int(11, 25), q = r.int(12, 60);
  return eqText(`${fmt(d * q)} : ${d} =`, q);
}

function k4DivRest(r: Rng): Item {
  const d = r.int(3, 9), q = r.int(30, 150), rem = r.int(1, d - 1);
  return { kind: 'rest', dividend: d * q + rem, divisor: d, q, r: rem };
}

function roundTo(n: number, step: number): number {
  return Math.round(n / step) * step;
}

function k4Mul10(r: Rng): Item {
  const n = r.int(2, 99), f = r.pick([10, 100, 1000]);
  return eqText(`${n} · ${fmt(f).replace('.', '')} =`, n * f);
}

function k4Div10(r: Rng): Item {
  const n = r.int(2, 99), f = r.pick([10, 100, 1000]);
  return eqText(`${fmt(n * f)} : ${f} =`, n);
}

function k4Round(r: Rng, step: number, lo: number, hi: number): Item {
  for (;;) {
    const n = r.int(lo, hi);
    if (n % step !== 0 && (n % step) * 2 !== step) return eqText(`${fmt(n)} ≈`, roundTo(n, step));
  }
}

function k4Punkt(r: Rng, i: number): Item {
  switch (i % 5) {
    case 0: {
      const a = r.int(12, 60), b = r.int(12, 60), c = r.int(3, 9);
      return eqText(`(${a} + ${b}) · ${c} =`, (a + b) * c);
    }
    case 1: {
      const a = r.int(11, 40), b = r.int(3, 9), c = r.int(11, 40), d = r.int(3, 9);
      return eqText(`${a} · ${b} + ${c} · ${d} =`, a * b + c * d);
    }
    case 2: {
      const c = r.int(3, 9), q = r.int(12, 40), a = c * q + r.int(50, 400);
      return eqText(`${a} − ${c * q} : ${c} =`, a - q);
    }
    case 3: {
      const b = r.int(3, 9), q = r.int(12, 60), c = r.int(10, 50);
      return eqText(`(${b * q + c} − ${c}) : ${b} =`, q);
    }
    default: {
      const a = r.int(200, 900), b = r.int(12, 40), c = r.int(3, 9);
      return eqText(`${a} + ${b} · ${c} =`, a + b * c);
    }
  }
}

function k4Groessen(r: Rng, kind: 'laenge' | 'gewicht' | 'geld' | 'zeit' | 'raum'): Item {
  const t = (a: string, answer: number) => eqText(a, answer);
  switch (kind) {
    case 'laenge':
      return r.pick<() => Item>([
        () => { const m = r.int(2, 19); return t(`${m} m in cm =`, m * 100); },
        () => { const k = r.int(2, 12); return t(`${k} km in m =`, k * 1000); },
        () => { const c = r.int(2, 19); return t(`${c} cm in mm =`, c * 10); },
        () => { const m = r.int(1, 9), c = r.int(10, 95); return t(`${m} m ${c} cm in cm =`, m * 100 + c); },
        () => { const k = r.int(1, 9), m = r.int(100, 950); return t(`${k} km ${m} m in m =`, k * 1000 + m); }
      ])();
    case 'gewicht':
      return r.pick<() => Item>([
        () => { const k = r.int(2, 12); return t(`${k} kg in g =`, k * 1000); },
        () => { const k = r.int(1, 8), g = r.int(100, 950); return t(`${k} kg ${g} g in g =`, k * 1000 + g); },
        () => { const x = r.int(2, 9); return t(`${x} t in kg =`, x * 1000); }
      ])();
    case 'geld':
      return r.pick<() => Item>([
        () => { const e = r.int(2, 29); return t(`${e} € in ct =`, e * 100); },
        () => { const e = r.int(1, 19), c = r.int(10, 95); return t(`${e} € ${c} ct in ct =`, e * 100 + c); }
      ])();
    case 'zeit':
      return r.pick<() => Item>([
        () => { const h = r.int(2, 9); return t(`${h} h in min =`, h * 60); },
        () => { const m = r.int(2, 9); return t(`${m} min in s =`, m * 60); },
        () => { const h = r.int(1, 5), m = r.int(5, 55); return t(`${h} h ${m} min in min =`, h * 60 + m); }
      ])();
    default:
      return r.pick<() => Item>([
        () => { const l = r.int(2, 12); return t(`${l} l in ml =`, l * 1000); },
        () => { const l = r.int(1, 6), m = r.int(100, 900); return t(`${l} l ${m} ml in ml =`, l * 1000 + m); }
      ])();
  }
}

const NAMES4 = ['Maya', 'Jonas', 'Lena', 'Tim', 'Mia', 'Ben', 'Nele', 'Paul'];

function sachK4(r: Rng, variant: number): Item {
  const name = r.pick(NAMES4);
  switch (variant % 8) {
    case 0: {
      const kids = r.int(48, 140), adults = r.int(35, 90), pk = r.pick([2, 3]), pa = r.pick([4, 5, 6]);
      return {
        kind: 'sach',
        story: `Beim Schulfest kostet der Eintritt für Kinder ${pk} € und für Erwachsene ${pa} €. Es kommen ${kids} Kinder und ${adults} Erwachsene.`,
        parts: [
          { question: 'Wie viel Euro zahlen alle Kinder zusammen?', answer: kids * pk, unit: '€' },
          { question: 'Wie viel Euro werden insgesamt eingenommen?', answer: kids * pk + adults * pa, unit: '€' }
        ]
      };
    }
    case 1: {
      const a = r.int(35, 70), b = r.int(40, 85), c = r.int(30, 60), goal = a + b + c + r.int(15, 60);
      return {
        kind: 'sach',
        story: `${name} fährt mit dem Fahrrad ${goal} km weit. Am 1. Tag fährt ${name} ${a} km, am 2. Tag ${b} km und am 3. Tag ${c} km.`,
        parts: [
          { question: 'Wie viele Kilometer sind es nach 3 Tagen?', answer: a + b + c, unit: 'km' },
          { question: 'Wie viele Kilometer fehlen noch bis zum Ziel?', answer: goal - (a + b + c), unit: 'km' }
        ]
      };
    }
    case 2: {
      const shelves = r.int(6, 12), books = r.int(85, 160), out = r.int(120, 380);
      return {
        kind: 'sach',
        story: `In der Bücherei stehen ${shelves} Regale mit je ${books} Büchern. ${out} Bücher sind gerade ausgeliehen.`,
        parts: [
          { question: 'Wie viele Bücher gibt es insgesamt?', answer: shelves * books, unit: 'Bücher' },
          { question: 'Wie viele Bücher stehen im Regal?', answer: shelves * books - out, unit: 'Bücher' }
        ]
      };
    }
    case 3: {
      const hn = r.int(3, 8), hp = r.pick([2, 3, 4]), sn = r.int(4, 9), sp = r.pick([1, 2, 5]), pay = 50;
      const cost = hn * hp + sn * sp;
      return {
        kind: 'sach',
        story: `${name} kauft ${hn} Hefte für je ${hp} € und ${sn} Stifte für je ${sp} €. ${name} bezahlt mit einem ${pay}-€-Schein.`,
        parts: [
          { question: 'Wie viel Euro kostet der Einkauf?', answer: cost, unit: '€' },
          { question: `Wie viel Euro bekommt ${name} zurück?`, answer: pay - cost, unit: '€' }
        ]
      };
    }
    case 4: {
      const week = r.int(4, 9), weeks = r.int(12, 30), price = week * weeks + r.int(25, 150);
      return {
        kind: 'sach',
        story: `${name} spart für ein Fahrrad. Es kostet ${price} €. ${name} legt jede Woche ${week} € zurück und spart ${weeks} Wochen lang.`,
        parts: [
          { question: 'Wie viel Euro sind es nach ' + weeks + ' Wochen?', answer: week * weeks, unit: '€' },
          { question: 'Wie viel Euro fehlen noch?', answer: price - week * weeks, unit: '€' }
        ]
      };
    }
    case 5: {
      const w1 = r.int(2, 5), p1 = r.int(70, 95), w2 = r.int(2, 4), p2 = r.int(96, 120);
      return {
        kind: 'sach',
        story: `Ein Zug hat ${w1} Wagen mit je ${p1} Sitzplätzen und ${w2} Wagen mit je ${p2} Sitzplätzen.`,
        parts: [{ question: 'Wie viele Sitzplätze hat der Zug insgesamt?', answer: w1 * p1 + w2 * p2, unit: 'Plätze' }]
      };
    }
    case 6: {
      const d = r.pick([6, 7, 8, 9]), q = r.int(40, 140), rem = r.int(1, d - 1);
      return {
        kind: 'sach',
        story: `Ein Obsthändler hat ${fmt(d * q + rem)} Äpfel. Er packt immer ${d} Äpfel in einen Beutel.`,
        parts: [
          { question: 'Wie viele Beutel werden ganz voll?', answer: q, unit: 'Beutel' },
          { question: 'Wie viele Äpfel bleiben übrig?', answer: rem, unit: 'Äpfel' }
        ]
      };
    }
    default: {
      const eimer = r.pick([8, 10, 12]), n = r.int(40, 150), total = eimer * n;
      return {
        kind: 'sach',
        story: `Ein Planschbecken fasst ${fmt(total)} Liter Wasser. Mit einem Eimer werden ${eimer} Liter geholt.`,
        parts: [
          { question: 'Wie oft muss der Eimer gefüllt werden?', answer: n, unit: 'Mal' },
          { question: `Nach ${Math.floor(n / 2)} Eimern: Wie viele Liter sind im Becken?`, answer: Math.floor(n / 2) * eimer, unit: 'Liter' }
        ]
      };
    }
  }
}

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
    case 'k4_plusminus':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne schriftlich: Plus.', 'cols2', uniq(6, () => k4Plus(r)), { hint: 'Schreibe die Zahlen untereinander (Stellenwerte!).' }),
          sec(2, 'Rechne schriftlich: Minus.', 'cols2', uniq(6, () => k4Minus(r))),
          sec(3, 'Rechne mit drei Zahlen.', 'cols2', uniq(4, () => k4Plus3(r)))
        ]
      };
    case 'k4_mal':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne schriftlich: Zahl · einstellig.', 'cols2', uniq(8, () => k4MulSmall(r))),
          sec(2, 'Rechne schriftlich: zweistellig · zweistellig.', 'cols2', uniq(6, () => k4MulTwo(r))),
          sec(3, 'Rechne schriftlich: dreistellig · zweistellig.', 'cols2', uniq(4, () => k4MulBig(r)))
        ]
      };
    case 'k4_geteilt':
      return {
        title: label,
        sections: [
          sec(1, 'Teile schriftlich (einstelliger Teiler).', 'cols2', uniq(8, () => k4DivSmall(r))),
          sec(2, 'Teile schriftlich (zweistelliger Teiler).', 'cols2', uniq(4, () => k4DivTwo(r))),
          sec(3, 'Teile mit Rest.', 'cols2', uniq(6, () => k4DivRest(r)), { hint: 'Rechne: Ergebnis R Rest.' })
        ]
      };
    case 'k4_kopf':
      return {
        title: label,
        sections: [
          sec(1, 'Mal 10, 100, 1000.', 'cols4', uniq(12, () => k4Mul10(r))),
          sec(2, 'Geteilt durch 10, 100, 1000.', 'cols4', uniq(12, () => k4Div10(r))),
          sec(3, 'Verdopple und halbiere.', 'cols4', [
            ...uniq(6, () => { const n = r.int(25, 490); return eqText(`${n} + ${n} =`, n * 2); }),
            ...uniq(6, () => { const n = r.int(25, 490); return eqText(`${fmt(n * 2)} : 2 =`, n); })
          ]),
          sec(4, 'Rechne mit ganzen Hundertern.', 'cols4', [
            ...uniq(4, () => { const a = r.int(2, 59) * 100, b = r.int(2, 39) * 100; return eqText(`${fmt(a)} + ${fmt(b)} =`, a + b); }),
            ...uniq(4, () => { const a = r.int(30, 99) * 100, b = r.int(2, 29) * 100; return eqText(`${fmt(a)} − ${fmt(b)} =`, a - b); })
          ])
        ]
      };
    case 'k4_runden':
      return {
        title: label,
        sections: [
          sec(1, 'Runde auf Zehner.', 'cols4', uniq(8, () => k4Round(r, 10, 11, 999))),
          sec(2, 'Runde auf Hunderter.', 'cols4', uniq(8, () => k4Round(r, 100, 101, 9999))),
          sec(3, 'Runde auf Tausender.', 'cols4', uniq(8, () => k4Round(r, 1000, 1001, 99999))),
          sec(4, 'Vorgänger und Nachfolger.', 'cols2', [
            ...uniq(4, () => { const n = r.int(2, 99) * 1000; return eqText(`Vorgänger von ${fmt(n)} =`, n - 1); }),
            ...uniq(4, () => { const n = r.int(2, 99) * 1000 - 1; return eqText(`Nachfolger von ${fmt(n)} =`, n + 1); })
          ])
        ]
      };
    case 'k4_punkt':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne. Klammern zuerst, Punkt vor Strich!', 'cols2', uniq(12, (i) => k4Punkt(r, i)), {
            hint: 'Erst die Klammer, dann Mal und Geteilt, zuletzt Plus und Minus.'
          }),
          sec(2, 'Rechne geschickt.', 'cols4', uniq(8, () => { const a = r.pick([25, 50, 125]), b = r.pick([2, 4, 8]); return eqText(`${a} · ${b} =`, a * b); }))
        ]
      };
    case 'k4_mauer':
      return {
        title: label,
        sections: [
          sec(1, 'Fülle die Zahlenmauern aus.', 'cols2', uniq(4, () => pyramidFill(r, 4, 20, 300))),
          sec(2, 'Welche Steine fehlen?', 'cols2', uniq(4, () => pyramidMissing(r, 4, 5, 20, 300)))
        ]
      };
    case 'k4_groessen':
      return {
        title: label,
        sections: [
          sec(1, 'Längen.', 'cols3', uniq(9, () => k4Groessen(r, 'laenge'))),
          sec(2, 'Gewichte.', 'cols3', uniq(6, () => k4Groessen(r, 'gewicht'))),
          sec(3, 'Geld und Zeit.', 'cols3', [...uniq(6, () => k4Groessen(r, 'geld')), ...uniq(6, () => k4Groessen(r, 'zeit'))]),
          sec(4, 'Hohlmaße.', 'cols3', uniq(3, () => k4Groessen(r, 'raum')))
        ]
      };
    case 'k4_sach':
      return {
        title: label,
        sections: [
          sec(1, 'Löse die Sachaufgaben. Schreibe Rechnung und Antwort auf.', 'cols1', (() => {
            const offset = r.int(0, 7);
            return build(4, (i) => sachK4(r, i + offset));
          })())
        ]
      };
    case 'k4_mix':
      return {
        title: label,
        sections: [
          sec(1, 'Rechne schriftlich.', 'cols2', [...uniq(2, () => k4Plus(r)), ...uniq(2, () => k4Minus(r))]),
          sec(2, 'Rechne schriftlich.', 'cols2', [...uniq(2, () => k4MulSmall(r)), ...uniq(2, () => k4MulTwo(r))]),
          sec(3, 'Teile.', 'cols2', [...uniq(2, () => k4DivSmall(r)), k4DivRest(r), k4DivRest(r)]),
          sec(4, 'Rechne im Kopf.', 'cols4', [...uniq(4, () => k4Mul10(r)), ...uniq(4, () => k4Div10(r))]),
          sec(5, 'Rechne. Klammern zuerst, Punkt vor Strich!', 'cols2', uniq(4, (i) => k4Punkt(r, i))),
          sec(6, 'Rechne um.', 'cols3', [
            ...uniq(2, () => k4Groessen(r, 'laenge')),
            ...uniq(2, () => k4Groessen(r, 'gewicht')),
            ...uniq(2, () => k4Groessen(r, 'geld'))
          ]),
          sec(7, 'Löse die Sachaufgaben. Schreibe Rechnung und Antwort auf.', 'cols1', (() => {
            const offset = r.int(0, 7);
            return build(2, (i) => sachK4(r, i + offset));
          })())
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
