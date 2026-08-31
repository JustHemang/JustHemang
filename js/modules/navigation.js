export function initMenu() {
  const fab = document.querySelector('#menuBtn') || document.querySelector('#menuFab');
  const overlay = document.querySelector('#menuOverlay');
  if (!fab || !overlay) return;
  const links = overlay.querySelectorAll('.menu-overlay__link');
  let isOpen = false;
  links.forEach((link, i) => {
    link.dataset.idx = i;
  });
  let rail = overlay.querySelector('.menu-overlay__rail');
  if (!rail) {
    rail = document.createElement('div');
    rail.className = 'menu-overlay__rail';
    overlay.insertBefore(rail, overlay.firstChild);
  } else {
    rail.innerHTML = '';
  }
  links.forEach((link, i) => {
    const num = document.createElement('span');
    num.className = 'menu-overlay__rail-num';
    num.textContent = String(i + 1).padStart(2, '0');
    rail.appendChild(num);
  });
  function openMenu() {
    isOpen = true;
    fab.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
    if (typeof window.gsap !== 'undefined') {
      links.forEach((link, i) => {
        window.gsap.fromTo(link,
          { opacity: 0, y: 80, skewY: 6 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.7, delay: 0.12 + i * 0.07, ease: 'power4.out' }
        );
      });
      window.gsap.from('.menu-overlay__foot a', { opacity: 0, y: 20, stagger: 0.06, duration: 0.5, delay: 0.5, ease: 'power3.out' });
    }
  }
  function closeMenu() {
    isOpen = false;
    fab.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
    if (typeof window.gsap !== 'undefined') {
      window.gsap.to(links, { opacity: 0, y: -30, skewY: -4, stagger: 0.04, duration: 0.35, ease: 'power3.in',
        onComplete: () => {
          overlay.classList.remove('open');
          overlay.setAttribute('aria-hidden', 'true');
          window.gsap.set(links, { opacity: 0, y: 80, skewY: 6 });
        }
      });
    } else {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }
  links.forEach((link) => {
    link.dataset.originalText = link.textContent.trim();
    link.setAttribute('aria-label', link.dataset.originalText);
  });
  fab.addEventListener('click', () => isOpen ? closeMenu() : openMenu());
  links.forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) closeMenu(); });
}
export function initPageTransition() {
  const overlay = document.querySelector('#pageTransition');
  if (!overlay) return;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) { 
    overlay.style.display = 'none'; 
    return; 
  }
  const bars = overlay.querySelectorAll('.pt-bar');
  const circle = overlay.querySelector('.pt-circle');
  window.gsap.set(bars, { xPercent: 0 });
  if (circle) window.gsap.set(circle, { scale: 0 });
  window.gsap.to(bars, { xPercent: 100, stagger: 0.05, duration: 0.6, ease: 'power3.inOut', delay: 0.1 });
  if (circle) window.gsap.to(circle, { scale: 80, duration: 0.4, ease: 'power2.in', delay: 0.1 });
  setTimeout(() => { overlay.style.display = 'none'; }, 900);
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.target === '_blank') return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = new URL(href, location.href).href;
      if (url === location.href) return;
      const fab = document.querySelector('#menuBtn');
      const overlayEl = document.querySelector('#menuOverlay');
      if (fab && overlayEl && overlayEl.classList.contains('open')) {
        fab.classList.remove('open');
        overlayEl.classList.remove('open');
        overlayEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
      }
      overlay.style.display = 'flex';
      overlay.style.pointerEvents = 'all';
      window.gsap.set(bars, { xPercent: -100 });
      if (circle) window.gsap.set(circle, { scale: 0 });
      window.gsap.to(bars, { xPercent: 0, stagger: 0.04, duration: 0.45, ease: 'power3.inOut' });
      if (circle) window.gsap.to(circle, { scale: 80, duration: 0.3, ease: 'power2.in' });
      setTimeout(() => { location.href = url; }, 700);
    });
  });
}