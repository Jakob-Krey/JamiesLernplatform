export interface VocabItem {
  en: string;
  de: string;
  emoji: string;
}

export const VOCAB_CATEGORIES = [
  { id: 'tiere', label: '🐾 Tiere (Animals)' },
  { id: 'farben', label: '🎨 Farben (Colors)' },
  { id: 'schule', label: '🎒 Schule (School)' },
  { id: 'essen', label: '🍎 Essen (Food)' }
] as const;

export type VocabCategoryId = typeof VOCAB_CATEGORIES[number]['id'];

export const VOCAB_DATA: Record<VocabCategoryId, VocabItem[]> = {
  tiere: [
    { en: 'Dog', de: 'Der Hund', emoji: '🐶' },
    { en: 'Cat', de: 'Die Katze', emoji: '🐱' },
    { en: 'Rabbit', de: 'Das Kaninchen / Der Hase', emoji: '🐰' },
    { en: 'Horse', de: 'Das Pferd', emoji: '🐴' },
    { en: 'Lion', de: 'Der Löwe', emoji: '🦁' },
    { en: 'Butterfly', de: 'Der Schmetterling', emoji: '🦋' }
  ],
  farben: [
    { en: 'Blue', de: 'Blau', emoji: '💙' },
    { en: 'Red', de: 'Rot', emoji: '❤️' },
    { en: 'Yellow', de: 'Gelb', emoji: '💛' },
    { en: 'Green', de: 'Grün', emoji: '💚' },
    { en: 'Purple', de: 'Lila / Violett', emoji: '💜' },
    { en: 'Pink', de: 'Rosa', emoji: '🩷' }
  ],
  schule: [
    { en: 'Schoolbag', de: 'Der Schulranzen', emoji: '🎒' },
    { en: 'Pencil', de: 'Der Bleistift', emoji: '✏️' },
    { en: 'Book', de: 'Das Buch', emoji: '📖' },
    { en: 'Ruler', de: 'Das Lineal', emoji: '📐' },
    { en: 'Scissors', de: 'Die Schere', emoji: '✂️' },
    { en: 'Teacher', de: 'Die Lehrerin / Der Lehrer', emoji: '👩‍🏫' }
  ],
  essen: [
    { en: 'Apple', de: 'Der Apfel', emoji: '🍎' },
    { en: 'Banana', de: 'Die Banane', emoji: '🍌' },
    { en: 'Sandwich', de: 'Das Pausenbrot', emoji: '🥪' },
    { en: 'Water', de: 'Das Wasser', emoji: '💧' },
    { en: 'Cookie', de: 'Der Keks', emoji: '🍪' }
  ]
};
