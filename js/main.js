import { initCursor, initMagneticButtons } from './modules/cursor.js';
import { initWebGLHero } from './modules/webgl-hero.js';
import { initMenu, initPageTransition } from './modules/navigation.js';
import { 
  initAnimations, 
  initSmartNav, 
  initScrollProgress, 
  initScrambleHover, 
  initLadderJourney, 
  initCounters, 
  initParallax 
} from './modules/animations.js';
import { 
  initTimecode, 
  initFilmstrip, 
  initTypewriter, 
  initTechChars, 
  initLiveClock, 
  initTabs, 
  initClimber, 
  initWaveformAnim 
} from './modules/features.js';

let lenis;
let cursorRenderLoop = null;
let marqueeX = 0;
let scrollVelocity = 0;
let scrollDirection = 1;

function initLenis() {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (REDUCED || typeof window.Lenis === 'undefined') {
    requestAnimationFrame(function loopt() {
      if (cursorRenderLoop) cursorRenderLoop();
      requestAnimationFrame(loopt);
    });
    return;
  }

  lenis = new window.Lenis({
    duration: 1.4,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    smoothWheel: true,
  });

  lenis.on('scroll', (e) => {
    if (window.ScrollTrigger) window.ScrollTrigger.update();
    scrollVelocity = Math.abs(e.velocity);
    scrollDirection = e.direction;
  });

  if (window.gsap) {
    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);
  }

  function loop() {
    if (cursorRenderLoop) cursorRenderLoop();

    const marqueeTrack = document.querySelector('.marquee__track');
    if (marqueeTrack) {
      const speed = 0.5 + Math.min(scrollVelocity * 0.3, 4);
      const dir = scrollDirection >= 0 ? -1 : 1;
      marqueeX += speed * dir;
      // Using a safer arbitrary width wrap, or we can use the original logic
      if (Math.abs(marqueeX) > 1000) marqueeX = 0;
      marqueeTrack.style.transform = `translateX(${marqueeX}px)`;
    }

    scrollVelocity *= 0.95; // Decay velocity
    requestAnimationFrame(loop);
  }
  
  requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', () => {
  // Add a minor delay for entry animations to feel deliberate
  setTimeout(() => {
    document.body.classList.add('is-page-entering');
  }, 100);

  // Initialize Core Systems
  cursorRenderLoop = initCursor();
  initMagneticButtons();
  initMenu();
  initPageTransition();
  initScrollProgress();
  initSmartNav();
  
  // GSAP Animations
  initAnimations();
  initScrambleHover();
  initLadderJourney();
  initCounters();
  initParallax();
  
  // Custom Features
  initTimecode();
  initFilmstrip();
  initTypewriter();
  initTechChars();
  initLiveClock();
  initTabs();
  initClimber();
  initWaveformAnim();
  
  initLenis();
  
  // Hero is only relevant on Home page
  if (!document.body.classList.contains('page-sub')) {
    initWebGLHero();
  }

  if (typeof window.ScrollTrigger !== 'undefined') {
    setTimeout(() => { window.ScrollTrigger.refresh(); }, 400);
  }
});
