(function () {
  'use strict';

  const W = 400, H = 300;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const sceneA = document.getElementById('scene-a');
  const sceneB = document.getElementById('scene-b');
  const foundEl = document.getElementById('found');
  const totalEl = document.getElementById('total');
  const timerEl = document.getElementById('timer');
  const missesEl = document.getElementById('misses');
  const diffSelect = document.getElementById('difficulty');
  const newGameBtn = document.getElementById('new-game');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayText = document.getElementById('overlay-text');
  const overlayClose = document.getElementById('overlay-close');

  const DIFFICULTY = { easy: 3, medium: 5, hard: 8, expert: 12 };

  let differences = [];
  let found = 0;
  let misses = 0;
  let startTs = 0;
  let timerHandle = null;
  let gameOver = false;

  // ---------- Utilities ----------
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  // ---------- Scene generator ----------
  function generateScene() {
    const shapes = [];

    // Sky (locked)
    shapes.push({ type: 'rect', x: 0, y: 0, w: W, h: 210, fill: '#9AD0EC', locked: true });
    // Ground (locked)
    shapes.push({ type: 'rect', x: 0, y: 210, w: W, h: H - 210, fill: '#7BC86C', locked: true });
    // Path (locked)
    shapes.push({ type: 'polygon', points: '150,300 250,300 220,210 180,210', fill: '#D4B37F', locked: true });

    // Sun or moon
    const isSun = Math.random() < 0.7;
    shapes.push({
      type: 'circle',
      cx: rand(40, 360), cy: rand(35, 80),
      r: rand(22, 30),
      fill: isSun ? '#FFD93D' : '#E8E8E8'
    });

    // House
    const hx = rand(45, 110);
    shapes.push({ type: 'rect', x: hx, y: 140, w: 90, h: 80, fill: pick(['#E6B58A', '#DEB887', '#C4A484']) });
    shapes.push({ type: 'polygon', points: `${hx - 10},140 ${hx + 100},140 ${hx + 45},90`, fill: pick(['#A0522D', '#8B4513', '#6B3410']) });
    shapes.push({ type: 'rect', x: hx + 35, y: 185, w: 20, h: 35, fill: '#5C3317' });
    shapes.push({ type: 'rect', x: hx + 60, y: 155, w: 22, h: 18, fill: '#B0E0E6' });
    shapes.push({ type: 'rect', x: hx + 70, y: 95, w: 10, h: 20, fill: '#555' });

    // Big tree
    const tx = rand(240, 300);
    shapes.push({ type: 'rect', x: tx, y: 170, w: 14, h: 50, fill: '#6B4423' });
    shapes.push({ type: 'circle', cx: tx + 7, cy: 165, r: 30, fill: pick(['#2E8B57', '#3CB371', '#228B22']) });

    // Bush
    const bx = rand(330, 380);
    shapes.push({ type: 'circle', cx: bx, cy: 200, r: 18, fill: '#3CB371' });

    // Clouds
    const cloudCount = randInt(2, 4);
    for (let i = 0; i < cloudCount; i++) {
      shapes.push({
        type: 'ellipse',
        cx: rand(40, 360), cy: rand(25, 95),
        rx: rand(22, 38), ry: rand(10, 16),
        fill: '#FFFFFF'
      });
    }

    // Flowers
    const flowerColors = ['#FF6B6B', '#FFB6C1', '#9370DB', '#FFD700', '#FF8C00', '#DA70D6'];
    const flowerCount = randInt(6, 9);
    for (let i = 0; i < flowerCount; i++) {
      shapes.push({
        type: 'circle',
        cx: rand(15, 385), cy: rand(240, 290),
        r: rand(5, 8),
        fill: pick(flowerColors)
      });
    }

    // Stones
    for (let i = 0; i < 3; i++) {
      shapes.push({
        type: 'ellipse',
        cx: rand(20, 380), cy: rand(250, 290),
        rx: rand(7, 12), ry: rand(4, 7),
        fill: pick(['#808080', '#A9A9A9', '#696969'])
      });
    }

    // Floating dots (birds/butterflies stylized)
    for (let i = 0; i < 2; i++) {
      shapes.push({
        type: 'circle',
        cx: rand(30, 370), cy: rand(110, 180),
        r: rand(4, 6),
        fill: pick(['#FF4500', '#1E90FF', '#FFD700'])
      });
    }

    // Optional star
    if (Math.random() < 0.5) {
      shapes.push({
        type: 'polygon',
        points: starPoints(rand(50, 350), rand(40, 90), 8),
        fill: '#FFF'
      });
    }

    return shapes;
  }

  function starPoints(cx, cy, size) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? size : size * 0.45;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  // ---------- Shape geometry helpers ----------
  function shapeCenter(s) {
    switch (s.type) {
      case 'rect': return { x: s.x + s.w / 2, y: s.y + s.h / 2 };
      case 'circle':
      case 'ellipse': return { x: s.cx, y: s.cy };
      case 'polygon': {
        const pts = s.points.trim().split(/\s+/).map(p => p.split(',').map(Number));
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
      }
    }
  }

  function shapeRadius(s) {
    switch (s.type) {
      case 'rect': return Math.max(s.w, s.h) / 2 + 8;
      case 'circle': return s.r + 8;
      case 'ellipse': return Math.max(s.rx, s.ry) + 8;
      case 'polygon': {
        const c = shapeCenter(s);
        const pts = s.points.trim().split(/\s+/).map(p => p.split(',').map(Number));
        let max = 0;
        for (const [x, y] of pts) {
          const d = Math.hypot(x - c.x, y - c.y);
          if (d > max) max = d;
        }
        return max + 8;
      }
    }
  }

  // ---------- Mutations ----------
  function mutateShape(shape) {
    const mutType = pick(['color', 'size', 'move']);
    if (mutType === 'color') {
      const palette = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9D6BFF', '#FF8C42', '#E91E63', '#00BCD4', '#FFFFFF'];
      let newColor;
      let tries = 0;
      do { newColor = pick(palette); tries++; } while (newColor.toUpperCase() === (shape.fill || '').toUpperCase() && tries < 8);
      shape.fill = newColor;
      return;
    }
    if (mutType === 'size') {
      const factor = Math.random() < 0.5 ? rand(0.55, 0.72) : rand(1.4, 1.75);
      if (shape.type === 'rect') {
        const cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
        shape.w = Math.max(6, shape.w * factor);
        shape.h = Math.max(6, shape.h * factor);
        shape.x = cx - shape.w / 2;
        shape.y = cy - shape.h / 2;
      } else if (shape.type === 'circle') {
        shape.r = Math.max(4, shape.r * factor);
      } else if (shape.type === 'ellipse') {
        shape.rx = Math.max(4, shape.rx * factor);
        shape.ry = Math.max(3, shape.ry * factor);
      } else if (shape.type === 'polygon') {
        const c = shapeCenter(shape);
        const pts = shape.points.trim().split(/\s+/).map(p => p.split(',').map(Number));
        shape.points = pts.map(([x, y]) => {
          const nx = c.x + (x - c.x) * factor;
          const ny = c.y + (y - c.y) * factor;
          return `${nx.toFixed(1)},${ny.toFixed(1)}`;
        }).join(' ');
      }
      return;
    }
    // move
    let dx, dy;
    do { dx = rand(-35, 35); dy = rand(-22, 22); } while (Math.hypot(dx, dy) < 16);
    if (shape.type === 'rect') { shape.x += dx; shape.y += dy; }
    else if (shape.type === 'circle' || shape.type === 'ellipse') { shape.cx += dx; shape.cy += dy; }
    else if (shape.type === 'polygon') {
      const pts = shape.points.trim().split(/\s+/).map(p => p.split(',').map(Number));
      shape.points = pts.map(([x, y]) => `${(x + dx).toFixed(1)},${(y + dy).toFixed(1)}`).join(' ');
    }
  }

  function createRandomShape() {
    const type = pick(['circle', 'ellipse', 'rect']);
    const palette = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9D6BFF', '#FF8C42', '#E91E63'];
    if (type === 'circle') {
      return { type, cx: rand(30, 370), cy: rand(30, 280), r: rand(7, 13), fill: pick(palette) };
    }
    if (type === 'ellipse') {
      return { type, cx: rand(30, 370), cy: rand(30, 280), rx: rand(9, 16), ry: rand(5, 10), fill: pick(palette) };
    }
    const w = rand(15, 28), h = rand(10, 20);
    return { type, x: rand(20, 360), y: rand(30, 270), w, h, fill: pick(palette) };
  }

  // ---------- SVG rendering ----------
  function shapeToElement(s) {
    let el;
    switch (s.type) {
      case 'rect':
        el = document.createElementNS(SVG_NS, 'rect');
        el.setAttribute('x', s.x);
        el.setAttribute('y', s.y);
        el.setAttribute('width', s.w);
        el.setAttribute('height', s.h);
        break;
      case 'circle':
        el = document.createElementNS(SVG_NS, 'circle');
        el.setAttribute('cx', s.cx);
        el.setAttribute('cy', s.cy);
        el.setAttribute('r', s.r);
        break;
      case 'ellipse':
        el = document.createElementNS(SVG_NS, 'ellipse');
        el.setAttribute('cx', s.cx);
        el.setAttribute('cy', s.cy);
        el.setAttribute('rx', s.rx);
        el.setAttribute('ry', s.ry);
        break;
      case 'polygon':
        el = document.createElementNS(SVG_NS, 'polygon');
        el.setAttribute('points', s.points);
        break;
    }
    if (s.fill) el.setAttribute('fill', s.fill);
    return el;
  }

  function renderScene(container, shapes) {
    container.innerHTML = '';
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    for (const s of shapes) svg.appendChild(shapeToElement(s));
    container.appendChild(svg);
    return svg;
  }

  // ---------- Game loop ----------
  function startGame() {
    const count = DIFFICULTY[diffSelect.value] || 5;
    const baseShapes = generateScene();

    const mutableIndexes = baseShapes
      .map((s, i) => (!s.locked ? i : -1))
      .filter(i => i !== -1);
    const shuffled = mutableIndexes.slice().sort(() => Math.random() - 0.5);

    const shapesA = clone(baseShapes);
    const shapesB = clone(baseShapes);
    differences = [];

    let placed = 0;
    let idx = 0;
    const mutationTypes = ['color', 'size', 'move', 'remove', 'add'];

    while (placed < count) {
      const canMutate = idx < shuffled.length;
      let mType = canMutate ? pick(mutationTypes) : 'add';
      // Reduce frequency of add so most differences come from existing shapes
      if (canMutate && mType === 'add' && Math.random() < 0.6) mType = pick(['color', 'size', 'move', 'remove']);

      if (mType === 'add') {
        const newShape = createRandomShape();
        shapesB.push(newShape);
        differences.push({
          center: shapeCenter(newShape),
          radius: shapeRadius(newShape),
          found: false
        });
        placed++;
        continue;
      }

      const targetIdx = shuffled[idx++];
      const original = shapesA[targetIdx];
      const modified = shapesB[targetIdx];

      if (mType === 'remove') {
        modified._removed = true;
        differences.push({
          center: shapeCenter(original),
          radius: shapeRadius(original),
          found: false
        });
      } else {
        mutateShape(modified);
        const cA = shapeCenter(original);
        const cB = shapeCenter(modified);
        const cx = (cA.x + cB.x) / 2;
        const cy = (cA.y + cB.y) / 2;
        const halfDist = Math.hypot(cA.x - cB.x, cA.y - cB.y) / 2;
        const r = halfDist + Math.max(shapeRadius(original), shapeRadius(modified));
        differences.push({ center: { x: cx, y: cy }, radius: r, found: false });
      }
      placed++;
    }

    const finalB = shapesB.filter(s => !s._removed);

    renderScene(sceneA, shapesA);
    renderScene(sceneB, finalB);

    found = 0;
    misses = 0;
    gameOver = false;
    foundEl.textContent = '0';
    totalEl.textContent = String(differences.length);
    missesEl.textContent = '0';
    clearMarkers();
    startTimer();
  }

  function clearMarkers() {
    sceneA.querySelectorAll('.marker').forEach(m => m.remove());
    sceneB.querySelectorAll('.marker').forEach(m => m.remove());
  }

  function startTimer() {
    if (timerHandle) clearInterval(timerHandle);
    startTs = Date.now();
    timerEl.textContent = '00:00';
    timerHandle = setInterval(updateTimer, 500);
  }

  function updateTimer() {
    const s = Math.floor((Date.now() - startTs) / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    timerEl.textContent = `${mm}:${ss}`;
  }

  function stopTimer() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
  }

  // ---------- Click handling ----------
  function handleClick(e, sceneEl) {
    if (gameOver) return;
    const svg = sceneEl.querySelector('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;

    let hitIndex = -1;
    let hitDist = Infinity;
    for (let i = 0; i < differences.length; i++) {
      const d = differences[i];
      if (d.found) continue;
      const dist = Math.hypot(d.center.x - x, d.center.y - y);
      if (dist <= d.radius && dist < hitDist) {
        hitIndex = i;
        hitDist = dist;
      }
    }

    if (hitIndex !== -1) {
      const d = differences[hitIndex];
      d.found = true;
      found++;
      foundEl.textContent = String(found);
      addMarker(sceneA, d.center.x, d.center.y, 'found', true);
      addMarker(sceneB, d.center.x, d.center.y, 'found', true);
      if (found === differences.length) {
        gameOver = true;
        stopTimer();
        overlayTitle.textContent = 'Geschafft!';
        overlayText.textContent = `Du hast alle ${differences.length} Unterschiede in ${timerEl.textContent} gefunden. Fehlklicks: ${misses}.`;
        overlay.classList.remove('hidden');
      }
    } else {
      misses++;
      missesEl.textContent = String(misses);
      addMarker(sceneEl, x, y, 'miss', false);
    }
  }

  function addMarker(sceneEl, xSvg, ySvg, cls, persistent) {
    const svg = sceneEl.querySelector('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = (xSvg / W) * rect.width;
    const py = (ySvg / H) * rect.height;
    const marker = document.createElement('div');
    marker.className = `marker ${cls}`;
    marker.style.left = `${px}px`;
    marker.style.top = `${py}px`;
    sceneEl.appendChild(marker);
    if (!persistent) setTimeout(() => marker.remove(), 1200);
  }

  // ---------- Wiring ----------
  sceneA.addEventListener('click', e => handleClick(e, sceneA));
  sceneB.addEventListener('click', e => handleClick(e, sceneB));
  newGameBtn.addEventListener('click', () => { overlay.classList.add('hidden'); startGame(); });
  overlayClose.addEventListener('click', () => { overlay.classList.add('hidden'); startGame(); });
  diffSelect.addEventListener('change', startGame);

  window.addEventListener('resize', () => {
    sceneA.querySelectorAll('.marker.found').forEach(m => m.remove());
    sceneB.querySelectorAll('.marker.found').forEach(m => m.remove());
    for (const d of differences) {
      if (d.found) {
        addMarker(sceneA, d.center.x, d.center.y, 'found', true);
        addMarker(sceneB, d.center.x, d.center.y, 'found', true);
      }
    }
  });

  startGame();
})();
