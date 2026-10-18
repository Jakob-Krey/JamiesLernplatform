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

const HANDMADE_CARDS: PokemonCardData[] = [
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

/* ==========================================================================
   Weitere Karten: kompakt als [Pokédex-Nr., Name, Typ, Stufe] hinterlegt.
   Stufe 1 = normal, 2 = selten, 3 = ultra selten, 4 = geheim.
   Typ: G Pflanze, F Feuer, W Wasser, E Elektro, P Psycho, N Normal, D Drache,
        B Käfer, O Gift, U Boden/Gestein, I Eis, H Kampf, S Geist, L Flug
   ========================================================================== */
type TypeCode = 'G' | 'F' | 'W' | 'E' | 'P' | 'N' | 'D' | 'B' | 'O' | 'U' | 'I' | 'H' | 'S' | 'L';

const TYPE_INFO: Record<TypeCode, { type: string; label: string; icon: string; attacks: string[]; texts: string[] }> = {
  G: { type: 'grass', label: 'Pflanzen', icon: '🌿', attacks: ['Rasierblatt', 'Rankenhieb', 'Blättersturm'], texts: ['liebt Sonnenschein und frische Luft.', 'wächst mit jedem Tag ein Stück.', 'duftet nach Blumen und Wald.'] },
  F: { type: 'fire', label: 'Feuer', icon: '🔥', attacks: ['Glut', 'Flammenwurf', 'Feuerwirbel'], texts: ['wärmt alle, die ihm nahe sind.', 'hat eine flackernde Flamme.', 'sprüht Funken, wenn es sich freut.'] },
  W: { type: 'water', label: 'Wasser', icon: '💧', attacks: ['Aquaknarre', 'Blubbstrahl', 'Wasserpuls'], texts: ['plantscht am liebsten im Wasser.', 'schwimmt flink durch Seen und Meere.', 'spritzt gern mit Wasser herum.'] },
  E: { type: 'electric', label: 'Elektro', icon: '⚡', attacks: ['Funkensprung', 'Donnerblitz', 'Voltung'], texts: ['lädt sich mit Strom auf.', 'knistert, wenn es aufgeregt ist.', 'sprüht kleine Blitze.'] },
  P: { type: 'psychic', label: 'Psycho', icon: '🔮', attacks: ['Konfusion', 'Psystoß', 'Psychokinese'], texts: ['kann Gedanken erahnen.', 'ist sehr klug und geheimnisvoll.', 'bewegt Dinge mit der Kraft der Gedanken.'] },
  N: { type: 'normal', label: 'Normal', icon: '⭐', attacks: ['Tackle', 'Kratzer', 'Superschall'], texts: ['ist ein treuer Begleiter.', 'ist freundlich und neugierig.', 'mag alle Menschen und Pokémon.'] },
  D: { type: 'dragon', label: 'Drachen', icon: '🐉', attacks: ['Drachenklaue', 'Drachenwut', 'Drachenpuls'], texts: ['ist sehr selten und mächtig.', 'schwebt elegant durch die Lüfte.', 'wacht über seine Freunde.'] },
  B: { type: 'bug', label: 'Käfer', icon: '🐛', attacks: ['Käferbiss', 'Fadenschuss', 'Silberhauch'], texts: ['krabbelt fleißig durch das Gras.', 'versteckt sich gern in Blättern.', 'ist kleiner, als man denkt.'] },
  O: { type: 'poison', label: 'Gift', icon: '☠️', attacks: ['Giftstachel', 'Säure', 'Schlammbombe'], texts: ['hat einen kleinen Giftstachel.', 'ist zum Glück nur selten wütend.', 'schleicht leise durch die Nacht.'] },
  U: { type: 'ground', label: 'Boden', icon: '⛰️', attacks: ['Sandwirbel', 'Steinwurf', 'Erdbeben'], texts: ['ist hart wie ein Stein.', 'gräbt sich tief in die Erde.', 'rollt gern über Berge.'] },
  I: { type: 'ice', label: 'Eis', icon: '❄️', attacks: ['Eissplitter', 'Eisstrahl', 'Blizzard'], texts: ['liebt es kalt und frostig.', 'glitzert wie frischer Schnee.', 'lässt die Luft gefrieren.'] },
  H: { type: 'fighting', label: 'Kampf', icon: '🥋', attacks: ['Karateschlag', 'Kehrtwende', 'Fußkick'], texts: ['trainiert jeden Tag hart.', 'ist stark und sehr ausdauernd.', 'gibt niemals auf.'] },
  S: { type: 'ghost', label: 'Geist', icon: '👻', attacks: ['Schreckmoment', 'Schattenklaue', 'Spukball'], texts: ['spukt gern im Dunkeln.', 'kichert leise im Schatten.', 'schwebt lautlos durch Wände.'] },
  L: { type: 'flying', label: 'Flug', icon: '🪽', attacks: ['Windstoß', 'Sturzflug', 'Fliegen'], texts: ['segelt hoch über den Wolken.', 'liebt den Wind unter den Flügeln.', 'sieht alles von oben.'] }
};

const TIER_INFO = [
  { rarity: '★ COMMON', hp: 40, dmg: 20, cost: 10 },
  { rarity: '★★ RARE', hp: 70, dmg: 40, cost: 20 },
  { rarity: '★★ ULTRA RARE', hp: 100, dmg: 70, cost: 30 },
  { rarity: '★★★ SECRET RARE', hp: 130, dmg: 100, cost: 50 }
];

const EXTRA_CARDS: [number, string, TypeCode, 1 | 2 | 3 | 4][] = [
  [3, 'Bisaflor', 'G', 3],
  [6, 'Glurak', 'F', 3],
  [9, 'Turtok', 'W', 3],
  [10, 'Raupy', 'B', 1],
  [11, 'Safcon', 'B', 2],
  [12, 'Smettbo', 'B', 3],
  [13, 'Hornliu', 'B', 1],
  [14, 'Kokuna', 'B', 2],
  [15, 'Bibor', 'B', 3],
  [16, 'Taubsi', 'L', 1],
  [17, 'Tauboga', 'L', 2],
  [18, 'Tauboss', 'L', 3],
  [19, 'Rattfratz', 'N', 1],
  [20, 'Rattikarl', 'N', 3],
  [21, 'Habitak', 'L', 1],
  [22, 'Ibitak', 'L', 3],
  [23, 'Rettan', 'O', 1],
  [24, 'Arbok', 'O', 3],
  [27, 'Sandan', 'U', 1],
  [28, 'Sandamer', 'U', 3],
  [29, 'Nidoran♀', 'O', 1],
  [30, 'Nidorina', 'O', 2],
  [31, 'Nidoqueen', 'O', 3],
  [32, 'Nidoran♂', 'O', 1],
  [33, 'Nidorino', 'O', 2],
  [34, 'Nidoking', 'O', 3],
  [35, 'Piepi', 'N', 1],
  [36, 'Pixi', 'N', 3],
  [37, 'Vulpix', 'F', 1],
  [38, 'Vulnona', 'F', 3],
  [40, 'Knuddeluff', 'N', 3],
  [41, 'Zubat', 'O', 1],
  [42, 'Golbat', 'O', 3],
  [43, 'Myrapla', 'G', 1],
  [44, 'Duflor', 'G', 2],
  [45, 'Giflor', 'G', 3],
  [46, 'Paras', 'B', 1],
  [47, 'Parasek', 'B', 3],
  [48, 'Bluzuk', 'B', 1],
  [49, 'Omot', 'B', 3],
  [50, 'Digda', 'U', 1],
  [51, 'Digdri', 'U', 3],
  [52, 'Mauzi', 'N', 1],
  [53, 'Snobilikat', 'N', 3],
  [55, 'Entoron', 'W', 3],
  [56, 'Menki', 'H', 1],
  [57, 'Rasaff', 'H', 3],
  [58, 'Fukano', 'F', 1],
  [59, 'Arkani', 'F', 3],
  [60, 'Quapsel', 'W', 1],
  [61, 'Quaputzi', 'W', 2],
  [62, 'Quappo', 'W', 3],
  [63, 'Abra', 'P', 1],
  [64, 'Kadabra', 'P', 2],
  [65, 'Simsala', 'P', 3],
  [66, 'Machollo', 'H', 1],
  [67, 'Maschock', 'H', 2],
  [68, 'Machomei', 'H', 3],
  [69, 'Knofensa', 'G', 1],
  [70, 'Ultrigaria', 'G', 2],
  [71, 'Sarzenia', 'G', 3],
  [72, 'Tentacha', 'W', 1],
  [73, 'Tentoxa', 'W', 3],
  [74, 'Kleinstein', 'U', 1],
  [75, 'Georok', 'U', 2],
  [76, 'Geowaz', 'U', 3],
  [77, 'Ponita', 'F', 1],
  [78, 'Gallopa', 'F', 3],
  [79, 'Flegmon', 'W', 1],
  [80, 'Lahmus', 'W', 3],
  [81, 'Magnetilo', 'E', 1],
  [82, 'Magneton', 'E', 3],
  [83, 'Porenta', 'N', 1],
  [84, 'Dodu', 'L', 1],
  [85, 'Dodri', 'L', 3],
  [86, 'Jurob', 'W', 1],
  [87, 'Jugong', 'W', 3],
  [88, 'Sleima', 'O', 1],
  [89, 'Sleimok', 'O', 3],
  [90, 'Muschas', 'W', 1],
  [91, 'Austos', 'W', 3],
  [92, 'Nebulak', 'S', 1],
  [93, 'Alpollo', 'S', 2],
  [95, 'Onix', 'U', 1],
  [96, 'Traumato', 'P', 1],
  [97, 'Hypno', 'P', 3],
  [98, 'Krabby', 'W', 1],
  [99, 'Kingler', 'W', 3],
  [100, 'Voltobal', 'E', 1],
  [101, 'Lektrobal', 'E', 3],
  [102, 'Owei', 'G', 1],
  [103, 'Kokowei', 'G', 3],
  [104, 'Tragosso', 'U', 1],
  [105, 'Knogga', 'U', 3],
  [106, 'Kicklee', 'H', 3],
  [107, 'Nockchan', 'H', 3],
  [108, 'Schlurp', 'N', 1],
  [109, 'Smogon', 'O', 1],
  [110, 'Smogmog', 'O', 3],
  [111, 'Rihorn', 'U', 1],
  [112, 'Rizeros', 'U', 3],
  [113, 'Chaneira', 'N', 1],
  [114, 'Tangela', 'G', 1],
  [115, 'Kangama', 'N', 1],
  [116, 'Seeper', 'W', 1],
  [117, 'Seemon', 'W', 3],
  [118, 'Goldini', 'W', 1],
  [119, 'Golking', 'W', 3],
  [120, 'Sterndu', 'W', 1],
  [121, 'Starmie', 'W', 3],
  [122, 'Pantimos', 'P', 3],
  [123, 'Sichlor', 'B', 1],
  [124, 'Rossana', 'I', 3],
  [125, 'Elektek', 'E', 3],
  [126, 'Magmar', 'F', 3],
  [127, 'Pinsir', 'B', 1],
  [128, 'Tauros', 'N', 1],
  [130, 'Garados', 'W', 3],
  [132, 'Ditto', 'N', 3],
  [134, 'Aquana', 'W', 3],
  [135, 'Blitza', 'E', 3],
  [136, 'Flamara', 'F', 3],
  [137, 'Porygon', 'N', 1],
  [138, 'Amonitas', 'U', 1],
  [139, 'Amoroso', 'U', 3],
  [140, 'Kabuto', 'U', 1],
  [141, 'Kabutops', 'U', 3],
  [142, 'Aerodactyl', 'U', 3],
  [143, 'Relaxo', 'N', 1],
  [144, 'Arktos', 'I', 4],
  [145, 'Zapdos', 'E', 4],
  [146, 'Lavados', 'F', 4],
  [147, 'Dratini', 'D', 1],
  [148, 'Dragonir', 'D', 3],
  [196, 'Psiana', 'P', 3],
  [197, 'Nachtara', 'N', 3],
  [470, 'Folipurba', 'G', 3],
  [471, 'Glaziola', 'I', 3],
  [447, 'Riolu', 'H', 1],
  [448, 'Lucario', 'H', 3],
  [445, 'Garchomp', 'D', 3],
  [252, 'Geckarbor', 'G', 1],
  [255, 'Flemmli', 'F', 1],
  [258, 'Hydropi', 'W', 1],
  [387, 'Chelast', 'G', 1],
  [390, 'Panflam', 'F', 1],
  [393, 'Plinfa', 'W', 1],
  [778, 'Mimigma', 'S', 3],
  [249, 'Lugia', 'P', 4],
  [250, 'Ho-Oh', 'F', 4],
  [251, 'Celebi', 'G', 4],
  [382, 'Kyogre', 'W', 4],
  [383, 'Groudon', 'U', 4],
  [384, 'Rayquaza', 'D', 4]
];

function makeCard([dex, name, code, tier]: [number, string, TypeCode, 1 | 2 | 3 | 4]): PokemonCardData {
  const t = TYPE_INFO[code];
  const info = TIER_INFO[tier - 1];
  return {
    id: `dex${dex}`,
    name,
    type: t.type,
    typeClass: `type-${t.type}`,
    icon: t.icon,
    dex,
    hp: `${info.hp + (dex % 4) * 10} KP`,
    rarity: info.rarity,
    cost: info.cost + (dex % 3) * 5,
    attackName: t.attacks[dex % 3],
    attackDmg: String(info.dmg + (dex % 3) * 10),
    attackDesc: `${name} ${t.texts[(dex + 1) % 3]}`
  };
}

export const POKEMON_DATA: PokemonCardData[] = [...HANDMADE_CARDS, ...EXTRA_CARDS.map(makeCard)];

/** Anzeigename je Typ (für den Filter). */
export const TYPE_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(TYPE_INFO).map((t) => [t.type, `${t.icon} ${t.label}`])
);
