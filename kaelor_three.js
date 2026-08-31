(() => {
  const canvas = document.getElementById('bg3d');
  if (!canvas || typeof THREE === 'undefined') return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 55;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const TQ = 0x00e5cc;
  const TQ_DIM = 0x003d36;
  const ambient = new THREE.AmbientLight(TQ, 0.06);
  scene.add(ambient);
  const pl1 = new THREE.PointLight(TQ, 0.5, 130);
  pl1.position.set(-35, 25, 25);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(TQ, 0.35, 100);
  pl2.position.set(35, -20, 18);
  scene.add(pl2);
  const shapes = [];
  const wireMat = new THREE.MeshBasicMaterial({ color: TQ, wireframe: true, transparent: true, opacity: 0.035 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: TQ_DIM, metalness: 0.15, roughness: 0.2, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
  const edgeMat = new THREE.LineBasicMaterial({ color: TQ, transparent: true, opacity: 0.06 });
  function addShape(geo, mat, pos, speed) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(mesh);
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, edgeMat.clone());
    mesh.add(line);
    shapes.push({
      mesh, line,
      rx: (Math.random() - 0.5) * speed,
      ry: (Math.random() - 0.5) * speed * 1.3,
      rz: (Math.random() - 0.5) * speed * 0.5,
      floatSpeed: 0.15 + Math.random() * 0.35,
      floatAmp: 1.5 + Math.random() * 2.5,
      baseY: pos[1],
      scrollFactor: (Math.random() - 0.5) * 0.5,
    });
  }
  addShape(new THREE.IcosahedronGeometry(3.5, 0), wireMat.clone(), [-30, 14, -20], 0.006);
  addShape(new THREE.OctahedronGeometry(2.5, 0), glassMat.clone(), [28, -12, -24], 0.009);
  addShape(new THREE.TorusGeometry(2.8, 0.6, 10, 20), wireMat.clone(), [-20, -18, -22], 0.007);
  addShape(new THREE.TorusKnotGeometry(2, 0.5, 48, 10), glassMat.clone(), [24, 16, -18], 0.005);
  addShape(new THREE.DodecahedronGeometry(2.2, 0), wireMat.clone(), [-32, -4, -28], 0.008);
  addShape(new THREE.ConeGeometry(1.8, 3.5, 6), glassMat.clone(), [32, 4, -30], 0.01);
  addShape(new THREE.RingGeometry(2, 2.8, 20), wireMat.clone(), [0, -20, -16], 0.004);
  addShape(new THREE.TetrahedronGeometry(2.5, 0), glassMat.clone(), [-14, 22, -26], 0.011);
  addShape(new THREE.IcosahedronGeometry(1.8, 1), wireMat.clone(), [14, -24, -20], 0.007);
  const outerRingGeo = new THREE.TorusGeometry(22, 0.08, 8, 64);
  const outerRingMat = new THREE.MeshBasicMaterial({ color: TQ, transparent: true, opacity: 0.04 });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.x = Math.PI / 2.5;
  scene.add(outerRing);
  const outerRing2Geo = new THREE.TorusGeometry(28, 0.05, 8, 80);
  const outerRing2Mat = new THREE.MeshBasicMaterial({ color: TQ, transparent: true, opacity: 0.025 });
  const outerRing2 = new THREE.Mesh(outerRing2Geo, outerRing2Mat);
  outerRing2.rotation.x = Math.PI / 3;
  outerRing2.rotation.z = Math.PI / 4;
  scene.add(outerRing2);
  const PC = 150;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PC * 3);
  const pVel = [];
  for (let i = 0; i < PC; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 110;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 80;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    pVel.push({ x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 });
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pSizes = new Float32Array(PC);
  for (let i = 0; i < PC; i++) pSizes[i] = 0.1 + Math.random() * 0.2;
  pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));
  const pMat = new THREE.PointsMaterial({ color: TQ, size: 0.18, transparent: true, opacity: 0.3, sizeAttenuation: true });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);
  const lGeo = new THREE.BufferGeometry();
  const lPos = new Float32Array(PC * PC * 6);
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lGeo.setDrawRange(0, 0);
  const lMat = new THREE.LineBasicMaterial({ color: TQ, transparent: true, opacity: 0.03 });
  const lineSegs = new THREE.LineSegments(lGeo, lMat);
  scene.add(lineSegs);
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  let sy = 0, tsy = 0;
  document.addEventListener('mousemove', (e) => {
    tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener('scroll', () => { tsy = window.scrollY; }, { passive: true });
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);
  const clock = new THREE.Clock();
  const animate = () => {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    mx += (tmx - mx) * 0.025;
    my += (tmy - my) * 0.025;
    sy += (tsy - sy) * 0.05;
    const sn = sy / (document.body.scrollHeight - window.innerHeight || 1);
    camera.position.x = mx * 6;
    camera.position.y = -my * 4 - sn * 25;
    camera.lookAt(0, -sn * 12, -5);
    shapes.forEach((s) => {
      s.mesh.rotation.x += s.rx;
      s.mesh.rotation.y += s.ry;
      s.mesh.rotation.z += s.rz;
      s.mesh.position.y = s.baseY + Math.sin(t * s.floatSpeed) * s.floatAmp + sy * s.scrollFactor * 0.015;
    });
    outerRing.rotation.z = t * 0.03;
    outerRing2.rotation.y = t * 0.02;
    const pa = pGeo.attributes.position.array;
    for (let i = 0; i < PC; i++) {
      pa[i * 3] += pVel[i].x + mx * 0.002;
      pa[i * 3 + 1] += pVel[i].y;
      if (Math.abs(pa[i * 3]) > 60) pVel[i].x *= -1;
      if (Math.abs(pa[i * 3 + 1]) > 40) pVel[i].y *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;
    let li = 0;
    const maxD = 9;
    const lp = lGeo.attributes.position.array;
    lGeo.setDrawRange(0, 0);
    for (let i = 0; i < PC; i++) {
      for (let j = i + 1; j < PC; j++) {
        const dx = pa[i * 3] - pa[j * 3];
        const dy = pa[i * 3 + 1] - pa[j * 3 + 1];
        const dz = pa[i * 3 + 2] - pa[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < maxD * maxD) {
          lp[li] = pa[i * 3]; lp[li + 1] = pa[i * 3 + 1]; lp[li + 2] = pa[i * 3 + 2];
          lp[li + 3] = pa[j * 3]; lp[li + 4] = pa[j * 3 + 1]; lp[li + 5] = pa[j * 3 + 2];
          li += 6;
        }
      }
    }
    lGeo.setDrawRange(0, li / 3);
    lGeo.attributes.position.needsUpdate = true;
    pl1.intensity = 0.5 + Math.sin(t * 0.4) * 0.15;
    pl2.intensity = 0.35 + Math.cos(t * 0.3) * 0.1;
    renderer.render(scene, camera);
  };
  animate();
})();