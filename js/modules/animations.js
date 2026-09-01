export function initAnimations() {
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_HOME = !document.body.classList.contains('page-sub');
  const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
  if (REDUCED) {
    document.querySelectorAll('.anim-clip,.anim-scale,.anim-slide-left,.anim-slide-right,.anim-slide-up,.anim-rotate,.anim-blur,.section--reveal,.cascade-child,.char-reveal').forEach(el => {
      el.style.clipPath = 'none';
      el.style.transform = 'none';
      el.style.opacity = '1';
      el.style.filter = 'none';
    });
    document.querySelectorAll('.clap-divider').forEach(d => d.classList.add('is-visible'));
    document.querySelectorAll('.footer').forEach(f => f.classList.add('is-visible'));
    return;
  }
  if (IS_HOME) {
    const tl = gsap.timeline({ delay: 0.8 });
    tl.from('.hero__typewriter', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' })
      .from('.hero__pre', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('.hero__char', { opacity: 0, y: 100, rotateX: -90, stagger: 0.04, duration: 1, ease: 'back.out(1.7)' }, '-=0.6')
      .from('.hero--sticky .accent-line', { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, '-=0.6')
      .from('.hero__tagline', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.3');
  }
  document.querySelectorAll('.tw-type').forEach(el => el.classList.add('tw-active'));
  gsap.utils.toArray('.highlight').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('revealed'),
      once: true
    });
  });
  document.querySelectorAll('.section--reveal').forEach(section => {
    gsap.to(section, {
      clipPath: 'inset(0 0 0 0)',
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 40%',
        scrub: 0.8,
        onEnter: () => section.classList.add('is-revealed'),
      }
    });
  });
  document.querySelectorAll('.clap-divider').forEach(divider => {
    ScrollTrigger.create({
      trigger: divider,
      start: 'top 88%',
      onEnter: () => divider.classList.add('is-visible'),
      once: true,
    });
  });
  document.querySelectorAll('.accent-line').forEach(el => {
    gsap.fromTo(el, { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 65%', scrub: 0.6 }
    });
  });
  document.querySelectorAll('.section__eyebrow').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', onEnter: () => el.classList.add('is-visible'), once: true },
      opacity: 0, x: -30, duration: 0.7, ease: 'power3.out',
    });
  });
  document.querySelectorAll('.section__heading, .statement__heading, .cta__heading, .page-hero__title').forEach(el => {
    if (!el.querySelector('.char-reveal')) {
      function wrapTextNodes(node) {
        if (node.nodeType === 3) { 
          if (!node.nodeValue.trim()) return;
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < node.nodeValue.length; i++) {
            const ch = node.nodeValue[i];
            if (ch === ' ') {
              fragment.appendChild(document.createTextNode(' '));
            } else {
              const span = document.createElement('span');
              span.className = 'char-reveal';
              span.textContent = ch;
              fragment.appendChild(span);
            }
          }
          node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === 1 && node.tagName !== 'BR') { 
          Array.from(node.childNodes).forEach(wrapTextNodes);
        }
      }
      Array.from(el.childNodes).forEach(wrapTextNodes);
    }
    el.style.opacity = '1';
    el.style.transform = 'none';
    const charEls = el.querySelectorAll('.char-reveal');
    gsap.fromTo(charEls, { opacity: 0, y: 40, rotateX: -60 }, {
      opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.03, ease: 'back.out(1.8)',
      scrollTrigger: {
        trigger: el, start: 'top 88%', toggleActions: 'play none none none',
        onEnter: () => charEls.forEach(c => c.classList.add('is-visible'))
      }
    });
  });
  document.querySelectorAll('.anim-clip').forEach(el => {
    gsap.to(el, { clipPath: 'inset(0 0 0 0)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 55%', scrub: 0.8 } });
  });
  document.querySelectorAll('.anim-scale').forEach(el => {
    gsap.to(el, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 } });
  });
  document.querySelectorAll('.anim-slide-left').forEach(el => {
    gsap.to(el, { x: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 } });
  });
  document.querySelectorAll('.anim-slide-right').forEach(el => {
    gsap.to(el, { x: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 } });
  });
  document.querySelectorAll('.anim-slide-up').forEach(el => {
    gsap.to(el, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 } });
  });
  document.querySelectorAll('.anim-rotate').forEach(el => {
    gsap.to(el, { rotation: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.8 } });
  });
  document.querySelectorAll('.anim-blur').forEach(el => {
    gsap.to(el, { filter: 'blur(0px)', opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 } });
  });
  document.querySelectorAll('.work__item:not(.work--horizontal .work__item)').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%' },
      opacity: 0, y: 50, rotateX: 12, scale: 0.96,
      duration: 0.9, delay: i * 0.12, ease: 'power3.out',
    });
  });
  document.querySelectorAll('.service-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%' },
      opacity: 0, x: -60, rotateY: -8, duration: 0.9, delay: i * 0.08, ease: 'power3.out',
    });
  });
  document.querySelectorAll('.pricing__card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      opacity: 0, y: 50, scale: 0.92, rotateY: 8, duration: 0.8, delay: i * 0.1, ease: 'back.out(1.4)',
    });
  });
  document.querySelectorAll('.process__step').forEach((step, i) => {
    gsap.from(step, {
      scrollTrigger: { trigger: step, start: 'top 88%' },
      opacity: 0, x: -50, rotateY: -5, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
    });
  });
  document.querySelectorAll('.capability').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      opacity: 0, y: 40, scale: 0.9, duration: 0.7, delay: i * 0.08, ease: 'back.out(1.4)',
    });
  });
  document.querySelectorAll('.stat').forEach((stat, i) => {
    gsap.from(stat, {
      scrollTrigger: { trigger: stat, start: 'top 88%' },
      opacity: 0, y: 40, scale: 0.85, duration: 0.7, delay: i * 0.1, ease: 'back.out(1.6)',
    });
  });
  document.querySelectorAll('.contact-links__item').forEach(item => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%' },
      opacity: 0, x: 50, rotateY: 5, duration: 0.9, ease: 'power3.out',
    });
  });
  document.querySelectorAll('.team__group').forEach((group, i) => {
    gsap.from(group, {
      scrollTrigger: { trigger: group, start: 'top 85%' },
      opacity: 0, y: 50, scale: 0.85, duration: 0.9, delay: i * 0.12, ease: 'back.out(1.4)',
    });
  });
  document.querySelectorAll('.cta__btn').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      opacity: 0, y: 40, scale: 0.75, duration: 0.8, ease: 'back.out(2.5)',
    });
  });
  document.querySelectorAll('.statement__text').forEach(el => {
    gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, {
      clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: 1 }
    });
  });
  const footer = document.querySelector('.footer');
  if (footer) {
    ScrollTrigger.create({
      trigger: footer, start: 'top 95%', once: true,
      onEnter: () => {
        footer.classList.add('is-visible');
        const logo = footer.querySelector('.footer__logo');
        if (logo) gsap.from(logo, { opacity: 0, rotation: -180, scale: 0.2, duration: 1.2, ease: 'back.out(1.5)', delay: 0.2 });
        const links = footer.querySelectorAll('.footer__links a');
        if (links.length) gsap.from(links, { opacity: 0, x: 30, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.4 });
      }
    });
  }
  const marquee = document.querySelector('.marquee');
  if (marquee) {
    gsap.from(marquee, { scrollTrigger: { trigger: marquee, start: 'top 92%' }, opacity: 0, scaleX: 0.7, duration: 1.2, ease: 'power3.out' });
  }
  document.querySelectorAll('.work__num').forEach(el => {
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, opacity: 0, scale: 2.5, rotation: -15, duration: 0.7, ease: 'back.out(2)' });
  });
  document.querySelectorAll('.scroll-highlight').forEach(el => {
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => el.classList.add('is-highlighted') });
  });
  const reel = document.querySelector('.reel__wrap');
  if (reel) {
    gsap.from(reel, { scrollTrigger: { trigger: reel, start: 'top 88%' }, opacity: 0, y: 50, scale: 0.96, rotateX: 8, duration: 1.2, ease: 'power3.out' });
  }
  document.querySelectorAll('.aero-window').forEach((win, i) => {
    gsap.from(win, { scrollTrigger: { trigger: win, start: 'top 88%' }, opacity: 0, y: 60, scale: 0.94, duration: 0.9, delay: i * 0.1, ease: 'power3.out' });
  });
  const progress = document.querySelector('#scrollProgress');
  if (progress) {
    ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => { progress.style.boxShadow = self.progress > 0.95 ? '0 0 16px 3px rgba(42, 122, 122, 0.6)' : 'none'; }
    });
  }
  const aboutMask = document.querySelector('#aboutCinematicMask');
  if (aboutMask && !REDUCED) {
    ScrollTrigger.create({
      trigger: aboutMask,
      start: 'top 75%',
      onEnter: () => aboutMask.classList.add('is-revealed')
    });
  }

  initHorizontalWork(gsap, ScrollTrigger, REDUCED, IS_MOBILE);
  initTrippy(gsap, REDUCED);
  initJourneyRoad(gsap, ScrollTrigger, REDUCED);
  initGalleryParallax(REDUCED);
}
export function initSmartNav() {
  const nav = document.querySelector('#nav');
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!nav || REDUCED) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) nav.classList.add('nav--scrolled');
    else nav.classList.remove('nav--scrolled');
  }, { passive: true });
}
export function initScrollProgress() {
  const progress = document.querySelector('#scrollProgress');
  function update() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? y / max : 0;
    if (progress) {
      progress.style.transform = `scaleX(${ratio})`;
      if (ratio > 0.01 && ratio < 0.99) progress.classList.add('has-glow');
      else progress.classList.remove('has-glow');
    }
    if (y > 80) document.body.classList.add('is-scrolled');
    else document.body.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
function scrambleText(el, finalText, startDelay) {
  let iterations = 0;
  const maxIter = finalText.length * 3;
  const startDelayMs = (startDelay || 0) * 1000;
  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent = finalText.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < Math.floor(iterations / 3)) return finalText[i];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join('');
      iterations++;
      if (iterations > maxIter) { el.textContent = finalText; clearInterval(interval); }
    }, 35);
  }, startDelayMs);
}
export function initScrambleHover() {
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!FINE_POINTER) return;
  document.querySelectorAll('.menu-overlay__link, .footer__links a, .nav__logo-text').forEach(el => {
    const orig = el.dataset.scrambleOrig || el.textContent.trim();
    el.dataset.scrambleOrig = orig;
    let timer = null;
    el.addEventListener('mouseenter', () => { clearTimeout(timer); scrambleText(el, orig, 0); });
  });
  document.querySelectorAll('.work__client').forEach(el => {
    const orig = el.dataset.scrambleOrig || el.textContent.trim();
    el.dataset.scrambleOrig = orig;
    el.addEventListener('mouseenter', () => scrambleText(el, orig, 0));
  });
}
export function initLadderJourney() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  const items = document.querySelectorAll('.journey__item, .timeline__item, .process__step');
  if (!items.length) return;
  items.forEach((item) => {
    const num = item.querySelector('.process__num, .journey__num, .timeline__num');
    const content = item.querySelector('.process__name, .journey__title, .timeline__title');
    const desc = item.querySelector('.process__desc, .journey__desc, .timeline__desc');
    const tl = window.gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 80%', once: true } });
    if (num) tl.from(num, { y: 60, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0);
    if (item.querySelector('.ladder__line')) tl.from(item.querySelector('.ladder__line'), { scaleY: 0, transformOrigin: 'top', duration: 0.8, ease: 'power2.inOut' }, 0.2);
    if (content) tl.from(content, { x: -40, opacity: 0, duration: 0.55, ease: 'power3.out' }, 0.15);
    if (desc) tl.from(desc, { x: -30, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.3);
  });
  document.querySelectorAll('.process__step::before, .journey__connector').forEach(c => {
    window.gsap.from(c, { scaleY: 0, transformOrigin: 'top', duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: c, start: 'top 85%', once: true } });
  });
}
export function initCounters() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.stat__num').forEach(el => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    const obj = { val: 0 };
    window.gsap.to(obj, {
      val: target, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
    });
  });
}
export function initParallax() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-speed]').forEach(el => {
    const speed = parseFloat(el.dataset.speed);
    if (!speed || speed === 1) return;
    window.gsap.to(el, {
      yPercent: (1 - speed) * 50, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}
function initHorizontalWork(gsap, ScrollTrigger, REDUCED, IS_MOBILE) {
  if (REDUCED || IS_MOBILE) return;
  const section = document.querySelector('.work--horizontal');
  if (!section) return;
  const grid = section.querySelector('.work__grid');
  if (!grid) return;
  function getScrollAmount() {
    const scrollW = grid.scrollWidth;
    const winW = window.innerWidth;
    if (scrollW <= winW) return 0;
    return -(scrollW - winW + 100); 
  }
  function updateHeight() {
    const amt = getScrollAmount();
    if (amt === 0) {
      section.style.height = 'auto';
    } else {
      section.style.height = `${Math.abs(amt) + window.innerHeight}px`;
    }
  }
  updateHeight();
  window.addEventListener('resize', updateHeight);
  const tween = gsap.to(grid, { x: getScrollAmount, ease: 'none' });
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    animation: tween,
    invalidateOnRefresh: true
  });
}
function initTrippy(gsap, REDUCED) {
  const wrap = document.querySelector('.hero-wrap');
  const container = document.querySelector('#trippyFrames');
  const heroContent = document.querySelector('.hero__content');
  if (!wrap || !container || REDUCED) return;
  const colors = ['var(--ink)', 'var(--paper)'];
  let parent = container;
  for (let i = 0; i < 20; i++) {
    const div = document.createElement('div');
    div.className = 'trippy__frame';
    div.style.background = colors[i % 2];
    div.style.padding = '2vmin';
    parent.appendChild(div);
    parent = div;
  }
  const frames = container.querySelectorAll('.trippy__frame');
  const tl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
  tl.to(container, { top: '0%', ease: 'none' }, 0);
  tl.to(heroContent, { opacity: 0, ease: 'none' }, 0);
  tl.to(frames, { scale: 1, rotate: '0deg', duration: 0.25, ease: 'none' }, 0);
  tl.to(frames, { scale: 0.9, rotate: '30deg', duration: 0.55, ease: 'none' }, 0.25);
  tl.to(frames, { scale: 1.25, rotate: '60deg', duration: 0.2, ease: 'none' }, 0.8);
}

