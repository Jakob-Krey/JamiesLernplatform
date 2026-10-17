export interface LessonTime {
  num?: number;
  start: string;
  end: string;
  isBreak?: boolean;
  title?: string;
}

export interface SubjectDetail {
  icon: string;
  class: string;
  description: string;
  pack: string[];
}

export interface ScheduledLesson {
  num: number;
  subject: string;
  Klassenrat?: boolean;
}

export interface DaySchedule {
  name: string;
  short: string;
  dayIndex: number;
  motto: string;
  lessons: ScheduledLesson[];
}

export const LESSON_TIMES: LessonTime[] = [
  { num: 1, start: '08:10', end: '08:55' },
  { num: 2, start: '09:00', end: '09:45' },
  { isBreak: true, title: 'Große Hofpause 🍎 & frische Luft', start: '09:45', end: '10:05' },
  { num: 3, start: '10:05', end: '10:50' },
  { num: 4, start: '10:55', end: '11:40' },
  { isBreak: true, title: 'Kleine Pause 🥪 & Durchatmen', start: '11:40', end: '11:55' },
  { num: 5, start: '11:55', end: '12:40' },
  { num: 6, start: '12:45', end: '13:30' }
];

export const SUBJECT_DETAILS: Record<string, SubjectDetail> = {
  'Mathe': {
    icon: '🔢',
    class: 'lesson-mathe',
    description: 'Rechnen, Zahlen & Knobelaufgaben',
    pack: ['Mathe-Buch 📘', 'Mathe-Heft 📐', 'Lineal & Bleistift ✏️']
  },
  'Deutsch': {
    icon: '📖',
    class: 'lesson-deutsch',
    description: 'Lesen, Schreiben & Rechtschreibung',
    pack: ['Deutsch-Buch 📕', 'Schreibheft 📝', 'Füller & Tintenpatrone 🖋️']
  },
  'Englisch': {
    icon: '🇬🇧',
    class: 'lesson-englisch',
    description: 'Colors, Animals & Fun Words',
    pack: ['Englisch-Workbook 🇬🇧', 'Vokabelheft 🗂️']
  },
  'Sachunterricht': {
    icon: '🌍',
    class: 'lesson-sachunterricht',
    description: 'Natur, Umwelt & Experimente',
    pack: ['Sachunterrichts-Mappe 🌿', 'Forscher-Heft 🔍']
  },
  'Kunst': {
    icon: '🎨',
    class: 'lesson-kunst',
    description: 'Malen, Basteln & Kreatives Gestalten',
    pack: ['Malkittel 🥼', 'Wasserfarbkasten & Pinsel 🎨', 'Zeichenblock 📄']
  },
  'Sport': {
    icon: '🏃‍♀️',
    class: 'lesson-sport',
    description: 'Turnen, Spiele & Auspowern',
    pack: ['Turnbeutel mit Sportsachen 👟', 'Hallenschuhe 🎽', 'Extra Trinkflasche 💧']
  },
  'Bewegungsstunde': {
    icon: '🤸',
    class: 'lesson-bewegungsstunde',
    description: 'Bewegungsspiele & Koordination',
    pack: ['Bequeme Kleidung / Schläppchen 🧦']
  },
  'Religion': {
    icon: '🕊️',
    class: 'lesson-religion',
    description: 'Geschichten, Werte & Gemeinschaft',
    pack: ['Religions-Heft 🕊️']
  },
  'Musik': {
    icon: '🎵',
    class: 'lesson-musik',
    description: 'Singen, Rhythmen & Musikinstrumente',
    pack: ['Musikmappe & Liederheft 🎶']
  },
  'Erzählkreis': {
    icon: '💬',
    class: 'lesson-erzaehlkreis',
    description: 'Morgenkreis, Wochenstart & Plaudern',
    pack: ['Wochenziel-Zettel 💭']
  },
  'Klassenrat': {
    icon: '🤝',
    class: 'lesson-klassenrat',
    description: 'Gemeinsam planen & Ideen teilen',
    pack: ['Ideen für die Klasse 💡']
  },
  'Förderunterricht': {
    icon: '⭐',
    class: 'lesson-foerderunterricht',
    description: 'Stärken trainieren & vertiefen',
    pack: ['Förderheft / Übungsblätter ⭐']
  }
};

export const SCHEDULE_DATA: Record<string, DaySchedule> = {
  montag: {
    name: 'Montag',
    short: 'Mo',
    dayIndex: 1,
    motto: 'Frischer Start in die neue Schulwoche! 🚀',
    lessons: [
      { num: 1, subject: 'Erzählkreis' },
      { num: 2, subject: 'Mathe' },
      { num: 3, subject: 'Englisch' },
      { num: 4, subject: 'Kunst' },
      { num: 5, subject: 'Kunst' }
    ]
  },
  dienstag: {
    name: 'Dienstag',
    short: 'Di',
    dayIndex: 2,
    motto: 'Volle Energie und spannende Entdeckungen! 🌍',
    lessons: [
      { num: 1, subject: 'Sachunterricht' },
      { num: 2, subject: 'Mathe' },
      { num: 3, subject: 'Deutsch' },
      { num: 4, Klassenrat: true, subject: 'Klassenrat' },
      { num: 5, subject: 'Religion' },
      { num: 6, subject: 'Musik' }
    ]
  },
  mittwoch: {
    name: 'Mittwoch',
    short: 'Mi',
    dayIndex: 3,
    motto: 'Bergfest! Schon die halbe Woche geschafft! 🏔️',
    lessons: [
      { num: 1, subject: 'Deutsch' },
      { num: 2, subject: 'Mathe' },
      { num: 3, subject: 'Förderunterricht' },
      { num: 4, subject: 'Sachunterricht' },
      { num: 5, subject: 'Englisch' }
    ]
  },
  donnerstag: {
    name: 'Donnerstag',
    short: 'Do',
    dayIndex: 4,
    motto: 'Schnell im Kopf und flink in Bewegung! 🤸',
    lessons: [
      { num: 1, subject: 'Mathe' },
      { num: 2, subject: 'Deutsch' },
      { num: 3, subject: 'Religion' },
      { num: 4, subject: 'Englisch' },
      { num: 5, subject: 'Bewegungsstunde' },
      { num: 6, subject: 'Deutsch' }
    ]
  },
  freitag: {
    name: 'Freitag',
    short: 'Fr',
    dayIndex: 5,
    motto: 'Fast Wochenende – nochmal richtig Gas geben! 🏃‍♀️',
    lessons: [
      { num: 1, subject: 'Deutsch' },
      { num: 2, subject: 'Mathe' },
      { num: 3, subject: 'Sport' },
      { num: 4, subject: 'Sport' }
    ]
  }
};

export const BASE_RANZEN_ITEMS = [
  'Federtasche (Füller, Buntstifte, Lineal) ✏️',
  'Postmappe & Hausaufgabenheft 📝',
  'Leckere Brotdose 🥪',
  'Frische Trinkflasche 💧'
];
