/* ============================================================
   IMPERIA · Cart — persistence, drawer, header badge
   Demo-only: no real payment.
   ============================================================ */

(() => {
  'use strict';

  const STORAGE_KEY = 'imperia.cart.v1';
  const listeners = new Set();

  const read = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  };

  const write = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    listeners.forEach((fn) => fn(items));
  };

  const lineKey = (line) =>
    [line.slug, line.size || '', line.vessel || '', (line.note || '').trim()].join('|');

  const sameLine = (a, b) => lineKey(a) === lineKey(b);

  const cart = {
    items: () => read(),
    count: () => read().reduce((n, l) => n + l.qty, 0),
    subtotal: () => read().reduce((s, l) => s + l.unitPrice * l.qty, 0),

    add(line) {
      const items = read();
      const existing = items.find((l) => sameLine(l, line));
      if (existing) {
        existing.qty = Math.min(9, existing.qty + (line.qty || 1));
      } else {
        items.push({ ...line, qty: Math.min(9, line.qty || 1) });
      }
      write(items);
    },

    setQty(key, qty) {
      const items = read();
      const found = items.find((l) => lineKey(l) === key);
      if (!found) return;
      const next = Math.max(0, Math.min(9, qty));
      if (next === 0) {
        write(items.filter((l) => lineKey(l) !== key));
      } else {
        found.qty = next;
        write(items);
      }
    },

    remove(key) {
      write(read().filter((l) => lineKey(l) !== key));
    },

    clear() {
      write([]);
    },

    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    keyOf: lineKey,
  };

  window.imperiaCart = cart;

  /* ----- Sync between tabs ----- */
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) listeners.forEach((fn) => fn(read()));
  });

  /* ============================================================
     Header cart button + drawer
     ============================================================ */

  const fmt = (n) => '€ ' + Math.round(n);

  const optWords = {
    size:   { petite: 'Petite', maison: 'Maison', atelier: 'Atelier' },
    vessel: { none: 'no vessel', glass: 'glass cylinder', ceramic: 'ceramic urn' },
  };

  const describeLine = (l) => {
    const parts = [];
    if (l.size)   parts.push(optWords.size[l.size] || l.size);
    if (l.vessel) parts.push(optWords.vessel[l.vessel] || l.vessel);
    return parts.join(' · ');
  };

  /* ----- Tiny DOM builder ----- */
  const el = (tag, attrs, ...children) => {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'html') {
          // Only used for trusted SVG / static markup
          node.innerHTML = v;
        }
        else if (k.startsWith('on') && typeof v === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        }
        else if (k === 'dataset') {
          for (const [dk, dv] of Object.entries(v)) node.dataset[dk] = dv;
        }
        else if (k in node && typeof node[k] !== 'object') {
          node[k] = v;
        }
        else {
          node.setAttribute(k, v);
        }
      }
    }
    for (const c of children) {
      if (c == null || c === false) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  };

  const ICONS = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M5 7h14l-1.4 10.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    arrow: '<svg width="20" height="10" viewBox="0 0 20 10" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 5h17M14 1l4 4-4 4"/></svg>',
    floret: '<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M30 8c4 6 4 12 0 18-4-6-4-12 0-18zM30 52c-4-6-4-12 0-18 4 6 4 12 0 18zM8 30c6-4 12-4 18 0-6 4-12 4-18 0zM52 30c-6 4-12 4-18 0 6-4 12-4 18 0z"/><circle cx="30" cy="30" r="2" fill="currentColor"/></svg>',
  };

  const injectCartButton = () => {
    const nav = document.getElementById('nav');
    if (!nav) return null;
    if (document.getElementById('navCart')) return document.getElementById('navCart');
    const cta = nav.querySelector('.nav-cta');
    const btn = el('button', {
      type: 'button',
      class: 'nav-cart',
      id: 'navCart',
      'aria-label': 'Open cart',
      html: ICONS.bag + '<span class="nav-cart-count" id="navCartCount" hidden>0</span>',
    });
    if (cta && cta.parentNode === nav) nav.insertBefore(btn, cta);
    else nav.appendChild(btn);
    return btn;
  };

  const buildDrawer = () => {
    if (document.getElementById('cartDrawer')) return;

    const overlay = el('div', { class: 'cart-overlay', id: 'cartOverlay', hidden: true });

    const head = el('header', { class: 'cart-head' },
      el('div', null,
        el('div', { class: 'cart-eyebrow', text: 'Your composition' }),
        el('h3',  { class: 'cart-title', html: 'The <em>basket</em>' }),
      ),
      el('button', { type: 'button', class: 'cart-close', id: 'cartClose', 'aria-label': 'Close cart', html: ICONS.close }),
    );

    const body = el('div', { class: 'cart-body', id: 'cartBody' });

    const foot = el('footer', { class: 'cart-foot', id: 'cartFoot', hidden: true },
      el('div', { class: 'cart-totals' },
        el('div', { class: 'cart-totals-row' },
          el('span', { text: 'Subtotal' }),
          el('span', { id: 'cartSubtotal', text: '€ 0' }),
        ),
        el('div', { class: 'cart-totals-row cart-totals-sub' },
          el('span', { text: 'Delivery' }),
          el('span', { html: '<em>calculated at checkout</em>' }),
        ),
      ),
      el('a', { class: 'btn btn-primary cart-checkout', href: '/checkout/', html: 'Checkout <span class="arrow">→</span>' }),
      el('button', { type: 'button', class: 'cart-clear', id: 'cartClear', text: 'Empty the basket' }),
    );

    const drawer = el('aside', {
      class: 'cart-drawer',
      id: 'cartDrawer',
      'aria-hidden': 'true',
      'aria-label': 'Shopping cart',
    }, head, body, foot);

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  };

  const renderEmpty = (container) => {
    container.replaceChildren(
      el('div', { class: 'cart-empty' },
        el('span', { class: 'cart-empty-icon', html: ICONS.floret }),
        el('p', { class: 'cart-empty-title', text: 'Nothing yet.' }),
        el('p', { class: 'cart-empty-sub italic', text: 'The collection is just through here —' }),
        el('a', { class: 'btn', href: '/products/', html: 'Browse the collection <span class="arrow">→</span>' }),
      )
    );
  };

  const renderLine = (l) => {
    const key = lineKey(l);
    const desc = describeLine(l);
    const note = (l.note || '').trim();
    const lineTotal = l.unitPrice * l.qty;
    const slugHref = '/products/show/?p=' + encodeURIComponent(l.slug);

    const thumb = el('a', { class: 'cart-line-thumb', href: slugHref },
      el('img', { loading: 'lazy', src: l.image, alt: l.name }),
    );

    const top = el('div', { class: 'cart-line-top' },
      el('a', { class: 'cart-line-name', href: slugHref, text: l.name }),
      el('span', { class: 'cart-line-price', text: fmt(lineTotal) }),
    );

    const meta = desc ? el('div', { class: 'cart-line-meta italic', text: desc }) : null;
    const noteEl = note ? el('div', { class: 'cart-line-note italic', text: '"' + note + '"' }) : null;

    const qtyRow = el('div', { class: 'cart-qty' },
      el('button', { type: 'button', class: 'cart-qty-btn', dataset: { action: 'dec' }, 'aria-label': 'Decrease quantity', text: '−' }),
      el('span', { class: 'cart-qty-val', text: String(l.qty) }),
      el('button', { type: 'button', class: 'cart-qty-btn', dataset: { action: 'inc' }, 'aria-label': 'Increase quantity', text: '+' }),
    );
    const removeBtn = el('button', { type: 'button', class: 'cart-line-remove', dataset: { action: 'rm' }, text: 'Remove' });
    const actions = el('div', { class: 'cart-line-actions' }, qtyRow, removeBtn);

    const bodyEl = el('div', { class: 'cart-line-body' },
      top, meta, noteEl, actions,
    );

    return el('article', { class: 'cart-line', dataset: { key } }, thumb, bodyEl);
  };

  const refresh = () => {
    const items = read();
    const count = items.reduce((n, l) => n + l.qty, 0);
    const sub = items.reduce((s, l) => s + l.unitPrice * l.qty, 0);

    const badge = document.getElementById('navCartCount');
    if (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    }
    const navBtn = document.getElementById('navCart');
    if (navBtn) navBtn.classList.toggle('has-items', count > 0);

    const body = document.getElementById('cartBody');
    const foot = document.getElementById('cartFoot');
    if (!body || !foot) return;

    if (items.length === 0) {
      renderEmpty(body);
      foot.hidden = true;
    } else {
      body.replaceChildren(...items.map(renderLine));
      foot.hidden = false;
      const subEl = document.getElementById('cartSubtotal');
      if (subEl) subEl.textContent = fmt(sub);
    }
  };

  const setOpen = (open) => {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer || !overlay) return;
    drawer.classList.toggle('open', open);
    overlay.hidden = !open;
    overlay.classList.toggle('show', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('cart-open', open);
  };

  cart.open  = () => setOpen(true);
  cart.close = () => setOpen(false);

  const init = () => {
    const btn = injectCartButton();
    buildDrawer();

    if (btn) btn.addEventListener('click', () => setOpen(true));

    const overlay = document.getElementById('cartOverlay');
    const closeBtn = document.getElementById('cartClose');
    const clearBtn = document.getElementById('cartClear');
    const body = document.getElementById('cartBody');

    if (overlay) overlay.addEventListener('click', () => setOpen(false));
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (confirm('Empty your basket?')) cart.clear();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('cart-open')) {
        setOpen(false);
      }
    });

    if (body) {
      body.addEventListener('click', (e) => {
        const lineEl = e.target.closest('.cart-line');
        if (!lineEl) return;
        const action = e.target.closest('[data-action]')?.dataset.action;
        if (!action) return;
        const key = lineEl.dataset.key;
        const items = read();
        const line = items.find((l) => lineKey(l) === key);
        if (!line) return;
        if (action === 'inc')      cart.setQty(key, line.qty + 1);
        else if (action === 'dec') cart.setQty(key, line.qty - 1);
        else if (action === 'rm')  cart.remove(key);
      });
    }

    cart.onChange(refresh);
    refresh();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
