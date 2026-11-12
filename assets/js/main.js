document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('circuit');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let w = 0, h = 0, nodes = [], reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastW = 0, lastH = 0;

  let animFrameId = null;
  let isTabVisible = true;

  function initNodes(targetW, targetH) {
    nodes = [];
    const count = Math.min(60, Math.floor((targetW * targetH) / 36842)); /* Cap max nodes for CPU efficiency */
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
      const extraCount = Math.min(15, Math.floor(((h - oldH) * w) / 36842));
      for (let i = 0; i < extraCount; i++) {
        if (nodes.length >= 75) break;
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

  // ---------- Reviews Section Neural Circuit ----------
  const revCanvas = document.getElementById('reviewsCircuit');
  const revCtx = revCanvas ? revCanvas.getContext('2d') : null;
  let revW = 0, revH = 0, revNodes = [];
  let isRevVisible = true;

  function initRevNodes() {
    if (!revCanvas) return;
    revNodes = [];
    const count = Math.min(36, Math.max(18, Math.floor((revW * revH) / 14000)));
    for (let i = 0; i < count; i++) {
      revNodes.push({
        x: Math.random() * revW,
        y: Math.random() * revH,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.14,
        r: Math.random() * 2.2 + 1.2,
        pulse: Math.random() * Math.PI * 2,
        colorType: Math.random() > 0.5 ? '216,154,152' : '109,139,170'
      });
    }
  }

  function resizeRev() {
    if (!revCanvas) return;
    const parent = revCanvas.parentElement;
    if (!parent) return;
    revW = revCanvas.width = parent.offsetWidth || window.innerWidth;
    revH = revCanvas.height = parent.offsetHeight || 380;
    initRevNodes();
  }

  function drawRev() {
    if (!revCtx || !isRevVisible || !isTabVisible) return;
    revCtx.clearRect(0, 0, revW, revH);
    const rLen = revNodes.length;
    // draw connections
    for (let i = 0; i < rLen; i++) {
      const a = revNodes[i];
      for (let j = i + 1; j < rLen; j++) {
        const b = revNodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 190) {
          const op = (1 - dist / 190) * 0.25;
          revCtx.strokeStyle = `rgba(14,13,12,${op})`;
          revCtx.lineWidth = 0.6;
          revCtx.beginPath();
          revCtx.moveTo(a.x, a.y);
          revCtx.lineTo(b.x, b.y);
          revCtx.stroke();
        }
      }
    }

    // draw nodes
    for (let i = 0; i < rLen; i++) {
      const n = revNodes[i];
      n.pulse += 0.014;
      const glow = (Math.sin(n.pulse) + 1) / 2;
      revCtx.beginPath();
      revCtx.arc(n.x, n.y, n.r + glow * 0.85, 0, Math.PI * 2);
      revCtx.fillStyle = `rgba(${n.colorType},${0.45 + glow * 0.45})`;
      revCtx.fill();

      if (!reduceMotion) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > revW) n.vx *= -1;
        if (n.y < 0 || n.y > revH) n.vy *= -1;
      }
    }
  }

  if (revCanvas && 'IntersectionObserver' in window) {
    const revObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isRevVisible = entry.isIntersecting;
      });
    }, { rootMargin: '200px 0px' });
    revObserver.observe(revCanvas);
  }

  function draw() {
    if (ctx && isTabVisible) {
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
          if (dist < 200) {
            const op = (1 - dist / 200) * 0.25;
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
    }

    drawRev();

    if (!reduceMotion) {
      animFrameId = requestAnimationFrame(draw);
    }
  }

  resize(true);
  resizeRev();
  
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize(false);
      resizeRev();
    }, 150);
  }, { passive: true });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      resize(true);
      resizeRev();
    }, 150);
  });

  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (isTabVisible && !reduceMotion) {
      draw();
    }
  });

  draw();

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

  // ---------- Dynamic Copyright Year ----------
  const yrStr = String(new Date().getFullYear());
  document.querySelectorAll('.copyright-year, #current-year').forEach(el => {
    el.textContent = yrStr;
  });

  // ---------- Generic Section Neural Circuits (.section-circuit) ----------
  document.querySelectorAll('canvas.section-circuit').forEach(sc => {
    const sctx = sc.getContext('2d');
    if (!sctx) return;
    let sw = 0, sh = 0, sNodes = [], sVisible = false;

    function sInit() {
      const parent = sc.parentElement;
      sw = sc.width = parent.offsetWidth || window.innerWidth;
      sh = sc.height = parent.offsetHeight || 600;
      sNodes = [];
      const count = Math.min(70, Math.max(24, Math.floor((sw * sh) / 26000)));
      for (let i = 0; i < count; i++) {
        sNodes.push({
          x: Math.random() * sw,
          y: Math.random() * sh,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.14,
          r: Math.random() * 2.2 + 1.2,
          pulse: Math.random() * Math.PI * 2,
          colorType: Math.random() > 0.5 ? '216,154,152' : '109,139,170'
        });
      }
    }

    function sDraw() {
      if (sVisible && isTabVisible) {
        sctx.clearRect(0, 0, sw, sh);
        const n = sNodes.length;
        for (let i = 0; i < n; i++) {
          const a = sNodes[i];
          for (let j = i + 1; j < n; j++) {
            const b = sNodes[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 190) {
              sctx.strokeStyle = `rgba(14,13,12,${(1 - dist / 190) * 0.25})`;
              sctx.lineWidth = 0.6;
              sctx.beginPath();
              sctx.moveTo(a.x, a.y);
              sctx.lineTo(b.x, b.y);
              sctx.stroke();
            }
          }
        }
        for (let i = 0; i < n; i++) {
          const p = sNodes[i];
          p.pulse += 0.014;
          const glow = (Math.sin(p.pulse) + 1) / 2;
          sctx.beginPath();
          sctx.arc(p.x, p.y, p.r + glow * 0.85, 0, Math.PI * 2);
          sctx.fillStyle = `rgba(${p.colorType},${0.45 + glow * 0.45})`;
          sctx.fill();
          if (!reduceMotion) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > sw) p.vx *= -1;
            if (p.y < 0 || p.y > sh) p.vy *= -1;
          }
        }
      }
      if (!reduceMotion) requestAnimationFrame(sDraw);
    }

    sInit();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(e => { sVisible = e.isIntersecting; });
      }, { rootMargin: '200px 0px' }).observe(sc);
    } else {
      sVisible = true;
    }
    let sResizeT = null;
    window.addEventListener('resize', () => {
      clearTimeout(sResizeT);
      sResizeT = setTimeout(sInit, 200);
    }, { passive: true });
    window.addEventListener('load', sInit);
    if (reduceMotion) { sVisible = true; sDraw(); } else { sDraw(); }
  });

  // ---------- Scattered Floating Gallery & Zoom Lightbox ----------
  const scatterStage = document.getElementById('scatterStage');
  const scatterCards = scatterStage ? Array.from(scatterStage.querySelectorAll('.scatter-card')) : [];
  const lightbox = document.getElementById('galleryLightbox');

  if (scatterStage && scatterCards.length > 0 && !reduceMotion) {
    scatterStage.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 1120) return;
      const rect = scatterStage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) - rect.width / 2;
      const relY = (e.clientY - rect.top) - rect.height / 2;
      scatterCards.forEach(card => {
        const depth = parseFloat(card.dataset.depth || '0.03');
        card.style.setProperty('--px', `${(relX * depth).toFixed(1)}px`);
        card.style.setProperty('--py', `${(relY * depth).toFixed(1)}px`);
      });
    }, { passive: true });

    scatterStage.addEventListener('mouseleave', () => {
      scatterCards.forEach(card => {
        card.style.setProperty('--px', '0px');
        card.style.setProperty('--py', '0px');
      });
    });
  }

  if (lightbox && scatterCards.length > 0) {
    const lbImg = document.getElementById('lightboxImg');
    const lbCat = document.getElementById('lightboxCategory');
    const lbTitle = document.getElementById('lightboxTitle');
    const lbDesc = document.getElementById('lightboxDesc');
    const lbCounter = document.getElementById('lightboxCounter');
    const lbClose = document.getElementById('lightboxClose');
    const lbBackdrop = document.getElementById('lightboxBackdrop');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');

    let activeIdx = 0;

    function renderLightboxItem(index) {
      const total = scatterCards.length;
      activeIdx = (index + total) % total;
      const card = scatterCards[activeIdx];
      const imgEl = card.querySelector('img');

      if (lbImg && imgEl) {
        lbImg.style.opacity = '0.35';
        lbImg.src = imgEl.getAttribute('src');
        lbImg.alt = imgEl.getAttribute('alt') || '';
        requestAnimationFrame(() => {
          lbImg.style.opacity = '1';
        });
      }
      if (lbCat) lbCat.textContent = card.dataset.category || '';
      if (lbTitle) lbTitle.textContent = card.dataset.title || '';
      if (lbDesc) lbDesc.textContent = card.dataset.caption || '';
      if (lbCounter) {
        const num = String(activeIdx + 1).padStart(2, '0');
        const tot = String(total).padStart(2, '0');
        lbCounter.textContent = `${num} / ${tot}`;
      }
    }

    function openLightbox(index) {
      renderLightboxItem(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox.classList.contains('is-open')) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    scatterCards.forEach((card, idx) => {
      card.addEventListener('click', () => openLightbox(idx));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightboxItem(activeIdx - 1);
    });
    if (lbNext) lbNext.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightboxItem(activeIdx + 1);
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') renderLightboxItem(activeIdx + 1);
      if (e.key === 'ArrowLeft') renderLightboxItem(activeIdx - 1);
    });
  }

});

