// ── Constellation background ───────────────────────────────────────────
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
    return Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(160,160,200,${(1 - dist / 150) * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(160,160,210,0.45)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  dots = makeDots();
  draw();

  window.addEventListener('resize', () => {
    resize();
    dots = makeDots();
  });
})();

// ── Mobile nav toggle ──────────────────────────────────────────────────
const toggle = document.getElementById('nav-toggle');
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

// ── Nav shadow on scroll ───────────────────────────────────────────────
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,0.06)'
      : 'none';
  }, { passive: true });
}
