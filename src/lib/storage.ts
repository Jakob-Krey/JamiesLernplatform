/* ==========================================================================
   JAMIE'S STORAGE & PROGRESS SERVICE
   Supports LocalStorage persistence + optional Supabase Cloud Sync
   ========================================================================== */

export interface JamieProgressState {
  stars: number;
  unlockedPokemon: string[];
  packedItems: Record<string, string[]>;
  lastUpdated: string;
}

const STORAGE_KEYS = {
  STARS: 'jamie_stars_count',
  UNLOCKED_POKEMON: 'jamie_unlocked_pokemon',
  PACKED_ITEMS: 'jamie_packed_items_date',
  LAST_LOGIN: 'jamie_last_login',
  CLOUD_CONFIG: 'jamie_cloud_config'
};

export const StorageService = {
  getStars(): number {
    if (typeof window === 'undefined') return 15;
    const stars = localStorage.getItem(STORAGE_KEYS.STARS);
    return stars ? parseInt(stars, 10) : 15; // 15 Bonus-Startsterne für Jamie!
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
    if (typeof window === 'undefined') return ['pikachu', 'evoli'];
    const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_POKEMON);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Error parsing unlocked pokemon', e);
      }
    }
    return ['pikachu', 'evoli'];
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

  exportBackup(): string {
    const state: JamieProgressState = {
      stars: this.getStars(),
      unlockedPokemon: this.getUnlockedPokemon(),
      packedItems: {},
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

  // Cloud Sync Vorbereitung (Supabase / REST)
  async syncToCloud(): Promise<void> {
    if (typeof window === 'undefined') return;
    const cloudConfigStr = localStorage.getItem(STORAGE_KEYS.CLOUD_CONFIG);
    if (!cloudConfigStr) return; // Kein Cloud Sync eingerichtet -> LocalStorage genügt
    try {
      const config = JSON.parse(cloudConfigStr);
      if (!config.url || !config.anonKey) return;
      
      // Send to Supabase table 'jamie_progress'
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
    } catch (err) {
      console.warn('Cloud Sync nicht erreichbar (Offline):', err);
    }
  }
};

// Global for inline handlers if needed
if (typeof window !== 'undefined') {
  (window as any).StorageService = StorageService;
}
