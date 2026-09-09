(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Theme toggle ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = storedTheme || (systemPrefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initialTheme);
  if (themeToggle) themeToggle.setAttribute('aria-pressed', String(initialTheme === 'light'));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeToggle.setAttribute('aria-pressed', String(next === 'light'));
      if (reduceMotion) drawFrame();
    });
  }

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

  function currentPalette() {
    const isLight = root.getAttribute('data-theme') === 'light';
    return {
      ink: isLight ? '90, 84, 70' : '154, 162, 176',
      gold: isLight ? '169, 125, 46' : '201, 161, 90',
    };
  }

  function drawFrame() {
    const { ink: inkRGB, gold: goldRGB } = currentPalette();
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
  const revealItemGroups = document.querySelectorAll('.cert-grid, .timeline, .skills-columns');

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.reveal-item').forEach((el) => el.classList.add('is-visible'));
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

    // Stagger reveal-item children within each group once the group scrolls into view
    const groupObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.reveal-item');
          items.forEach((item, i) => {
            setTimeout(() => item.classList.add('is-visible'), i * 90);
          });
          groupObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItemGroups.forEach((el) => groupObserver.observe(el));
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

    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = Math.min(pct, 100) + '%';
    }
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

  /* ---------------- Copy email ---------------- */
  const emailCopyBtn = document.getElementById('email-copy');
  if (emailCopyBtn) {
    emailCopyBtn.addEventListener('click', async () => {
      const email = emailCopyBtn.closest('.contact-links').querySelector('#email-link').dataset.email;
      const label = document.getElementById('email-copy-label');
      try {
        await navigator.clipboard.writeText(email);
        emailCopyBtn.classList.add('copied');
        if (label) label.textContent = 'Copied!';
        setTimeout(() => {
          emailCopyBtn.classList.remove('copied');
          if (label) label.textContent = 'Copy email';
        }, 1800);
      } catch (e) {
        if (label) label.textContent = email;
      }
    });
  }
})();
