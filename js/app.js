'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const IS_HOME = !document.body.classList.contains('page-sub');
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;

let mx = 0, my = 0, rx = 0, ry = 0;
let cursorRing, marqueeTrack, marqueeX = 0, marqueeUnitW = 1000, lenis;
let scrollVelocity = 0, scrollDirection = 1, lastScrollY = 0;

/* ═══════════════════════════════════════════════════════
   LENIS SMOOTH SCROLL — silky, intentional feel
   ═══════════════════════════════════════════════════════ */
function initLenis() {
  if (REDUCED || typeof Lenis === 'undefined') {
    requestAnimationFrame(function loopt() {
      if (cursorRing) {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        cursorRing.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      }
      requestAnimationFrame(loopt);
    });
    return;
  }

  lenis = new Lenis({
    duration: 1.4,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    smoothWheel: true,
  });

  lenis.on('scroll', function(e) {
    ScrollTrigger.update();
    // Track velocity and direction for marquee + nav
    scrollVelocity = Math.abs(e.velocity);
    scrollDirection = e.direction;
  });

  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  function loop() {
    // Custom cursor
    if (cursorRing) {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      cursorRing.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
    }

    // Velocity-responsive marquee
    if (marqueeTrack) {
      var speed = 0.5 + Math.min(scrollVelocity * 0.3, 4);
      var dir = scrollDirection >= 0 ? -1 : 1;
      marqueeX += speed * dir;
      if (Math.abs(marqueeX) > marqueeUnitW) marqueeX = 0;
      marqueeTrack.style.transform = 'translateX(' + marqueeX + 'px)';
    }

    // Decay velocity
    scrollVelocity *= 0.95;

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ═══════════════════════════════════════════════════════
   THREE.JS HERO CANVAS
   ═══════════════════════════════════════════════════════ */
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

  // Floating Cyber Particles
  const particleCount = 180;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 12;
    particlePos[i + 1] = (Math.random() - 0.5) * 8;
    particlePos[i + 2] = (Math.random() - 0.5) * 6;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.04,
    transparent: true,
    opacity: 0.5,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  let mouseX = 0, mouseY = 0;
  let running = !REDUCED;

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, { passive: true });

  let resizeTimer;
  function resize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const w = hero.clientWidth, h = hero.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }, 100);
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
    particles.rotation.y = t * 0.08 + mouseX * 0.05;
    particles.rotation.x = Math.sin(t * 0.05) * 0.1 + mouseY * 0.05;
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

/* ═══════════════════════════════════════════════════════
   CUSTOM CAMERA CURSOR
   ═══════════════════════════════════════════════════════ */
function initCursor() {
  if (!FINE_POINTER || REDUCED) return;
  document.body.classList.add('has-cursor');
  const dot = $('#cursorDot');
  cursorRing = $('#cursorRing');
  if (!dot || !cursorRing) return;

  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
  }, { passive: true });

  addEventListener('mousedown', () => cursorRing.classList.add('is-down'));
  addEventListener('mouseup', () => cursorRing.classList.remove('is-down'));

  // Camera Focus Lock-on for interactive elements
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
}

/* ═══════════════════════════════════════════════════════
   UNIQUE FULLSCREEN HAMBURGER MENU
   ═══════════════════════════════════════════════════════ */
