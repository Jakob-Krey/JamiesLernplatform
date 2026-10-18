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
  }
];

/** Offizielles Artwork von PokéAPI (wird direkt von GitHub geladen). */
export function pokemonArtUrl(dex: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`;
}
