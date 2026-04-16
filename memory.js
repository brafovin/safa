(() => {
  'use strict';

  // ---------- Motive (als SVG) ----------
  // Jede Karte ist 3:4, viewBox 300x400. Echte Fotos können hier später einfach
  // durch <image href="..."> ersetzt werden.
  const SVG_OPEN = '<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">';
  const BG_RECT  = '<rect width="300" height="400" fill="#f4f6fa"/>';
  const JERSEY_PATH = 'M60 90 L100 60 Q150 80 200 60 L240 90 L220 140 L200 130 L200 340 L100 340 L100 130 L80 140 Z';

  const MOTIFS = [
    {
      id: 'barca', label: 'FC Barcelona',
      svg: `${SVG_OPEN}${BG_RECT}
        <path d="${JERSEY_PATH}" fill="#004d98" stroke="#000" stroke-width="2"/>
        <rect x="100" y="80" width="20" height="260" fill="#a50044"/>
        <rect x="140" y="80" width="20" height="260" fill="#a50044"/>
        <rect x="180" y="80" width="20" height="260" fill="#a50044"/>
        <path d="M130 72 Q150 88 170 72" fill="none" stroke="#fff" stroke-width="3"/>
        <text x="150" y="260" font-family="Impact, sans-serif" font-size="110" fill="#fff" text-anchor="middle" stroke="#000" stroke-width="2">10</text>
        <text x="150" y="385" font-family="Arial, sans-serif" font-size="16" fill="#333" text-anchor="middle" font-weight="700">FC BARCELONA</text>
        </svg>`
    },
    {
      id: 'psg', label: 'Paris Saint-Germain',
      svg: `${SVG_OPEN}${BG_RECT}
        <path d="${JERSEY_PATH}" fill="#004170" stroke="#000" stroke-width="2"/>
        <rect x="130" y="80" width="40" height="260" fill="#ed1c24"/>
        <rect x="125" y="80" width="5" height="260" fill="#fff"/>
        <rect x="170" y="80" width="5" height="260" fill="#fff"/>
        <text x="150" y="260" font-family="Impact, sans-serif" font-size="110" fill="#fff" text-anchor="middle" stroke="#000" stroke-width="2">30</text>
        <text x="150" y="385" font-family="Arial, sans-serif" font-size="16" fill="#333" text-anchor="middle" font-weight="700">PARIS SG</text>
        </svg>`
    },
    {
      id: 'miami', label: 'Inter Miami',
      svg: `${SVG_OPEN}${BG_RECT}
        <path d="${JERSEY_PATH}" fill="#f7b5cd" stroke="#231f20" stroke-width="2"/>
        <path d="M130 72 Q150 88 170 72" fill="none" stroke="#231f20" stroke-width="3"/>
        <text x="150" y="260" font-family="Impact, sans-serif" font-size="110" fill="#231f20" text-anchor="middle">10</text>
        <text x="150" y="385" font-family="Arial, sans-serif" font-size="16" fill="#333" text-anchor="middle" font-weight="700">INTER MIAMI</text>
        </svg>`
    },
    {
      id: 'arg', label: 'Argentinien',
      svg: `${SVG_OPEN}${BG_RECT}
        <path d="${JERSEY_PATH}" fill="#ffffff" stroke="#000" stroke-width="2"/>
        <rect x="110" y="80" width="20" height="260" fill="#75aadb"/>
        <rect x="170" y="80" width="20" height="260" fill="#75aadb"/>
        <circle cx="150" cy="112" r="12" fill="#f6b40e" stroke="#b88600" stroke-width="1"/>
        <text x="150" y="260" font-family="Impact, sans-serif" font-size="110" fill="#0a1a34" text-anchor="middle">10</text>
        <text x="150" y="385" font-family="Arial, sans-serif" font-size="16" fill="#333" text-anchor="middle" font-weight="700">ARGENTINIEN</text>
        </svg>`
    },
    {
      id: 'newells', label: "Newell's Old Boys",
      svg: `${SVG_OPEN}${BG_RECT}
        <path d="${JERSEY_PATH}" fill="#e60026" stroke="#000" stroke-width="2"/>
        <rect x="150" y="80" width="50" height="260" fill="#111"/>
        <text x="150" y="260" font-family="Impact, sans-serif" font-size="110" fill="#fff" text-anchor="middle" stroke="#000" stroke-width="2">10</text>
        <text x="150" y="385" font-family="Arial, sans-serif" font-size="16" fill="#333" text-anchor="middle" font-weight="700">NEWELL'S</text>
        </svg>`
    },
    {
      id: 'wc2022', label: 'WM 2022',
      svg: `${SVG_OPEN}${BG_RECT}
        <defs>
          <linearGradient id="gold1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#fff2a8"/>
            <stop offset="0.5" stop-color="#f6b40e"/>
            <stop offset="1" stop-color="#8e6300"/>
          </linearGradient>
        </defs>
        <circle cx="150" cy="140" r="52" fill="url(#gold1)" stroke="#5a3f00" stroke-width="2"/>
        <path d="M100 140 Q150 95 200 140" fill="none" stroke="#5a3f00" stroke-width="1.6"/>
        <path d="M100 140 Q150 185 200 140" fill="none" stroke="#5a3f00" stroke-width="1.6"/>
        <path d="M120 190 Q132 235 120 275 L180 275 Q168 235 180 190 Z" fill="url(#gold1)" stroke="#5a3f00" stroke-width="2"/>
        <rect x="108" y="275" width="84" height="22" fill="url(#gold1)" stroke="#5a3f00" stroke-width="2"/>
        <rect x="98" y="297" width="104" height="14" fill="#3e2c00"/>
        <text x="150" y="355" font-family="Impact, sans-serif" font-size="44" fill="#0a1a34" text-anchor="middle">2022</text>
        <text x="150" y="385" font-family="Arial, sans-serif" font-size="16" fill="#333" text-anchor="middle" font-weight="700">WELTMEISTER</text>
        </svg>`
    },
    {
      id: 'copa', label: 'Copa América 2021',
      svg: `${SVG_OPEN}${BG_RECT}
        <defs>
          <linearGradient id="silver1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="0.5" stop-color="#c0c7d1"/>
            <stop offset="1" stop-color="#5d6673"/>
          </linearGradient>
        </defs>
        <path d="M100 95 L200 95 L185 225 Q150 245 115 225 Z" fill="url(#silver1)" stroke="#303640" stroke-width="2"/>
        <path d="M100 110 Q65 145 100 185" fill="none" stroke="#9aa3ae" stroke-width="12" stroke-linecap="round"/>
        <path d="M200 110 Q235 145 200 185" fill="none" stroke="#9aa3ae" stroke-width="12" stroke-linecap="round"/>
        <rect x="140" y="245" width="20" height="30" fill="url(#silver1)" stroke="#303640" stroke-width="2"/>
        <ellipse cx="150" cy="280" rx="46" ry="10" fill="url(#silver1)" stroke="#303640" stroke-width="2"/>
        <rect x="108" y="288" width="84" height="14" fill="#303640"/>
        <text x="150" y="350" font-family="Impact, sans-serif" font-size="44" fill="#0a1a34" text-anchor="middle">2021</text>
        <text x="150" y="385" font-family="Arial, sans-serif" font-size="15" fill="#333" text-anchor="middle" font-weight="700">COPA AMÉRICA</text>
        </svg>`
    },
    {
      id: 'ballon', label: "Ballon d'Or",
      svg: `${SVG_OPEN}${BG_RECT}
        <defs>
          <radialGradient id="gold2" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stop-color="#fff5c0"/>
            <stop offset="0.55" stop-color="#f6b40e"/>
            <stop offset="1" stop-color="#704e00"/>
          </radialGradient>
        </defs>
        <circle cx="150" cy="165" r="78" fill="url(#gold2)" stroke="#503a00" stroke-width="2"/>
        <polygon points="150,115 178,138 168,172 132,172 122,138" fill="#7a5700" opacity="0.45"/>
        <polygon points="95,160 118,145 130,178 112,200 88,180" fill="#7a5700" opacity="0.45"/>
        <polygon points="205,160 182,145 170,178 188,200 212,180" fill="#7a5700" opacity="0.45"/>
        <polygon points="150,215 170,195 185,215 170,235 130,235 115,215 130,195" fill="#7a5700" opacity="0.35"/>
        <rect x="128" y="250" width="44" height="42" fill="#2a1a00"/>
        <rect x="108" y="292" width="84" height="16" fill="#2a1a00"/>
        <text x="150" y="280" font-family="Arial, sans-serif" font-size="20" fill="#f6b40e" text-anchor="middle" font-weight="900">×8</text>
        <text x="150" y="355" font-family="Impact, sans-serif" font-size="34" fill="#0a1a34" text-anchor="middle">BALLON d'OR</text>
        </svg>`
    },
    {
      id: 'olympia', label: 'Olympia 2008',
      svg: `${SVG_OPEN}${BG_RECT}
        <g stroke-width="8" fill="none">
          <circle cx="92"  cy="130" r="30" stroke="#0081c8"/>
          <circle cx="150" cy="130" r="30" stroke="#111"/>
          <circle cx="208" cy="130" r="30" stroke="#ee334e"/>
          <circle cx="121" cy="172" r="30" stroke="#fcb131"/>
          <circle cx="179" cy="172" r="30" stroke="#00a651"/>
        </g>
        <path d="M110 230 L150 260 L190 230" fill="none" stroke="#c00" stroke-width="6"/>
        <circle cx="150" cy="290" r="46" fill="#f6b40e" stroke="#6a4a00" stroke-width="2"/>
        <text x="150" y="300" font-family="Impact, sans-serif" font-size="30" fill="#6a4a00" text-anchor="middle">GOLD</text>
        <text x="150" y="370" font-family="Impact, sans-serif" font-size="30" fill="#0a1a34" text-anchor="middle">PEKING 2008</text>
        </svg>`
    },
    {
      id: 'goat', label: 'GOAT',
      svg: `${SVG_OPEN}${BG_RECT}
        <path d="M80 170 L100 100 L130 155 L150 90 L170 155 L200 100 L220 170 L220 210 L80 210 Z"
              fill="#f6b40e" stroke="#6a4a00" stroke-width="3"/>
        <circle cx="100" cy="100" r="8" fill="#e60026"/>
        <circle cx="150" cy="90"  r="8" fill="#0081c8"/>
        <circle cx="200" cy="100" r="8" fill="#00a651"/>
        <rect x="80" y="200" width="140" height="12" fill="#b88600"/>
        <text x="150" y="285" font-family="Impact, sans-serif" font-size="70" fill="#0a1a34" text-anchor="middle" letter-spacing="4">GOAT</text>
        <text x="150" y="320" font-family="Arial, sans-serif" font-size="13" fill="#333" text-anchor="middle" font-weight="700">Greatest Of All Time</text>
        <text x="150" y="360" font-family="Georgia, serif" font-size="22" fill="#a50044" text-anchor="middle" font-style="italic">Leo Messi</text>
        </svg>`
    },
  ];

  const DIFFICULTY = {
    easy:   { pairs: 6,  cols: 4 },
    medium: { pairs: 8,  cols: 4 },
    hard:   { pairs: 10, cols: 5 },
  };

  // ---------- DOM ----------
  const boardEl       = document.getElementById('board');
  const foundEl       = document.getElementById('found');
  const totalEl       = document.getElementById('total');
  const movesEl       = document.getElementById('moves');
  const timerEl       = document.getElementById('timer');
  const newBtn        = document.getElementById('new-game');
  const diffEl        = document.getElementById('difficulty');
  const overlay       = document.getElementById('overlay');
  const overlayText   = document.getElementById('overlay-text');
  const overlayClose  = document.getElementById('overlay-close');

  let state = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatTime(ms) {
    const s  = Math.floor(ms / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function startTimer() {
    if (state.timerId) return;
    state.startedAt = Date.now();
    state.timerId = setInterval(() => {
      timerEl.textContent = formatTime(Date.now() - state.startedAt);
    }, 500);
  }

  function stopTimer() {
    if (state && state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function makeCard(motif, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = motif.id;
    card.dataset.index = String(index);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Karte ${index + 1}`);
    card.innerHTML =
      '<div class="card-inner">' +
        '<div class="card-face front" aria-hidden="true"></div>' +
        '<div class="card-face back">' + motif.svg + '</div>' +
      '</div>';
    const handler = () => onCardClick(card);
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
    return card;
  }

  function onCardClick(card) {
    if (!state || state.locked) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    startTimer();
    card.classList.add('flipped');

    if (!state.first) {
      state.first = card;
      return;
    }
    state.second = card;
    state.moves += 1;
    movesEl.textContent = String(state.moves);
    checkMatch();
  }

  function checkMatch() {
    const { first, second } = state;
    const isMatch = first.dataset.id === second.dataset.id;
    state.locked = true;

    if (isMatch) {
      setTimeout(() => {
        first.classList.add('matched');
        second.classList.add('matched');
        state.found += 1;
        foundEl.textContent = String(state.found);
        state.first = state.second = null;
        state.locked = false;
        if (state.found === state.pairs) {
          stopTimer();
          setTimeout(showWin, 450);
        }
      }, 280);
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        state.first = state.second = null;
        state.locked = false;
      }, 900);
    }
  }

  function showWin() {
    const timeText = state.startedAt ? formatTime(Date.now() - state.startedAt) : '00:00';
    overlayText.textContent = `${state.pairs} Paare in ${state.moves} Zügen – Zeit ${timeText}.`;
    overlay.classList.remove('hidden');
  }

  function newGame() {
    const setting = DIFFICULTY[diffEl.value] || DIFFICULTY.medium;
    stopTimer();
    overlay.classList.add('hidden');

    state = {
      pairs: setting.pairs,
      cols: setting.cols,
      found: 0,
      moves: 0,
      first: null,
      second: null,
      locked: false,
      startedAt: null,
      timerId: null,
    };

    const chosen = shuffle(MOTIFS).slice(0, setting.pairs);
    const deck   = shuffle(chosen.concat(chosen));

    boardEl.style.setProperty('--cols', setting.cols);
    boardEl.innerHTML = '';
    deck.forEach((motif, i) => boardEl.appendChild(makeCard(motif, i)));

    foundEl.textContent = '0';
    totalEl.textContent = String(setting.pairs);
    movesEl.textContent = '0';
    timerEl.textContent = '00:00';
  }

  newBtn.addEventListener('click', newGame);
  diffEl.addEventListener('change', newGame);
  overlayClose.addEventListener('click', newGame);

  newGame();
})();
