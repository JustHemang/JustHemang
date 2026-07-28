'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const IS_HOME = !document.body.classList.contains('page-sub');

let mx = 0, my = 0, rx = 0, ry = 0;
let cursorRing, marqueeTrack, marqueeX = 0, marqueeUnitW = 1000, lenis;

function initLenis() {
  if (REDUCED || typeof Lenis === 'undefined') { requestAnimationFrame(function loopt() { if (cursorRing) { rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15; cursorRing.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; } requestAnimationFrame(loopt); }); return; }
  lenis = new Lenis({ duration: 1.2, wheelMultiplier: 1 });
  lenis.on('scroll', function() { ScrollTrigger.update(); });
  function loop(t) {
    lenis.raf(t);
    if (cursorRing) { rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15; cursorRing.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; }
    if (marqueeTrack) {
      marqueeX -= 0.5;
      if (Math.abs(marqueeX) > marqueeUnitW) marqueeX = 0;
      marqueeTrack.style.transform = 'translateX(' + marqueeX + 'px)';
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function initHero() {
  if (!IS_HOME) return;
  const canvas = $('#heroCanvas');
  const hero = $('.hero--sticky');
  if (!canvas || !hero || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, hero.clientWidth / hero.clientHeight, 0.1, 100);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(hero.clientWidth, hero.clientHeight);

  const textureLoader = new THREE.TextureLoader();
  const logoTexture = textureLoader.load('Logo Transparent.png');
  const logoMat = new THREE.MeshBasicMaterial({
    map: logoTexture, transparent: true, opacity: 0.4,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const logoGeo = new THREE.PlaneGeometry(2.2, 2.2);
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  scene.add(logoMesh);

  const ringGeo = new THREE.RingGeometry(1.6, 1.63, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x66d9ef, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  scene.add(ring);

  const outerGeo = new THREE.RingGeometry(2.1, 2.13, 64);
  const outerMat = new THREE.MeshBasicMaterial({ color: 0x3399ff, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
  const outer = new THREE.Mesh(outerGeo, outerMat);
  scene.add(outer);

  let mouseX = 0, mouseY = 0;
  let running = !REDUCED;

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, { passive: true });

  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  addEventListener('resize', resize);

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);
    const t = performance.now() * 0.0003;
    logoMesh.rotation.y = t * 0.3 + mouseX * 0.2;
    logoMesh.rotation.x = Math.sin(t) * 0.08 + mouseY * 0.1;
    logoMesh.position.y = Math.sin(t * 1.5) * 0.06;
    ring.rotation.z = t * 0.15;
    ring.position.y = Math.sin(t * 1.5) * 0.06;
    outer.rotation.z = -t * 0.1;
    outer.position.y = Math.sin(t * 1.5) * 0.06;
    renderer.render(scene, camera);
  }

  if (REDUCED) { logoMesh.rotation.y = 0.2; renderer.render(scene, camera); return; }

  new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    if (visible && !running) { running = true; animate(); }
    if (!visible) running = false;
  }, { root: null }).observe(hero);

  animate();
}

function initCursor() {
  if (!FINE_POINTER || REDUCED) return;
  document.body.classList.add('has-cursor');
  const dot = $('#cursorDot');
  cursorRing = $('#cursorRing');
  if (!dot) return;
  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
  }, { passive: true });
}

function initMenu() {
  const fab = $('#menuBtn') || $('#menuFab');
  const overlay = $('#menuOverlay');
  if (!fab || !overlay) return;
  const links = $$('.menu-overlay__link', overlay);

  const toggle = (open) => {
    fab.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', String(open));
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && typeof gsap !== 'undefined') {
      gsap.from(links, { opacity: 0, y: 60, stagger: 0.06, duration: 0.6, ease: 'power3.out', delay: 0.15 });
    }
  };

  fab.addEventListener('click', () => toggle(!overlay.classList.contains('open')));
  links.forEach((a) => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) toggle(false);
  });
}

function initScrollProgress() {
  const progress = $('#scrollProgress');
  if (!progress) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
  }, { passive: true });
}

function initCounters() {
  if (REDUCED || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  $$('.stat__num').forEach((el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
    });
  });
}

