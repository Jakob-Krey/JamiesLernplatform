/* ==========================================================================
   DEUTSCH: SATZGLIEDER & WORTARTEN
   Lernkarten (Begriffe) und Beispielsätze zum Anklicken.
   ========================================================================== */

/** S = Subjekt, P = Prädikat, A = Akkusativobjekt (Wen oder was?), D = Dativobjekt (Wem?) */
export type Role = 'S' | 'P' | 'A' | 'D';

export const ROLE_INFO: Record<Role, { name: string; short: string; question: string; hint: string }> = {
  S: {
    name: 'Subjekt',
    short: 'Subjekt',
    question: 'Wer oder was …?',
    hint: 'Frag: „Wer oder was …?“ und setz das Verb ein.'
  },
  P: {
    name: 'Prädikat',
    short: 'Prädikat',
    question: 'Was tut …? / Was passiert?',
    hint: 'Das Prädikat ist immer ein Verb (Tunwort). Im Aussagesatz steht es an 2. Stelle.'
  },
  A: {
    name: 'Akkusativobjekt',
    short: 'Wen oder was?',
    question: 'Wen oder was …?',
    hint: 'Frag: „Wen oder was …?“ – zum Beispiel: „Wen oder was isst Jamie?“'
  },
  D: {
    name: 'Dativobjekt',
    short: 'Wem?',
    question: 'Wem …?',
    hint: 'Frag: „Wem …?“ – zum Beispiel: „Wem schenkt Oma etwas?“'
  }
};

/* --------------------------------------------------------------------------
   LERNKARTEN
   In `example` wird der Teil in [eckigen Klammern] farbig markiert.
   -------------------------------------------------------------------------- */

export interface GrammarCard {
  topic: 'satzglieder' | 'wortarten';
  emoji: string;
  term: string;
  alias?: string;
  question?: string;
  text: string;
  example: string;
  /** Farbe der Markierung im Beispiel */
  role?: Role;
}

export const CARD_TOPICS = [
  { id: 'satzglieder', label: '🧩 Satzglieder' },
  { id: 'wortarten', label: '🏷️ Wortarten' },
  { id: 'alle', label: '🌈 Alle' }
] as const;

export type CardTopicId = (typeof CARD_TOPICS)[number]['id'];

