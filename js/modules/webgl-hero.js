export function initWebGLHero() {
  const IS_HOME = !document.body.classList.contains('page-sub');
  if (!IS_HOME) return null;
  const canvas = document.querySelector('#bg3d');
  const hero = document.querySelector('.hero');
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canvas || !hero || typeof THREE === 'undefined') return null;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 15;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  const shapesGroup = new THREE.Group();
  scene.add(shapesGroup);
  const material = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const geometries = [
    new THREE.IcosahedronGeometry(2, 0),
    new THREE.TorusGeometry(1.5, 0.5, 16, 32),
    new THREE.OctahedronGeometry(1.8, 0),
    new THREE.DodecahedronGeometry(2, 0),
    new THREE.TetrahedronGeometry(1.5, 1)
  ];
  const shapes = [];
  for (let i = 0; i < 15; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.x = (Math.random() - 0.5) * 30;
    mesh.position.y = (Math.random() - 0.5) * 20;
    mesh.position.z = (Math.random() - 0.5) * 20 - 5;
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.01,
      ry: (Math.random() - 0.5) * 0.01,
      rz: (Math.random() - 0.5) * 0.01,
      floatSpeed: Math.random() * 0.02 + 0.01,
      baseY: mesh.position.y,
      timeOffset: Math.random() * Math.PI * 2
    };
    shapesGroup.add(mesh);
    shapes.push(mesh);
  }
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  if (!REDUCED) {
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.005;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.005;
    }, { passive: true });
  }
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    if (!REDUCED) {
      targetX = mouseX * 2;
      targetY = mouseY * 2;
      shapesGroup.rotation.y += 0.05 * (targetX - shapesGroup.rotation.y);
      shapesGroup.rotation.x += 0.05 * (targetY - shapesGroup.rotation.x);
    }
    shapesGroup.position.y = scrollY * 0.01;
    shapes.forEach(mesh => {
      mesh.rotation.x += mesh.userData.rx;
      mesh.rotation.y += mesh.userData.ry;
      mesh.rotation.z += mesh.userData.rz;
      mesh.position.y = mesh.userData.baseY + Math.sin(time * mesh.userData.floatSpeed + mesh.userData.timeOffset) * 1.5;
    });
    renderer.render(scene, camera);
  }
  animate();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
  }, { passive: true });
  return renderer;
}