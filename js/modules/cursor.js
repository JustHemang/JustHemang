export function initCursor() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!FINE_POINTER || REDUCED) return null;
  document.body.classList.add('has-cursor');
  const dot = document.querySelector('#cursorDot');
  const cursorRing = document.querySelector('#cursorRing');
  if (!dot || !cursorRing) return null;
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; 
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });
  window.addEventListener('mousedown', () => cursorRing.classList.add('is-down'));
  window.addEventListener('mouseup', () => cursorRing.classList.remove('is-down'));
  const interactiveSel = 'a, button, input, textarea, .work__item, .service-item, .capability, .pricing__card, .menu-overlay__link, .cta__btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSel)) {
      cursorRing.classList.add('is-active');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSel)) {
      cursorRing.classList.remove('is-active');
    }
  });
  return function renderCursor() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
  };
}
export function initMagneticButtons() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!FINE_POINTER || REDUCED) return;
  const magneticElements = document.querySelectorAll('.cta__btn, .nav__menu-btn');
  magneticElements.forEach((el) => {
    el.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)';
    const inner = el.querySelector('span');
    if (inner) inner.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)';
    el.addEventListener('mousemove', function(e) {
      this.style.transition = 'none';
      if (inner) inner.style.transition = 'none';
      const rect = this.getBoundingClientRect();
      const h = rect.width / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - (rect.height / 2);
      this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      if (inner) {
        inner.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      }
    });
    el.addEventListener('mouseleave', function() {
      this.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)';
      if (inner) inner.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)';
      this.style.transform = `translate(0px, 0px)`;
      if (inner) {
        inner.style.transform = `translate(0px, 0px)`;
      }
    });
  });
}