export const GRAMMAR_CARDS: GrammarCard[] = [
  // ---------- Satzglieder ----------
  {
    topic: 'satzglieder',
    emoji: '🧩',
    term: 'Satzglied',
    text: 'Ein oder mehrere Wörter, die beim Umstellen immer zusammenbleiben.',
    example: '[Der kleine Hund] | bellt | laut.'
  },
  {
    topic: 'satzglieder',
    emoji: '🔄',
    term: 'Umstellprobe',
    text: 'Du stellst die Satzglieder um. Der Satz ergibt trotzdem Sinn. So findest du heraus, welche Wörter zusammengehören.',
    example: 'Jamie spielt im Garten. → [Im Garten] spielt Jamie.'
  },
  {
    topic: 'satzglieder',
    emoji: '🙋',
    term: 'Subjekt',
    alias: 'Satzgegenstand',
    question: 'Wer oder was …?',
    text: 'Sagt, wer oder was etwas tut.',
    example: '[Der Hund] bellt. → Wer oder was bellt? Der Hund.',
    role: 'S'
  },
  {
    topic: 'satzglieder',
    emoji: '⚡',
    term: 'Prädikat',
    alias: 'Satzaussage',
    question: 'Was tut …? Was passiert?',
    text: 'Sagt, was jemand tut oder was passiert. Es ist immer ein Verb und steht im Aussagesatz an 2. Stelle.',
    example: 'Der Hund [bellt]. → Was tut der Hund? Er bellt.',
    role: 'P'
  },
  {
    topic: 'satzglieder',
    emoji: '🎯',
    term: 'Akkusativobjekt',
    alias: 'Wen-oder-was-Ergänzung',
    question: 'Wen oder was …?',
    text: 'Ergänzt den Satz. Du findest es mit der Frage „Wen oder was?“.',
    example: 'Jamie liest [ein Buch]. → Wen oder was liest Jamie?',
    role: 'A'
  },
  {
    topic: 'satzglieder',
    emoji: '🎁',
    term: 'Dativobjekt',
    alias: 'Wem-Ergänzung',
    question: 'Wem …?',
    text: 'Ergänzt den Satz. Du findest es mit der Frage „Wem?“.',
    example: 'Oma schenkt [ihrer Enkelin] einen Schal. → Wem schenkt Oma einen Schal?',
    role: 'D'
  },
  {
    topic: 'satzglieder',
    emoji: '⏰',
    term: 'Zeitangabe',
    question: 'Wann? Wie lange?',
    text: 'Sagt, wann oder wie lange etwas passiert.',
    example: '[Am Morgen] putzt Jamie die Zähne.'
  },
  {
    topic: 'satzglieder',
    emoji: '📍',
    term: 'Ortsangabe',
    question: 'Wo? Wohin? Woher?',
    text: 'Sagt, wo etwas passiert.',
    example: 'Die Katze schläft [auf dem Sofa].'
  },
  {
    topic: 'satzglieder',
    emoji: '🤔',
    term: 'Wortart oder Satzglied?',
    text: 'Die Wortart sagt, was für ein Wort es ist (Nomen, Verb …). Das Satzglied sagt, welche Aufgabe es im Satz hat (Subjekt, Prädikat …).',
    example: '„Hund“ ist ein Nomen. In „[Der Hund] bellt.“ ist „der Hund“ das Subjekt.'
  },

  // ---------- Wortarten ----------
  {
    topic: 'wortarten',
    emoji: '🐕',
    term: 'Nomen',
    alias: 'Namenwort',
    text: 'Menschen, Tiere, Pflanzen, Dinge und Gefühle. Nomen schreibt man immer groß. Sie haben einen Begleiter (der, die, das).',
    example: 'der [Hund], die [Blume], die [Freude]'
  },
  {
    topic: 'wortarten',
    emoji: '🏃',
    term: 'Verb',
    alias: 'Tunwort',
    text: 'Sagt, was jemand tut oder was passiert. Verben schreibt man klein.',
    example: 'Jamie [rennt]. Die Sonne [scheint].'
  },
  {
    topic: 'wortarten',
    emoji: '🎨',
    term: 'Adjektiv',
    alias: 'Wiewort',
    question: 'Wie ist etwas?',
    text: 'Sagt, wie jemand oder etwas ist. Adjektive schreibt man klein.',
    example: 'der [bunte] Ball, die Suppe ist [heiß]'
  },
  {
    topic: 'wortarten',
    emoji: '👉',
    term: 'Artikel',
    alias: 'Begleiter',
    text: 'Steht vor dem Nomen. Bestimmte Artikel: der, die, das. Unbestimmte Artikel: ein, eine.',
    example: '[der] Hund, [eine] Katze'
  },
  {
    topic: 'wortarten',
    emoji: '🔁',
    term: 'Pronomen',
    alias: 'Fürwort',
    text: 'Steht für ein Nomen, damit man es nicht immer wiederholen muss: ich, du, er, sie, es, wir, ihr, sie.',
    example: 'Der Hund bellt. [Er] hat Hunger.'
  }
];

/* --------------------------------------------------------------------------
   BEISPIELSÄTZE ZUM ANKLICKEN
   Schreibweise: {S Der kleine Hund} {P bellt} {_ laut}.
   S/P/A/D = Satzglied mit Rolle, _ = anderes Satzglied (z. B. Ort/Zeit).
   Das Prädikat ist immer genau ein Wort (Präsens), damit die Fragen passen.
   -------------------------------------------------------------------------- */

