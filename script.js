(function(){
  document.body.style.overflow = 'hidden';

  // Custom cursor + trail
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let lastTrail = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    const now = performance.now();
    if (now - lastTrail > 18) {
      spawnTrail(mouseX, mouseY);
      lastTrail = now;
    }
  });

  function spawnTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    trail.style.background = Math.random() > 0.5 ? 'var(--coral)' : 'var(--lilac)';
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 460);
  }

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    cursor.style.transform = 'translate(-50%, -50%)';
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    cursorDot.style.transform = 'translate(-50%, -50%)';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Typewriter helper
  function typewrite(el, html, speed, onDone) {
    const segments = [];
    const re = /(<[^>]+>)|([^<]+)/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      if (m[1]) {
        segments.push({ type: 'tag', content: m[1] });
      } else {
        segments.push({ type: 'text', content: m[2] });
      }
    }

    let built = '';
    let si = 0;
    let ci = 0;

    function tick() {
      if (si >= segments.length) {
        if (onDone) onDone();
        return;
      }
      const seg = segments[si];
      if (seg.type === 'tag') {
        built += seg.content;
        si++;
        ci = 0;
        el.innerHTML = built + '<span class="ld-cursor">▌</span>';
        tick();
      } else {
        built += seg.content[ci];
        ci++;
        el.innerHTML = built + '<span class="ld-cursor">▌</span>';
        if (ci >= seg.content.length) {
          si++;
          ci = 0;
        }
        setTimeout(tick, speed);
      }
    }
    tick();
  }

  // Log lines
  const logLines = [
    { icon: 'ok', text: 'SYSTEM <span class="key">BOOT</span> .............. OK' },
    { icon: 'ok', text: 'LOADING <span class="key">DESIGN_SKILLS</span> ...... OK' },
    { icon: 'ok', text: 'IMPORTING <span class="key">REACT</span> ............ OK' },
    { icon: 'warn', text: 'CHECKING <span class="key">WCAG_COMPLIANCE</span> .... PASS' },
    { icon: 'ok', text: 'MOUNTING <span class="key">PORTFOLIO.EXE</span> ...... OK' }
  ];

  const CHAR_SPEED = 22;
  const LINE_PAUSE = 80;

  const log = document.getElementById('ldLog');

  function runLine(index) {
    if (index >= logLines.length) return;
    const { icon, text } = logLines[index];

    const el = document.createElement('div');
    el.className = 'ld-log-line show';
    const iconHtml = `<span class="${icon}">${icon === 'ok' ? '✔' : '!'}</span>`;
    el.innerHTML = iconHtml;
    log.appendChild(el);

    const textSpan = document.createElement('span');
    textSpan.className = 'ld-log-text';
    el.appendChild(textSpan);

    typewrite(textSpan, text, CHAR_SPEED, () => {
      textSpan.innerHTML = text;
      setTimeout(() => runLine(index + 1), LINE_PAUSE);
    });
  }

  setTimeout(() => runLine(0), 750);

  // Stat bars
  document.querySelectorAll('.ld-stat-fill').forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'width 0.5s cubic-bezier(.4,0,.2,1)';
      el.style.width = '100%';
    }, 1050 + i * 150);
  });

  // Main progress bar
  let pct = 0;
  const fill = document.getElementById('ldBarFill');
  const pctEl = document.getElementById('ldPct');
  const stages = [
    { target: 30, duration: 500, start: 900 },
    { target: 62, duration: 600, start: 1400 },
    { target: 85, duration: 500, start: 2000 },
    { target: 100, duration: 350, start: 2650 }
  ];
  stages.forEach(({ target, duration, start }) => {
    setTimeout(() => {
      const from = pct;
      const range = target - from;
      const t0 = performance.now();
      (function step(now) {
        const t = Math.min((now - t0) / duration, 1);
        const e = 1 - Math.pow(1 - t, 3);
        pct = from + range * e;
        fill.style.width = pct + '%';
        pctEl.textContent = Math.round(pct) + '%';
        if (t < 1) requestAnimationFrame(step);
      })(t0);
    }, start);
  });

  setTimeout(() => {
    document.getElementById('ldEnter').classList.add('show');
  }, 3200);
})();

function dismissLoader() {
  const loader = document.getElementById('loader');
  loader.classList.add('hide');
  document.body.style.overflow = '';
  setTimeout(() => loader.remove(), 700);
}
