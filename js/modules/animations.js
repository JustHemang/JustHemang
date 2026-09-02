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
  initHorizontalMuseum();
  initGalleryParallax(REDUCED);
  initKineticAccordion();
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

export function initHorizontalMuseum() {
  const section = document.querySelector('.film-strip-section');
  if (!section) return;
  
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  
  const track = section.querySelector('.film-strip-track');
  const frames = track.querySelectorAll('.film-frame');
  
  // Calculate total scroll width
  let totalWidth = 0;
  frames.forEach(f => {
    totalWidth += f.offsetWidth + parseFloat(window.getComputedStyle(f).marginRight || 0);
  });
  
  gsap.to(track, {
    x: () => -(totalWidth - window.innerWidth + (window.innerWidth * 0.1)),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 1,
      end: () => '+=' + totalWidth,
      invalidateOnRefresh: true
    }
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

function initKineticAccordion() {
  const items = document.querySelectorAll('.k-item');
  const bgs = document.querySelectorAll('.k-bg');
  
  if (!items.length || !bgs.length) return;

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const bgId = item.getAttribute('data-bg');
      bgs.forEach(bg => {
        if (bg.classList.contains('k-bg--' + bgId)) {
          bg.classList.add('active');
        } else {
          bg.classList.remove('active');
        }
      });
    });
  });

  // Activate first one by default if not mobile
  if (window.innerWidth > 768 && items[0]) {
    const firstBgId = items[0].getAttribute('data-bg');
    const firstBg = document.querySelector('.k-bg--' + firstBgId);
    if (firstBg) firstBg.classList.add('active');
  }
}

export function initInteractiveCanvas() {
  const canvas = document.querySelector('#about.interactive-canvas');
  if (!canvas) return;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  // Kinetic Background text shifting on mouse move
  const bgText = canvas.querySelector('.canvas-bg');
  if (bgText) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      gsap.to(bgText, {
        x: x,
        y: y,
        duration: 1,
        ease: 'power2.out'
      });
    });
  }

  // Hover Image Reveal
  const reveals = document.querySelectorAll('.hover-reveal');
  const imgContainer = document.getElementById('hoverImageContainer');
  const imgDisplay = document.getElementById('hoverImageDisplay');

  if (reveals.length && imgContainer && imgDisplay) {
    // Make container follow mouse
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (imgContainer.classList.contains('is-visible')) {
        gsap.to(imgContainer, {
          left: mouseX,
          top: mouseY,
          duration: 0.6,
          ease: 'power3.out'
        });
      }
    });

    reveals.forEach(rev => {
      rev.addEventListener('mouseenter', () => {
        const imgSrc = rev.getAttribute('data-img');
        if (imgSrc) {
          imgDisplay.src = imgSrc;
          imgContainer.classList.add('is-visible');
          // Instantly snap to current mouse pos when appearing
          gsap.set(imgContainer, { left: mouseX, top: mouseY });
        }
      });
      rev.addEventListener('mouseleave', () => {
        imgContainer.classList.remove('is-visible');
      });
    });
  }

  // Number Counter Stats
  const stats = document.querySelectorAll('.c-stat');
  stats.forEach(stat => {
    const valSpan = stat.querySelector('.counter-val');
    const target = parseInt(stat.getAttribute('data-target') || '0', 10);
    if (!valSpan) return;

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(valSpan, {
          innerHTML: target,
          duration: 2,
          ease: 'power3.out',
          snap: { innerHTML: 1 },
          onUpdate: function() {
            valSpan.innerHTML = Math.ceil(valSpan.innerHTML);
          }
        });
      }
    });
  });
}


export function initContactOrb() {
  const section = document.querySelector('.monolithic-glass');
  const orb = document.querySelector('.glass-orb');
  if (!section || !orb) return;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) return;

  const gsap = window.gsap;
  
  let mx = 0, my = 0;
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    // Calculate mouse position relative to the section center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    gsap.to(orb, {
      left: x,
      top: y,
      duration: 1.5,
      ease: 'power2.out'
    });
  });
}

