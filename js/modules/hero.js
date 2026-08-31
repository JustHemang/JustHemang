export function initHeroGrid() {
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

      const chars = '01+-/\\*•&^%$#@!;:><[]{}';
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

  // Hero Text Transition
  const heroText1 = document.getElementById('heroText1');
  const heroText2 = document.getElementById('heroText2');
  
  if (heroText1 && heroText2 && typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const splitText = (element) => {
      const text = element.textContent.trim();
      element.innerHTML = '';
      text.split('').forEach(char => {
        const span = document.createElement('span');
        if (char === ' ') {
          span.innerHTML = '&nbsp;';
        } else {
          span.textContent = char;
        }
        span.style.cssText = 'display:inline-block;';
        element.appendChild(span);
      });
      return element.querySelectorAll('span');
    };

    const spans1 = splitText(heroText1);
    const spans2 = splitText(heroText2);

    // Initial entrance animation for HERTX
    gsap.set(spans1, { opacity: 0, y: 80, rotateX: -60, transformOrigin: 'bottom center' });
    gsap.to(spans1, {
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.8, ease: 'power3.out',
      stagger: 0.05, delay: 0.3
    });

    // Scroll animation for transitioning from HERTX to JUST HEMANG
    gsap.set(heroText2, { opacity: 1 }); // Container needs to be visible
    gsap.set(spans2, { opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-wrap',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    tl.to(spans1, {
      opacity: 0,
      y: -50,
      scale: 1.1,
      filter: 'blur(10px)',
      stagger: 0.02,
      ease: 'power2.inOut',
      duration: 1
    }, 0)
    .to(spans2, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      stagger: 0.02,
      ease: 'power2.inOut',
      duration: 1
    }, 0.2);
  }
}
