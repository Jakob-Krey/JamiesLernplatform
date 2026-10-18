/* ==========================================================================
   PROFILE (Kinder)
   Eine Seite für mehrere Kinder. Das Profil kommt aus der Adresse
   (?kind=maya), wird im Browser gemerkt und trennt Sterne, Pokémon,
   Antworten und den Cloud-Datensatz. Jamie bleibt das Standard-Profil und
   behält seine bisherigen Speicher-Schlüssel (nichts geht verloren).
   ========================================================================== */

export type ProfileId = 'jamie' | 'maya';

export type PageId =
  | 'stundenplan'
  | 'deutsch'
  | 'mathe'
  | 'englisch'
  | 'pokemon'
  | 'lernziele'
  | 'timer'
  | 'uebungen';

export interface Profile {
  id: ProfileId;
  name: string;
  emoji: string;
  /** Firestore-Dokument in der Sammlung "jamie_data" */
  docId: string;
  /** Endung für lokale Speicher-Schlüssel ('' = unverändert wie früher) */
  suffix: string;
  /** Farbe der kleinen Besitzer-Markierung auf den Pokémon-Karten */
  color: string;
  /** Erlaubte Seiten; "stundenplan" ist die Startseite */
  pages: PageId[];
  /** Standard-Modus beim Kopfrechnen (Mathe-Seite) */
  mathDefault: string;
  /** Welche Vokabel-Stufen dieses Kind sieht (1 = Klasse 2, 2 = Klasse 3, 3 = Klasse 4) */
  vocabLevels: number[];
  /** Welche Übungsblatt-Themen dieses Kind sieht */
  showTopic: (topicId: string) => boolean;
  /** Übungsblatt-Thema, mit dem die Seite startet */
  defaultTopic: string;
  /** Kleiner Hinweis auf der Startseite */
  greeting: string;
}

const ALL_PAGES: PageId[] = ['stundenplan', 'deutsch', 'mathe', 'englisch', 'pokemon', 'lernziele', 'timer', 'uebungen'];

export const PROFILES: Record<ProfileId, Profile> = {
  jamie: {
    id: 'jamie',
    name: 'Jamie',
    emoji: '🎒',
    docId: 'progress',
    suffix: '',
    color: '#ec4899',
    pages: ALL_PAGES,
    mathDefault: 'mix_alles',
    vocabLevels: [1, 2],
    showTopic: (id) => !id.startsWith('k4_'),
    defaultTopic: 'plusminus',
    greeting: 'Hallo, Jamie!'
  },
  maya: {
    id: 'maya',
    name: 'Maya',
    emoji: '🦄',
    docId: 'progress_maya',
    suffix: '__maya',
    color: '#db2777',
    pages: ['stundenplan', 'mathe', 'englisch', 'pokemon', 'timer', 'uebungen'],
    mathDefault: 'mix_schwer',
    vocabLevels: [3],
    showTopic: (id) => id.startsWith('k4_'),
    defaultTopic: 'k4_plusminus',
    greeting: 'Hallo, Maya!'
  }
};

export const PROFILE_IDS = Object.keys(PROFILES) as ProfileId[];
export const DEFAULT_PROFILE: ProfileId = 'jamie';
export const PROFILE_STORAGE_KEY = 'jamie_profile';

/** Profil bestimmen: ?kind=… in der Adresse, sonst das zuletzt gemerkte, sonst Jamie. */
export function currentProfileId(): ProfileId {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  let id: string | null = null;
  try {
    const q = new URLSearchParams(location.search).get('kind')?.toLowerCase() ?? null;
    if (q && q in PROFILES) {
      id = q;
      localStorage.setItem(PROFILE_STORAGE_KEY, q);
    } else {
      id = localStorage.getItem(PROFILE_STORAGE_KEY);
    }
  } catch {}
  return id && id in PROFILES ? (id as ProfileId) : DEFAULT_PROFILE;
}

export function currentProfile(): Profile {
  return PROFILES[currentProfileId()];
}

/** Das jeweils andere Kind (für „Wer hat welche Pokémon?“). */
export function otherProfiles(): Profile[] {
  const me = currentProfileId();
  return PROFILE_IDS.filter((id) => id !== me).map((id) => PROFILES[id]);
}

/** Lokalen Speicher-Schlüssel für das aktuelle Kind. */
export function pkey(key: string): string {
  return key + currentProfile().suffix;
}

/** Web-App-Manifest-Datei je Kind. */
export function manifestFile(id: ProfileId): string {
  return id === DEFAULT_PROFILE ? 'manifest.webmanifest' : `manifest-${id}.webmanifest`;
}

/** Web-App-Manifest je Kind (die Maya-App startet direkt mit ?kind=maya). */
export function buildManifest(id: ProfileId, base: string) {
  const p = PROFILES[id];
  const prefix = id === DEFAULT_PROFILE ? '' : `${id}-`;
  return {
    name: `${p.name}s Lernplattform`,
    short_name: `${p.name} lernt`,
    description: 'Üben, Vokabeln und Pokémon-Sammelalbum.',
    lang: 'de',
    start_url: id === DEFAULT_PROFILE ? base : `${base}?kind=${id}`,
    scope: base,
    display: 'standalone',
    orientation: 'any',
    background_color: '#eef2ff',
    theme_color: id === DEFAULT_PROFILE ? '#ec4899' : '#e11d48',
    icons: [
      { src: `${base}icons/${prefix}icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${base}icons/${prefix}icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${base}icons/${prefix}icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
