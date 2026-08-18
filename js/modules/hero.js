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
  const heroText = document.getElementById('heroText');
  
  if (heroText && typeof window.gsap !== 'undefined') {
    const gsap = window.gsap;

    const text = heroText.textContent.trim();
    heroText.innerHTML = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      // Fix for spaces getting squished
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }
      span.style.cssText = 'display:inline-block;opacity:0;transform:translateY(80px) rotateX(-60deg);transform-origin:bottom center;';
      heroText.appendChild(span);
    });
    
    gsap.to(heroText.querySelectorAll('span'), {
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.8, ease: 'power3.out',
      stagger: 0.05, delay: 0.3
    });
  }
}