export function initDeckAbout() {
  const section = document.querySelector('.deck-about-section');
  if (!section) return;
  
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  
  const card1 = section.querySelector('.deck-card-1');
  const card2 = section.querySelector('.deck-card-2');
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  });
  
  // Peel away top card
  tl.to(card1, {
    y: '-100%',
    scale: 0.9,
    opacity: 0,
    ease: 'power2.inOut'
  });
  
  // Peel away middle card
  tl.to(card2, {
    y: '-100%',
    scale: 0.9,
    opacity: 0,
    ease: 'power2.inOut'
  });
}

export function initDeckJourney() {
  const section = document.querySelector('.deck-journey-section');
  if (!section) return;
  
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  
  const cards = section.querySelectorAll('.dj-card');
  
  cards.forEach((card, i) => {
    // Skip the very last spacing card
    if (card.classList.contains('dj-card-end')) return;
    
    const inner = card.querySelector('.dj-card-inner');
    if (!inner) return;
    
    // Pin each card so it stays on screen while the user scrolls past it
    ScrollTrigger.create({
      trigger: card,
      start: 'top center',
      end: 'bottom top',
      pin: inner,
      pinSpacing: false
    });

    // Animate it fading/shrinking away when the NEXT card comes up
    if (i < cards.length - 2) {
      const nextCard = cards[i + 1];
      gsap.to(inner, {
        scale: 0.9,
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'none',
        scrollTrigger: {
          trigger: nextCard,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 1
        }
      });
    }
  });
}

export function initOrbitalTimeline() {
  const section = document.querySelector('.orbital-section');
  if (!section) return;
  
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  
  const timeline = document.getElementById('orbitalTimeline');
  const lineProgress = timeline.querySelector('.orbital-line-progress');
  const nodes = timeline.querySelectorAll('.orbital-node');
  
  // Animate the line filling up
  gsap.to(lineProgress, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: timeline,
      start: 'top center',
      end: 'bottom center',
      scrub: true
    }
  });
  
  // Activate nodes as they cross the center of the screen
  nodes.forEach(node => {
    ScrollTrigger.create({
      trigger: node,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        node.classList.add('active');
        const orb = node.querySelector('.orb');
        if (orb) orb.classList.add('active');
      },
      onLeaveBack: () => {
        node.classList.remove('active');
        const orb = node.querySelector('.orb');
        if (orb) orb.classList.remove('active');
      }
    });
  });
}


export function initRoadTimeline() {
  const nodes = document.querySelectorAll('.road-node');
  if (!nodes.length) return;

  nodes.forEach((node, index) => {
    const photo = node.querySelector('.road-photo');
    const text = node.querySelector('.road-text');
    
    // Determine alternating side for the text (desktop only)
    const isMobile = window.innerWidth <= 900;
    
    // Desktop: Even goes left, Odd goes right
    const finalX = isMobile ? 0 : (index % 2 === 0 ? -200 : 200);
    const startX = isMobile ? 0 : (index % 2 === 0 ? -400 : 400);

    // Photo animation: fades in, scales up, moves up
    gsap.fromTo(photo, 
      { opacity: 0, scale: 0.8, y: 150, rotationX: 10 },
      { 
        opacity: 1, scale: 1, y: 0, rotationX: 0,
        scrollTrigger: {
          trigger: node,
          start: 'top 85%',
          end: 'center 50%',
          scrub: 1
        }
      }
    );

    // Text animation: fades in, slides in from side
    gsap.fromTo(text,
      { opacity: 0, x: startX, y: 50 },
      {
        opacity: 1, x: finalX, y: 0,
        scrollTrigger: {
          trigger: node,
          start: 'top 75%',
          end: 'center 50%',
          scrub: 1.5
        }
      }
    );
    
    // Fade out everything when passing it
    gsap.to([photo, text], {
      opacity: 0.2,
      y: -100,
      scale: 0.9,
      scrollTrigger: {
        trigger: node,
        start: 'center 20%',
        end: 'bottom top',
        scrub: 1
      }
    });
  });
}


