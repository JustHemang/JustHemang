export function initTimecode() {
  const el = document.querySelector('#timecodeValue');
  if (!el) return;
  const start = performance.now();
  let prevFrame = -1;
  function loop() {
    const elapsed = performance.now() - start;
    const f = Math.floor(elapsed / (1000 / 24)) % 24;
    if (f !== prevFrame) {
      prevFrame = f;
      const totalSec = Math.floor(elapsed / 1000);
      const s = totalSec % 60;
      const m = Math.floor(totalSec / 60) % 60;
      const h = Math.floor(totalSec / 3600);
      el.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ':' + String(f).padStart(2, '0');
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
export function initFilmstrip() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) return;
  const track = document.querySelector('#filmstripTrack');
  if (!track) return;
  const clone = track.innerHTML;
  track.innerHTML += clone;
}
export function initTypewriter() {
  const el = document.querySelector('#heroTypewriter');
  const IS_HOME = !document.body.classList.contains('page-sub');
  if (!el || !IS_HOME) return;
  const phrases = [
    'Freelance Video Editor',
    'Frontend Developer',
    'President of OPCODE',
    'Founder of Kaelor Media',
    'Creative Director',
    'Motion Graphics Artist',
    'Color Grading Specialist',
  ];
  let pi = 0, ci = 0, deleting = false, delay = 80;
  el.innerHTML = '<span class="tw-cursor"></span>';
  const cursor = el.querySelector('.tw-cursor');
  function tick() {
    const current = phrases[pi];
    if (!deleting) {
      ci++;
      if (ci > current.length) { deleting = true; delay = 1800; }
    } else {
      ci--;
      if (ci < 0) { ci = 0; deleting = false; pi = (pi + 1) % phrases.length; delay = 200; }
    }
    el.textContent = current.substring(0, ci);
    el.appendChild(cursor);
    setTimeout(tick, deleting ? 35 : delay);
  }
  setTimeout(tick, 1200);
}
export function initTechChars() {
  const container = document.querySelector('#techChars');
  if (!container) return;
  const chars = ['{0,1}', '</>', '0xFF', '>>>', '&&', '===', 'npm', 'git', '{}', '[]', '=>', '##', '@@', '**', '++', '--', '&&', '||', '!'];
  for (let i = 0; i < 18; i++) {
    const span = document.createElement('span');
    span.className = 'tech-char';
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.animationDuration = (6 + Math.random() * 10) + 's';
    span.style.animationDelay = (Math.random() * 12) + 's';
    span.style.fontSize = (.5 + Math.random() * .5) + 'rem';
    container.appendChild(span);
  }
}
export function initLiveClock() {
  const el = document.querySelector('#liveClock');
  if (!el) return;
  function update() {
    const now = new Date();
    el.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}
export function initTabs() {
  document.querySelectorAll('.services-tabs__btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.services-tabs__btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.services-tabs__panel').forEach(function(p) { p.classList.remove('active'); });
      btn.classList.add('active');
      const panel = document.querySelector('#tab-' + tab);
      if (panel) panel.classList.add('active');
    });
  });
}
export function initClimber() {
  const grid = document.querySelector('#expGrid');
  const climber = document.querySelector('#climber');
  const img = document.querySelector('#climberImg');
  const yearEl = document.querySelector('#expYear');
  const altEl = document.querySelector('#expAlt');
  const cards = document.querySelectorAll('.exp-card');
  const rungs = document.querySelectorAll('.ladder__rung');
  if (!grid || !climber) return;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FRAMES = 17;
  const sprites = [];
  for (let i = 1; i <= FRAMES; i++) {
    const src = `https://hemang.vercel.app/assets/sprite/sprite-${String(i).padStart(3, '0')}.png`;
    const pre = new Image();
    pre.src = src;
    sprites.push(src);
  }
  let ticking = false;
  function update() {
    ticking = false;
    const rect = grid.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.6;
    let p = (window.innerHeight * 0.55 - rect.top) / Math.max(total, 1);
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    const climbBottom = 2 + p * 68;
    climber.style.bottom = `${climbBottom}%`;
    if (!REDUCED) {
      const frame = Math.floor(p * 64) % FRAMES;
      img.src = sprites[frame];
    }
    if (altEl) altEl.textContent = String(Math.round(p * 847)).padStart(3, '0');
    rungs.forEach(function(rung, i) {
      const rungPos = (i / Math.max(rungs.length - 1, 1)) * 100;
      if (climbBottom >= rungPos) {
        rung.classList.add('active');
      } else {
        rung.classList.remove('active');
      }
    });
    let best = null, bestD = Infinity;
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
      if (d < bestD) { bestD = d; best = card; }
      card.classList.remove('active');
    });
    if (best) {
      best.classList.add('active');
      if (yearEl && yearEl.textContent !== best.dataset.year) {
        yearEl.textContent = best.dataset.year;
      }
    }
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}
export function initWaveformAnim() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) return;
  const bars = document.querySelectorAll('.waveform__bar');
  if (!bars.length) return;
  function randomizeWaveform() {
    bars.forEach(function(bar) {
      const targetH = Math.floor(4 + Math.random() * 22);
      if (typeof window.gsap !== 'undefined') {
        window.gsap.to(bar, {
          height: targetH + 'px',
          duration: 0.2 + Math.random() * 0.25,
          ease: 'power1.inOut'
        });
      } else {
        bar.style.height = targetH + 'px';
      }
    });
  }
  setInterval(randomizeWaveform, 200);
}