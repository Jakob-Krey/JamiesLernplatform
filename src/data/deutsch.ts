export interface DeutschItem {
  word: string;
  emoji: string;
  sol: string;
  exp: string;
}

export const DEUTSCH_TOPICS = [
  { id: 'wortarten', label: '🏷️ Wortarten' },
  { id: 'doppelkonsonanten', label: '⚡ Doppelte Mitlaute' },
  { id: 'silben', label: '🎶 Silben trennen' }
] as const;

export type DeutschTopicId = typeof DEUTSCH_TOPICS[number]['id'];

export const DEUTSCH_DATA: Record<DeutschTopicId, DeutschItem[]> = {
  wortarten: [
    { word: 'Katze', emoji: '🐱', sol: 'Nomen (Namenwort)', exp: 'Großgeschrieben! Begleiter: "die Katze".' },
    { word: 'rennen', emoji: '🏃‍♀️', sol: 'Verb (Tunwort)', exp: 'Kleingeschrieben! Es beschreibt, was Jamie tut.' },
    { word: 'bunt', emoji: '🎨', sol: 'Adjektiv (Wie-Wort)', exp: 'Kleingeschrieben! Wie ist das Bild? Es ist bunt!' },
    { word: 'Schule', emoji: '🏫', sol: 'Nomen (Namenwort)', exp: 'Ein Ort / Ding. Immer mit großem Anfangsbuchstaben!' },
    { word: 'lachen', emoji: '😄', sol: 'Verb (Tunwort)', exp: 'Jamie lacht. Etwas, das man tun kann!' },
    { word: 'klug', emoji: '💡', sol: 'Adjektiv (Wie-Wort)', exp: 'Wie ist Jamie? Super klug!' }
  ],
  doppelkonsonanten: [
    { word: 'So...e (Sonne)', emoji: '☀️', sol: 'Sonne (mit doppeltem nn)', exp: 'Weil das "o" kurz gesprochen wird, kommt danach ein Doppel-n!' },
    { word: 'Wa...er (Wasser)', emoji: '💧', sol: 'Wasser (mit doppeltem ss)', exp: 'Kurzer Selbstlaut "a" -> doppeltes "ss"!' },
    { word: 'Ba... (Ball)', emoji: '⚽', sol: 'Ball (mit doppeltem ll)', exp: 'Kurzes "a" -> doppelter Mitlaut "ll".' },
    { word: 'Re...en (Rennen)', emoji: '🏎️', sol: 'Rennen (mit doppeltem nn)', exp: 'Kurzes "e" -> Doppel-n!' }
  ],
  silben: [
    { word: 'Schmetterling', emoji: '🦋', sol: 'Schmet - ter - ling (3 Silben)', exp: 'Klatsche mit in die Hände: Schmet • ter • ling!' },
    { word: 'Krokodil', emoji: '🐊', sol: 'Kro - ko - dil (3 Silben)', exp: 'Drei Silbenschwünge: Kro • ko • dil!' },
    { word: 'Schule', emoji: '🎒', sol: 'Schu - le (2 Silben)', exp: 'Zwei Silben: Schu • le!' }
  ]
};
