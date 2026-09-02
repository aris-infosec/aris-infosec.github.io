(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Subtle network background ---------------- */
  const canvas = document.getElementById('net-bg');
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let w, h, dpr;

  function sizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initNodes() {
    const count = Math.min(46, Math.floor((w * h) / 34000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
    }));
  }

  const LINK_DIST = 140;
  const inkRGB = '154, 162, 176';
  const goldRGB = '201, 161, 90';

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.08;
          ctx.strokeStyle = `rgba(${inkRGB}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${goldRGB}, 0.35)`;
      ctx.fill();
    }
  }

  function tick() {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    drawFrame();
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  sizeCanvas();
  initNodes();
  drawFrame();
  if (!reduceMotion) requestAnimationFrame(tick);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizeCanvas();
      initNodes();
      drawFrame();
    }, 150);
  });

  /* ---------------- Stat counters ---------------- */
  const statNums = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    if (reduceMotion || !target) {
      el.textContent = target;
      return;
    }
    let current = 0;
    const step = Math.max(1, Math.round(target / 30));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 25);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statNums.forEach(animateCount);
        statObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  const statRow = document.querySelector('.stat-row');
  if (statRow) statObserver.observe(statRow);

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------- Expandable timeline entries ---------------- */
  document.querySelectorAll('.entry-body').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });

  /* ---------------- Nav: scroll state, scroll-spy, mobile toggle ---------------- */
  const nav = document.getElementById('site-nav');
  const sections = document.querySelectorAll('main .section');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navToggle = document.getElementById('nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');
  const toTopBtn = document.getElementById('to-top');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    if (nav) nav.classList.toggle('scrolled', scrolled);
    if (toTopBtn) toTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.nav === id);
        });
      }
    });
  }, { threshold: 0.5 });
  sections.forEach((s) => spyObserver.observe(s));

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinksEl.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
})();
