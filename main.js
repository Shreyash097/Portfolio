(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $('#year').textContent = new Date().getFullYear();
  window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 350));

  /* ---------- typed roles ---------- */
  const roles = ['Full Stack Developer', 'Node.js & MERN Engineer', 'AI / RAG Builder', 'Database Migration Lead'];
  const typed = $('#typed');
  if (reduce) typed.textContent = roles[0];
  else {
    let r = 0, i = 0, del = false;
    (function tick() {
      const w = roles[r];
      typed.textContent = w.slice(0, i);
      if (!del && i === w.length) { del = true; return setTimeout(tick, 1400); }
      if (del && i === 0) { del = false; r = (r + 1) % roles.length; }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 75);
    })();
  }

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  $$('[data-count]').forEach(el => {
    const to = +el.dataset.count; let n = 0;
    const step = () => { n += Math.max(1, to / 40); if (n >= to) return el.textContent = to + (to === 7 ? ' → v7' : '+'); el.textContent = Math.floor(n); requestAnimationFrame(step); };
    setTimeout(step, 600);
  });
  const mongo = $('[data-count="7"]'); if (mongo) setTimeout(() => mongo.textContent = 'v3 → v7', 1600);

  /* ---------- scroll progress ---------- */
  const bar = $('#progress');
  let scrollP = 0;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    scrollP = h > 0 ? scrollY / h : 0;
    bar.style.width = scrollP * 100 + '%';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- custom cursor, magnetic buttons, tilt ---------- */
  if (fine) {
    const g = $('#glow');
    let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; g.style.opacity = 1; });
    document.addEventListener('mouseleave', () => g.style.opacity = 0);
    (function loop() { gx += (tx - gx) * .12; gy += (ty - gy) * .12; g.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(loop); })();
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const b = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * .25}px,${(e.clientY - b.top - b.height / 2) * .35}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
    if (!reduce) $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const b = el.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  /* ---------- Hire me drawer ---------- */
  const dr = $('#drawer'), bg = $('#drawerBg');
  const setDrawer = on => {
    dr.classList.toggle('open', on); dr.setAttribute('aria-hidden', !on);
    document.body.classList.toggle('drawer-open', on);
    if (on) { bg.hidden = false; requestAnimationFrame(() => bg.classList.add('show')); $('#drawerClose').focus(); }
    else { bg.classList.remove('show'); setTimeout(() => bg.hidden = true, 350); }
  };
  $('#hireBtn').addEventListener('click', e => { e.preventDefault(); setDrawer(true); });
  $('#drawerClose').addEventListener('click', () => setDrawer(false));
  bg.addEventListener('click', () => setDrawer(false));
  addEventListener('keydown', e => { if (e.key === 'Escape') setDrawer(false); });

  /* ---------- WhatsApp message ---------- */
  $('#waForm').addEventListener('submit', e => {
    e.preventDefault();
    const text = `Hi Shreyash, I'm ${$('#waName').value.trim()}.\n${$('#waMsg').value.trim()}\n\n(sent from your portfolio)`;
    open('https://wa.me/918887984720?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });

  /* ---------- skills inventory ---------- */
  const LV = { high: ['HIGH', 3], op: ['OPERATIONAL', 2], dev: ['DEVELOPING', 1] };
  const SKILLS = [
    ['JavaScript', 'Programming', 'high'], ['Java', 'Programming', 'op'], ['SQL', 'Programming', 'op'], ['TypeScript', 'Programming', 'dev'],
    ['React.js', 'Frontend', 'high'], ['HTML / CSS', 'Frontend', 'high'], ['Tailwind CSS', 'Frontend', 'op'],
    ['Node.js', 'Backend', 'high'], ['Express.js', 'Backend', 'high'], ['REST APIs', 'Backend', 'high'], ['API Integrations', 'Backend', 'high'],
    ['Docker', 'Cloud & DevOps', 'high'], ['Git', 'Cloud & DevOps', 'high'], ['GitHub', 'Cloud & DevOps', 'high'], ['Vercel', 'Cloud & DevOps', 'op'],
    ['MongoDB', 'Data', 'high'], ['MySQL', 'Data', 'op'], ['Pinecone', 'Data', 'op'], ['RAG', 'Data', 'op'],
    ['Postman', 'Tools', 'op'], ['Jira', 'Tools', 'op'], ['Notion', 'Tools', 'op'], ['VS Code', 'Tools', 'high'],
    ['System Design', 'Learning', 'dev'], ['Agentic AI', 'Learning', 'dev'], ['Automation Concepts', 'Learning', 'dev'], ['Machine Learning Fundamentals', 'Learning', 'dev'],
    ['Cursor', 'AI Coding Tools', 'high'], ['Antigravity', 'AI Coding Tools', 'high'], ['Claude Code', 'AI Coding Tools', 'high'],
  ];
  const cats = ['All', ...new Set(SKILLS.map(s => s[1]))];
  const fWrap = $('#skillFilters'), grid = $('#skillGrid');
  const drawSkills = cat => {
    grid.innerHTML = SKILLS.filter(s => cat === 'All' || s[1] === cat).map(([n, c, l]) =>
      `<div class="sk"><b>${n}</b><span class="mono">${c}</span><div class="row mono"><em>PROFICIENCY: ${LV[l][0]}</em><i class="pips" data-n="${LV[l][1]}"><u></u><u></u><u></u></i></div></div>`).join('');
    $$('.chip', fWrap).forEach(b => { const on = b.dataset.c === cat; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  };
  cats.forEach(c => { const b = document.createElement('button'); b.className = 'chip mono'; b.dataset.c = c; b.textContent = c.toUpperCase(); b.setAttribute('role', 'tab'); b.onclick = () => drawSkills(c); fWrap.appendChild(b); });
  drawSkills('All');

  /* ---------- Three.js background ---------- */
  const canvas = $('#bg');
  if (!window.THREE) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080f, .035);
  const camera = new THREE.PerspectiveCamera(60, 1, .1, 200);
  camera.position.set(0, 0, 14);

  const mobile = innerWidth < 760;
  const group = new THREE.Group(); scene.add(group);

  // hero core: glowing wireframe icosahedron + inner knot + orbit rings
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 1),
    new THREE.MeshBasicMaterial({ color: 0x7c5cff, wireframe: true, transparent: true, opacity: .55 }));
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.35, .38, 160, 18),
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: .8, roughness: .25, emissive: 0x0a3a55, emissiveIntensity: .8 }));
  group.add(core, knot);
  const rings = [0, 1, 2].map(i => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(4.4 + i * .7, .014, 8, 160),
      new THREE.MeshBasicMaterial({ color: [0x22d3ee, 0xff5cae, 0x7c5cff][i], transparent: true, opacity: .6 }));
    m.rotation.set(i * 1.1, i * .6, 0); group.add(m); return m;
  });
  group.position.x = mobile ? 0 : 4.2;
  if (mobile) group.scale.setScalar(.7);

  scene.add(new THREE.AmbientLight(0x6666aa, .8));
  const l1 = new THREE.PointLight(0x7c5cff, 60, 40); l1.position.set(6, 5, 8); scene.add(l1);
  const l2 = new THREE.PointLight(0xff5cae, 40, 40); l2.position.set(-7, -4, 6); scene.add(l2);

  // starfield
  const N = mobile ? 900 : 2200, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), tmp = new THREE.Color();
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - .5) * 90; pos[i * 3 + 1] = (Math.random() - .5) * 90; pos[i * 3 + 2] = (Math.random() - .5) * 140 - 20;
    tmp.setHSL(.55 + Math.random() * .25, .9, .65); col.set([tmp.r, tmp.g, tmp.b], i * 3);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); sg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: .09, vertexColors: true, transparent: true, opacity: .9, depthWrite: false }));
  scene.add(stars);

  // floating polyhedra along the scroll path
  const floaters = [];
  const geos = [new THREE.OctahedronGeometry(.8), new THREE.TetrahedronGeometry(.9), new THREE.IcosahedronGeometry(.7), new THREE.BoxGeometry(1, 1, 1)];
  for (let i = 0; i < (mobile ? 10 : 22); i++) {
    const m = new THREE.Mesh(geos[i % 4], new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(.5 + Math.random() * .25, .8, .55), metalness: .7, roughness: .3, wireframe: Math.random() > .5 }));
    const side = i % 2 ? 1 : -1;
    m.position.set(side * (4 + Math.random() * 9), (Math.random() - .5) * 14, -Math.random() * 60);
    m.userData = { v: (Math.random() + .3) * .01, ph: Math.random() * 6 };
    scene.add(m); floaters.push(m);
  }

  const mouse = { x: 0, y: 0 };
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth - .5; mouse.y = e.clientY / innerHeight - .5; });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  const clock = new THREE.Clock();
  let camZ = 14;
  function frame() {
    const t = clock.getElapsedTime();
    const heroFade = Math.max(0, 1 - scrollP * 5);   // hero core fades as you scroll
    group.rotation.y = t * .25 + mouse.x * .8; group.rotation.x = mouse.y * .5;
    knot.rotation.x = t * .5; knot.rotation.y = t * .3;
    core.rotation.y = -t * .15;
    rings.forEach((r, i) => { r.rotation.z += .004 * (i + 1); r.material.opacity = .6 * heroFade; });
    core.material.opacity = .55 * heroFade; knot.visible = heroFade > .02; knot.scale.setScalar(.4 + heroFade * .6);
    group.position.y = scrollP * 10;

    // fly forward through the scene while scrolling
    const target = 14 - scrollP * 62;
    camZ += (target - camZ) * .06;
    camera.position.z = camZ;
    camera.position.x += (mouse.x * 3 - camera.position.x) * .04;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * .04;
    camera.lookAt(0, 0, camZ - 20);

    floaters.forEach(m => { m.rotation.x += m.userData.v; m.rotation.y += m.userData.v * 1.3; m.position.y += Math.sin(t + m.userData.ph) * .004; });
    stars.rotation.z = t * .01;
    l1.color.setHSL((.7 + scrollP * .3) % 1, .9, .6);
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }
  frame();
  if (reduce) addEventListener('scroll', frame, { passive: true });
})();