function initJourneyRoad(gsap, ScrollTrigger, REDUCED) {
  if (REDUCED) return;
  const container = document.querySelector('#journey3dSection');
  if (!container) return;
  
  const billboards = document.querySelectorAll('.billboard');
  const roadGrid = document.querySelector('#roadGrid');
  
  // Total scroll distance depends on the number of items. 
  // Let's give each item 3000px of scroll space for a very smooth sequence.
  const endZ = billboards.length * 3000;
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${endZ}`,
      scrub: 1,
      pin: true,
    }
  });

  // Animate the road infinitely over the total duration of the sequence
  // Each item takes exactly 4.9 seconds of timeline time.
  const totalDuration = billboards.length * 4.9;
  tl.to(roadGrid, {
    backgroundPositionY: `${endZ}px`,
    ease: 'none',
    duration: totalDuration
  }, 0);
  
  // Sequence each billboard
  let time = 0;
  billboards.forEach((b, i) => {
    const content = b.querySelector('.billboard__content');
    const photo = b.querySelector('.billboard__photo');
    
    // Hide content initially via JS just in case
    gsap.set(content, { opacity: 0, y: 30 });
    gsap.set(photo, { opacity: 0, scale: 0.8 });
    
    // 1. Pull to center & fade in photo
    tl.to(b, {
      '--x': '0vw',
      '--y': '0vh',
      '--z': '0',
      '--rX': '0deg',
      '--rY': '0deg',
      '--rZ': '0deg',
      duration: 1,
      ease: 'power2.out'
    }, time);
    
    tl.to(photo, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, time);
    
    time += 0.8; // overlap slightly
    
    // 2. Fade in text
    tl.to(content, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, time);
    
    time += 1.2; // hold for reading
    
    // 3. Fade out everything and push out of the way
    tl.to(b, {
      opacity: 0,
      '--z': '-1000', // push past camera
      filter: 'blur(20px)',
      duration: 0.8,
      ease: 'power2.in'
    }, time);
    
    time += 0.6; // move to next
  });
}

function initGalleryParallax(REDUCED) {
  if (REDUCED) return;
  const cards = document.querySelectorAll('.work__item');
  if (!cards.length) return;
  
  cards.forEach(card => {
    const bg = card.querySelector('.work__item-bg img');
    if (!bg) return;
    
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const xPct = x / (rect.width / 2);
      const yPct = y / (rect.height / 2);
      
      // Tilt card
      card.style.transform = `perspective(1000px) rotateY(${xPct * 8}deg) rotateX(${yPct * -8}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.zIndex = '10';
      
      // Pan image
      bg.style.transform = `scale(1.15) translate3d(${xPct * -15}px, ${yPct * -15}px, 0)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
      card.style.zIndex = '1';
      bg.style.transform = `scale(1) translate3d(0, 0, 0)`;
      setTimeout(() => {
        card.style.transform = '';
        bg.style.transform = '';
      }, 400); // allow transition to finish
    });
  });
}