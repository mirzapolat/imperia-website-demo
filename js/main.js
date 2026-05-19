/* ============================================================
   IMPERIA · Maison Florale — choreography
   ============================================================ */

(() => {
  'use strict';

  /* ----------  Nav: scroll state + mobile burger  ---------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenuOpen = (open) => {
    if (!nav) return;
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  if (burger) {
    burger.setAttribute('aria-label', 'Toggle menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('open'));
    });
  }

  /* Close mobile menu on link click and on ESC */
  document.querySelectorAll('.nav-panel a').forEach((a) => {
    a.addEventListener('click', () => {
      if (nav && nav.classList.contains('open')) setMenuOpen(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
      setMenuOpen(false);
    }
  });

  /* Close menu when viewport grows past mobile breakpoint */
  const mq = window.matchMedia('(min-width: 921px)');
  mq.addEventListener('change', () => {
    if (mq.matches && nav && nav.classList.contains('open')) setMenuOpen(false);
  });

  /* ----------  Reveal-on-scroll  ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .poster');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ----------  Floating petals (landing page only)  ---------- */
  const petalContainer = document.getElementById('petals');
  if (petalContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const buildPetalSvg = () => {
      const svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('viewBox', '0 0 40 40');
      svg.setAttribute('fill', 'none');
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', 'M20 4 C 28 10, 32 22, 24 34 C 20 30, 12 26, 14 14 C 16 8, 20 4, 20 4 Z');
      path.setAttribute('fill', 'currentColor');
      path.setAttribute('opacity', '0.85');
      svg.appendChild(path);
      return svg;
    };
    const colors = ['#b8584a', '#c97a6a', '#8a3327', '#a88556', '#d9a594', '#6a7a52'];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      const size = 14 + Math.random() * 26;
      const left = Math.random() * 100;
      const dur = 14 + Math.random() * 14;
      const delay = -Math.random() * dur;
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${left}%;
        color:${color};
        animation-duration:${dur}s, ${dur}s;
        animation-delay:${delay}s, ${delay}s;
      `;
      p.appendChild(buildPetalSvg());
      petalContainer.appendChild(p);
    }
  }

  /* ----------  Marquee: duplicate content for seamless loop  ---------- */
  const marquee = document.getElementById('marquee');
  if (marquee && marquee.children.length === 1) {
    marquee.appendChild(marquee.firstElementChild.cloneNode(true));
  }

  /* ----------  Products filter  ---------- */
  const filters = document.querySelectorAll('.filter');
  const productsGrid = document.getElementById('productsGrid');

  if (filters.length && productsGrid) {
    const products = productsGrid.querySelectorAll('.product');

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((f) => f.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-filter');
        products.forEach((p, i) => {
          const cats = (p.getAttribute('data-cat') || '').split(/\s+/);
          const show = cat === 'all' || cats.includes(cat);
          if (show) {
            p.style.display = '';
            p.style.opacity = '0';
            p.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              p.style.transition = 'opacity 600ms cubic-bezier(.16,1,.3,1), transform 600ms cubic-bezier(.16,1,.3,1)';
              p.style.transitionDelay = (i * 40) + 'ms';
              p.style.opacity = '1';
              p.style.transform = 'translateY(0)';
            });
          } else {
            p.style.transition = 'opacity 240ms ease';
            p.style.opacity = '0';
            setTimeout(() => { p.style.display = 'none'; }, 240);
          }
        });
      });
    });
  }

  /* ----------  Sticky filter offset under nav  ---------- */
  const filtersBar = document.querySelector('.filters');
  if (filtersBar && nav) {
    const setOffset = () => {
      filtersBar.style.top = nav.offsetHeight + 'px';
    };
    setOffset();
    window.addEventListener('resize', setOffset);
  }

  /* ----------  Contact form  ---------- */
  window.imperiaSubmit = (form) => {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    setTimeout(() => {
      btn.textContent = '✿ Thank you — we will write back shortly';
      btn.style.background = 'var(--moss)';
      btn.style.borderColor = 'var(--moss)';
      setTimeout(() => {
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 4200);
    }, 900);
  };

  /* ----------  Hours: mark closed rows  ---------- */
  document.querySelectorAll('.hours-table .closed-cell').forEach((cell) => {
    cell.closest('tr').classList.add('closed');
  });

  /* ----------  Tiny parallax for poster background  ---------- */
  const posters = document.querySelectorAll('.poster');
  if (posters.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    const update = () => {
      posters.forEach((p) => {
        const img = p.querySelector('.poster-img');
        if (!img) return;
        const rect = p.getBoundingClientRect();
        const center = window.innerHeight / 2;
        const offset = (rect.top + rect.height / 2 - center) * 0.05;
        const baseScale = p.classList.contains('in-view') ? 1 : 1.08;
        img.style.transform = `scale(${baseScale}) translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ----------  Cursor halo (desktop only, non-touch)  ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const halo = document.createElement('div');
    halo.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 28px; height: 28px;
      border-radius: 50%;
      border: 1px solid rgba(138, 51, 39, 0.6);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: transform 200ms cubic-bezier(.16,1,.3,1), width 260ms ease, height 260ms ease, border-color 200ms;
      mix-blend-mode: multiply;
      opacity: 0;
    `;
    document.body.appendChild(halo);

    let x = 0, y = 0, tx = 0, ty = 0, visible = false;
    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!visible) { halo.style.opacity = '1'; visible = true; }
    });
    document.addEventListener('mouseleave', () => {
      halo.style.opacity = '0'; visible = false;
    });

    const hoverable = 'a, button, .product, .service, .filter, input, textarea, select';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverable)) {
        halo.style.width = '52px';
        halo.style.height = '52px';
        halo.style.borderColor = 'rgba(184, 88, 74, 0.9)';
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverable)) {
        halo.style.width = '28px';
        halo.style.height = '28px';
        halo.style.borderColor = 'rgba(138, 51, 39, 0.6)';
      }
    });

    const animate = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      halo.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();
  }
})();
