/* ==========================================================================
   JAMIE'S STORAGE & PROGRESS SERVICE
   Supports LocalStorage persistence + Firebase Realtime Cloud Sync
   ========================================================================== */

import { FirebaseSync } from './firebase';

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
  lastUpdated: string;
}

const STORAGE_KEYS = {
  STARS: 'jamie_stars_count',
  UNLOCKED_POKEMON: 'jamie_unlocked_pokemon',
  PACKED_ITEMS: 'jamie_packed_items_date',
  LAST_LOGIN: 'jamie_last_login',
  RESET_VERSION: 'jamie_reset_version',
  CLOUD_CONFIG: 'jamie_cloud_config',
  GOAL_SCHREIBHEFT: 'jamie_goal_schreibheft',
  GOAL_MATHE: 'jamie_goal_mathe',
  GOAL_DAILY_LOG: 'jamie_goal_daily_log'
};

// Einmaliger Reset (lokal + Firestore): Sterne 0, alle Pokémon-Karten gesperrt.
// Für einen weiteren Reset einfach den Wert ändern.
const RESET_VERSION = '2026-10-17';

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
  async syncToCloud(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // 1. Firebase Firestore Sync
    try {
      const state = {
        stars: this.getStars(),
        unlockedPokemon: this.getUnlockedPokemon(),
        schreibheftGoal: this.getSchreibheftGoal(),
        matheGoal: this.getMatheGoal(),
        resetVersion: RESET_VERSION,
        lastUpdated: new Date().toISOString()
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

  // Realtime Cloud Synchronisierung starten
  initCloudSync(): void {
    if (typeof window === 'undefined') return;
    
    // Live-Update von Firebase empfangen (z. B. wenn auf dem iPad Sterne verdient werden)
    FirebaseSync.subscribe((remoteData: any) => {
      if (!remoteData) return;
      // Veraltete Cloud-Daten (vor dem Reset) nicht übernehmen, sondern überschreiben
      if (remoteData.resetVersion !== RESET_VERSION) {
        this.syncToCloud();
        return;
      }
      if (typeof remoteData.stars === 'number') {
        const localStars = this.getStars();
        if (remoteData.stars !== localStars) {
          localStorage.setItem(STORAGE_KEYS.STARS, remoteData.stars.toString());
          this.dispatchUpdate('stars', remoteData.stars);
        }
      }
      if (Array.isArray(remoteData.unlockedPokemon)) {
        const localPoke = this.getUnlockedPokemon();
        if (JSON.stringify(remoteData.unlockedPokemon) !== JSON.stringify(localPoke)) {
          localStorage.setItem(STORAGE_KEYS.UNLOCKED_POKEMON, JSON.stringify(remoteData.unlockedPokemon));
          this.dispatchUpdate('pokemon', remoteData.unlockedPokemon);
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
    });

    // Ersten Sync anstoßen, falls Firestore noch leer ist
    setTimeout(() => {
      this.syncToCloud();
    }, 1500);
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
