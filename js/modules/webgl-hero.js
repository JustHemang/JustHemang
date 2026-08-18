// Uses global window.THREE loaded from CDN

export function initWebGLHero() {
  const IS_HOME = !document.body.classList.contains('page-sub');
  if (!IS_HOME) return null;

  const canvas = document.querySelector('#heroCanvas');
  const hero = document.querySelector('.hero--sticky');
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!canvas || !hero) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, hero.clientWidth / hero.clientHeight, 0.1, 100);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(hero.clientWidth, hero.clientHeight);

  // Logo Texture (Using optimized WebP if available)
  const textureLoader = new THREE.TextureLoader();
  const logoTexture = textureLoader.load('Logo Transparent.png');
  const logoMat = new THREE.MeshBasicMaterial({
    map: logoTexture, 
    transparent: true, 
    opacity: 0.4,
    side: THREE.DoubleSide, 
    depthWrite: false,
  });
  const logoGeo = new THREE.PlaneGeometry(2.2, 2.2);
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  scene.add(logoMesh);

  // Holographic Rings
  const ringGeo = new THREE.RingGeometry(1.6, 1.63, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  scene.add(ring);

  const outerGeo = new THREE.RingGeometry(2.1, 2.13, 64);
  const outerMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
  const outer = new THREE.Mesh(outerGeo, outerMat);
  scene.add(outer);

  // Fluid-like Cyber Particles
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particlePhases = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    particlePos[idx] = (Math.random() - 0.5) * 12;
    particlePos[idx + 1] = (Math.random() - 0.5) * 8;
    particlePos[idx + 2] = (Math.random() - 0.5) * 6;
    particlePhases[i] = Math.random() * Math.PI * 2;
  }
  
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('phase', new THREE.BufferAttribute(particlePhases, 1));
  
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
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
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = hero.clientWidth, h = hero.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }, 100);
  });

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);
    
    const t = performance.now() * 0.0003;
    
    // Smooth magnetic easing for interactive rotation
    logoMesh.rotation.y += ((t * 0.3 + mouseX * 0.2) - logoMesh.rotation.y) * 0.05;
    logoMesh.rotation.x += ((Math.sin(t) * 0.08 + mouseY * 0.1) - logoMesh.rotation.x) * 0.05;
    logoMesh.position.y = Math.sin(t * 1.5) * 0.06;
    
    ring.rotation.z = t * 0.15;
    ring.position.y = Math.sin(t * 1.5) * 0.06;
    
    outer.rotation.z = -t * 0.1;
    outer.position.y = Math.sin(t * 1.5) * 0.06;
    
    particles.rotation.y = t * 0.08 + mouseX * 0.05;
    particles.rotation.x = Math.sin(t * 0.05) * 0.1 + mouseY * 0.05;

    // Organic particle wave motion
    const positions = particles.geometry.attributes.position.array;
    const phases = particles.geometry.attributes.phase.array;
    for(let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx + 1] += Math.sin(t * 2 + phases[i]) * 0.002;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  if (REDUCED) { 
    logoMesh.rotation.y = 0.2; 
    renderer.render(scene, camera); 
    return null; 
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries[0].isIntersecting;
    if (visible && !running) { 
      running = true; 
      animate(); 
    }
    if (!visible) running = false;
  }, { root: null });
  
  observer.observe(hero);
  animate();

  return {
    destroy: () => {
      running = false;
      observer.disconnect();
      renderer.dispose();
    }
  };
}
