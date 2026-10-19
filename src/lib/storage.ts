/* ==========================================================================
   JAMIE'S STORAGE & PROGRESS SERVICE
   Supports LocalStorage persistence + Firebase Realtime Cloud Sync
   ========================================================================== */

import { FirebaseSync } from './firebase';
import { currentProfile } from './profile';

export interface SchreibheftGoal {
  startPage: number;
  targetPage: number;
  currentPage: number;
  targetDate: string;
}

export interface MatheGoal {
  yellowTarget: number;
  blueTarget: number;
  yellowDoneTotal: number;
  blueDoneTotal: number;
  targetDate: string;
}

export interface DailyGoalLog {
  date: string;
  schreibheftPagesToday: number;
  yellowPagesToday: number;
  bluePagesToday: number;
  yellowDoneToday: boolean;
  blueDoneToday: boolean;
}

export interface JamieProgressState {
  stars: number;
  unlockedPokemon: string[];
  packedItems: Record<string, string[]>;
  schreibheftGoal?: SchreibheftGoal;
  matheGoal?: MatheGoal;
  claimedDays?: string[];
  lastUpdated: string;
}

// Jeder lokale Schlüssel bekommt die Endung des Kindes (Jamie: keine, Maya: "__maya"),
// damit Sterne, Pokémon usw. getrennt bleiben.
const SFX = typeof window !== 'undefined' ? currentProfile().suffix : '';

const STORAGE_KEYS = {
  STARS: 'jamie_stars_count' + SFX,
  UNLOCKED_POKEMON: 'jamie_unlocked_pokemon' + SFX,
  PACKED_ITEMS: 'jamie_packed_items_date' + SFX,
  LAST_LOGIN: 'jamie_last_login' + SFX,
  RESET_VERSION: 'jamie_reset_version' + SFX,
  CLAIMED_DAYS: 'jamie_claimed_days' + SFX,
  MODIFIED: 'jamie_modified' + SFX,
  SYNCED: 'jamie_synced' + SFX,
  CLOUD_CONFIG: 'jamie_cloud_config',
  GOAL_SCHREIBHEFT: 'jamie_goal_schreibheft' + SFX,
  GOAL_MATHE: 'jamie_goal_mathe' + SFX,
  GOAL_DAILY_LOG: 'jamie_goal_daily_log' + SFX
};

// Einmaliger Reset (lokal + Firestore): Sterne 0, alle Pokémon-Karten gesperrt.
// Für einen weiteren Reset einfach den Wert ändern.
const RESET_VERSION = '2026-10-17';

// Wird true, sobald der Cloud-Stand dieses Geräts gelesen wurde (vorher wird nie hochgeladen).
let remoteKnown = false;

