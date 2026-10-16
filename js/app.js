/* ==========================================================================
   APP CONTROLLER & INTERACTIVITY
   Sound synthesis, Confetti, Timetable rendering, Packlist logic
   ========================================================================== */

// Pleasant Web Audio synthesizer for kid-friendly sounds
const AudioFX = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playChime() {
    try {
      this.init();
      if (!this.ctx) return;
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
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.3);
      });
    } catch (e) {
      console.warn('Fanfare error', e);
    }
  }
};

// Text-to-speech for English words
function speakEnglish(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // slightly slower for kids
    window.speechSynthesis.speak(utterance);
  }
}

// Canvas Confetti
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
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

  let animationId;
  function update() {
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

// Star Toast
function showStarToast(amount = 1, message = 'Super gemacht, Jamie!') {
  let toast = document.querySelector('.star-reward-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'star-reward-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>⭐ +${amount} Stern!</span> <span>${message}</span>`;
  toast.classList.add('show');
  AudioFX.playChime();
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Update stars display
  function refreshStars() {
    const starEl = document.getElementById('jamie-star-count');
    if (starEl) {
      starEl.textContent = StorageService.getStars();
    }
  }
  refreshStars();
  window.addEventListener('jamie-storage-update', refreshStars);

  // Determine current day of week (1: Monday .. 5: Friday, else default to Monday)
  const currentDayNum = new Date().getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  let activeDayKey = 'montag';
  if (currentDayNum === 2) activeDayKey = 'dienstag';
  else if (currentDayNum === 3) activeDayKey = 'mittwoch';
  else if (currentDayNum === 4) activeDayKey = 'donnerstag';
  else if (currentDayNum === 5) activeDayKey = 'freitag';

  // Render hero banner day indicator
  const todayBadge = document.getElementById('hero-today-name');
  const todayCount = document.getElementById('hero-today-count');
  if (todayBadge && todayCount) {
    const todayInfo = SCHEDULE_DATA[activeDayKey];
    todayBadge.textContent = todayInfo.name;
    todayCount.textContent = `${todayInfo.lessons.length} Schulstunden heute`;
  }

  // Active view state: 'week' | 'day' | 'ranzen'
  let currentView = 'week';
  let selectedTabDay = activeDayKey;

  // Render Day Tabs
  const tabsContainer = document.getElementById('day-tabs-container');
  if (tabsContainer) {
    tabsContainer.innerHTML = '';
    Object.keys(SCHEDULE_DATA).forEach(dayKey => {
      const day = SCHEDULE_DATA[dayKey];
      const btn = document.createElement('button');
      btn.className = `day-tab-btn ${dayKey === selectedTabDay ? 'active' : ''} ${dayKey === activeDayKey ? 'today-indicator' : ''}`;
      btn.innerHTML = `
        <span class="day-tab-name">${day.name}</span>
        <span class="day-tab-sub">${day.lessons.length} Stunden</span>
      `;
      btn.addEventListener('click', () => {
        selectedTabDay = dayKey;
        document.querySelectorAll('.day-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (currentView === 'day') {
          renderSingleDayView(selectedTabDay);
        }
        renderRanzenPackliste(selectedTabDay);
      });
      tabsContainer.appendChild(btn);
    });
  }

  // View Switchers
  const btnViewWeek = document.getElementById('btn-view-week');
  const btnViewDay = document.getElementById('btn-view-day');
  const btnViewRanzen = document.getElementById('btn-view-ranzen');

  function setView(view) {
    currentView = view;
    [btnViewWeek, btnViewDay, btnViewRanzen].forEach(b => b && b.classList.remove('active'));
    const weekEl = document.getElementById('timetable-week-view');
    const dayEl = document.getElementById('timetable-day-view');
    const ranzenEl = document.getElementById('ranzen-packliste-wrapper');

    if (view === 'week') {
      btnViewWeek && btnViewWeek.classList.add('active');
      if (weekEl) weekEl.style.display = 'grid';
      if (dayEl) dayEl.style.display = 'none';
      if (ranzenEl) ranzenEl.scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'day') {
      btnViewDay && btnViewDay.classList.add('active');
      if (weekEl) weekEl.style.display = 'none';
      if (dayEl) dayEl.style.display = 'block';
      renderSingleDayView(selectedTabDay);
    } else if (view === 'ranzen') {
      btnViewRanzen && btnViewRanzen.classList.add('active');
      const ranzenSection = document.getElementById('schulranzen-section');
      if (ranzenSection) ranzenSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (btnViewWeek) btnViewWeek.addEventListener('click', () => setView('week'));
  if (btnViewDay) btnViewDay.addEventListener('click', () => setView('day'));
  if (btnViewRanzen) btnViewRanzen.addEventListener('click', () => setView('ranzen'));

  // Render Full Weekly Grid
  const weekGrid = document.getElementById('timetable-week-view');
  if (weekGrid) {
    weekGrid.innerHTML = '';
    Object.keys(SCHEDULE_DATA).forEach(dayKey => {
      const day = SCHEDULE_DATA[dayKey];
      const isToday = dayKey === activeDayKey;
      const col = document.createElement('div');
      col.className = `day-column ${isToday ? 'is-today' : ''}`;
      
      let lessonsHtml = '';
      let lessonCounter = 1;
      
      LESSON_TIMES.forEach(timeSlot => {
        if (timeSlot.isBreak) {
          lessonsHtml += `
            <div class="break-indicator" title="${timeSlot.title}">
              <span>${timeSlot.title}</span>
              <span>(${timeSlot.start} - ${timeSlot.end})</span>
            </div>
          `;
        } else {
          const lesson = day.lessons.find(l => l.num === timeSlot.num);
          if (lesson) {
            const subjMeta = SUBJECT_DETAILS[lesson.subject] || {
              icon: '📝',
              class: 'lesson-mathe',
              description: 'Unterricht'
            };
            lessonsHtml += `
              <div class="lesson-card ${subjMeta.class}" data-day="${day.name}" data-subject="${lesson.subject}" onclick="openLessonModal('${lesson.subject}', '${day.name}', ${lesson.num}, '${timeSlot.start} - ${timeSlot.end}')">
                <div class="lesson-num">${lesson.num}</div>
                <div class="lesson-info">
                  <div class="lesson-name">${lesson.subject}</div>
                  <div class="lesson-time">${timeSlot.start} - ${timeSlot.end}</div>
                </div>
                <div class="lesson-icon">${subjMeta.icon}</div>
              </div>
            `;
          }
        }
      });

      col.innerHTML = `
        <div class="day-col-header">
          <div class="day-col-title">${day.name}</div>
          <div class="day-col-hours">${day.lessons.length} Stunden • ${day.short}</div>
        </div>
        <div class="lessons-list">
          ${lessonsHtml}
        </div>
      `;
      weekGrid.appendChild(col);
    });
  }

  // Render Single Day View
  function renderSingleDayView(dayKey) {
    const dayEl = document.getElementById('timetable-day-view');
    if (!dayEl) return;
    const day = SCHEDULE_DATA[dayKey];
    let cardsHtml = '';
    
    LESSON_TIMES.forEach(slot => {
      if (slot.isBreak) {
        cardsHtml += `
          <div class="break-indicator" style="margin: 0.75rem 0; font-size: 0.9rem; padding: 0.75rem;">
            <span>${slot.title} (${slot.start} - ${slot.end})</span>
          </div>
        `;
      } else {
        const lesson = day.lessons.find(l => l.num === slot.num);
        if (lesson) {
          const meta = SUBJECT_DETAILS[lesson.subject] || { icon: '📝', class: 'lesson-mathe', description: '' };
          cardsHtml += `
            <div class="lesson-card ${meta.class}" style="padding: 1.15rem; margin-bottom: 0.85rem;" onclick="openLessonModal('${lesson.subject}', '${day.name}', ${lesson.num}, '${slot.start} - ${slot.end}')">
              <div class="lesson-num" style="width: 38px; height: 38px; font-size: 1.1rem;">${lesson.num}</div>
              <div class="lesson-info" style="margin-left: 0.5rem;">
                <div class="lesson-name" style="font-size: 1.25rem;">${lesson.subject}</div>
                <div class="lesson-time" style="font-size: 0.88rem;">Uhrzeit: ${slot.start} - ${slot.end}</div>
                <div style="font-size: 0.85rem; opacity: 0.9; margin-top: 0.25rem;">${meta.description}</div>
              </div>
              <div class="lesson-icon" style="font-size: 2.2rem;">${meta.icon}</div>
            </div>
          `;
        }
      }
    });

    dayEl.innerHTML = `
      <div style="background: white; border-radius: 20px; border: 2px solid #e0e7ff; padding: 1.75rem; box-shadow: var(--shadow-md); max-width: 650px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.7rem; font-weight: 800; color: #1e293b;">${day.name}</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem;">${day.motto}</p>
          </div>
          <span style="background: #eef2ff; color: #4338ca; padding: 0.4rem 0.9rem; border-radius: 9999px; font-weight: 800; font-size: 0.85rem;">
            ${day.lessons.length} Stunden
          </span>
        </div>
        <div>${cardsHtml}</div>
      </div>
    `;
  }

  // Render Ranzen Packliste
  function renderRanzenPackliste(dayKey) {
    const container = document.getElementById('ranzen-items-container');
    const dayTitleEl = document.getElementById('ranzen-day-name');
    const successBanner = document.getElementById('ranzen-success');
    if (!container) return;

    const day = SCHEDULE_DATA[dayKey];
    if (dayTitleEl) {
      dayTitleEl.textContent = `Packliste für ${day.name}`;
    }

    // Collect all required items
    const requiredItems = new Set(BASE_RANZEN_ITEMS);
    day.lessons.forEach(l => {
      const meta = SUBJECT_DETAILS[l.subject];
      if (meta && meta.pack) {
        meta.pack.forEach(p => requiredItems.add(p));
      }
    });

    const packedList = StorageService.getPackedItems(dayKey);
    container.innerHTML = '';

    const itemsArray = Array.from(requiredItems);
    itemsArray.forEach((itemText, idx) => {
      const isChecked = packedList.includes(itemText);
      const itemEl = document.createElement('div');
      itemEl.className = `check-item ${isChecked ? 'checked' : ''}`;
      itemEl.innerHTML = `
        <div class="check-box">${isChecked ? '✓' : ''}</div>
        <span class="check-label">${itemText}</span>
      `;

      itemEl.addEventListener('click', () => {
        let currentPacked = StorageService.getPackedItems(dayKey);
        if (currentPacked.includes(itemText)) {
          currentPacked = currentPacked.filter(i => i !== itemText);
          itemEl.classList.remove('checked');
          itemEl.querySelector('.check-box').textContent = '';
        } else {
          currentPacked.push(itemText);
          itemEl.classList.add('checked');
          itemEl.querySelector('.check-box').textContent = '✓';
          AudioFX.playChime();
        }
        StorageService.setPackedItems(dayKey, currentPacked);

        // Check if all items packed!
        if (currentPacked.length === itemsArray.length) {
          if (successBanner) successBanner.style.display = 'block';
          triggerConfetti();
          AudioFX.playSuccessFanfare();
          StorageService.addStars(2);
          showStarToast(2, 'Ranzen komplett gepackt! 🎒✨');
        } else {
          if (successBanner) successBanner.style.display = 'none';
        }
      });

      container.appendChild(itemEl);
    });

    if (successBanner) {
      successBanner.style.display = packedList.length === itemsArray.length && itemsArray.length > 0 ? 'block' : 'none';
    }
  }

  // Initial render of packlist
  renderRanzenPackliste(selectedTabDay);
});

// Modal Logic for clicking a lesson
function openLessonModal(subject, dayName, lessonNum, timeRange) {
  const modal = document.getElementById('lesson-detail-modal');
  const modalBody = document.getElementById('modal-lesson-body');
  if (!modal || !modalBody) return;

  const meta = SUBJECT_DETAILS[subject] || {
    icon: '📚',
    description: 'Schulfach',
    pack: ['Mappe & Schreibzeug']
  };

  let subpageLink = '';
  if (subject === 'Englisch') {
    subpageLink = `<a href="englisch.html" class="btn-trainer btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center;">🇬🇧 Jetzt Englisch Vokabeln üben!</a>`;
  } else if (subject === 'Mathe') {
    subpageLink = `<a href="mathe.html" class="btn-trainer btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center;">🔢 Jetzt Mathe Kopfrechnen trainieren!</a>`;
  } else if (subject === 'Deutsch') {
    subpageLink = `<a href="deutsch.html" class="btn-trainer btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center;">📖 Jetzt Deutsch Lernkarten öffnen!</a>`;
  }

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 1.25rem;">
      <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">${meta.icon}</div>
      <h2 style="font-size: 1.8rem; font-weight: 900; color: #0f172a;">${subject}</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; font-weight: 600;">${dayName} • ${lessonNum}. Stunde (${timeRange})</p>
    </div>
    
    <div style="background: #f8fafc; border-radius: 12px; padding: 1.15rem; margin-bottom: 1.25rem; border: 1px solid #e2e8f0;">
      <h4 style="font-size: 0.95rem; font-weight: 800; color: #334155; margin-bottom: 0.4rem;">Worum geht's?</h4>
      <p style="font-size: 0.92rem; color: #64748b;">${meta.description}</p>
    </div>

    <div style="background: #fffbeb; border-radius: 12px; padding: 1.15rem; margin-bottom: 1rem; border: 1px solid #fef3c7;">
      <h4 style="font-size: 0.95rem; font-weight: 800; color: #b45309; margin-bottom: 0.4rem;">Was gehört in den Ranzen?</h4>
      <ul style="padding-left: 1.2rem; font-size: 0.9rem; color: #78350f;">
        ${meta.pack.map(p => `<li style="margin-bottom: 0.25rem;">${p}</li>`).join('')}
      </ul>
    </div>

    ${subpageLink}
  `;

  modal.classList.add('active');
}

function closeLessonModal() {
  const modal = document.getElementById('lesson-detail-modal');
  if (modal) modal.classList.remove('active');
}

window.openLessonModal = openLessonModal;
window.closeLessonModal = closeLessonModal;
window.AudioFX = AudioFX;
window.speakEnglish = speakEnglish;
window.triggerConfetti = triggerConfetti;
window.showStarToast = showStarToast;