export const SENTENCES: string[] = [
  '{S Der kleine Hund} {P bellt} {_ laut}.',
  '{S Jamie} {P spielt} {_ im Garten}.',
  '{S Die Sonne} {P scheint} {_ hell}.',
  '{_ Heute} {P backt} {S Oma} {A einen Kuchen}.',
  '{S Mein Bruder} {P isst} {A einen Apfel}.',
  '{S Die Katze} {P schläft} {_ auf dem Sofa}.',
  '{_ Im Winter} {P fällt} {S der Schnee}.',
  '{S Die Kinder} {P singen} {A ein Lied}.',
  '{S Papa} {P kocht} {A Nudeln}.',
  '{S Der Vogel} {P baut} {A ein Nest}.',
  '{S Lena} {P schenkt} {D ihrer Freundin} {A ein Bild}.',
  '{S Das Pferd} {P frisst} {A Heu}.',
  '{S Der Lehrer} {P erklärt} {D den Kindern} {A die Aufgabe}.',
  '{S Der Bäcker} {P verkauft} {A frische Brötchen}.',
  '{S Opa} {P erzählt} {D den Enkeln} {A eine Geschichte}.',
  '{_ Am Nachmittag} {P malt} {S Jamie} {A ein Bild}.',
  '{S Die Ente} {P schwimmt} {_ auf dem See}.',
  '{S Der Wind} {P weht} {_ stark}.',
  '{S Mama} {P hilft} {D dem Nachbarn}.',
  '{S Das Baby} {P lacht}.',
  '{S Die Klasse} {P besucht} {A den Zoo}.',
  '{S Der Hase} {P hoppelt} {_ über die Wiese}.',
  '{S Tim} {P gibt} {D dem Hund} {A einen Knochen}.',
  '{_ Jeden Morgen} {P putzt} {S Jamie} {A die Zähne}.',
  '{S Die Feuerwehr} {P löscht} {A das Feuer}.',
  '{S Die Blumen} {P blühen} {_ im Frühling}.',
  '{S Der Frosch} {P springt} {_ in den Teich}.',
  '{S Die Lehrerin} {P zeigt} {D der Klasse} {A einen Film}.',
  '{_ Am Wochenende} {P besucht} {S die Familie} {A die Oma}.',
  '{S Das Eichhörnchen} {P sammelt} {A Nüsse}.',
  '{S Die Kinder} {P bauen} {A einen Schneemann}.',
  '{S Oma} {P strickt} {D ihrer Enkelin} {A einen Schal}.',
  '{_ Nach der Schule} {P macht} {S Jamie} {A die Hausaufgaben}.',
  '{S Der Postbote} {P bringt} {D uns} {A ein Paket}.',
  '{_ Heimlich} {P frisst} {S die Maus} {A den Käse}.'
];

export interface SentencePart {
  text: string;
  /** Rolle des Satzglieds, null = anderes Satzglied, undefined = Satzzeichen */
  role?: Role | null;
}

/** Zerlegt einen markierten Satz in Satzglieder und Satzzeichen. */
export function parseSentence(src: string): SentencePart[] {
  const parts: SentencePart[] = [];
  const re = /\{([SPAD_])\s([^}]+)\}|([.!?,])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[3]) parts.push({ text: m[3] });
    else parts.push({ text: m[2], role: m[1] === '_' ? null : (m[1] as Role) });
  }
  return parts;
}

const LOWER_AT_START = new Set([
  'der', 'die', 'das', 'ein', 'eine', 'mein', 'meine', 'dein', 'deine',
  'sein', 'seine', 'ihr', 'ihre', 'unser', 'unsere', 'er', 'sie', 'es', 'wir'
]);

/** Satzglied mitten im Satz: „Der Hund“ → „der Hund“, „Jamie“ bleibt. */
function inside(text: string): string {
  const first = text.split(' ')[0].toLowerCase();
  return LOWER_AT_START.has(first) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

/** Baut die passende Frage, z. B. „Wer oder was bellt?“ → „Der kleine Hund“. */
export function explain(parts: SentencePart[], role: Role): { question: string; answer: string } {
  const get = (r: Role) => parts.find(p => p.role === r)?.text;
  const s = get('S') ?? '';
  const p = get('P') ?? '';
  const a = get('A');
  const plural = /en$/.test(p);
  const answer = get(role) ?? '';
  switch (role) {
    case 'S':
      return { question: `Wer oder was ${p}?`, answer };
    case 'P':
      return { question: `Was ${plural ? 'tun' : 'tut'} ${inside(s)}?`, answer };
    case 'A':
      return { question: `Wen oder was ${p} ${inside(s)}?`, answer };
    case 'D':
      return { question: `Wem ${p} ${inside(s)}${a ? ' ' + inside(a) : ''}?`, answer };
  }
}
