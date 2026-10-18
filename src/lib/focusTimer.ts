/* ==========================================================================
   JAMIE'S FOCUS TIMER SERVICE (15 Min Work / 5 Min Break)
   Persisted in localStorage with timestamp end dates so it keeps running
   seamlessly across page navigation and tabs!
   ========================================================================== */

import { StorageService } from './storage';
import { pkey } from './profile';
import { AudioFX, triggerConfetti, showStarToast } from './audio';

export type TimerMode = 'work' | 'break';

export interface FocusTimerState {
  mode: TimerMode;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  targetEndTime: number | null; // epoch ms
  completedToday: number;
}

const TIMER_KEYS = {
  STATE: pkey('jamie_focus_timer_state_v1'),
  COMPLETED: pkey('jamie_focus_completed_today_v1')
};

const WORK_DURATION = 15 * 60; // 15 minutes = 900 seconds
const BREAK_DURATION = 5 * 60;  // 5 minutes = 300 seconds

let tickInterval: any = null;

export const FocusTimerService = {
  WORK_DURATION,
  BREAK_DURATION,

  getCompletedToday(): number {
    if (typeof window === 'undefined') return 0;
    const todayStr = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem(`${TIMER_KEYS.COMPLETED}_${todayStr}`);
    return stored ? parseInt(stored, 10) : 0;
  },

  addCompletedSession(): number {
    if (typeof window === 'undefined') return 1;
    const todayStr = new Date().toISOString().slice(0, 10);
    const count = this.getCompletedToday() + 1;
    localStorage.setItem(`${TIMER_KEYS.COMPLETED}_${todayStr}`, count.toString());
    return count;
  },

  getState(): FocusTimerState {
    const defaultState: FocusTimerState = {
      mode: 'work',
      timeLeft: WORK_DURATION,
      totalDuration: WORK_DURATION,
      isRunning: false,
      targetEndTime: null,
      completedToday: this.getCompletedToday()
    };

    if (typeof window === 'undefined') return defaultState;

    const raw = localStorage.getItem(TIMER_KEYS.STATE);
    if (!raw) return defaultState;

    try {
      const state = JSON.parse(raw) as FocusTimerState;
      state.completedToday = this.getCompletedToday();

      // Check if it was running while page was reloaded or closed
      if (state.isRunning && state.targetEndTime) {
        const remaining = Math.round((state.targetEndTime - Date.now()) / 1000);
        if (remaining <= 0) {
          // Timer finished while page was closed
          state.timeLeft = 0;
          state.isRunning = false;
          state.targetEndTime = null;
        } else {
          state.timeLeft = remaining;
        }
      }
      return state;
    } catch {
      return defaultState;
    }
  },

  saveState(state: FocusTimerState): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TIMER_KEYS.STATE, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('jamie-timer-tick', { detail: state }));
  },

  init(): void {
    if (typeof window === 'undefined') return;
    if (tickInterval) return;

    // Check state on load
    const current = this.getState();
    if (current.isRunning) {
      this.startCountdown();
    }

    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === TIMER_KEYS.STATE) {
        const s = this.getState();
        if (s.isRunning && !tickInterval) {
          this.startCountdown();
        } else if (!s.isRunning && tickInterval) {
          clearInterval(tickInterval);
          tickInterval = null;
        }
        window.dispatchEvent(new CustomEvent('jamie-timer-tick', { detail: s }));
      }
    });
  },

  start(): void {
    const state = this.getState();
    if (state.timeLeft <= 0) {
      state.timeLeft = state.mode === 'work' ? WORK_DURATION : BREAK_DURATION;
      state.totalDuration = state.timeLeft;
    }

    state.isRunning = true;
    state.targetEndTime = Date.now() + state.timeLeft * 1000;
    this.saveState(state);
    this.startCountdown();
    AudioFX.playChime();
  },

  pause(): void {
    const state = this.getState();
    state.isRunning = false;
    state.targetEndTime = null;
    this.saveState(state);

    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  },

  toggle(): void {
    const state = this.getState();
    if (state.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  },

  reset(): void {
    const state = this.getState();
    state.isRunning = false;
    state.targetEndTime = null;
    state.timeLeft = state.mode === 'work' ? WORK_DURATION : BREAK_DURATION;
    state.totalDuration = state.timeLeft;
    this.saveState(state);

    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  },

  setMode(mode: TimerMode): void {
    const state = this.getState();
    state.mode = mode;
    state.isRunning = false;
    state.targetEndTime = null;
    state.timeLeft = mode === 'work' ? WORK_DURATION : BREAK_DURATION;
    state.totalDuration = state.timeLeft;
    this.saveState(state);

    if (tickInterval) {
      clearInterval(tickInterval);
      tickInterval = null;
    }
  },

  startCountdown(): void {
    if (tickInterval) clearInterval(tickInterval);

    tickInterval = setInterval(() => {
      const state = this.getState();
      if (!state.isRunning || !state.targetEndTime) {
        clearInterval(tickInterval);
        tickInterval = null;
        return;
      }

      const diff = Math.round((state.targetEndTime - Date.now()) / 1000);

      if (diff <= 0) {
        // Timer Finished!
        state.timeLeft = 0;
        state.isRunning = false;
        state.targetEndTime = null;

        if (state.mode === 'work') {
          // Completed 15 min focus session!
          const completed = this.addCompletedSession();
          state.completedToday = completed;
          
          // Reward Jamie with +2 stars!
          StorageService.addStars(2);
          AudioFX.playSuccessFanfare();
          AudioFX.playTimerBell();
          triggerConfetti();
          showStarToast(2, '🎉 15 Min Fokus geschafft! (+2 Sterne)');

          // Automatically switch to Break
          state.mode = 'break';
          state.timeLeft = BREAK_DURATION;
          state.totalDuration = BREAK_DURATION;
        } else {
          // Break finished
          AudioFX.playTimerBell();
          showStarToast(0, '🔔 Pause beendet! Bereit für die nächste Runde? 🎯');

          // Switch to Work
          state.mode = 'work';
          state.timeLeft = WORK_DURATION;
          state.totalDuration = WORK_DURATION;
        }

        this.saveState(state);
        clearInterval(tickInterval);
        tickInterval = null;
      } else {
        state.timeLeft = diff;
        this.saveState(state);
      }
    }, 1000);
  },

  formatTime(totalSeconds: number): string {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};