function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  if (REDUCED) {
    $$('.anim-clip,.anim-scale,.anim-slide-left,.anim-slide-right,.anim-slide-up,.anim-rotate,.anim-blur').forEach((el) => {
      el.style.clipPath = 'none';
      el.style.transform = 'none';
      el.style.opacity = '1';
      el.style.filter = 'none';
    });
    return;
  }

  if (IS_HOME) {
    const tl = gsap.timeline({ delay: 0.8 });
    tl.from('.hero__typewriter', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' })
      .from('.hero__pre', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('.hero--sticky .accent-line', { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, '-=0.4')
      .from('.hero__tagline', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.3')
      .from('.nav__menu-btn', { opacity: 0, scale: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.4');
  } else {
    gsap.from('.nav__menu-btn', { opacity: 0, scale: 0, duration: 0.5, ease: 'back.out(2)', delay: 0.3 });
  }

  $$('.tw-type').forEach(function(el) {
    el.classList.add('tw-active');
  });

  $$('.work__item, .service-item, .pricing__card, .process__step, .capability, .stat, .toolkit__card, .aero-window').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 92%' },
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
    });
  });

  $$('.section__eyebrow, .section__heading').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
    });
  });

  $$('.contact-links__item').forEach((item) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 92%' },
      opacity: 0, x: 30, duration: 0.7, ease: 'power3.out',
    });
  });

  $$('.cta__heading, .page-cta h2').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      opacity: 0, y: 50, duration: 1, ease: 'power4.out',
    });
  });

  const footerLogo = $('.footer__logo');
  if (footerLogo) {
    gsap.from(footerLogo, {
      scrollTrigger: { trigger: footerLogo, start: 'top 95%' },
      opacity: 0, scale: 0.3, duration: 0.8, ease: 'back.out(1.5)',
    });
  }

  const footerLinks = $$('.footer__links a');
  if (footerLinks.length) {
    gsap.from(footerLinks, {
      scrollTrigger: { trigger: '.footer__links', start: 'top 95%' },
      opacity: 0, y: 20, stagger: 0.08, duration: 0.5, ease: 'power2.out',
    });
  }

  const reel = $('.reel__wrap');
  if (reel) {
    gsap.from(reel, {
      scrollTrigger: { trigger: reel, start: 'top 88%' },
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
    });
  }

  const progress = $('#scrollProgress');
  if (progress) {
    ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        progress.style.boxShadow = self.progress > 0.95
          ? '0 0 12px 2px rgba(42, 122, 122, 0.5)'
          : 'none';
      }
    });
  }
}

function initMarquee() {
  marqueeTrack = $('#marqueeTrack');
  if (!marqueeTrack || REDUCED) return;
  const unitHTML = marqueeTrack.innerHTML;
  let safety = 0;
  while (marqueeTrack.scrollWidth < innerWidth * 2.5 && safety < 20) { marqueeTrack.innerHTML += unitHTML; safety++; }
  marqueeUnitW = marqueeTrack.firstElementChild ? marqueeTrack.firstElementChild.offsetWidth * (marqueeTrack.children.length / 4) : 1000;
}

function initPageTransition() {
  const overlay = $('#pageTransition');
  if (!overlay) return;
  if (REDUCED) { overlay.style.display = 'none'; return; }

  const bars = $$('.pt-bar', overlay);
  const circle = $('.pt-circle', overlay);
  gsap.set(bars, { xPercent: 0 });
  if (circle) gsap.set(circle, { scale: 0 });

  gsap.to(bars, { xPercent: 100, stagger: 0.05, duration: 0.5, ease: 'power3.inOut', delay: 0.1 });
  if (circle) gsap.to(circle, { scale: 80, duration: 0.4, ease: 'power2.in', delay: 0.1 });
  setTimeout(function() { overlay.style.display = 'none'; }, 800);

  $$('a[href]').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.target === '_blank') return;
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var url = new URL(href, location.href).href;
      if (url === location.href) return;
      var fab = $('#menuBtn');
      var overlayEl = $('#menuOverlay');
      if (fab && overlayEl && overlayEl.classList.contains('open')) {
        fab.classList.remove('open');
        overlayEl.classList.remove('open');
        overlayEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      overlay.style.display = '';
      overlay.style.pointerEvents = 'all';
      gsap.set(bars, { xPercent: 0 });
      if (circle) gsap.set(circle, { scale: 0 });
      gsap.to(bars, { xPercent: 100, stagger: 0.04, duration: 0.4, ease: 'power3.inOut', delay: 0.15 });
      if (circle) gsap.to(circle, { scale: 80, duration: 0.3, ease: 'power2.in', delay: 0.15 });
      setTimeout(function() { location.href = url; }, 600);
    });
  });
}

function initTimecode() {
  const el = $('#timecodeValue');
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

function initFilmstrip() {
  if (REDUCED) return;
  const track = $('#filmstripTrack');
  if (!track) return;
  const clone = track.innerHTML;
  track.innerHTML += clone;
}

function initTypewriter() {
  const el = $('#heroTypewriter');
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

function initTechChars() {
  const container = $('#techChars');
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

function initLiveClock() {
  const el = $('#liveClock');
  if (!el) return;
  function update() {
    const now = new Date();
    el.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}

function initTabs() {
  $$('.services-tabs__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      $$('.services-tabs__btn').forEach((b) => b.classList.remove('active'));
      $$('.services-tabs__panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = $('#tab-' + tab);
      if (panel) panel.classList.add('active');
    });
  });
}

function initTrippy() {
  var wrap = document.querySelector('.hero-wrap');
  var container = document.querySelector('#trippyFrames');
  var heroContent = document.querySelector('.hero__content');
  if (!wrap || !container || REDUCED) return;
  var frames = container.querySelectorAll('.trippy__frame');

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    }
  });

  tl.to(container, { top: '0%', ease: 'none' }, 0);
  tl.to(heroContent, { opacity: 0, ease: 'none' }, 0);
  tl.to(frames, { scale: 1, rotate: '0deg', duration: 0.25, ease: 'none' }, 0);
  tl.to(frames, { scale: 0.9, rotate: '30deg', duration: 0.55, ease: 'none' }, 0.25);
  tl.to(frames, { scale: 1.25, rotate: '60deg', duration: 0.2, ease: 'none' }, 0.8);
}

document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initCursor();
  initScrollProgress();
  initMenu();
  initAnimations();
  initCounters();
  initPageTransition();
  initTimecode();
  initFilmstrip();
  initTypewriter();
  initTechChars();
  initLiveClock();
  initTabs();
  initMarquee();
  initLenis();
  initTrippy();
});
