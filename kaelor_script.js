document.addEventListener('DOMContentLoaded', () => {

  // ═══ PAGE LOADER & TRANSITIONS ═══
  const loader = document.getElementById('pageLoader');
  const loaderLock = document.getElementById('loader-lock');
  const loaderTyped = document.getElementById('loaderTyped');
  const isVisited = sessionStorage.getItem('kaelor_visited');

  if (loader) {
    if (isVisited) {
      // Skip the 4.5s loader on subsequent visits
      loader.remove();
      document.body.classList.remove('loading');
      if (loaderLock) loaderLock.remove();

      // Play the exit animation of the page transition
      const transition = document.createElement('div');
      transition.className = 'page-transition';
      const bar = document.createElement('div');
      bar.className = 'page-transition-bar active exit';
      transition.appendChild(bar);
      document.body.appendChild(transition);
      
      setTimeout(() => {
        bar.classList.remove('active');
        setTimeout(() => transition.remove(), 650);
      }, 50);

    } else {
      // First visit - play full loader
      sessionStorage.setItem('kaelor_visited', 'true');
      document.body.classList.add('loading');
      if (loaderTyped) {
        const sequence = ['KAELOR', 'Creative Director', 'Lead Developer'];
        let seqIdx = 0;
        let charIdx = 0;
        let erasing = false;

        function tick() {
          const current = sequence[seqIdx];
          if (!erasing) {
            loaderTyped.textContent += current[charIdx];
            charIdx++;
            if (charIdx < current.length) {
              setTimeout(tick, 80);
            } else {
              setTimeout(() => { erasing = true; tick(); }, 900);
            }
          } else {
            loaderTyped.textContent = current.slice(0, charIdx);
            charIdx--;
            if (charIdx >= 0) {
              setTimeout(tick, 35);
            } else {
              erasing = false;
              seqIdx++;
              charIdx = 0;
              if (seqIdx < sequence.length) {
                setTimeout(tick, 200);
              }
            }
          }
        }
        tick();
      }
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s';
      }, 4500);
      setTimeout(() => {
        loader.remove();
        document.body.classList.remove('loading');
        if (loaderLock) loaderLock.remove();
      }, 4800);
    }
  } else if (loaderLock) {
    loaderLock.remove();
  }

  const hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    document.body.classList.add('no-gsap');
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ═══ HEADER SCROLL ═══
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ═══ OVERLAY MENU ═══
  const navToggle = document.querySelector('.nav-toggle');
  const overlayMenu = document.querySelector('.overlay-menu');
  const overlayLinks = document.querySelectorAll('.overlay-link');
  function openMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    overlayMenu.classList.add('open');
  }
  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    overlayMenu.classList.remove('open');
  }
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });
  overlayLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') closeMenu();
  });

  if (!hasGSAP) return;

  // ═══ HERO — BLUR TRANSITION KAELOR → MEDIA ═══
  const heroText = document.getElementById('heroText');
  const heroMedia = document.getElementById('heroMediaText');
  if (heroText && heroMedia) {
    const text = heroText.textContent.trim();
    heroText.innerHTML = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.cssText = 'display:inline-block;opacity:0;transform:translateY(80px) rotateX(-60deg);transform-origin:bottom center;';
      heroText.appendChild(span);
    });
    gsap.to(heroText.querySelectorAll('span'), {
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.8, ease: 'power3.out',
      stagger: 0.07, delay: 0.3
    });

    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        heroText.style.filter = `blur(${p * 20}px)`;
        heroText.style.opacity = 1 - p;
        heroText.style.transform = `scale(${1 + p * 0.05})`;
        heroMedia.style.opacity = p;
        heroMedia.style.filter = `blur(${(1 - p) * 20}px)`;
        heroMedia.style.transform = `scale(${0.95 + p * 0.05})`;
      }
    });
  }

  // ═══ CURSOR FOLLOWER ═══
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursorDot);
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  (function updateCursor() {
    cursor.style.transform = `translate(${mx - 18}px, ${my - 18}px)`;
    cursorDot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    requestAnimationFrame(updateCursor);
  })();
  document.querySelectorAll('a, button, .service-card, .work-item, .h-scroll-card, .pricing-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-grow'));
  });

  // ═══ FLOATING PARTICLES ═══
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  document.body.appendChild(particleContainer);
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}vw;top:${Math.random() * 100}vh;animation-duration:${Math.random() * 20 + 15}s;animation-delay:${Math.random() * 10}s;`;
    particleContainer.appendChild(p);
  }

  // ═══ 3D FLOATING BACKGROUND TEXT PARALLAX ═══
  gsap.utils.toArray('.bg-float-text').forEach(el => {
    gsap.to(el, {
      y: -120, rotation: -5, scale: 1.1,
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
    });
  });

  // ═══ SCROLL REVEALS — ONE CLEAN SYSTEM ═══
  const gridParents = '.services-grid, .work-grid, .work-grid-page, .stats-grid, .process-steps, .testimonials-grid, .pricing-grid, .team-grid, .about-values-grid, .services-detail, .contact-methods, .footer-nav, .social-links, .about-approach-grid, .services-hero-right, .about-story-grid, .services-hero-inner, .team-skills-grid, .collab-grid, .team-values-grid';

  gsap.utils.toArray('.reveal').forEach(el => {
    const parent = el.closest(gridParents);
    let delay = 0;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
      delay = siblings.indexOf(el) * 0.1;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: delay
      }
    );
  });

  // ═══ HIGHLIGHT BG SWEEP — SCROLLTRIGGER ═══
  gsap.utils.toArray('.highlight').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('revealed'),
      once: true
    });
  });

  // ═══ STAT COUNTERS ═══
  gsap.utils.toArray('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (!target) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { el.textContent = target; return; }
    const obj = { val: 0 };
    gsap.to(obj, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      val: target, duration: 2, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.val); }
    });
  });

  // ═══ GSAP HORIZONTAL SCROLL ═══
  const hSection = document.querySelector('.horizontal-scroll-section');
  if (hSection) {
    const hTrack = hSection.querySelector('.horizontal-track');
    if (hTrack) {
      const totalScroll = hTrack.scrollWidth - window.innerWidth;
      gsap.to(hTrack, {
        x: -totalScroll, ease: 'none',
        scrollTrigger: { trigger: hSection, start: 'top top', end: () => '+=' + totalScroll, scrub: 1.2, pin: true, anticipatePin: 1, invalidateOnRefresh: true }
      });
    }
  }

  // ═══ 3D TILT WITH CHILD MOVEMENT ═══
  const tiltCards = document.querySelectorAll('.service-card, .work-item, .testimonial-card, .pricing-card, .h-scroll-card, .services-hero-card, .service-detail-card, .about-value-card, .team-member');
  tiltCards.forEach(card => {
    const children = card.querySelectorAll('h3, h4, p, .service-icon, .service-features, .work-media, .work-info, .pricing-price, .pricing-desc, .pricing-features, .btn, .service-cta, .author-avatar, .testimonial-rating, .shc-icon, .about-value-num, .member-photo, span');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      gsap.to(card, { rotateX: (0.5 - y) * 8, rotateY: (x - 0.5) * 8, scale: 1.03, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
      children.forEach((child, i) => {
        const depth = 1 + (i % 3) * 0.5;
        gsap.to(child, { x: (x - 0.5) * 14 * depth, y: (y - 0.5) * 14 * depth, duration: 0.4, ease: 'power2.out' });
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      children.forEach(child => { gsap.to(child, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' }); });
    });
  });

  // ═══ MAGNETIC BUTTONS ═══
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // ═══ FILTER BUTTONS ═══
  const filterBtns = document.querySelectorAll('.filter-btn');
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  // ═══ PAGE TRANSITION ON CLICK ═══
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Only transition for internal links
      if (href && !href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:') && link.target !== '_blank' && href !== '#' && !href.startsWith('#')) {
        e.preventDefault();
        
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        const bar = document.createElement('div');
        bar.className = 'page-transition-bar';
        transition.appendChild(bar);
        document.body.appendChild(transition);
        
        // Trigger animation
        setTimeout(() => {
          bar.classList.add('active');
        }, 10);
        
        // Navigate after animation covers screen
        setTimeout(() => {
          window.location.href = href;
        }, 550);
      }
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('[data-filter]').forEach(target => {
        if (filter === 'all' || target.getAttribute('data-filter') === filter) {
          target.classList.remove('hidden');
          gsap.fromTo(target, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        } else {
          target.classList.add('hidden');
        }
      });
    });
  });

  // ═══ CONTACT FORM ═══
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.btn-primary');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Message Sent!';
      submitBtn.style.background = 'var(--accent-turquoise)';
      setTimeout(() => { submitBtn.textContent = originalText; submitBtn.style.background = ''; form.reset(); }, 3000);
    });
  }

  // ═══ HERO GRID HOVER ═══
  const heroGrid = document.getElementById('heroGrid');
  if (heroGrid) {
    const CELL_SIZE = 70;
    let activeCell = null;
    let fadeTimer = null;

    function buildHeroGrid() {
      heroGrid.innerHTML = '';
      const w = heroGrid.parentElement.clientWidth;
      const h = heroGrid.parentElement.clientHeight;
      const cols = Math.floor(w / CELL_SIZE);
      const rows = Math.floor(h / CELL_SIZE);

      heroGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      heroGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

      const chars = '01アイウエオカキクケコ∞∑∂√∫≈≠±×÷';
      for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement('div');
        cell.classList.add('hero-grid-cell');
        cell.textContent = chars[Math.floor(Math.random() * chars.length)];
        cell.addEventListener('mouseenter', () => {
          if (activeCell && activeCell !== cell) {
            activeCell.classList.remove('lit');
            activeCell.style.transition = 'background 0.8s ease';
          }
          clearTimeout(fadeTimer);
          cell.classList.add('lit');
          cell.style.transition = 'background 0.12s ease';
          activeCell = cell;
        });
        cell.addEventListener('mouseleave', () => {
          fadeTimer = setTimeout(() => {
            cell.style.transition = 'background 1.8s ease';
            cell.classList.remove('lit');
          }, 200);
        });
        heroGrid.appendChild(cell);
      }
    }

    buildHeroGrid();
    let gridResize;
    window.addEventListener('resize', () => {
      clearTimeout(gridResize);
      gridResize = setTimeout(buildHeroGrid, 200);
    });
  }

});