function initMenu() {
  var fab = $('#menuBtn') || $('#menuFab');
  var overlay = $('#menuOverlay');
  if (!fab || !overlay) return;
  var links = $$('.menu-overlay__link', overlay);
  var isOpen = false;

  /* Stagger link data so each knows its index */
  links.forEach(function(link, i) {
    link.dataset.idx = i;
  });

  /* Build the index rail from the links so every page (4 or 5 links)
     always renders the same fullscreen layout */
  var rail = overlay.querySelector('.menu-overlay__rail');
  if (!rail) {
    rail = document.createElement('div');
    rail.className = 'menu-overlay__rail';
    overlay.insertBefore(rail, overlay.firstChild);
  } else {
    rail.innerHTML = '';
  }
  links.forEach(function(link, i) {
    var num = document.createElement('span');
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

    if (typeof gsap !== 'undefined') {
      /* Staggered link reveal — each slides up */
      links.forEach(function(link, i) {
        gsap.fromTo(link,
          { opacity: 0, y: 80, skewY: 6 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.7, delay: 0.12 + i * 0.07, ease: 'power4.out' }
        );
      });
      /* Footer socials */
      gsap.from('.menu-overlay__foot a', { opacity: 0, y: 20, stagger: 0.06, duration: 0.5, delay: 0.5, ease: 'power3.out' });
    }
  }

  function closeMenu() {
    isOpen = false;
    fab.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');

    if (typeof gsap !== 'undefined') {
      gsap.to(links, { opacity: 0, y: -30, skewY: -4, stagger: 0.04, duration: 0.35, ease: 'power3.in',
        onComplete: function() {
          overlay.classList.remove('open');
          overlay.setAttribute('aria-hidden', 'true');
          /* Reset for next open */
          gsap.set(links, { opacity: 0, y: 80, skewY: 6 });
        }
      });
    } else {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  /* Store original text */
  links.forEach(function(link) {
    link.dataset.originalText = link.textContent.trim();
    link.setAttribute('aria-label', link.dataset.originalText);
  });

  fab.addEventListener('click', function() { isOpen ? closeMenu() : openMenu(); });
  links.forEach(function(a) { a.addEventListener('click', closeMenu); });
  addEventListener('keydown', function(e) { if (e.key === 'Escape' && isOpen) closeMenu(); });
}


/* ═══════════════════════════════════════════════════════
   SMART NAV — scroll-aware hide/show + glassmorphism
   ═══════════════════════════════════════════════════════ */
function initSmartNav() {
  var nav = $('#nav');
  if (!nav || REDUCED) return;

  function onScroll() {
    var y = window.scrollY;
    if (y > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ═══════════════════════════════════════════════════════
   SCROLL PROGRESS — enhanced with glow
   ═══════════════════════════════════════════════════════ */
function initScrollProgress() {
  var progress = $('#scrollProgress');

  function update() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? y / max : 0;
    if (progress) progress.style.transform = 'scaleX(' + ratio + ')';

    // Add glow when actively scrolling
    if (progress) {
      if (ratio > 0.01 && ratio < 0.99) {
        progress.classList.add('has-glow');
      } else {
        progress.classList.remove('has-glow');
      }
    }

    // Toggle bottom bars slide-up from below screen on scroll
    if (y > 80) {
      document.body.classList.add('is-scrolled');
    } else {
      document.body.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ═══════════════════════════════════════════════════════
   CHARACTER SCRAMBLE TEXT EFFECT (like ayaskant007)
   ═══════════════════════════════════════════════════════ */
var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

function scrambleText(el, finalText, startDelay) {
  var iterations = 0;
  var maxIter = finalText.length * 3;
  var startDelayMs = (startDelay || 0) * 1000;
  setTimeout(function() {
    var interval = setInterval(function() {
      el.textContent = finalText.split('').map(function(ch, i) {
        if (ch === ' ') return ' ';
        if (i < Math.floor(iterations / 3)) return finalText[i];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join('');
      iterations++;
      if (iterations > maxIter) { el.textContent = finalText; clearInterval(interval); }
    }, 35);
  }, startDelayMs);
}

function initScrambleHover() {
  if (!FINE_POINTER) return;
  /* Apply to nav links, work clients, menu links, section headings */
  var targets = $$('.menu-overlay__link, .footer__links a, .nav__logo-text');
  targets.forEach(function(el) {
    var orig = el.dataset.scrambleOrig || el.textContent.trim();
    el.dataset.scrambleOrig = orig;
    var timer = null;
    el.addEventListener('mouseenter', function() {
      clearTimeout(timer);
      scrambleText(el, orig, 0);
    });
  });

  /* For work client headings — scramble on hover */
  $$('.work__client').forEach(function(el) {
    var orig = el.dataset.scrambleOrig || el.textContent.trim();
    el.dataset.scrambleOrig = orig;
    el.addEventListener('mouseenter', function() { scrambleText(el, orig, 0); });
  });
}

/* ═══════════════════════════════════════════════════════
   LADDER / JOURNEY ANIMATION (like hemang.vercel.app)
   ═══════════════════════════════════════════════════════ */
function initLadderJourney() {
  if (REDUCED || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var items = $$('.journey__item, .timeline__item, .process__step');
  if (!items.length) return;

  items.forEach(function(item, i) {
    var num = item.querySelector('.process__num, .journey__num, .timeline__num');
    var content = item.querySelector('.process__name, .journey__title, .timeline__title');
    var desc = item.querySelector('.process__desc, .journey__desc, .timeline__desc');

    var tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: 'top 80%', once: true }
    });

    /* Number climbs up like a ladder rung */
    if (num) tl.from(num, { y: 60, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, 0);
    /* Line grows down connecting rungs */
    if (item.querySelector('.ladder__line')) {
      tl.from(item.querySelector('.ladder__line'), { scaleY: 0, transformOrigin: 'top', duration: 0.8, ease: 'power2.inOut' }, 0.2);
    }
    if (content) tl.from(content, { x: -40, opacity: 0, duration: 0.55, ease: 'power3.out' }, 0.15);
    if (desc)    tl.from(desc,    { x: -30, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.3);
  });

  /* Connector line between steps */
  var connectors = $$('.process__step::before, .journey__connector');
  connectors.forEach(function(c) {
    gsap.from(c, { scaleY: 0, transformOrigin: 'top', duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: c, start: 'top 85%', once: true } });
  });
}


function initCounters() {
  if (REDUCED || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  $$('.stat__num').forEach(function(el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^(\d+)(.*)/);
    if (!match) return;
    var target = parseInt(match[1], 10);
    var suffix = match[2] || '';
    var obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: function() { el.textContent = Math.round(obj.val) + suffix; },
    });
  });
}

/* ═══════════════════════════════════════════════════════
   SCROLL-DRIVEN ANIMATIONS — the main event
   ═══════════════════════════════════════════════════════ */
function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  if (REDUCED) {
    $$('.anim-clip,.anim-scale,.anim-slide-left,.anim-slide-right,.anim-slide-up,.anim-rotate,.anim-blur,.section--reveal,.cascade-child,.char-reveal').forEach(function(el) {
      el.style.clipPath = 'none';
      el.style.transform = 'none';
      el.style.opacity = '1';
      el.style.filter = 'none';
    });
    $$('.clap-divider').forEach(function(d) { d.classList.add('is-visible'); });
    $$('.footer').forEach(function(f) { f.classList.add('is-visible'); });
    return;
  }

  // ── Hero entrance timeline ──
  if (IS_HOME) {
    var tl = gsap.timeline({ delay: 0.8 });
    tl.from('.hero__typewriter', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' })
      .from('.hero__pre', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('.hero__char', { opacity: 0, y: 100, rotateX: -90, stagger: 0.04, duration: 1, ease: 'back.out(1.7)' }, '-=0.6')
      .from('.hero--sticky .accent-line', { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, '-=0.6')
      .from('.hero__tagline', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.3');
  } else {
    
  }

  // ── Typewriter headings ──
  $$('.tw-type').forEach(function(el) {
    el.classList.add('tw-active');
  });

  // ── SECTION REVEAL — scrub-driven clip reveal ──
  $$('.section--reveal').forEach(function(section) {
    gsap.to(section, {
      clipPath: 'inset(0 0 0 0)',
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 40%',
        scrub: 0.8,
        onEnter: function() { section.classList.add('is-revealed'); },
      }
    });
  });

  // ── CLAP DIVIDERS — cinematic bar wipe ──
  $$('.clap-divider').forEach(function(divider) {
    ScrollTrigger.create({
      trigger: divider,
      start: 'top 88%',
      onEnter: function() { divider.classList.add('is-visible'); },
      once: true,
    });
  });

  // ── ACCENT LINES — scroll-scrubbed grow ──
  $$('.accent-line').forEach(function(el) {
    gsap.fromTo(el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'top 65%',
          scrub: 0.6,
        }
      }
    );
  });

  // ── SECTION EYEBROWS — slide in with dash ──
  $$('.section__eyebrow').forEach(function(el) {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        onEnter: function() { el.classList.add('is-visible'); },
        once: true,
      },
      opacity: 0,
      x: -30,
      duration: 0.7,
      ease: 'power3.out',
    });
  });

  // ── SECTION HEADINGS — character-by-character reveal ──
  $$('.section__heading, .statement__heading, .cta__heading').forEach(function(el) {
    if (!el.querySelector('.char-reveal')) {
      var text = el.innerHTML;
      var parts = text.split(/(<br\s*\/?>)/gi);
      var html = '';
      parts.forEach(function(part) {
        if (part.match(/<br\s*\/?>/i)) {
          html += part;
        } else {
          for (var i = 0; i < part.length; i++) {
            var ch = part[i];
            if (ch === ' ') {
              html += ' ';
            } else {
              html += '<span class="char-reveal">' + ch + '</span>';
            }
          }
        }
      });
      el.innerHTML = html;
    }
    el.style.opacity = '1';
    el.style.transform = 'none';

    var charEls = $$('.char-reveal', el);
    gsap.fromTo(charEls,
      { opacity: 0, y: 40, rotateX: -60 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'back.out(1.8)',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          onEnter: function() {
            charEls.forEach(function(c) { c.classList.add('is-visible'); });
          }
        }
      }
    );
  });

  // ── GENERIC ANIMATION CLASSES — upgraded with scrub ──
  $$('.anim-clip').forEach(function(el) {
    gsap.to(el, {
      clipPath: 'inset(0 0 0 0)',
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 55%', scrub: 0.8 },
    });
  });

  $$('.anim-scale').forEach(function(el) {
    gsap.to(el, {
      scale: 1, opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 },
    });
  });

  $$('.anim-slide-left').forEach(function(el) {
    gsap.to(el, {
      x: 0, opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 },
    });
  });

  $$('.anim-slide-right').forEach(function(el) {
    gsap.to(el, {
      x: 0, opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 },
    });
  });

  $$('.anim-slide-up').forEach(function(el) {
    gsap.to(el, {
      y: 0, opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 },
    });
  });

  $$('.anim-rotate').forEach(function(el) {
    gsap.to(el, {
      rotation: 0, scale: 1, opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.8 },
    });
  });

  $$('.anim-blur').forEach(function(el) {
    gsap.to(el, {
      filter: 'blur(0px)', opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 0.6 },
    });
  });

  // ── WORK ITEMS — cascade with 3D rotation ──
  $$('.work__item:not(.work--horizontal .work__item)').forEach(function(item, i) {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%' },
      opacity: 0, y: 50, rotateX: 12, scale: 0.96,
      duration: 0.9, delay: i * 0.12, ease: 'power3.out',
    });
  });

  // ── SERVICE ITEMS ──
  $$('.service-item').forEach(function(item, i) {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%' },
      opacity: 0, x: -60, rotateY: -8,
      duration: 0.9, delay: i * 0.08, ease: 'power3.out',
    });
  });

  // ── PRICING CARDS ──
  $$('.pricing__card').forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      opacity: 0, y: 50, scale: 0.92, rotateY: 8,
      duration: 0.8, delay: i * 0.1, ease: 'back.out(1.4)',
    });
  });

  // ── PROCESS STEPS ──
  $$('.process__step').forEach(function(step, i) {
    gsap.from(step, {
      scrollTrigger: { trigger: step, start: 'top 88%' },
      opacity: 0, x: -50, rotateY: -5,
      duration: 0.8, delay: i * 0.1, ease: 'power3.out',
    });
  });

  // ── CAPABILITY CARDS ──
  $$('.capability').forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      opacity: 0, y: 40, scale: 0.9,
      duration: 0.7, delay: i * 0.08, ease: 'back.out(1.4)',
    });
  });

  // ── STATS ──
  $$('.stat').forEach(function(stat, i) {
    gsap.from(stat, {
      scrollTrigger: { trigger: stat, start: 'top 88%' },
      opacity: 0, y: 40, scale: 0.85,
      duration: 0.7, delay: i * 0.1, ease: 'back.out(1.6)',
    });
  });

  // ── CONTACT LINKS ──
  $$('.contact-links__item').forEach(function(item) {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%' },
      opacity: 0, x: 50, rotateY: 5,
      duration: 0.9, ease: 'power3.out',
    });
  });

  // ── TEAM GROUPS ──
  $$('.team__group').forEach(function(group, i) {
    gsap.from(group, {
      scrollTrigger: { trigger: group, start: 'top 85%' },
      opacity: 0, y: 50, scale: 0.85,
      duration: 0.9, delay: i * 0.12, ease: 'back.out(1.4)',
    });
  });

  // ── CTA BUTTON ──
  $$('.cta__btn').forEach(function(el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      opacity: 0, y: 40, scale: 0.75,
      duration: 0.8, ease: 'back.out(2.5)',
    });
  });

  // ── STATEMENT TEXT — horizontal wipe reveal ──
  $$('.statement__text').forEach(function(el) {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 45%',
          scrub: 1,
        }
      }
    );
  });

  // ── FOOTER CURTAIN RAISE ──
  var footer = $('.footer');
  if (footer) {
    ScrollTrigger.create({
      trigger: footer,
      start: 'top 95%',
      onEnter: function() {
        footer.classList.add('is-visible');
        // Cascade children
        var logo = $('.footer__logo', footer);
        if (logo) {
          gsap.from(logo, {
            opacity: 0, rotation: -180, scale: 0.2,
            duration: 1.2, ease: 'back.out(1.5)', delay: 0.2,
          });
        }
        var links = $$('.footer__links a', footer);
        if (links.length) {
          gsap.from(links, {
            opacity: 0, x: 30, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.4,
          });
        }
      },
      once: true,
    });
  }

  // ── MARQUEE ──
  var marquee = $('.marquee');
  if (marquee) {
    gsap.from(marquee, {
      scrollTrigger: { trigger: marquee, start: 'top 92%' },
      opacity: 0, scaleX: 0.7, duration: 1.2, ease: 'power3.out',
    });
  }

  // ── WORK NUMBERS ──
  $$('.work__num').forEach(function(el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, scale: 2.5, rotation: -15,
      duration: 0.7, ease: 'back.out(2)',
    });
  });

  // ── SCROLL HIGHLIGHT / TYPEWRITER EFFECT ──
  $$('.scroll-highlight').forEach(function(el) {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: function() { el.classList.add('is-highlighted'); },
      once: true
    });
  });

  // ── REEL ──
  var reel = $('.reel__wrap');
  if (reel) {
    gsap.from(reel, {
      scrollTrigger: { trigger: reel, start: 'top 88%' },
      opacity: 0, y: 50, scale: 0.96, rotateX: 8,
      duration: 1.2, ease: 'power3.out',
    });
  }

  // ── AERO WINDOWS ──
  $$('.aero-window').forEach(function(win, i) {
    gsap.from(win, {
      scrollTrigger: { trigger: win, start: 'top 88%' },
      opacity: 0, y: 60, scale: 0.94,
      duration: 0.9, delay: i * 0.1, ease: 'power3.out',
    });
  });

  // ── SCROLL PROGRESS GLOW BOOST ──
  var progress = $('#scrollProgress');
  if (progress) {
    ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom',
      onUpdate: function(self) {
        progress.style.boxShadow = self.progress > 0.95
          ? '0 0 16px 3px rgba(42, 122, 122, 0.6)'
          : 'none';
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════
   PARALLAX DEPTH SYSTEM
   ═══════════════════════════════════════════════════════ */
function initParallax() {
  if (REDUCED || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  $$('[data-speed]').forEach(function(el) {
    var speed = parseFloat(el.dataset.speed);
    if (!speed || speed === 1) return;

    gsap.to(el, {
      yPercent: (1 - speed) * 50,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════
   HORIZONTAL WORK SCROLL (desktop only)
   ═══════════════════════════════════════════════════════ */
function initHorizontalWork() {
  if (REDUCED || IS_MOBILE || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var section = $('.work--horizontal');
  if (!section) return;
  var grid = $('.work__grid', section);
  if (!grid) return;

  // Calculate scroll distance
  function getScrollAmount() {
    var scrollW = grid.scrollWidth;
    var winW = window.innerWidth;
    if (scrollW <= winW) return 0;
    return -(scrollW - winW + 100);
  }

  var tween = gsap.to(grid, {
    x: getScrollAmount,
    ease: 'none',
  });

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: function() { return '+=' + Math.abs(getScrollAmount()); },
    pin: true,
    scrub: 1.2,
    animation: tween,
    invalidateOnRefresh: true,
    anticipatePin: 1,
  });

  // Scale up items as they enter center
  $$('.work__item', section).forEach(function(item) {
    gsap.fromTo(item,
      { scale: 0.94, opacity: 0.95 },
      {
        scale: 1, opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          containerAnimation: tween,
          start: 'left 92%',
          end: 'left 35%',
          scrub: true,
        }
      }
    );
  });
}

/* ═══════════════════════════════════════════════════════
   VELOCITY-RESPONSIVE MARQUEE
   ═══════════════════════════════════════════════════════ */
function initMarquee() {
  marqueeTrack = $('#marqueeTrack');
  if (!marqueeTrack || REDUCED) return;
  var unitHTML = marqueeTrack.innerHTML;
  var safety = 0;
  while (marqueeTrack.scrollWidth < innerWidth * 2.5 && safety < 20) {
    marqueeTrack.innerHTML += unitHTML;
    safety++;
  }
  marqueeUnitW = marqueeTrack.firstElementChild
    ? marqueeTrack.firstElementChild.offsetWidth * (marqueeTrack.children.length / 4)
    : 1000;
}

/* ═══════════════════════════════════════════════════════
   PAGE TRANSITIONS
   ═══════════════════════════════════════════════════════ */
function initPageTransition() {
  var overlay = $('#pageTransition');
  if (!overlay) return;
  if (REDUCED) { overlay.style.display = 'none'; return; }

  var bars = $$('.pt-bar', overlay);
  var circle = $('.pt-circle', overlay);
  
  // On load: reveal page by sliding right
  gsap.set(bars, { xPercent: 0 });
  if (circle) gsap.set(circle, { scale: 0 });

  gsap.to(bars, { xPercent: 100, stagger: 0.05, duration: 0.6, ease: 'power3.inOut', delay: 0.1 });
  if (circle) gsap.to(circle, { scale: 80, duration: 0.4, ease: 'power2.in', delay: 0.1 });
  setTimeout(function() { overlay.style.display = 'none'; }, 900);

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
        document.body.classList.remove('menu-open');
      }
      
      // On exit: slide in from left to cover
      overlay.style.display = 'flex';
      overlay.style.pointerEvents = 'all';
      gsap.set(bars, { xPercent: -100 });
      if (circle) gsap.set(circle, { scale: 0 });
      
      gsap.to(bars, { xPercent: 0, stagger: 0.04, duration: 0.45, ease: 'power3.inOut' });
      if (circle) gsap.to(circle, { scale: 80, duration: 0.3, ease: 'power2.in' });
      
      setTimeout(function() { location.href = url; }, 700);
    });
  });
}

/* ═══════════════════════════════════════════════════════
   TIMECODE COUNTER
   ═══════════════════════════════════════════════════════ */
function initTimecode() {
  var el = $('#timecodeValue');
  if (!el) return;
  var start = performance.now();
  var prevFrame = -1;
  function loop() {
    var elapsed = performance.now() - start;
    var f = Math.floor(elapsed / (1000 / 24)) % 24;
    if (f !== prevFrame) {
      prevFrame = f;
      var totalSec = Math.floor(elapsed / 1000);
      var s = totalSec % 60;
      var m = Math.floor(totalSec / 60) % 60;
      var h = Math.floor(totalSec / 3600);
      el.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ':' + String(f).padStart(2, '0');
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ═══════════════════════════════════════════════════════
   FILMSTRIP
   ═══════════════════════════════════════════════════════ */
function initFilmstrip() {
  if (REDUCED) return;
  var track = $('#filmstripTrack');
  if (!track) return;
  var clone = track.innerHTML;
  track.innerHTML += clone;
}

/* ═══════════════════════════════════════════════════════
   TYPEWRITER
   ═══════════════════════════════════════════════════════ */
function initTypewriter() {
  var el = $('#heroTypewriter');
  if (!el || !IS_HOME) return;
  var phrases = [
    'Freelance Video Editor',
    'Frontend Developer',
    'President of OPCODE',
    'Founder of Kaelor Media',
    'Creative Director',
    'Motion Graphics Artist',
    'Color Grading Specialist',
  ];
  var pi = 0, ci = 0, deleting = false, delay = 80;
  el.innerHTML = '<span class="tw-cursor"></span>';
  var cursor = el.querySelector('.tw-cursor');
  function tick() {
    var current = phrases[pi];
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

/* ═══════════════════════════════════════════════════════
   TECH CHARACTERS FLOATING
   ═══════════════════════════════════════════════════════ */
function initTechChars() {
  var container = $('#techChars');
  if (!container) return;
  var chars = ['{0,1}', '</>', '0xFF', '>>>', '&&', '===', 'npm', 'git', '{}', '[]', '=>', '##', '@@', '**', '++', '--', '&&', '||', '!'];
  for (var i = 0; i < 18; i++) {
    var span = document.createElement('span');
    span.className = 'tech-char';
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.animationDuration = (6 + Math.random() * 10) + 's';
    span.style.animationDelay = (Math.random() * 12) + 's';
    span.style.fontSize = (.5 + Math.random() * .5) + 'rem';
    container.appendChild(span);
  }
}

/* ═══════════════════════════════════════════════════════
   LIVE CLOCK
   ═══════════════════════════════════════════════════════ */
function initLiveClock() {
  var el = $('#liveClock');
  if (!el) return;
  function update() {
    var now = new Date();
    el.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}

/* ═══════════════════════════════════════════════════════
   SERVICE TABS
   ═══════════════════════════════════════════════════════ */
function initTabs() {
  $$('.services-tabs__btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var tab = btn.dataset.tab;
      $$('.services-tabs__btn').forEach(function(b) { b.classList.remove('active'); });
      $$('.services-tabs__panel').forEach(function(p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = $('#tab-' + tab);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ═══════════════════════════════════════════════════════
   TRIPPY SCROLL-DRIVEN FRAMES
   ═══════════════════════════════════════════════════════ */
function initTrippy() {
  var wrap = document.querySelector('.hero-wrap');
  var container = document.querySelector('#trippyFrames');
  var heroContent = document.querySelector('.hero__content');
  if (!wrap || !container || REDUCED) return;

  var colors = ['var(--ink)', 'var(--paper)'];
  var parent = container;
  for (var i = 0; i < 20; i++) {
    var div = document.createElement('div');
    div.className = 'trippy__frame';
    div.style.background = colors[i % 2];
    div.style.padding = '2vmin';
    parent.appendChild(div);
    parent = div;
  }

  var frames = container.querySelectorAll('.trippy__frame');

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
    }
  });

  tl.to(container, { top: '0%', ease: 'none' }, 0);
  tl.to(heroContent, { opacity: 0, ease: 'none' }, 0);
  tl.to(frames, { scale: 1, rotate: '0deg', duration: 0.25, ease: 'none' }, 0);
  tl.to(frames, { scale: 0.9, rotate: '30deg', duration: 0.55, ease: 'none' }, 0.25);
  tl.to(frames, { scale: 1.25, rotate: '60deg', duration: 0.2, ease: 'none' }, 0.8);
}

/* ═══════════════════════════════════════════════════════
   TEXT RADIUS HOVER — color shift around cursor radius
   ═══════════════════════════════════════════════════════ */
function initTextRadiusHover() {
  if (!FINE_POINTER || REDUCED) return;

  const RADIUS = 85; // 85px radius around camera viewfinder cursor
  let tickScheduled = false;

  function updateRadiusHover() {
    const elements = $$('.hero__char, .char-reveal, .work__client, .service-name, .menu-overlay__link, .section__eyebrow, .statement__heading, .page-hero__title, .contact-hero__title');

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;

      const dist = Math.hypot(mx - elX, my - elY);

      if (dist < RADIUS) {
        el.classList.add('in-cursor-radius');
      } else {
        el.classList.remove('in-cursor-radius');
      }
    });

    tickScheduled = false;
  }

  let lastUpdate = 0;
  window.addEventListener('mousemove', () => {
    if (Date.now() - lastUpdate > 50) {
      if (!tickScheduled) {
        tickScheduled = true;
        requestAnimationFrame(updateRadiusHover);
      }
      lastUpdate = Date.now();
    }
  }, { passive: true });
}




/* ═══════════════════════════════════════════════════════
   3D CARD TILT & MOUSE SPOTLIGHT SHEEN
   ═══════════════════════════════════════════════════════ */
function init3DTiltCards() {
  if (!FINE_POINTER || REDUCED || typeof gsap === 'undefined') return;

  const selector = '.work__item, .exp-card, .capability, .toolkit__card, .services-grid__card, .pricing__card, .dossier__card';

  document.querySelectorAll(selector).forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.35,
        ease: 'power1.out',
      });
    });

    card.addEventListener('mouseleave', function() {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════
   MAGNETIC BUTTON PHYSICS
   ═══════════════════════════════════════════════════════ */
function initMagneticButtons() {
  if (!FINE_POINTER || REDUCED || typeof gsap === 'undefined') return;

  const selectors = '.cta__btn, .work__play, .nav__menu-btn, .exp-badge, .nav__logo';

  document.querySelectorAll(selectors).forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      gsap.to(btn, {
        x: x * 0.32,
        y: y * 0.32,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', function() {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'elastic.out(1.2, 0.4)'
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════
   HERO WAVEFORM AUDIO VISUALIZER
   ═══════════════════════════════════════════════════════ */
function initWaveformAnim() {
  if (REDUCED) return;
  const bars = $$('.waveform__bar');
  if (!bars.length) return;

  function randomizeWaveform() {
    bars.forEach(function(bar) {
      const targetH = Math.floor(4 + Math.random() * 22);
      if (typeof gsap !== 'undefined') {
        gsap.to(bar, {
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

/* ═══════════════════════════════════════════════════════
   INITIALIZATION
   ═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  initHero();
  initCursor();
  initScrollProgress();
  initMenu();
  initSmartNav();
  initAnimations();
  initCounters();
  initParallax();
  initHorizontalWork();
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
  initScrambleHover();
  initLadderJourney();
  initClimber();
  init3DTiltCards();
  initMagneticButtons();
  initWaveformAnim();

  if (typeof ScrollTrigger !== 'undefined') {
    setTimeout(function() { ScrollTrigger.refresh(); }, 400);
  }
});

/* ============================================================
   THE CLIMB - sprite climber follows scroll
   ============================================================ */
function initClimber() {
  const grid = document.querySelector('#expGrid');
  const climber = document.querySelector('#climber');
  const img = document.querySelector('#climberImg');
  const yearEl = document.querySelector('#expYear');
  const altEl = document.querySelector('#expAlt');
  const cards = document.querySelectorAll('.exp-card');
  const rungs = document.querySelectorAll('.ladder__rung');
  if (!grid || !climber) return;

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
    const total = rect.height - innerHeight * 0.6;
    let p = (innerHeight * 0.55 - rect.top) / Math.max(total, 1);
    if (p < 0) p = 0;
    if (p > 1) p = 1;

    // Climber stays cleanly on the ladder and stops below the year header
    const climbBottom = 2 + p * 68;
    climber.style.bottom = `${climbBottom}%`;
    if (!REDUCED) {
      const frame = Math.floor(p * 64) % FRAMES;
      img.src = sprites[frame];
    }
    if (altEl) altEl.textContent = String(Math.round(p * 847)).padStart(3, '0');

    // Light up rungs passed by climber
    rungs.forEach(function(rung, i) {
      const rungPos = (i / Math.max(rungs.length - 1, 1)) * 100;
      if (climbBottom >= rungPos) {
        rung.classList.add('active');
      } else {
        rung.classList.remove('active');
      }
    });

    // Active card = nearest viewport center
    let best = null, bestD = Infinity;
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - innerHeight / 2);
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