export function initHeroAnimation() {
  const hxH = document.querySelector('.hx-h');
  const hxX = document.querySelector('.hx-x');
  const mid = document.querySelector('.hx-mid');
  if (!mid || typeof window.gsap === 'undefined') return;
  
  const finalWord = "ERT";
  const chars = "!<>-_\/[]{}—=+*^?#________";
  
  // A helper function to scramble text
  function scrambleText(element, finalString, duration) {
    const proxy = { progress: 0 };
    window.gsap.to(proxy, {
      progress: 1,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        if (proxy.progress >= 0.95) {
          element.textContent = finalString;
          return;
        }
        let result = "";
        for (let i = 0; i < finalString.length; i++) {
          if (Math.random() < proxy.progress) {
            result += finalString[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        element.textContent = result;
      }
    });
  }

  // Cinematic Cyber-Decryption Hx -> Hertx reveal
  setTimeout(() => {
    // Reset to natural width to measure
    window.gsap.set(mid, { width: 'auto', opacity: 1, display: 'inline-flex', clearProps: 'transform' });
    mid.textContent = finalWord;
    const midWidth = mid.offsetWidth || 150; 
    
    // Initial state: outer letters pushed in, mid invisible
    window.gsap.set(hxH, { x: midWidth / 2 });
    window.gsap.set(hxX, { x: -(midWidth / 2) });
    window.gsap.set(mid, { opacity: 0, scaleX: 0, transformOrigin: 'center' });
    
    const tl = window.gsap.timeline({ delay: 0.4 });
    
    // 1. Initial Glitch flash
    tl.to('.hero-big-text', {
      textShadow: "15px 0 0 red, -15px 0 0 cyan",
      duration: 0.1,
      yoyo: true,
      repeat: 3,
      ease: "steps(1)"
    })
    // 2. Violent explode outwards
    .to([hxH, hxX], {
      x: 0,
      duration: 1.2,
      ease: "power4.out"
    }, "<0.1")
    // 3. Mid letter appears and scrambles
    .to(mid, {
      scaleX: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
      onStart: () => {
        scrambleText(mid, finalWord, 1.8);
      }
    }, "<")
    // 4. Reset shadow immediately before final flash
    .set('.hero-big-text', { textShadow: "0 0 80px rgba(56, 189, 248, 0.06)" }, "+=0.3")
    // 5. Lock-in flash
    .to('.hero-big-text', {
      textShadow: "0 0 60px rgba(255, 255, 255, 0.8), 0 0 100px rgba(56, 189, 248, 1)",
      duration: 0.1,
      ease: "power4.out"
    })
    .to('.hero-big-text', {
      textShadow: "0 0 80px rgba(56, 189, 248, 0.06)",
      duration: 1.5,
      ease: "power2.out"
    });

  }, 100);
}

export function initContactHover() {
  const links = document.querySelectorAll('.contact-link');
  const overlay = document.querySelector('.contact-bg-overlay');
  if (!links.length || !overlay) return;

  links.forEach(link => {
    link.addEventListener('mouseenter', (e) => {
      const color = link.getAttribute('data-color');
      overlay.style.backgroundColor = color;
      
      // Calculate mouse position relative to window for clip-path center
      const rect = link.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      
      overlay.style.clipPath = `circle(150% at ${x}% ${y}%)`;
    });
    
    link.addEventListener('mouseleave', () => {
      overlay.style.clipPath = `circle(0% at 50% 50%)`;
    });
  });
}


export function initWorkFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const container = document.querySelector('.masonry-container');
  const items = document.querySelectorAll('.masonry-item');
  if (!btns.length || !container) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      
      // Animate out
      window.gsap.to(items, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          // Toggle layout mode
          if (filter === 'all') {
            container.classList.remove('is-filtered');
          } else {
            container.classList.add('is-filtered');
          }

          // Hide/Show items
          items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
              item.style.display = 'block';
              window.gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 });
            } else {
              item.style.display = 'none';
            }
          });
        }
      });
    });
  });
}
