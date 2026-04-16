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

    // Sun or moon (major)
    const isSun = Math.random() < 0.7;
    shapes.push({
      type: 'circle',
      cx: rand(40, 360), cy: rand(35, 80),
      r: rand(22, 30),
      fill: isSun ? '#FFD93D' : '#E8E8E8',
      category: 'major'
    });

    // House (major – nur dezente Änderungen)
    const hx = rand(45, 110);
    shapes.push({ type: 'rect', x: hx, y: 140, w: 90, h: 80, fill: pick(['#E6B58A', '#DEB887', '#C4A484']), category: 'major' });
    shapes.push({ type: 'polygon', points: `${hx - 10},140 ${hx + 100},140 ${hx + 45},90`, fill: pick(['#A0522D', '#8B4513', '#6B3410']), category: 'major' });
    shapes.push({ type: 'rect', x: hx + 35, y: 185, w: 20, h: 35, fill: '#5C3317', category: 'major' });
    shapes.push({ type: 'rect', x: hx + 60, y: 155, w: 22, h: 18, fill: '#B0E0E6', category: 'major' });
    shapes.push({ type: 'rect', x: hx + 70, y: 95, w: 10, h: 20, fill: '#555', category: 'major' });
    // Zweites Fenster
    shapes.push({ type: 'rect', x: hx + 10, y: 155, w: 18, h: 18, fill: '#B0E0E6', category: 'major' });
    // Türknauf (klein, minor – kann verschwinden)
    shapes.push({ type: 'circle', cx: hx + 52, cy: 203, r: 2.2, fill: '#FFD700', category: 'minor' });

    // Big tree (major)
    const tx = rand(240, 300);
    shapes.push({ type: 'rect', x: tx, y: 170, w: 14, h: 50, fill: '#6B4423', category: 'major' });
    shapes.push({ type: 'circle', cx: tx + 7, cy: 165, r: 30, fill: pick(['#2E8B57', '#3CB371', '#228B22']), category: 'major' });

    // Bush (major)
    const bx = rand(330, 380);
    shapes.push({ type: 'circle', cx: bx, cy: 200, r: 18, fill: '#3CB371', category: 'major' });

    // Äpfel / Früchte auf dem Baum (minor)
    const fruitCount = randInt(2, 4);
    for (let i = 0; i < fruitCount; i++) {
      shapes.push({
        type: 'circle',
        cx: tx + 7 + rand(-22, 22), cy: 165 + rand(-20, 18),
        r: rand(2.5, 3.5),
        fill: pick(['#E74C3C', '#C0392B', '#FFB347']),
        category: 'minor'
      });
    }

    // Clouds (minor – können Form/Farbe ändern, auch mal verschwinden)
    const cloudCount = randInt(3, 5);
    for (let i = 0; i < cloudCount; i++) {
      shapes.push({
        type: 'ellipse',
        cx: rand(40, 360), cy: rand(20, 100),
        rx: rand(22, 38), ry: rand(10, 16),
        fill: '#FFFFFF',
        category: 'minor'
      });
    }

    // Schornsteinrauch (minor)
    for (let i = 0; i < 2; i++) {
      shapes.push({
        type: 'circle',
        cx: hx + 75 + rand(-4, 4), cy: 80 - i * 10,
        r: rand(4, 6),
        fill: '#E8E8E8',
        category: 'minor'
      });
    }

    // Flowers (minor)
    const flowerColors = ['#FF6B6B', '#FFB6C1', '#9370DB', '#FFD700', '#FF8C00', '#DA70D6', '#FF1493'];
    const flowerCount = randInt(9, 13);
    for (let i = 0; i < flowerCount; i++) {
      shapes.push({
        type: 'circle',
        cx: rand(15, 385), cy: rand(235, 292),
        r: rand(4, 7),
        fill: pick(flowerColors),
        category: 'minor'
      });
    }

    // Grasbüschel (minor)
    for (let i = 0; i < randInt(4, 7); i++) {
      shapes.push({
        type: 'ellipse',
        cx: rand(15, 385), cy: rand(230, 290),
        rx: rand(4, 7), ry: rand(2, 3.5),
        fill: pick(['#2E8B57', '#228B22', '#3CB371']),
        category: 'minor'
      });
    }

    // Stones (minor)
    for (let i = 0; i < randInt(3, 5); i++) {
      shapes.push({
        type: 'ellipse',
        cx: rand(20, 380), cy: rand(250, 290),
        rx: rand(6, 11), ry: rand(4, 7),
        fill: pick(['#808080', '#A9A9A9', '#696969']),
        category: 'minor'
      });
    }

    // Schmetterlinge / Vögel (minor)
    for (let i = 0; i < randInt(2, 4); i++) {
      shapes.push({
        type: 'circle',
        cx: rand(30, 370), cy: rand(110, 185),
        r: rand(3, 5),
        fill: pick(['#FF4500', '#1E90FF', '#FFD700', '#FF69B4']),
        category: 'minor'
      });
    }

    // Optional star (minor)
    if (Math.random() < 0.4) {
      shapes.push({
        type: 'polygon',
        points: starPoints(rand(50, 350), rand(40, 90), rand(5, 7)),
        fill: '#FFF',
        category: 'minor'
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

  // ---------- Color utilities (für subtile Farbverschiebungen) ----------
  function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  }

  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
    return '#' + toHex(f(0)) + toHex(f(8)) + toHex(f(4));
  }

  function shiftColor(hex, intensity) {
    // intensity: 'subtle' | 'moderate'
    const src = hex.length === 4
      ? '#' + hex.slice(1).split('').map(c => c + c).join('')
      : hex;
    try {
      const [h, s, l] = hexToHsl(src);
      const sign = Math.random() < 0.5 ? -1 : 1;
      const variant = Math.random();
      let nh = h, ns = s, nl = l;
      if (intensity === 'subtle') {
        if (variant < 0.45) nh = (h + sign * rand(18, 40) + 360) % 360;
        else if (variant < 0.8) ns = Math.max(15, Math.min(95, s + sign * rand(15, 28)));
        else nl = Math.max(25, Math.min(82, l + sign * rand(8, 16)));
      } else {
        if (variant < 0.5) nh = (h + sign * rand(40, 90) + 360) % 360;
        else if (variant < 0.8) ns = Math.max(10, Math.min(95, s + sign * rand(25, 45)));
        else nl = Math.max(20, Math.min(85, l + sign * rand(15, 28)));
      }
      return hslToHex(nh, ns, nl);
    } catch {
      return hex;
    }
  }

  // ---------- Mutations ----------
  function mutateShape(shape) {
    const isMajor = shape.category === 'major';
    // Für große Strukturen nur dezente Änderungen
    const allowed = isMajor ? ['color', 'color', 'size', 'move'] : ['color', 'size', 'move'];
    const mutType = pick(allowed);

    if (mutType === 'color') {
      shape.fill = shiftColor(shape.fill || '#888888', isMajor ? 'subtle' : 'moderate');
      return;
    }
    if (mutType === 'size') {
      const factor = isMajor
        ? (Math.random() < 0.5 ? rand(0.8, 0.9) : rand(1.12, 1.25))
        : (Math.random() < 0.5 ? rand(0.65, 0.8) : rand(1.3, 1.55));
      if (shape.type === 'rect') {
        const cx = shape.x + shape.w / 2, cy = shape.y + shape.h / 2;
        shape.w = Math.max(6, shape.w * factor);
        shape.h = Math.max(6, shape.h * factor);
        shape.x = cx - shape.w / 2;
        shape.y = cy - shape.h / 2;
      } else if (shape.type === 'circle') {
        shape.r = Math.max(3, shape.r * factor);
      } else if (shape.type === 'ellipse') {
        shape.rx = Math.max(3, shape.rx * factor);
        shape.ry = Math.max(2, shape.ry * factor);
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
    const range = isMajor
      ? { min: 4, dx: 8, dy: 6 }
      : { min: 10, dx: 22, dy: 16 };
    let dx, dy;
    do {
      dx = rand(-range.dx, range.dx);
      dy = rand(-range.dy, range.dy);
    } while (Math.hypot(dx, dy) < range.min);
    if (shape.type === 'rect') { shape.x += dx; shape.y += dy; }
    else if (shape.type === 'circle' || shape.type === 'ellipse') { shape.cx += dx; shape.cy += dy; }
    else if (shape.type === 'polygon') {
      const pts = shape.points.trim().split(/\s+/).map(p => p.split(',').map(Number));
      shape.points = pts.map(([x, y]) => `${(x + dx).toFixed(1)},${(y + dy).toFixed(1)}`).join(' ');
    }
  }

  function createRandomShape() {
    // Kleine, unauffällige Deko – damit neue Objekte nicht sofort ins Auge fallen
    const variant = Math.random();
    if (variant < 0.5) {
      // Blume
      const flowerColors = ['#FF6B6B', '#FFB6C1', '#9370DB', '#FFD700', '#FF8C00', '#DA70D6', '#FF1493'];
      return {
        type: 'circle',
        cx: rand(20, 380), cy: rand(240, 290),
        r: rand(4, 7),
        fill: pick(flowerColors),
        category: 'minor'
      };
    }
    if (variant < 0.75) {
      // Stein
      return {
        type: 'ellipse',
        cx: rand(20, 380), cy: rand(250, 290),
        rx: rand(6, 10), ry: rand(4, 6),
        fill: pick(['#808080', '#A9A9A9', '#696969']),
        category: 'minor'
      };
    }
    // Kleine Wolke oder fliegender Punkt
    if (Math.random() < 0.5) {
      return {
        type: 'ellipse',
        cx: rand(30, 370), cy: rand(20, 100),
        rx: rand(18, 30), ry: rand(8, 13),
        fill: '#FFFFFF',
        category: 'minor'
      };
    }
    return {
      type: 'circle',
      cx: rand(30, 370), cy: rand(110, 180),
      r: rand(3, 5),
      fill: pick(['#FF4500', '#1E90FF', '#FFD700', '#FF69B4']),
      category: 'minor'
    };
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

    // Getrennte Pools für major und minor – remove/add läuft nur gegen minor
    const majorIdx = [];
    const minorIdx = [];
    baseShapes.forEach((s, i) => {
      if (s.locked) return;
      if (s.category === 'major') majorIdx.push(i);
      else minorIdx.push(i);
    });
    majorIdx.sort(() => Math.random() - 0.5);
    minorIdx.sort(() => Math.random() - 0.5);

    const shapesA = clone(baseShapes);
    const shapesB = clone(baseShapes);
    differences = [];

    let placed = 0;
    let mIdx = 0; // minor pointer
    let MIdx = 0; // major pointer
    // Etwa 1/3 der Unterschiede dürfen auf major-Shapes entfallen – und nur als subtile Änderung
    const majorBudget = Math.max(1, Math.floor(count / 3));
    let majorUsed = 0;

    while (placed < count) {
      // Mutationstyp wählen: remove/add nur für minor; major nur color/size/move
      let mType;
      const canMajor = majorUsed < majorBudget && MIdx < majorIdx.length;
      const canMinor = mIdx < minorIdx.length;

      // 30% Chance auf major-Mutation, solange Budget da ist – sonst minor
      if (canMajor && (!canMinor || Math.random() < 0.3)) {
        mType = pick(['color', 'size', 'move']);
        const targetIdx = majorIdx[MIdx++];
        majorUsed++;
        const original = shapesA[targetIdx];
        const modified = shapesB[targetIdx];
        mutateShape(modified);
        addDifferenceFromPair(original, modified);
        placed++;
        continue;
      }

      if (canMinor) {
        // Bei minor: color/size/move/remove, seltener add
        mType = pick(['color', 'size', 'move', 'remove', 'color', 'size', 'move']);
        const targetIdx = minorIdx[mIdx++];
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
          addDifferenceFromPair(original, modified);
        }
        placed++;
        continue;
      }

      // Keine Kandidaten mehr: neue Shape in B hinzufügen
      const newShape = createRandomShape();
      shapesB.push(newShape);
      differences.push({
        center: shapeCenter(newShape),
        radius: shapeRadius(newShape),
        found: false
      });
      placed++;
    }

    function addDifferenceFromPair(original, modified) {
      const cA = shapeCenter(original);
      const cB = shapeCenter(modified);
      const cx = (cA.x + cB.x) / 2;
      const cy = (cA.y + cB.y) / 2;
      const halfDist = Math.hypot(cA.x - cB.x, cA.y - cB.y) / 2;
      const r = halfDist + Math.max(shapeRadius(original), shapeRadius(modified));
      differences.push({ center: { x: cx, y: cy }, radius: r, found: false });
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
