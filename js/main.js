// ── Constellation (warm golden on dark) ───────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeDots() {
    return Array.from({ length: 65 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r:  Math.random() * 1.2 + 0.8,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - dist / 140) * 0.18})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.55)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  dots = makeDots();
  draw();
  window.addEventListener('resize', () => { resize(); dots = makeDots(); });
})();

// ── Typewriter on homepage greeting ───────────────────────────────────
const greetEl = document.getElementById('greeting-text');
if (greetEl) {
  const text = 'Welcome to my little corner on the Internet.';
  const cursor = greetEl.querySelector('.cursor');
  const textSpan = document.createElement('span');
  greetEl.innerHTML = '';
  greetEl.appendChild(textSpan);
  greetEl.appendChild(cursor);
  let i = 0;

  function type() {
    if (i <= text.length) {
      textSpan.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 600 : 38 + Math.random() * 22);
    }
  }
  setTimeout(type, 400);
}

// ── Mobile nav toggle ──────────────────────────────────────────────────
const toggle  = document.getElementById('nav-toggle');
const navRight = document.getElementById('nav-right');

if (toggle && navRight) {
  toggle.addEventListener('click', () => {
    const open = navRight.classList.toggle('open');
    toggle.textContent = open ? '✕' : '☰';
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navRight.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navRight.classList.remove('open');
      toggle.textContent = '☰';
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('nav') && navRight.classList.contains('open')) {
      navRight.classList.remove('open');
      toggle.textContent = '☰';
      document.body.style.overflow = '';
    }
  });
}

// ── Scroll reveal ──────────────────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    entries => entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.07, rootMargin: '0px 0px -28px 0px' }
  );

  document.querySelectorAll(
    '.reveal, .work-item, .story-item, .edu-card, .recent-item'
  ).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.06}s`;
    io.observe(el);
  });
}

// ── Nav scroll shadow ──────────────────────────────────────────────────
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 12
      ? '0 4px 24px rgba(0,0,0,0.4)'
      : 'none';
  }, { passive: true });
}