export const StorageService = {
  getStars(): number {
    if (typeof window === 'undefined') return 0;
    const stars = localStorage.getItem(STORAGE_KEYS.STARS);
    return stars ? parseInt(stars, 10) : 0;
  },

  setStars(amount: number): number {
    if (typeof window === 'undefined') return amount;
    localStorage.setItem(STORAGE_KEYS.STARS, amount.toString());
    this.dispatchUpdate('stars', amount);
    this.syncToCloud();
    return amount;
  },

  addStars(amount: number = 1): number {
    const current = this.getStars();
    const updated = Math.max(0, current + amount);
    return this.setStars(updated);
  },

  getUnlockedPokemon(): string[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_POKEMON);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Error parsing unlocked pokemon', e);
      }
    }
    return [];
  },

  unlockPokemon(id: string): boolean {
    const list = this.getUnlockedPokemon();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_POKEMON, JSON.stringify(list));
      this.dispatchUpdate('pokemon', list);
      this.syncToCloud();
      return true;
    }
    return false;
  },

  getPackedItems(dayKey: string): string[] {
    if (typeof window === 'undefined') return [];
    const todayStr = new Date().toISOString().split('T')[0];
    const key = `${STORAGE_KEYS.PACKED_ITEMS}_${todayStr}_${dayKey}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  },

  setPackedItems(dayKey: string, items: string[]): void {
    if (typeof window === 'undefined') return;
    const todayStr = new Date().toISOString().split('T')[0];
    const key = `${STORAGE_KEYS.PACKED_ITEMS}_${todayStr}_${dayKey}`;
    localStorage.setItem(key, JSON.stringify(items));
    this.dispatchUpdate('ranzen', { dayKey, items });
    this.syncToCloud();
  },

  // Tage, für die die Sterne-Belohnung schon vergeben wurde (YYYY-MM-DD)
  getClaimedDays(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLAIMED_DAYS) || '[]');
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [];
  },

  /** Markiert einen Tag als abgeholt. Gibt false zurück, wenn er schon abgeholt war. */
  claimDay(date: string): boolean {
    const list = this.getClaimedDays();
    if (list.includes(date)) return false;
    list.push(date);
    localStorage.setItem(STORAGE_KEYS.CLAIMED_DAYS, JSON.stringify(list));
    this.dispatchUpdate('claimed_days', list);
    this.syncToCloud();
    return true;
  },

  getSchreibheftGoal(): SchreibheftGoal {
    if (typeof window === 'undefined') {
      return { startPage: 35, targetPage: 76, currentPage: 35, targetDate: '2026-11-02' };
    }
    const raw = localStorage.getItem(STORAGE_KEYS.GOAL_SCHREIBHEFT);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return { startPage: 35, currentPage: 35, targetDate: '2026-11-02', ...parsed, targetPage: 76 };
      } catch (e) {}
    }
    return { startPage: 35, targetPage: 76, currentPage: 35, targetDate: '2026-11-02' };
  },

  setSchreibheftCurrentPage(page: number): SchreibheftGoal {
    const goal = this.getSchreibheftGoal();
    goal.currentPage = Math.min(goal.targetPage, Math.max(goal.startPage, page));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GOAL_SCHREIBHEFT, JSON.stringify(goal));
      this.dispatchUpdate('goal_schreibheft', goal);
      this.syncToCloud();
    }
    return goal;
  },

  getMatheGoal(): MatheGoal {
    if (typeof window === 'undefined') {
      return { yellowTarget: 17, blueTarget: 17, yellowDoneTotal: 0, blueDoneTotal: 0, targetDate: '2026-11-02' };
    }
    const raw = localStorage.getItem(STORAGE_KEYS.GOAL_MATHE);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return {
          yellowTarget: 17,
          blueTarget: 17,
          yellowDoneTotal: 0,
          blueDoneTotal: 0,
          targetDate: '2026-11-02',
          ...parsed,
          yellowTarget: 17,
          blueTarget: 17
        };
      } catch (e) {}
    }
    return { yellowTarget: 17, blueTarget: 17, yellowDoneTotal: 0, blueDoneTotal: 0, targetDate: '2026-11-02' };
  },

  updateMatheGoal(delta: { yellow?: number; blue?: number }): MatheGoal {
    const goal = this.getMatheGoal();
    if (typeof delta.yellow === 'number') {
      goal.yellowDoneTotal = Math.max(0, goal.yellowDoneTotal + delta.yellow);
    }
    if (typeof delta.blue === 'number') {
      goal.blueDoneTotal = Math.max(0, goal.blueDoneTotal + delta.blue);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GOAL_MATHE, JSON.stringify(goal));
      this.dispatchUpdate('goal_mathe', goal);
      this.syncToCloud();
    }
    return goal;
  },

  getDailyGoalLog(): DailyGoalLog {
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultLog: DailyGoalLog = {
      date: todayStr,
      schreibheftPagesToday: 0,
      yellowPagesToday: 0,
      bluePagesToday: 0,
      yellowDoneToday: false,
      blueDoneToday: false
    };
    if (typeof window === 'undefined') return defaultLog;
    const raw = localStorage.getItem(`${STORAGE_KEYS.GOAL_DAILY_LOG}_${todayStr}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return defaultLog;
  },

  updateDailyGoalLog(update: Partial<DailyGoalLog>): DailyGoalLog {
    const todayStr = new Date().toISOString().split('T')[0];
    const log = this.getDailyGoalLog();
    const updated: DailyGoalLog = { ...log, ...update, date: todayStr };
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEYS.GOAL_DAILY_LOG}_${todayStr}`, JSON.stringify(updated));
      this.dispatchUpdate('goal_daily_log', updated);
      this.syncToCloud();
    }
    return updated;
  },

  exportBackup(): string {
    const state: JamieProgressState = {
      stars: this.getStars(),
      unlockedPokemon: this.getUnlockedPokemon(),
      packedItems: {},
      schreibheftGoal: this.getSchreibheftGoal(),
      matheGoal: this.getMatheGoal(),
      claimedDays: this.getClaimedDays(),
      lastUpdated: new Date().toISOString()
    };
    return JSON.stringify(state, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data.stars === 'number') this.setStars(data.stars);
      if (Array.isArray(data.unlockedPokemon)) {
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_POKEMON, JSON.stringify(data.unlockedPokemon));
        this.dispatchUpdate('pokemon', data.unlockedPokemon);
      }
      if (data.schreibheftGoal) {
        localStorage.setItem(STORAGE_KEYS.GOAL_SCHREIBHEFT, JSON.stringify(data.schreibheftGoal));
        this.dispatchUpdate('goal_schreibheft', data.schreibheftGoal);
      }
      if (data.matheGoal) {
        localStorage.setItem(STORAGE_KEYS.GOAL_MATHE, JSON.stringify(data.matheGoal));
        this.dispatchUpdate('goal_mathe', data.matheGoal);
      }
      if (Array.isArray(data.claimedDays)) {
        localStorage.setItem(STORAGE_KEYS.CLAIMED_DAYS, JSON.stringify(data.claimedDays));
        this.dispatchUpdate('claimed_days', data.claimedDays);
      }
      this.syncToCloud();
      return true;
    } catch (e) {
      console.error('Fehler beim Import', e);
      return false;
    }
  },

  // Event dispatcher for reactive UI updates across all components
  dispatchUpdate(type: string, data: any): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('jamie-storage-update', {
      detail: { type, data }
    }));
  },

  // Cloud Sync mit Firebase Firestore + Supabase Fallback
  async syncToCloud(force = false): Promise<void> {
    if (typeof window === 'undefined') return;

    // Zeitpunkt der letzten lokalen Änderung merken (der neuere Stand gewinnt später)
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.MODIFIED, now);

    // Solange der Cloud-Stand noch nicht bekannt ist, nichts hochladen:
    // ein frisches oder veraltetes Gerät darf den Cloud-Stand nie überschreiben.
    if (!force && !remoteKnown) return;

    // 1. Firebase Firestore Sync
    try {
      const state = {
        stars: this.getStars(),
        unlockedPokemon: this.getUnlockedPokemon(),
        schreibheftGoal: this.getSchreibheftGoal(),
        matheGoal: this.getMatheGoal(),
        claimedDays: this.getClaimedDays(),
        resetVersion: RESET_VERSION,
        lastUpdated: now
      };
      await FirebaseSync.save(state);
    } catch (err) {
      console.warn('Firebase Sync Warnung:', err);
    }

    // 2. Optional Supabase REST Sync
    const cloudConfigStr = localStorage.getItem(STORAGE_KEYS.CLOUD_CONFIG);
    if (cloudConfigStr) {
      try {
        const config = JSON.parse(cloudConfigStr);
        if (config.url && config.anonKey) {
          await fetch(`${config.url}/rest/v1/jamie_progress?id=eq.default`, {
            method: 'PATCH',
            headers: {
              'apikey': config.anonKey,
              'Authorization': `Bearer ${config.anonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              stars: this.getStars(),
              unlocked_pokemon: this.getUnlockedPokemon(),
              updated_at: new Date().toISOString()
            })
          });
        }
      } catch (err) {
        console.warn('Supabase Sync Warnung:', err);
      }
    }
  },

  /** Übernimmt einen neueren Cloud-Stand oder lädt einen neueren lokalen Stand hoch. */
  handleRemote(remoteData: any): void {
    if (!remoteData) return;
    // Veraltete Cloud-Daten (vor dem Reset) nicht übernehmen, sondern überschreiben
    if (remoteData.resetVersion !== RESET_VERSION) {
      this.syncToCloud(true);
      return;
    }
    const remoteTs: string = [remoteData.updatedAt, remoteData.lastUpdated].filter(Boolean).sort().pop() || '';
    const localTs = localStorage.getItem(STORAGE_KEYS.MODIFIED) || '';

    // Ein Gerät, das noch nie mit der Cloud abgeglichen war, übernimmt immer den Cloud-Stand
    const synced = localStorage.getItem(STORAGE_KEYS.SYNCED) === '1';
    if (synced && localTs > remoteTs) {
      // Dieses Gerät hat Neueres (z. B. offline gesammelt): hochladen
      this.syncToCloud(true);
      return;
    }
    if (synced && remoteTs === localTs) return;
    localStorage.setItem(STORAGE_KEYS.SYNCED, '1');

    // Cloud ist neuer: übernehmen. Gesammelte Karten gehen nie verloren (Vereinigung).
    if (typeof remoteData.stars === 'number' && remoteData.stars !== this.getStars()) {
      localStorage.setItem(STORAGE_KEYS.STARS, remoteData.stars.toString());
      this.dispatchUpdate('stars', remoteData.stars);
    }
    let needRepair = false;
    if (Array.isArray(remoteData.unlockedPokemon)) {
      const local = this.getUnlockedPokemon();
      const union = Array.from(new Set([...remoteData.unlockedPokemon, ...local]));
      if (JSON.stringify(union) !== JSON.stringify(local)) {
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_POKEMON, JSON.stringify(union));
        this.dispatchUpdate('pokemon', union);
      }
      needRepair = union.length !== remoteData.unlockedPokemon.length;
    }
    if (Array.isArray(remoteData.claimedDays)) {
      const merged = Array.from(new Set([...this.getClaimedDays(), ...remoteData.claimedDays]));
      if (merged.length !== this.getClaimedDays().length) {
        localStorage.setItem(STORAGE_KEYS.CLAIMED_DAYS, JSON.stringify(merged));
        this.dispatchUpdate('claimed_days', merged);
      }
    }
    if (remoteData.schreibheftGoal) {
      localStorage.setItem(STORAGE_KEYS.GOAL_SCHREIBHEFT, JSON.stringify(remoteData.schreibheftGoal));
      this.dispatchUpdate('goal_schreibheft', remoteData.schreibheftGoal);
    }
    if (remoteData.matheGoal) {
      localStorage.setItem(STORAGE_KEYS.GOAL_MATHE, JSON.stringify(remoteData.matheGoal));
      this.dispatchUpdate('goal_mathe', remoteData.matheGoal);
    }
    localStorage.setItem(STORAGE_KEYS.MODIFIED, remoteTs);
    // Karten, die nur lokal waren, zurück in die Cloud schreiben
    if (needRepair) this.syncToCloud(true);
  },

  // Realtime Cloud Synchronisierung starten
  initCloudSync(): void {
    if (typeof window === 'undefined') return;

    // Erst den Cloud-Stand lesen, danach darf dieses Gerät schreiben.
    FirebaseSync.loadChecked().then((res) => {
      if (!res.ok) return; // offline/Fehler: lokal weiterarbeiten, nichts überschreiben
      remoteKnown = true;
      if (res.data) this.handleRemote(res.data);
      else {
        // Noch kein Cloud-Dokument (z. B. neues Profil): eigenen Stand als Grundlage hochladen
        localStorage.setItem(STORAGE_KEYS.SYNCED, '1');
        if (localStorage.getItem(STORAGE_KEYS.MODIFIED)) this.syncToCloud(true);
      }
    });

    // Live-Updates von anderen Geräten (z. B. wenn auf dem iPad Sterne verdient werden)
    FirebaseSync.subscribe((remoteData: any) => {
      remoteKnown = true;
      this.handleRemote(remoteData);
    });
  }
};

// Auto-Init im Browser
if (typeof window !== 'undefined') {
  (window as any).StorageService = StorageService;
  if (localStorage.getItem(STORAGE_KEYS.RESET_VERSION) !== RESET_VERSION) {
    localStorage.setItem(STORAGE_KEYS.STARS, '0');
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_POKEMON, '[]');
    localStorage.setItem(STORAGE_KEYS.RESET_VERSION, RESET_VERSION);
  }
  StorageService.initCloudSync();
}
