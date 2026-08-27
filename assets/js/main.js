document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('circuit');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let w = 0, h = 0, nodes = [], reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastW = 0, lastH = 0;

  function initNodes(targetW, targetH) {
    nodes = [];
    const count = Math.floor((targetW * targetH) / 36842); /* 5% fewer neurons */
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * targetW,
        y: Math.random() * targetH,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 2.2 + 1.2,
        pulse: Math.random() * Math.PI * 2,
        colorType: Math.random() > 0.5 ? '216,154,152' : '109,139,170'
      });
    }
  }

  function resize(force = false) {
    if (!canvas) return;
    const currentW = window.innerWidth;
    const currentH = Math.max(window.innerHeight, document.documentElement.scrollHeight, document.body.scrollHeight);

    // If width hasn't meaningfully changed (e.g. mobile scroll showing/hiding address bar), DO NOT recreate canvas/nodes
    const widthChanged = Math.abs(currentW - lastW) > 5;
    const heightExpanded = (currentH - lastH) > 200;

    if (force || widthChanged || lastW === 0) {
      w = canvas.width = currentW;
      h = canvas.height = currentH;
      lastW = w;
      lastH = h;
      initNodes(w, h);
    } else if (heightExpanded) {
      // If content expanded dynamically, extend height and add extra nodes without deleting existing ones
      const oldH = h;
      h = canvas.height = currentH;
      lastH = h;
      const extraCount = Math.floor(((h - oldH) * w) / 36842);
      for (let i = 0; i < extraCount; i++) {
        nodes.push({
          x: Math.random() * w,
          y: oldH + Math.random() * (h - oldH),
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: Math.random() * 2.2 + 1.2,
          pulse: Math.random() * Math.PI * 2,
          colorType: Math.random() > 0.5 ? '216,154,152' : '109,139,170'
        });
      }
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const innerH = window.innerHeight || 800;
    const viewTop = scrollY - 200;
    const viewBottom = scrollY + innerH + 200;

    const len = nodes.length;
    // draw connections
    for (let i = 0; i < len; i++) {
      const a = nodes[i];
      if (a.y > viewBottom || a.y < viewTop) continue;
      for (let j = i + 1; j < len; j++) {
        const b = nodes[j];
        if (b.y > viewBottom || b.y < viewTop) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          const op = (1 - dist / 220) * 0.25;
          ctx.strokeStyle = `rgba(14,13,12,${op})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // draw nodes
    for (let i = 0; i < len; i++) {
      const n = nodes[i];
      if (n.y >= viewTop && n.y <= viewBottom) {
        n.pulse += 0.012;
        const glow = (Math.sin(n.pulse) + 1) / 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.colorType},${0.4 + glow * 0.4})`;
        ctx.fill();
      }

      if (!reduceMotion) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
    }

    requestAnimationFrame(draw);
  }

  resize(true);
  window.addEventListener('resize', () => resize(false), { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => resize(true), 100);
  });
  if (!reduceMotion) {
    draw();
  } else {
    draw(); // single static frame
  }

  // ---------- Scroll fade & stage activation ----------
  const fadeElements = document.querySelectorAll('.stage, .scroll-fade');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {threshold:0.05});
  fadeElements.forEach(el=>observer.observe(el));

  // ---------- Nav background intensify on scroll ----------
  const navEl = document.querySelector('nav');
  if (navEl) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navEl.classList.add('scrolled');
      } else {
        navEl.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ---------- Mobile Nav Elements & Toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  const oldNavCanvas = document.getElementById('navCircuit');
  if (oldNavCanvas) oldNavCanvas.remove();

  function closeMobileNav() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove('is-active');
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMobileNav(e) {
    if (!navToggle || !navLinks) return;
    if (e) e.stopPropagation();
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileNav);
  }

  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('is-open')) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobileNav();
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMobileNav();
    }
  }, { passive: true });

});

