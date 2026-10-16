/* ==========================================================================
   JAMIE'S STORAGE & PROGRESS HELPER
   Persists stars, streaks, packed bag items, and unlocked Pokémon in LocalStorage
   ========================================================================== */

const STORAGE_KEYS = {
  STARS: 'jamie_stars_count',
  UNLOCKED_POKEMON: 'jamie_unlocked_pokemon',
  PACKED_ITEMS: 'jamie_packed_items_date',
  LAST_LOGIN: 'jamie_last_login'
};

const StorageService = {
  getStars() {
    const stars = localStorage.getItem(STORAGE_KEYS.STARS);
    return stars ? parseInt(stars, 10) : 15; // Start with 15 bonus stars!
  },

  addStars(amount = 1) {
    const current = this.getStars();
    const updated = current + amount;
    localStorage.setItem(STORAGE_KEYS.STARS, updated);
    this.dispatchUpdate('stars', updated);
    return updated;
  },

  getUnlockedPokemon() {
    const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_POKEMON);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error parsing unlocked pokemon', e);
      }
    }
    // Default unlocked starter cards for Jamie
    return ['pikachu', 'evoli'];
  },

  unlockPokemon(id) {
    const list = this.getUnlockedPokemon();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_POKEMON, JSON.stringify(list));
      this.dispatchUpdate('pokemon', list);
      return true;
    }
    return false;
  },

  getPackedItems(dayKey) {
    const todayStr = new Date().toISOString().split('T')[0];
    const key = `${STORAGE_KEYS.PACKED_ITEMS}_${todayStr}_${dayKey}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  },

  setPackedItems(dayKey, items) {
    const todayStr = new Date().toISOString().split('T')[0];
    const key = `${STORAGE_KEYS.PACKED_ITEMS}_${todayStr}_${dayKey}`;
    localStorage.setItem(key, JSON.stringify(items));
  },

  dispatchUpdate(type, data) {
    window.dispatchEvent(new CustomEvent('jamie-storage-update', {
      detail: { type, data }
    }));
  }
};

window.StorageService = StorageService;
