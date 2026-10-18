export interface PokemonCardData {
  id: string;
  name: string;
  type: string;
  typeClass: string;
  icon: string;
  dex: number; // Pokédex-Nummer für das Bild
  hp: string;
  rarity: string;
  cost: number;
  attackName: string;
  attackDmg: string;
  attackDesc: string;
}

export const POKEMON_DATA: PokemonCardData[] = [
  {
    id: 'pikachu',
    name: 'Pikachu',
    type: 'electric',
    typeClass: 'type-electric',
    icon: '⚡',
    dex: 25,
    hp: '70 KP',
    rarity: '★ HOLO RARE',
    cost: 0,
    attackName: 'Donnerschock',
    attackDmg: '40',
    attackDesc: 'Pikachu entlädt blitzschnell Elektrizität aus seinen roten Backen.'
  },
  {
    id: 'evoli',
    name: 'Evoli',
    type: 'normal',
    typeClass: 'type-normal',
    icon: '🦊',
    dex: 133,
    hp: '60 KP',
    rarity: '★ PROMO',
    cost: 0,
    attackName: 'Sternschauer',
    attackDmg: '30',
    attackDesc: 'Verschießt funkelnde Sterne auf den Gegner.'
  },
  {
    id: 'glumanda',
    name: 'Glumanda',
    type: 'fire',
    typeClass: 'type-fire',
    icon: '🔥',
    dex: 4,
    hp: '70 KP',
    rarity: '★★ ULTRA RARE',
    cost: 20,
    attackName: 'Flammenwurf',
    attackDmg: '50',
    attackDesc: 'Die Flamme an seinem Schweif brennt bei Begeisterung hell auf!'
  },
  {
    id: 'schiggy',
    name: 'Schiggy',
    type: 'water',
    typeClass: 'type-water',
    icon: '🐢',
    dex: 7,
    hp: '60 KP',
    rarity: '★★ ULTRA RARE',
    cost: 25,
    attackName: 'Aquaknarre',
    attackDmg: '45',
    attackDesc: 'Spritzt mit hohem Druck einen gezielten Wasserstrahl.'
  },
  {
    id: 'bisasam',
    name: 'Bisasam',
    type: 'grass',
    typeClass: 'type-grass',
    icon: '🍃',
    dex: 1,
    hp: '70 KP',
    rarity: '★★ ULTRA RARE',
    cost: 30,
    attackName: 'Rankenhieb',
    attackDmg: '50',
    attackDesc: 'Trägt eine Knospe auf dem Rücken, die mit jedem Lerntag wächst.'
  },
  {
    id: 'mewtu',
    name: 'Mewtu',
    type: 'psychic',
    typeClass: 'type-psychic',
    icon: '🔮',
    dex: 150,
    hp: '130 KP',
    rarity: '★★★ SECRET RARE',
    cost: 45,
    attackName: 'Psystoß',
    attackDmg: '90',
    attackDesc: 'Das legendäre Psycho-Pokémon. Extrem schlau und mächtig!'
  },
  {
    id: 'pichu',
    name: 'Pichu',
    type: 'electric',
    typeClass: 'type-electric',
    icon: '⚡',
    dex: 172,
    hp: '40 KP',
    rarity: '★ COMMON',
    cost: 10,
    attackName: 'Funkenspiel',
    attackDmg: '20',
    attackDesc: 'Kleine Funken sprühen aus den Backen. Noch etwas schüchtern!'
  },
  {
    id: 'karpador',
    name: 'Karpador',
    type: 'water',
    typeClass: 'type-water',
    icon: '🐟',
    dex: 129,
    hp: '30 KP',
    rarity: '★ COMMON',
    cost: 10,
    attackName: 'Platscher',
    attackDmg: '10',
    attackDesc: 'Zappelt wild herum. Aber Achtung: daraus wird einmal etwas ganz Großes!'
  },
  {
    id: 'pummeluff',
    name: 'Pummeluff',
    type: 'normal',
    typeClass: 'type-normal',
    icon: '🎈',
    dex: 39,
    hp: '60 KP',
    rarity: '★ COMMON',
    cost: 15,
    attackName: 'Wiegenlied',
    attackDmg: '30',
    attackDesc: 'Singt so schön, dass alle ganz müde werden.'
  },
  {
    id: 'togepi',
    name: 'Togepi',
    type: 'normal',
    typeClass: 'type-normal',
    icon: '🥚',
    dex: 175,
    hp: '50 KP',
    rarity: '★★ RARE',
    cost: 15,
    attackName: 'Glücksbote',
    attackDmg: '30',
    attackDesc: 'Bringt allen Glück, die gut zu ihm sind.'
  },
  {
    id: 'enton',
    name: 'Enton',
    type: 'water',
    typeClass: 'type-water',
    icon: '🦆',
    dex: 54,
    hp: '60 KP',
    rarity: '★ COMMON',
    cost: 15,
    attackName: 'Kopfschmerzen',
    attackDmg: '30',
    attackDesc: 'Hat oft Kopfweh und merkt nicht, wie stark es ist.'
  },
  {
    id: 'bisaknosp',
    name: 'Bisaknosp',
    type: 'grass',
    typeClass: 'type-grass',
    icon: '🌱',
    dex: 2,
    hp: '80 KP',
    rarity: '★★ RARE',
    cost: 25,
    attackName: 'Rasierblatt',
    attackDmg: '60',
    attackDesc: 'Die Knospe auf dem Rücken ist schon richtig groß geworden.'
  },
  {
    id: 'glutexo',
    name: 'Glutexo',
    type: 'fire',
    typeClass: 'type-fire',
    icon: '🔥',
    dex: 5,
    hp: '80 KP',
    rarity: '★★ RARE',
    cost: 25,
    attackName: 'Feuerzahn',
    attackDmg: '60',
    attackDesc: 'Seine Flamme wird immer heißer, wenn es kämpft.'
  },
  {
    id: 'schillok',
    name: 'Schillok',
    type: 'water',
    typeClass: 'type-water',
    icon: '🐢',
    dex: 8,
    hp: '80 KP',
    rarity: '★★ RARE',
    cost: 25,
    attackName: 'Wasserpuls',
    attackDmg: '60',
    attackDesc: 'Sein flauschiger Schwanz wedelt beim Schwimmen.'
  },
  {
    id: 'raichu',
    name: 'Raichu',
    type: 'electric',
    typeClass: 'type-electric',
    icon: '⚡',
    dex: 26,
    hp: '90 KP',
    rarity: '★★ RARE',
    cost: 30,
    attackName: 'Donnerblitz',
    attackDmg: '70',
    attackDesc: 'Die Weiterentwicklung von Pikachu. Ganz schön blitzschnell!'
  },
  {
    id: 'lapras',
    name: 'Lapras',
    type: 'water',
    typeClass: 'type-water',
    icon: '🌊',
    dex: 131,
    hp: '100 KP',
    rarity: '★★ ULTRA RARE',
    cost: 30,
    attackName: 'Wellenreiter',
    attackDmg: '70',
    attackDesc: 'Trägt gern Freunde sicher über das Meer.'
  },
  {
    id: 'gengar',
    name: 'Gengar',
    type: 'psychic',
    typeClass: 'type-psychic',
    icon: '👻',
    dex: 94,
    hp: '90 KP',
    rarity: '★★ ULTRA RARE',
    cost: 35,
    attackName: 'Schattenball',
    attackDmg: '80',
    attackDesc: 'Versteckt sich im Dunkeln und kichert leise.'
  },
  {
    id: 'dragoran',
    name: 'Dragoran',
    type: 'dragon',
    typeClass: 'type-dragon',
    icon: '🐉',
    dex: 149,
    hp: '120 KP',
    rarity: '★★★ SECRET RARE',
    cost: 40,
    attackName: 'Drachenwut',
    attackDmg: '100',
    attackDesc: 'Ein freundlicher Drache, der in nur 16 Stunden um die Welt fliegt.'
  },
  {
    id: 'mew',
    name: 'Mew',
    type: 'psychic',
    typeClass: 'type-psychic',
    icon: '✨',
    dex: 151,
    hp: '110 KP',
    rarity: '★★★ SECRET RARE',
    cost: 50,
    attackName: 'Wunderkraft',
    attackDmg: '90',
    attackDesc: 'Sehr selten und neugierig. Kann jede Attacke lernen!'
  }
];

/** Offizielles Artwork von PokéAPI (wird direkt von GitHub geladen). */
export function pokemonArtUrl(dex: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`;
}

/** Animiertes GIF (Showdown-Sprite), optional als Shiny-Variante. */
export function pokemonGifUrl(dex: number, shiny = false): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${shiny ? 'shiny/' : ''}${dex}.gif`;
}

/** Original-Ruf des Pokémon (PokéAPI cries). */
export function pokemonCryUrl(dex: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${dex}.ogg`;
}
