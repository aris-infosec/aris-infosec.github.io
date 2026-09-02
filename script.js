(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Network background canvas ---------------- */
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
    const count = Math.min(70, Math.floor((w * h) / 22000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  }

  const LINK_DIST = 130;
  const inkColor = '232, 230, 223';
  const amberColor = '217, 164, 65';

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.14;
          ctx.strokeStyle = `rgba(${inkColor}, ${alpha})`;
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
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${amberColor}, 0.5)`;
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

  /* ---------------- Cursor glow ---------------- */
  const glow = document.querySelector('.glow-cursor');
  if (!reduceMotion && glow) {
    window.addEventListener('pointermove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }

  /* ---------------- Hero typing effect ---------------- */
  const roleEl = document.getElementById('hero-role');
  const roles = [
    'is working toward a career in cybersecurity.',
    'is early in the path — CISSP done, CCNA next.',
    'is building the technical floor under the theory.',
  ];

  function typeLoop() {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function step() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = false;
          setTimeout(() => { deleting = true; step(); }, 2200);
          return;
        }
        setTimeout(step, 28);
      } else {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(step, 400);
          return;
        }
        setTimeout(step, 14);
      }
    }
    step();
  }

  if (roleEl) {
    if (reduceMotion) {
      roleEl.textContent = roles[0];
    } else {
      typeLoop();
    }
  }

  /* ---------------- Progress meter ---------------- */
  const entries = document.querySelectorAll('.entry');
  const total = entries.length;
  const done = document.querySelectorAll('.entry--done').length;
  const active = document.querySelectorAll('.entry--active').length;
  const percent = Math.round(((done + active * 0.5) / total) * 100);

  const fill = document.getElementById('progress-fill');
  const percentLabel = document.getElementById('progress-percent');

  function animateProgress() {
    if (!fill) return;
    fill.style.width = percent + '%';
    if (!percentLabel) return;
    if (reduceMotion) {
      percentLabel.textContent = percent + '%';
      return;
    }
    let current = 0;
    const timer = setInterval(() => {
      current++;
      percentLabel.textContent = current + '%';
      if (current >= percent) clearInterval(timer);
    }, 800 / Math.max(percent, 1));
  }

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateProgress();
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const progressBlock = document.querySelector('.progress-block');
  if (progressBlock) heroObserver.observe(progressBlock);

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblingDelay = Array.from(el.parentElement.children).indexOf(el) * 60;
          setTimeout(() => el.classList.add('is-visible'), siblingDelay);
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------- Expandable timeline entries ---------------- */
  document.querySelectorAll('.entry-body').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });

  /* ---------------- Nav: scroll spy + background on scroll ---------------- */
  const nav = document.getElementById('site-nav');
  const sections = document.querySelectorAll('main .section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
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
})();
