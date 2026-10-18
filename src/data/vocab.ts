export interface VocabItem {
  en: string;
  de: string;
  emoji: string;
}

export const VOCAB_CATEGORIES = [
  { id: 'tiere', label: '🐾 Tiere (Animals)' },
  { id: 'farben', label: '🎨 Farben (Colors)' },
  { id: 'schule', label: '🎒 Schule (School)' },
  { id: 'essen', label: '🍎 Essen (Food)' },
  { id: 'familie', label: '👨‍👩‍👧 Familie (Family)' },
  { id: 'koerper', label: '🧍 Körper (Body)' },
  { id: 'zahlen', label: '🔢 Zahlen (Numbers)' }
] as const;

export type VocabCategoryId = typeof VOCAB_CATEGORIES[number]['id'];

export const VOCAB_DATA: Record<VocabCategoryId, VocabItem[]> = {
  tiere: [
    { en: 'Dog', de: 'Der Hund', emoji: '🐶' },
    { en: 'Cat', de: 'Die Katze', emoji: '🐱' },
    { en: 'Rabbit', de: 'Das Kaninchen / Der Hase', emoji: '🐰' },
    { en: 'Horse', de: 'Das Pferd', emoji: '🐴' },
    { en: 'Lion', de: 'Der Löwe', emoji: '🦁' },
    { en: 'Butterfly', de: 'Der Schmetterling', emoji: '🦋' },
    { en: 'Bird', de: 'Der Vogel', emoji: '🐦' },
    { en: 'Fish', de: 'Der Fisch', emoji: '🐟' },
    { en: 'Mouse', de: 'Die Maus', emoji: '🐭' },
    { en: 'Cow', de: 'Die Kuh', emoji: '🐮' },
    { en: 'Pig', de: 'Das Schwein', emoji: '🐷' },
    { en: 'Elephant', de: 'Der Elefant', emoji: '🐘' },
    { en: 'Monkey', de: 'Der Affe', emoji: '🐵' },
    { en: 'Duck', de: 'Die Ente', emoji: '🦆' }
  ],
  farben: [
    { en: 'Blue', de: 'Blau', emoji: '💙' },
    { en: 'Red', de: 'Rot', emoji: '❤️' },
    { en: 'Yellow', de: 'Gelb', emoji: '💛' },
    { en: 'Green', de: 'Grün', emoji: '💚' },
    { en: 'Purple', de: 'Lila / Violett', emoji: '💜' },
    { en: 'Pink', de: 'Rosa', emoji: '🩷' },
    { en: 'Orange', de: 'Orange', emoji: '🧡' },
    { en: 'Black', de: 'Schwarz', emoji: '🖤' },
    { en: 'White', de: 'Weiß', emoji: '🤍' },
    { en: 'Brown', de: 'Braun', emoji: '🤎' },
    { en: 'Grey', de: 'Grau', emoji: '🩶' }
  ],
  schule: [
    { en: 'Schoolbag', de: 'Der Schulranzen', emoji: '🎒' },
    { en: 'Pencil', de: 'Der Bleistift', emoji: '✏️' },
    { en: 'Book', de: 'Das Buch', emoji: '📖' },
    { en: 'Ruler', de: 'Das Lineal', emoji: '📐' },
    { en: 'Scissors', de: 'Die Schere', emoji: '✂️' },
    { en: 'Teacher', de: 'Die Lehrerin / Der Lehrer', emoji: '👩‍🏫' },
    { en: 'Pen', de: 'Der Stift', emoji: '🖊️' },
    { en: 'Chair', de: 'Der Stuhl', emoji: '🪑' },
    { en: 'School', de: 'Die Schule', emoji: '🏫' },
    { en: 'Notebook', de: 'Das Heft', emoji: '📓' },
    { en: 'Computer', de: 'Der Computer', emoji: '💻' }
  ],
  essen: [
    { en: 'Apple', de: 'Der Apfel', emoji: '🍎' },
    { en: 'Banana', de: 'Die Banane', emoji: '🍌' },
    { en: 'Sandwich', de: 'Das Pausenbrot', emoji: '🥪' },
    { en: 'Water', de: 'Das Wasser', emoji: '💧' },
    { en: 'Cookie', de: 'Der Keks', emoji: '🍪' },
    { en: 'Bread', de: 'Das Brot', emoji: '🍞' },
    { en: 'Milk', de: 'Die Milch', emoji: '🥛' },
    { en: 'Cheese', de: 'Der Käse', emoji: '🧀' },
    { en: 'Egg', de: 'Das Ei', emoji: '🥚' },
    { en: 'Pizza', de: 'Die Pizza', emoji: '🍕' },
    { en: 'Ice cream', de: 'Das Eis', emoji: '🍦' },
    { en: 'Strawberry', de: 'Die Erdbeere', emoji: '🍓' },
    { en: 'Juice', de: 'Der Saft', emoji: '🧃' }
  ],
  familie: [
    { en: 'Mother', de: 'Die Mutter', emoji: '👩' },
    { en: 'Father', de: 'Der Vater', emoji: '👨' },
    { en: 'Sister', de: 'Die Schwester', emoji: '👧' },
    { en: 'Brother', de: 'Der Bruder', emoji: '👦' },
    { en: 'Grandma', de: 'Die Oma', emoji: '👵' },
    { en: 'Grandpa', de: 'Der Opa', emoji: '👴' },
    { en: 'Baby', de: 'Das Baby', emoji: '👶' },
    { en: 'Friend', de: 'Der Freund / Die Freundin', emoji: '🧑‍🤝‍🧑' }
  ],
  koerper: [
    { en: 'Head', de: 'Der Kopf', emoji: '🙂' },
    { en: 'Hand', de: 'Die Hand', emoji: '✋' },
    { en: 'Foot', de: 'Der Fuß', emoji: '🦶' },
    { en: 'Eye', de: 'Das Auge', emoji: '👁️' },
    { en: 'Ear', de: 'Das Ohr', emoji: '👂' },
    { en: 'Nose', de: 'Die Nase', emoji: '👃' },
    { en: 'Mouth', de: 'Der Mund', emoji: '👄' },
    { en: 'Leg', de: 'Das Bein', emoji: '🦵' }
  ],
  zahlen: [
    { en: 'One', de: 'Eins', emoji: '1️⃣' },
    { en: 'Two', de: 'Zwei', emoji: '2️⃣' },
    { en: 'Three', de: 'Drei', emoji: '3️⃣' },
    { en: 'Four', de: 'Vier', emoji: '4️⃣' },
    { en: 'Five', de: 'Fünf', emoji: '5️⃣' },
    { en: 'Six', de: 'Sechs', emoji: '6️⃣' },
    { en: 'Seven', de: 'Sieben', emoji: '7️⃣' },
    { en: 'Eight', de: 'Acht', emoji: '8️⃣' },
    { en: 'Nine', de: 'Neun', emoji: '9️⃣' },
    { en: 'Ten', de: 'Zehn', emoji: '🔟' }
  ]
};
