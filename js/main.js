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
    return Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
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
        if (dist < 145) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(140, 130, 180, ${(1 - dist / 145) * 0.28})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(140, 130, 200, 0.5)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  dots = makeDots();
  draw();
  window.addEventListener('resize', () => { resize(); dots = makeDots(); });
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

// ── Scroll reveal ──────────────────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  document.querySelectorAll('.reveal, .work-item, .story-item, .edu-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 5) * 0.07}s`;
    observer.observe(el);
  });
}

// ── Active nav link ────────────────────────────────────────────────────
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-right a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    a.style.textDecoration = 'underline';
  }
});
