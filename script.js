(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || (navigator.connection && navigator.connection.saveData);

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

  /* ---------------- Parallax background orbs ---------------- */
  const orbGold = document.getElementById('orb-gold');
  const orbSage = document.getElementById('orb-sage');
  const orbInk = document.getElementById('orb-ink');
  const canHoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let targetScrollY = window.scrollY;
  let currentScrollY = targetScrollY;
  let targetMouseX = 0, targetMouseY = 0; // -0.5 .. 0.5
  let currentMouseX = 0, currentMouseY = 0;
  let parallaxRunning = false;

  window.addEventListener('scroll', () => { targetScrollY = window.scrollY; }, { passive: true });

  if (canHoverFine && !reduceMotion) {
    window.addEventListener('pointermove', (e) => {
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  // Each layer gets its own scroll speed and mouse-drift amount, so they
  // separate visually into distinct depths rather than moving as one block.
  const layers = [
    { el: orbGold, scrollSpeed: 0.10, mouseDrift: 26 },
    { el: orbSage, scrollSpeed: -0.16, mouseDrift: -38 },
    { el: orbInk, scrollSpeed: 0.22, mouseDrift: 16 },
  ];

  function parallaxTick() {
    currentScrollY += (targetScrollY - currentScrollY) * 0.08;
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    layers.forEach(({ el, scrollSpeed, mouseDrift }) => {
      if (!el) return;
      const x = currentMouseX * mouseDrift;
      const y = currentScrollY * scrollSpeed + currentMouseY * (mouseDrift * 0.6);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    requestAnimationFrame(parallaxTick);
  }

  function updateParallax() {
    // One-off static positioning fallback (used when motion is reduced).
    layers.forEach(({ el, scrollSpeed }) => {
      if (el) el.style.transform = `translate3d(0, ${window.scrollY * scrollSpeed}px, 0)`;
    });
  }

  if (!reduceMotion) {
    requestAnimationFrame(parallaxTick);
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

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealItemGroups = document.querySelectorAll('.cert-grid, .timeline, .skills-columns, .exp-list');

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
    if (reduceMotion) updateParallax();

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

  updateParallax();

  /* ---------------- Hero orbit tilt on pointer move ---------------- */
  const orbitFrame = document.querySelector('.orbit-frame');
  if (orbitFrame && canHoverFine && !reduceMotion) {
    orbitFrame.addEventListener('mousemove', (e) => {
      const rect = orbitFrame.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      orbitFrame.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
    });
    orbitFrame.addEventListener('mouseleave', () => {
      orbitFrame.style.transform = 'rotateY(0deg) rotateX(0deg)';
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
