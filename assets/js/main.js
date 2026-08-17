document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('circuit');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let w, h, nodes = [], reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    if (!canvas) return;
    w = canvas.width = window.innerWidth;
    h = canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);
    initNodes();
  }

  function initNodes(){
    nodes = [];
    const count = Math.floor((w*h)/36842); /* 5% fewer neurons */
    for(let i=0;i<count;i++){
      nodes.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.12,
        vy: (Math.random()-0.5)*0.12,
        r: Math.random()*2.2+1.2,
        pulse: Math.random()*Math.PI*2,
        colorType: Math.random() > 0.5 ? '216,154,152' : '109,139,170'
      });
    }
  }

  function draw(){
    if (!ctx) return;
    ctx.clearRect(0,0,w,h);
    const viewBottom = window.scrollY + window.innerHeight*1.4;

    // draw connections
    for(let i=0;i<nodes.length;i++){
      const a = nodes[i];
      if(a.y > viewBottom || a.y < window.scrollY - 200) continue;
      for(let j=i+1;j<nodes.length;j++){
        const b = nodes[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 220){
          const op = (1 - dist/220) * 0.25;
          ctx.strokeStyle = `rgba(14,13,12,${op})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    // draw nodes
    nodes.forEach(n=>{
      if(n.y > viewBottom || n.y < window.scrollY - 200) return;
      n.pulse += 0.012;
      const glow = (Math.sin(n.pulse)+1)/2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow*0.8, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${n.colorType},${0.4 + glow*0.4})`;
      ctx.fill();

      if(!reduceMotion){
        n.x += n.vx;
        n.y += n.vy;
        if(n.x<0||n.x>w) n.vx*=-1;
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  if(!reduceMotion){
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
    });
  }

  // ---------- Mobile Nav Toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

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
  });

});

