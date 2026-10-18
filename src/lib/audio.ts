/* ==========================================================================
   AUDIO, CONFETTI & UI FEEDBACK HELPERS
   ========================================================================== */

export const AudioFX = {
  ctx: null as AudioContext | null,

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  },

  playChime() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  },

  playSuccessFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.1);
        osc.stop(this.ctx!.currentTime + idx * 0.1 + 0.3);
      });
    } catch (e) {
      console.warn('Fanfare error', e);
    }
  },

  playTimerBell() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      // Melodic school bell / chime sequence (C5, E5, G5, C6)
      const pitches = [523.25, 659.25, 783.99, 1046.5];
      pitches.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.22);
        gain.gain.setValueAtTime(0.25, this.ctx!.currentTime + idx * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.22 + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.22);
        osc.stop(this.ctx!.currentTime + idx * 0.22 + 0.8);
      });
    } catch (e) {
      console.warn('Timer bell error', e);
    }
  }
};

// Stimmen, die nur Spaß-Effekte machen und nicht zum Lernen taugen
const NOVELTY_VOICES = /albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|organ|superstar|trinoids|whisper|wobble|zarvox|fred|ralph|kathy|jester|grandma|grandpa|rocko|shelley|flo|eddy|reed|sandy|junior/i;

let warnedNoEnglishVoice = false;

/** Beste englische Stimme des Geräts (iPad/Safari nimmt sonst die deutsche Standardstimme). */
function pickEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang) && !NOVELTY_VOICES.test(v.name));
  if (voices.length === 0) return null;
  const score = (v: SpeechSynthesisVoice) =>
    (/^en[-_]gb/i.test(v.lang) ? 3 : /^en[-_]us/i.test(v.lang) ? 2 : 1) * 10 +
    (/premium|enhanced|erweitert/i.test(v.name) ? 5 : 0) +
    (/daniel|samantha|karen|serena|oliver|kate/i.test(v.name) ? 3 : 0) +
    (v.localService ? 1 : 0);
  return voices.sort((a, b) => score(b) - score(a))[0];
}

// Stimmen werden im Browser teils erst nach dem Start geladen
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices());
}

export function speakEnglish(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  // Klammern und "…" nicht mitsprechen, z. B. "Open (adj.)" oder "My name is …"
  const spoken = text.replace(/\([^)]*\)/g, '').replace(/…/g, '').replace(/\s+/g, ' ').trim();
  if (!spoken) return;

  if (synth.speaking || synth.pending) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(spoken);
  const voice = pickEnglishVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = 'en-GB';
    if (!warnedNoEnglishVoice && synth.getVoices().length > 0) {
      warnedNoEnglishVoice = true;
      showStarToast(0, 'Keine englische Stimme gefunden: iPad-Einstellungen › Bedienungshilfen › Gesprochene Inhalte › Stimmen › Englisch');
    }
  }
  utterance.rate = 0.85; // etwas langsamer für Kinder
  synth.speak(utterance);
}

export function triggerConfetti() {
  if (typeof window === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: any[] = [];
  const colors = ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 9 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      gravity: 0.35,
      opacity: 1
    });
  }

  let animationId: number;
  function update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      animationId = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animationId);
      canvas.remove();
    }
  }
  update();
}

export function showStarToast(addedCount: number, message: string = 'Super gemacht!') {
  if (typeof window === 'undefined') return;
  const existing = document.querySelector('.star-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'star-toast animate-bounce';
  toast.innerHTML = `
    <span style="font-size: 1.4rem;">⭐</span>
    <div>
      <div style="font-weight: 800; color: #78350f;">${addedCount > 0 ? `+${addedCount} Stern${addedCount > 1 ? 'e' : ''}!` : 'Toll!'}</div>
      <div style="font-size: 0.85rem; color: #92400e;">${message}</div>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 2200);
}

// Bind to window for legacy onclick handlers if any
if (typeof window !== 'undefined') {
  (window as any).AudioFX = AudioFX;
  (window as any).speakEnglish = speakEnglish;
  (window as any).triggerConfetti = triggerConfetti;
  (window as any).showStarToast = showStarToast;
}
