/* ============================================================
   IMPERIA · Checkout — summary render, place-order flow
   Demo-only: no real payment.
   ============================================================ */

(() => {
  'use strict';

  const fmt = (n) => '€ ' + Math.round(n);
  const FREE_DELIVERY = 80;
  const DELIVERY_FEE = 9;

  const optWords = {
    size:   { petite: 'Petite', maison: 'Maison', atelier: 'Atelier' },
    vessel: { none: 'no vessel', glass: 'glass cylinder', ceramic: 'ceramic urn' },
  };

  const describeLine = (l) => {
    const parts = [];
    if (l.size)   parts.push(optWords.size[l.size] || l.size);
    if (l.vessel) parts.push(optWords.vessel[l.vessel] || l.vessel);
    if (l.qty > 1) parts.push('× ' + l.qty);
    return parts.join(' · ');
  };

  const el = (tag, attrs, ...children) => {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class')      node.className = v;
        else if (k === 'text')  node.textContent = v;
        else                    node.setAttribute(k, v);
      }
    }
    for (const c of children) {
      if (c == null || c === false) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  };

  const renderSummary = () => {
    const cart = window.imperiaCart;
    const items = cart ? cart.items() : [];
    const linesEl = document.getElementById('checkoutLines');
    const totalsEl = document.getElementById('checkoutTotals');
    const grid = document.getElementById('checkoutGrid');
    const empty = document.getElementById('checkoutEmpty');

    if (!items.length) {
      if (grid) grid.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    if (grid) grid.hidden = false;
    if (empty) empty.hidden = true;

    linesEl.replaceChildren(
      ...items.map((l) =>
        el('div', { class: 'checkout-line' },
          el('div', { class: 'checkout-line-thumb' },
            el('img', { src: l.image, alt: l.name, loading: 'lazy' }),
          ),
          el('div', { class: 'checkout-line-info' },
            el('span', { class: 'checkout-line-name', text: l.name }),
            el('span', { class: 'checkout-line-meta', text: describeLine(l) }),
          ),
          el('span', { class: 'checkout-line-price', text: fmt(l.unitPrice * l.qty) }),
        )
      )
    );

    const subtotal = items.reduce((s, l) => s + l.unitPrice * l.qty, 0);
    const delivery = subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
    const tax = Math.round(subtotal * 0.07);
    const total = subtotal + delivery;

    const grandLabel = el('span', null, el('em', { text: 'Total' }));

    totalsEl.replaceChildren(
      el('div', { class: 'checkout-totals-row' },
        el('span', { text: 'Subtotal' }),
        el('span', { text: fmt(subtotal) }),
      ),
      el('div', { class: 'checkout-totals-row' },
        el('span', { text: 'Delivery' }),
        el('span', { text: delivery === 0 ? 'Complimentary' : fmt(delivery) }),
      ),
      el('div', { class: 'checkout-totals-row muted' },
        el('span', { text: 'incl. VAT (7%)' }),
        el('span', { text: fmt(tax) }),
      ),
      el('div', { class: 'checkout-totals-row grand' },
        grandLabel,
        el('span', { text: fmt(total) }),
      ),
    );
  };

  const todayISO = () => {
    const d = new Date();
    const z = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  };

  const generateOrderNo = () => {
    const stamp = new Date();
    const y = String(stamp.getFullYear()).slice(-2);
    const m = String(stamp.getMonth() + 1).padStart(2, '0');
    const d = String(stamp.getDate()).padStart(2, '0');
    const rnd = Math.floor(Math.random() * 9000 + 1000);
    return `IM-${y}${m}${d}-${rnd}`;
  };

  const collectForm = () => {
    const form = document.getElementById('checkoutForm');
    const out = {};
    new FormData(form).forEach((v, k) => { out[k] = String(v).trim(); });
    return out;
  };

  const init = () => {
    if (!window.imperiaCart) return;

    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
      dateInput.min = todayISO();
      dateInput.value = todayISO();
    }

    renderSummary();
    window.imperiaCart.onChange(renderSummary);

    const form = document.getElementById('checkoutForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const items = window.imperiaCart.items();
      if (items.length === 0) return;

      const subtotal = items.reduce((s, l) => s + l.unitPrice * l.qty, 0);
      const delivery = subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
      const total = subtotal + delivery;
      const details = collectForm();
      const orderNo = generateOrderNo();

      const order = {
        orderNo,
        placedAt: new Date().toISOString(),
        items: items.map((l) => ({ ...l })),
        subtotal, delivery, total,
        details,
      };

      try {
        sessionStorage.setItem('imperia.lastOrder', JSON.stringify(order));
      } catch (_) {}

      const btn = document.getElementById('placeBtn');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Composing…';
      }

      setTimeout(() => {
        window.imperiaCart.clear();
        window.location.href = '/checkout/thanks/';
      }, 700);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
